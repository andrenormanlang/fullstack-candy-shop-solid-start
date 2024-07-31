import type { APIEvent } from "@solidjs/start/server";
import prisma from "../../lib/prisma";
import { json } from "@solidjs/router";

// Get all orders
export async function GET(event: APIEvent) {
  try {
    const orders = await prisma.order.findMany({
      include: { items: true }, // Include order items if necessary
    });
    return json({ status: "success", data: orders });
  } catch (error) {
    console.error("Error fetching orders", error);
    return json({ status: "error", message: "Something went wrong" }, { status: 500 });
  }
}

// Create a new order
export async function POST(event: APIEvent) {
  const data = await event.request.json();
  try {
    const order = await prisma.order.create({
      data: {
        customer_first_name: data.customer_first_name,
        customer_last_name: data.customer_last_name,
        customer_address: data.customer_address,
        customer_postcode: data.customer_postcode,
        customer_city: data.customer_city,
        customer_email: data.customer_email,
        customer_phone: data.customer_phone,
        order_total: data.order_total,
        items: {
          create: data.order_items,
        },
      },
      include: { items: true },
    });
    return json({ status: "success", data: order }, { status: 201 });
  } catch (error) {
    console.error("Error creating order", error);
    return json({ status: "error", message: "Something went wrong" }, { status: 500 });
  }
}

