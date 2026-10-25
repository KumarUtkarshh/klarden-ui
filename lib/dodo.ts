import DodoPayments from "dodopayments";

let cachedDonationProductId: string | null = null;

export function getDodoClient(): DodoPayments {
  const apiKey = process.env.DODO_PAYMENTS_API_KEY;
  if (!apiKey || apiKey.includes("your_api_key_here")) {
    throw new Error(
      "DODO_PAYMENTS_API_KEY is not configured. Please add your key in .env.local"
    );
  }

  const env =
    process.env.DODO_PAYMENTS_ENVIRONMENT === "live_mode"
      ? "live_mode"
      : apiKey.startsWith("dodo_live_")
        ? "live_mode"
        : "test_mode";

  return new DodoPayments({
    bearerToken: apiKey,
    environment: env,
  });
}

/**
 * Resolves the donation product ID.
 * Prefers DODO_PAYMENTS_PRODUCT_ID from environment.
 * If unset, looks up existing 'Klarden UI Donation' product or provisions one automatically with pay_what_you_want.
 */
export async function getOrCreateDonationProduct(client: DodoPayments): Promise<string> {
  if (process.env.DODO_PAYMENTS_PRODUCT_ID) {
    return process.env.DODO_PAYMENTS_PRODUCT_ID;
  }

  if (cachedDonationProductId) {
    return cachedDonationProductId;
  }

  try {
    const list = await client.products.list({ page_size: 20 });
    const existing = list.items.find(
      (p) =>
        p.name?.toLowerCase().includes("klarden") ||
        p.name?.toLowerCase().includes("donation")
    );
    if (existing) {
      cachedDonationProductId = existing.product_id;
      return existing.product_id;
    }
  } catch (err) {
    console.warn("Could not query existing products, attempting creation:", err);
  }

  const newProduct = await client.products.create({
    name: "Klarden UI Project Donation",
    description: "Support open-source design engineering & refined UI components for Klarden UI.",
    tax_category: "digital_products",
    price: {
      type: "one_time_price",
      currency: "USD",
      price: 100, // $1.00 USD minimum
      pay_what_you_want: true,
    },
  });

  cachedDonationProductId = newProduct.product_id;
  return newProduct.product_id;
}
