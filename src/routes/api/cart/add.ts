import type { APIEvent } from "@solidjs/start/server";
import prisma from "../../../lib/prisma";
import { json } from "@solidjs/router";

export async function POST(event: APIEvent) {
  const data = await event.request.json();
  const { product_id, quantity } = data;

  if (!product_id || !quantity) {
    return json({ status: "fail", message: "Product ID and quantity are required." }, { status: 400 });
  }

  try {
    const cartItem = await prisma.cartItem.create({
      data: {
        product_id,
        quantity,
      },
    });

    return json({ status: "success", data: cartItem }, { status: 201 });
  } catch (error) {
    console.error("Error creating cart item", error);
    return json({ status: "error", message: "Something went wrong" }, { status: 500 });
  }
}
