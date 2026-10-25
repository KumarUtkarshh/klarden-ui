import { NextResponse } from "next/server";
import { getDodoClient, getOrCreateDonationProduct } from "@/lib/dodo";

export async function GET(request: Request) {
  // If a direct static payment link is configured, redirect immediately
  if (process.env.DODO_PAYMENTS_PAYMENT_LINK) {
    return NextResponse.redirect(process.env.DODO_PAYMENTS_PAYMENT_LINK, 303);
  }

  try {
    const client = getDodoClient();
    const productId = await getOrCreateDonationProduct(client);

    const requestUrl = new URL(request.url);
    const origin = process.env.NEXT_PUBLIC_APP_URL || requestUrl.origin;
    const returnUrl = `${origin}/donate/success`;

    const session = await client.checkoutSessions.create({
      product_cart: [
        {
          product_id: productId,
          quantity: 1,
        },
      ],
      minimal_address: true,
      metadata: {
        category: "donation",
        source: "klarden_ui_website",
      },
      feature_flags: {
        allow_currency_selection: true,
        allow_customer_editing_email: true,
        allow_customer_editing_name: true,
        allow_phone_number_collection: false,
        require_phone_number: false,
        allow_customer_editing_city: false,
        allow_customer_editing_state: false,
        allow_customer_editing_street: false,
        allow_customer_editing_zipcode: false,
        allow_tax_id: false,
      },
      return_url: returnUrl,
      cancel_url: origin,
    });

    if (session.checkout_url) {
      return NextResponse.redirect(session.checkout_url, 303);
    }

    return NextResponse.json(
      { error: "Dodo Payments did not return a checkout URL" },
      { status: 502 }
    );
  } catch (error: unknown) {
    console.error("Donation redirect error:", error);
    const message = error instanceof Error ? error.message : "Dodo checkout error";

    // If API key is not yet set up, direct to test environment or show setup instruction
    const isTestMode =
      process.env.DODO_PAYMENTS_ENVIRONMENT !== "live_mode";
    const fallbackUrl = isTestMode
      ? "https://test.dodopayments.com"
      : "https://app.dodopayments.com";

    // If running in development without key, render a helpful notice
    if (message.includes("DODO_PAYMENTS_API_KEY is not configured")) {
      return new NextResponse(
        `<!DOCTYPE html>
<html>
<head>
  <title>Dodo Payments Setup</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #09090b; color: #f4f4f5; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; padding: 1.5rem; box-sizing: border-box; }
    .card { background: #18181b; border: 1px solid #27272a; border-radius: 1rem; max-width: 480px; width: 100%; padding: 2rem; text-align: center; }
    h1 { font-size: 1.25rem; margin-bottom: 0.5rem; }
    p { color: #a1a1aa; font-size: 0.875rem; line-height: 1.5; margin-bottom: 1.5rem; }
    code { background: #27272a; padding: 0.2rem 0.4rem; border-radius: 0.25rem; font-size: 0.8rem; }
    .btn { display: inline-block; background: #ffffff; color: #09090b; text-decoration: none; font-weight: 600; font-size: 0.875rem; padding: 0.75rem 1.5rem; border-radius: 0.75rem; transition: opacity 0.2s; }
    .btn:hover { opacity: 0.9; }
  </style>
</head>
<body>
  <div class="card">
    <h1>Dodo Payments Configuration Required</h1>
    <p>Please add your <code>DODO_PAYMENTS_API_KEY</code> or <code>DODO_PAYMENTS_PAYMENT_LINK</code> in <code>.env.local</code> to enable direct checkout.</p>
    <a href="${fallbackUrl}" target="_blank" class="btn">Open Dodo Dashboard</a>
  </div>
</body>
</html>`,
        { status: 503, headers: { "Content-Type": "text/html" } }
      );
    }

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
