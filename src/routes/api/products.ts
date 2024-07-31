import type { APIEvent } from "@solidjs/start/server";
import prisma from "../../lib/prisma";
import { json } from "@solidjs/router";

// Get all products
export async function GET(event: APIEvent) {
  try {
    const products = await prisma.product.findMany();
    return json({ status: "success", data: products });
  } catch (error) {
    console.error("Error fetching products", error);
    return json({ status: "error", message: "Something went wrong" }, { status: 500 });
  }
}

// Create a product
export async function POST(event: APIEvent) {
  const data = await event.request.json();
  try {
    const product = await prisma.product.create({
      data: {
        name: data.name,
        description: data.description,
        price: data.price,
        images: data.images,
        stock_status: data.stock_status,
        stock_quantity: data.stock_quantity,
      },
    });
    return json({ status: "success", data: product }, { status: 201 });
  } catch (error) {
    console.error("Error creating product", error);
    return json({ status: "error", message: "Something went wrong" }, { status: 500 });
  }
}
