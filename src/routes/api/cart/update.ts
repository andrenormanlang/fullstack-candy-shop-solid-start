import type { APIEvent } from "@solidjs/start/server";
import prisma from "../../../lib/prisma";
import { json } from "@solidjs/router";

export async function PUT(event: APIEvent) {
  const data = await event.request.json();
  const { id, quantity } = data;

  try {
    const cartItem = await prisma.cartItem.findUnique({
      where: { id },
    });

    if (!cartItem) {
      return json({ status: "error", message: "Cart item not found" }, { status: 404 });
    }

    const product = await prisma.product.findUnique({
      where: { id: cartItem.product_id },
    });

    if (!product) {
      return json({ status: "error", message: "Product not found" }, { status: 404 });
    }

    const quantityDifference = quantity - cartItem.quantity;

    if (product.stock_quantity < quantityDifference) {
      return json({ status: "fail", message: "Insufficient stock." }, { status: 400 });
    }

    await prisma.cartItem.update({
      where: { id },
      data: { quantity },
    });

    await prisma.product.update({
      where: { id: product.id },
      data: { stock_quantity: { decrement: quantityDifference } },
    });

    return json({ status: "success" }, { status: 200 });
  } catch (error) {
    console.error(`Error updating cart item with id ${id}`, error);
    return json({ status: "error", message: "Something went wrong" }, { status: 500 });
  }
}
