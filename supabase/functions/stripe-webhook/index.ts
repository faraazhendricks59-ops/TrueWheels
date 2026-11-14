import Stripe from "https://esm.sh/stripe@12.0.0?target=deno";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.0";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") ?? "", { apiVersion: "2023-10-16" });
const supabaseAdmin = createClient(Deno.env.get("SUPABASE_URL") ?? "", Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "");
serve(async (request) => {
  const signature = request.headers.get("stripe-signature"); const body = await request.text();
  if (!signature) return new Response("Missing Stripe signature", { status: 400 });
  let event: Stripe.Event;
  try { event = await stripe.webhooks.constructEventAsync(body, signature, Deno.env.get("STRIPE_WEBHOOK_SECRET") ?? ""); }
  catch (error) { return new Response(`Webhook error: ${error instanceof Error ? error.message : "invalid signature"}`, { status: 400 }); }
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session; const metadata = session.metadata ?? {};
    const { error } = await supabaseAdmin.from("invoices").upsert({ user_id: metadata.user_id ?? null, stripe_payment_intent_id: typeof session.payment_intent === "string" ? session.payment_intent : null, amount_cents: session.amount_total ?? 0, description: metadata.description ?? "TrueWheels purchase", status: "succeeded" }, { onConflict: "stripe_payment_intent_id" });
    if (error) return new Response("Invoice recording failed", { status: 500 });
    if (metadata.type === "listing_boost" && metadata.listing_id) await supabaseAdmin.from("listings").update({ boost_expires_at: new Date(Date.now() + 7 * 86400000).toISOString() }).eq("id", metadata.listing_id);
    if (metadata.type === "dealer_subscription" && metadata.tier && metadata.user_id) await supabaseAdmin.from("dealerships").update({ subscription_tier: metadata.tier }).eq("owner_id", metadata.user_id);
  }
  return Response.json({ received: true });
});
