import type { APIEvent } from "@solidjs/start/server";
import prisma from "../../../lib/prisma";
import { json } from "@solidjs/router";

export async function GET(event: APIEvent) {
  try {
    const cartItems = await prisma.cartItem.findMany({
      include: { product: true }
    });
    return json({ status: "success", data: cartItems }, { status: 200 });
  } catch (error) {
    console.error("Error fetching cart items", error);
    return json({ status: "error", message: "Something went wrong" }, { status: 500 });
  }
}
