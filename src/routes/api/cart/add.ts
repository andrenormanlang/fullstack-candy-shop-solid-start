import type { APIEvent } from "@solidjs/start/server";
import prisma from "../../../lib/prisma";
import { json } from "@solidjs/router";

export async function POST(event: APIEvent) {
  try {
    const data = await event.request.json();
    const { product_id, quantity } = data;

    if (!product_id || !quantity) {
      return json({ status: "fail", message: "Product ID and quantity are required." }, { status: 400 });
    }

    // Check if the product exists
    const product = await prisma.product.findUnique({
      where: { id: product_id },
    });

    if (!product) {
      return json({ status: "fail", message: "Product not found." }, { status: 404 });
    }

    if (product.stock_quantity < quantity) {
      return json({ status: "fail", message: "Insufficient stock." }, { status: 400 });
    }

    const existingItem = await prisma.cartItem.findFirst({
      where: { product_id },
    });

    if (existingItem) {
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity },
      });
    } else {
      await prisma.cartItem.create({
        data: {
          product_id,
          quantity,
        },
      });
    }

    await prisma.product.update({
      where: { id: product_id },
      data: { stock_quantity: product.stock_quantity - quantity },
    });

    return json({ status: "success" }, { status: 201 });
  } catch (error) {
    console.error("Error adding to cart", error);
    return json({ status: "error", message: "Something went wrong" }, { status: 500 });
  }
}
