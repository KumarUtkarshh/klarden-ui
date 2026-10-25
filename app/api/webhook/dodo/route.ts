import { NextResponse } from "next/server";
import { getDodoClient } from "@/lib/dodo";

export async function POST(request: Request) {
  const rawBody = await request.text();
  const webhookId = request.headers.get("webhook-id");
  const webhookSignature = request.headers.get("webhook-signature");
  const webhookTimestamp = request.headers.get("webhook-timestamp");

  if (!webhookId || !webhookSignature || !webhookTimestamp) {
    return NextResponse.json({ error: "Missing required webhook headers" }, { status: 400 });
  }

  try {
    const client = getDodoClient();
    const event = client.webhooks.unwrap(rawBody, {
      headers: {
        "webhook-id": webhookId,
        "webhook-signature": webhookSignature,
        "webhook-timestamp": webhookTimestamp,
      },
    });

    if (event.type === "payment.succeeded") {
      const payment = event.data;
      console.log(`[Dodo Webhook] Donation succeeded: Payment ID ${payment.payment_id}, total: ${payment.total_amount}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("[Dodo Webhook] Verification or processing error:", error);
    return NextResponse.json({ error: "Invalid webhook signature or payload" }, { status: 401 });
  }
}
