import { v4 as uuidv4 } from 'uuid';
import type { APIEvent } from "@solidjs/start/server";
import { PrismaClient } from "@prisma/client"; 
import { json } from "@solidjs/router";

const prisma = new PrismaClient();

export async function POST(event: APIEvent) {
  try {
    const data = await event.request.json();

    // Check if there is sufficient stock for each item
    for (const item of data.order_items) {
      const product = await prisma.product.findUnique({
        where: { id: item.product_id },
      });

      if (!product) {
        return json({ status: "fail", message: `Product with ID ${item.product_id} not found.` }, { status: 404 });
      }

      if (product.stock_quantity < item.qty) {
        return json({ status: "fail", message: `Insufficient stock for product with ID ${item.product_id}.` }, { status: 400 });
      }
    }

    // Use a transaction to ensure atomicity
    const order = await prisma.$transaction(async (prisma) => {
      // Create the order
      const newOrder = await prisma.order.create({
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
            create: data.order_items.map(item => ({
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
      for (const item of data.order_items) {
        await prisma.product.update({
          where: { id: item.product_id },
          data: { stock_quantity: { decrement: item.qty } },
        });
      }

      // Clear the cart after the order is placed
      await prisma.cartItem.deleteMany({});

      return newOrder;
    });

    return json({ status: "success", data: order }, { status: 201 });
  } catch (error) {
    console.error("Error creating order", error);
    return json({ status: "error", message: "Something went wrong" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
