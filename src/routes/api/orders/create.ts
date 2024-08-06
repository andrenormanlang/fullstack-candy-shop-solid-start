import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";
import type { APIEvent } from "@solidjs/start/server";
import { json } from "@solidjs/router";

const prisma = new PrismaClient();

export async function POST(event: APIEvent) {
  try {
    const data = await event.request.json();

    // Check if the products exist
    const stockCheckPromises = data.order_items.map(async (item) => {
      const product = await prisma.product.findUnique({
        where: { id: item.product_id },
      });

      if (!product) {
        throw new Error(`Product with ID ${item.product_id} not found.`);
      }
    });

    await Promise.all(stockCheckPromises);

    const result = await prisma.$transaction(async (transaction) => {
      // Create the order
      const order = await transaction.order.create({
        data: {
          order_date: new Date(data.order_date),
          customer_first_name: data.customer_first_name,
          customer_last_name: data.customer_last_name,
          customer_address: data.customer_address,
          customer_postcode: data.customer_postcode,
          customer_city: data.customer_city,
          customer_email: data.customer_email,
          customer_phone: data.customer_phone,
          order_total: data.order_total,
          order_number: uuidv4(), // Generate a unique order number
          created_at: new Date(data.created_at),
          updated_at: new Date(data.updated_at),
          items: {
            create: data.order_items.map((item) => ({
              product_id: item.product_id,
              product_name: item.product_name,
              qty: item.qty,
              item_price: item.item_price,
              item_total: item.item_total,
            })),
          },
        },
        include: { items: true },
      });

      // Update the stock quantity after the order is created
      const stockUpdatePromises = data.order_items.map(async (item) => {
        const product = await transaction.product.findUnique({
          where: { id: item.product_id },
        });

        const newStockQuantity = Math.max(product.stock_quantity - item.qty, 0);

        await transaction.product.update({
          where: { id: item.product_id },
          data: { stock_quantity: newStockQuantity },
        });
      });

      await Promise.all(stockUpdatePromises);

      return order;
    });

    return json({ status: "success", data: result }, { status: 201 });
  } catch (error) {
    console.error("Error creating order", error);
    return json({ status: "error", message: error.message }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
