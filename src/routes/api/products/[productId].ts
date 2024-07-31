import type { APIEvent } from "@solidjs/start/server";
import prisma from "../../../lib/prisma";
import { json } from "@solidjs/router";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

// Get a single product
export async function GET(event: APIEvent) {
  const { params } = event;
  const productId = Number(params.productId);
  try {
    const product = await prisma.product.findUniqueOrThrow({
      where: { id: productId },
    });
    return json({ status: "success", data: product });
  } catch (error) {
    console.error(`Error finding product with id ${productId}`, error);
    return json({ status: "error", message: "Product not found" }, { status: 404 });
  }
}

// Update a product
export async function PUT(event: APIEvent) {
  const { params } = event;
  const productId = Number(params.productId);
  const data = await event.request.json();
  try {
    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: {
        name: data.name,
        description: data.description,
        price: data.price,
        images: data.images,
        stock_status: data.stock_status,
        stock_quantity: data.stock_quantity,
      },
    });
    return json({ status: "success", data: updatedProduct });
  } catch (error) {
    console.error(`Error updating product with id ${productId}`, error);
    if (error instanceof PrismaClientKnownRequestError && error.code === "P2025") {
      return json({ status: "error", message: "Product not found" }, { status: 404 });
    }
    return json({ status: "error", message: "Something went wrong" }, { status: 500 });
  }
}

// Delete a product
export async function DELETE(event: APIEvent) {
  const { params } = event;
  const productId = Number(params.productId);
  try {
    await prisma.product.delete({
      where: { id: productId },
    });
    return json({ status: "success", message: "Product deleted successfully" });
  } catch (error) {
    console.error(`Error deleting product with id ${productId}`, error);
    if (error instanceof PrismaClientKnownRequestError && error.code === "P2025") {
      return json({ status: "error", message: "Product not found" }, { status: 404 });
    }
    return json({ status: "error", message: "Something went wrong" }, { status: 500 });
  }
}
