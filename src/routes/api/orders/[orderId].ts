import type { APIEvent } from "@solidjs/start/server";
import prisma from "../../../lib/prisma";
import { json } from "@solidjs/router";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

// Get a single order
export async function GET(event: APIEvent) {
  const { params } = event;
  const orderId = Number(params.orderId);
  try {
    const order = await prisma.order.findUniqueOrThrow({
      where: { id: orderId },
      include: { items: true },
    });
    return json({ status: "success", data: order });
  } catch (error) {
    console.error(`Error finding order with id ${orderId}`, error);
    return json({ status: "error", message: "Order not found" }, { status: 404 });
  }
}

// Update an order
export async function PUT(event: APIEvent) {
  const { params } = event;
  const orderId = Number(params.orderId);
  const data = await event.request.json();
  try {
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        customer_first_name: data.customer_first_name,
        customer_last_name: data.customer_last_name,
        customer_address: data.customer_address,
        customer_postcode: data.customer_postcode,
        customer_city: data.customer_city,
        customer_email: data.customer_email,
        customer_phone: data.customer_phone,
        order_total: data.order_total,
      },
      include: { items: true },
    });
    return json({ status: "success", data: updatedOrder });
  } catch (error) {
    console.error(`Error updating order with id ${orderId}`, error);
    if (error instanceof PrismaClientKnownRequestError && error.code === "P2025") {
      return json({ status: "error", message: "Order not found" }, { status: 404 });
    }
    return json({ status: "error", message: "Something went wrong" }, { status: 500 });
  }
}

// Delete an order
export async function DELETE(event: APIEvent) {
  const { params } = event;
  const orderId = Number(params.orderId);
  try {
    await prisma.order.delete({
      where: { id: orderId },
    });
    return json({ status: "success", message: "Order deleted successfully" });
  } catch (error) {
    console.error(`Error deleting order with id ${orderId}`, error);
    if (error instanceof PrismaClientKnownRequestError && error.code === "P2025") {
      return json({ status: "error", message: "Order not found" }, { status: 404 });
    }
    return json({ status: "error", message: "Something went wrong" }, { status: 500 });
  }
}
