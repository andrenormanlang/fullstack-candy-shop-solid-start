import type { APIEvent } from "@solidjs/start/server";
import prisma from "../../../lib/prisma";
import { json } from "@solidjs/router";

export async function POST(event: APIEvent) {
  try {
    const cartItems = await prisma.cartItem.findMany();
    for (const item of cartItems) {
      await prisma.product.update({
        where: { id: item.product_id },
        data: { stock_quantity: { increment: item.quantity } },
      });
    }
    await prisma.cartItem.deleteMany({});
    return json({ status: "success", message: "Cart cleared." }, { status: 200 });
  } catch (error) {
    console.error("Error clearing cart", error);
    return json({ status: "error", message: "Something went wrong" }, { status: 500 });
  }
}
