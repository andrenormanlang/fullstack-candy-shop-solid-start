import type { APIEvent } from "@solidjs/start/server";
import prisma from "../../../lib/prisma";
import { json } from "@solidjs/router";

export async function GET(event: APIEvent) {
  try {
    const products = await prisma.product.findMany();
    return json({ status: "success", data: products }, { status: 200 });
  } catch (error) {
    console.error("Error fetching products", error);
    return json({ status: "error", message: "Something went wrong" }, { status: 500 });
  }
}
