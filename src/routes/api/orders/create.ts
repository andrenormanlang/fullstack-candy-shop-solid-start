import { v4 as uuidv4 } from 'uuid';
import type { APIEvent } from "@solidjs/start/server";
import prisma from "../../../lib/prisma";
import { json } from "@solidjs/router";

export async function POST(event: APIEvent) {
  try {
    const data = await event.request.json();

    const order = await prisma.order.create({
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
            qty: item.qty,
            item_price: item.item_price,
            item_total: item.item_total,
          })),
        },
      },
      include: { items: true },
    });

    return json({ status: "success", data: order }, { status: 201 });
  } catch (error) {
    console.error("Error creating order", error);
    return json({ status: "error", message: "Something went wrong" }, { status: 500 });
  }
}
