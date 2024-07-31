import type { APIEvent } from "@solidjs/start/server";
import prisma from "../../../lib/prisma";
import { json } from "@solidjs/router";

// Create multiple products
export async function POST(event: APIEvent) {
  const data = await event.request.json();
  if (!Array.isArray(data)) {
    return json({ status: "fail", message: "Expected an array of products." }, { status: 400 });
  }

  try {
    // Prepare product data with a default stock_quantity if not provided
    const productData = data.map(product => ({
      name: product.name,
      description: product.description,
      price: product.price,
      images: product.images,
      stock_status: product.stock_status,
      stock_quantity: product.stock_quantity ?? 0,
    }));

    // The `createMany` method is used for bulk creation of records.
    const products = await prisma.product.createMany({
      data: productData,
      skipDuplicates: true, // Optionally skip duplicates
    });

    return json({ status: "success", data: products, message: "Products created successfully." }, { status: 201 });
  } catch (error) {
    console.error("Error creating products", error);
    return json({ status: "error", message: "Something went wrong" }, { status: 500 });
  }
}
