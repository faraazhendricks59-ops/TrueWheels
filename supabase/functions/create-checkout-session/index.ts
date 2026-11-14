import Stripe from "https://esm.sh/stripe@12.0.0?target=deno";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.0";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") ?? "", { apiVersion: "2023-10-16" });
const supabase = createClient(Deno.env.get("SUPABASE_URL") ?? "", Deno.env.get("SUPABASE_ANON_KEY") ?? "");
serve(async (request) => {
  if (request.method !== "POST") return new Response("Method not allowed", { status: 405 });
  const token = request.headers.get("Authorization")?.replace("Bearer ", ""); if (!token) return new Response("Unauthorized", { status: 401 });
  const { data: { user } } = await supabase.auth.getUser(token); if (!user) return new Response("Unauthorized", { status: 401 });
  const payload = await request.json().catch(() => null) as { type?: string; listingId?: string; tier?: string } | null;
  const isBoost = payload?.type === "listing_boost" && Boolean(payload.listingId); const isSubscription = payload?.type === "dealer_subscription" && ["starter", "professional", "enterprise"].includes(payload.tier ?? "");
  if (!isBoost && !isSubscription) return Response.json({ error: "Invalid checkout request" }, { status: 400 });
  const priceId = isBoost ? Deno.env.get("STRIPE_BOOST_PRICE_ID") : Deno.env.get(`STRIPE_${(payload?.tier ?? "").toUpperCase()}_PRICE_ID`); if (!priceId) return Response.json({ error: "Price not configured" }, { status: 500 });
  const session = await stripe.checkout.sessions.create({ mode: isSubscription ? "subscription" : "payment", line_items: [{ price: priceId, quantity: 1 }], success_url: `${Deno.env.get("APP_URL")}/checkout/success?session_id={CHECKOUT_SESSION_ID}`, cancel_url: `${Deno.env.get("APP_URL")}/checkout/cancelled`, metadata: { type: payload?.type ?? "", listing_id: payload?.listingId ?? "", tier: payload?.tier ?? "", user_id: user.id, description: isBoost ? "7-Day Listing Boost" : `${payload?.tier} Dealer Plan` } });
  return Response.json({ url: session.url });
});
