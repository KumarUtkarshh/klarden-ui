import { NextResponse } from "next/server";
import { getDodoClient, getOrCreateDonationProduct } from "@/lib/dodo";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Invalid request payload" }, { status: 400 });
    }

    const { amount, donorName, donorEmail, message } = body as {
      amount?: number | string;
      donorName?: string;
      donorEmail?: string;
      message?: string;
    };

    const parsedAmount = typeof amount === "string" ? parseFloat(amount) : Number(amount);
    if (isNaN(parsedAmount) || parsedAmount < 1) {
      return NextResponse.json(
        { error: "Minimum donation amount is $1.00 USD" },
        { status: 400 }
      );
    }

    const amountInCents = Math.round(parsedAmount * 100);

    let client;
    try {
      client = getDodoClient();
    } catch (clientErr: unknown) {
      const msg = clientErr instanceof Error ? clientErr.message : "Dodo client error";
      return NextResponse.json(
        {
          error: msg,
          configured: false,
        },
        { status: 400 }
      );
    }

    // Resolve or provision donation product ID
    const productId = await getOrCreateDonationProduct(client);

    // Determine return URL
    const requestUrl = new URL(request.url);
    const origin = process.env.NEXT_PUBLIC_APP_URL || requestUrl.origin;
    const returnUrl = `${origin}/donate/success`;

    const session = await client.checkoutSessions.create({
      product_cart: [
        {
          product_id: productId,
          quantity: 1,
          amount: amountInCents,
        },
      ],
      customer: donorEmail
        ? {
            email: donorEmail.trim(),
            name: donorName?.trim() || undefined,
          }
        : undefined,
      metadata: {
        category: "donation",
        amount_usd: parsedAmount.toFixed(2),
        donor_name: donorName?.trim() || "Anonymous",
        donor_message: message?.trim() || "",
      },
      feature_flags: {
        allow_currency_selection: true,
        allow_customer_editing_email: true,
      },
      return_url: returnUrl,
      cancel_url: origin,
    });

    if (!session.checkout_url) {
      return NextResponse.json(
        { error: "Dodo Payments did not return a checkout URL" },
        { status: 502 }
      );
    }

    return NextResponse.json({
      checkoutUrl: session.checkout_url,
      sessionId: session.session_id,
    });
  } catch (error: unknown) {
    console.error("Donation checkout session error:", error);
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
