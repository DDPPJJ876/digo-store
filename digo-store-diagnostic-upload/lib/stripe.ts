import Stripe from "stripe";

export function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY?.trim();
  const mode = process.env.STRIPE_MODE ?? "test";
  if (mode !== "test" && mode !== "live") throw new Error("Invalid STRIPE_MODE.");
  if (!key || !new RegExp(`^(sk|rk)_${mode}_`).test(key)) {
    throw new Error(`Configure a Stripe ${mode} key matching STRIPE_MODE.`);
  }
  return new Stripe(key, { maxNetworkRetries: 2, timeout: 15000 });
}

export function getCheckoutSiteUrl() {
  const configured = process.env.VERCEL_ENV === "preview" && process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}` : process.env.NEXT_PUBLIC_SITE_URL;
  if (!configured) throw new Error("Missing NEXT_PUBLIC_SITE_URL.");
  const url = new URL(configured);
  if (url.username || url.password || (url.protocol !== "https:" &&
      !(url.protocol === "http:" && ["localhost", "127.0.0.1"].includes(url.hostname)))) {
    throw new Error("Configure a secure site URL.");
  }
  return url.origin;
}
