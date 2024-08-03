import type { APIEvent } from "@solidjs/start/server";
import prisma from "../../../lib/prisma";
import { json } from "@solidjs/router";

export async function DELETE(event: APIEvent) {
  const data = await event.request.json();
  const { id } = data;  // Assuming `id` is the primary key for CartItem

  if (!id) {
    return json({ status: "fail", message: "ID is required." }, { status: 400 });
  }

  try {
    await prisma.cartItem.delete({
      where: { id },  // Using `id` for the where clause
    });

    return json({ status: "success" }, { status: 200 });
  } catch (error) {
    console.error("Error removing cart item", error);
    return json({ status: "error", message: "Something went wrong" }, { status: 500 });
  }
}
