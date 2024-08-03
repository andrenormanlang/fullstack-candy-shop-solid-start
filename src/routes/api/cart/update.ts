import type { APIEvent } from "@solidjs/start/server";
import prisma from "../../../lib/prisma";
import { json } from "@solidjs/router";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

// Update cart item quantity
export async function PUT(event: APIEvent) {
  const data = await event.request.json();
  const { id, quantity } = data;  // Destructure 'id' from data

  try {
    const updatedCartItem = await prisma.cartItem.update({
      where: { id: id }, // Ensure 'id' is used correctly
      data: { quantity },
    });

    return json({ status: "success", data: updatedCartItem });
  } catch (error) {
    console.error(`Error updating cart item with id ${id}`, error);
    if (error instanceof PrismaClientKnownRequestError && error.code === "P2025") {
      return json({ status: "error", message: "Cart item not found" }, { status: 404 });
    }
    return json({ status: "error", message: "Something went wrong" }, { status: 500 });
  }
}
