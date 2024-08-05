import type { APIEvent } from "@solidjs/start/server";
import prisma from "../../../lib/prisma";
import { json } from "@solidjs/router";

export async function GET(event: APIEvent) {
  try {
    const orders = await prisma.order.findMany({
      include: {
        items: true,
      },
    });

    return json({ status: "success", data: orders }, { status: 200 });
  } catch (error) {
    console.error("Error fetching orders", error);
    return json({ status: "error", message: "Something went wrong" }, { status: 500 });
  }
}
