import { json } from "@solidjs/router";

export async function GET() {
  return json({ status: "success", message: "Cart API is running." }, { status: 200 });
}
