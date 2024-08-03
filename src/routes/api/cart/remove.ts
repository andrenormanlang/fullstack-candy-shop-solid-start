import type { APIEvent } from "@solidjs/start/server";
import prisma from "../../../lib/prisma";
import { json } from "@solidjs/router";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

export async function DELETE(event: APIEvent) {
  const data = await event.request.json();
  const { id } = data;

  if (!id) {
    return json({ status: "fail", message: "ID is required." }, { status: 400 });
  }

  try {
    const cartItem = await prisma.cartItem.findUnique({
      where: { id },
    });

    if (!cartItem) {
      return json({ status: "error", message: "Cart item not found" }, { status: 404 });
    }

    await prisma.product.update({
      where: { id: cartItem.product_id },
      data: { stock_quantity: { increment: cartItem.quantity } },
    });

    await prisma.cartItem.delete({
      where: { id },
    });

    return json({ status: "success" }, { status: 200 });
  } catch (error) {
    console.error("Error removing cart item", error);
    return json({ status: "error", message: "Something went wrong" }, { status: 500 });
  }
}
