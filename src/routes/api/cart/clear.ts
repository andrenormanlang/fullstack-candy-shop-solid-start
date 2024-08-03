import type { APIEvent } from "@solidjs/start/server";
import prisma from "../../../lib/prisma";
import { json } from "@solidjs/router";

export async function POST() {
  try {
    await prisma.cartItem.deleteMany({});
    return json({ status: "success", message: "Cart cleared." }, { status: 200 });
  } catch (error) {
    console.error("Error clearing cart", error);
    return json({ status: "error", message: "Something went wrong" }, { status: 500 });
  }
}

