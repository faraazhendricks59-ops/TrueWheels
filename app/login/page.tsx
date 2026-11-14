"use client";
import { useState } from "react";
import { Check, Mail, ShieldCheck } from "lucide-react";
import { createClient } from "@/lib/supabase/browser";

const intents = [
  { id: "buy", title: "Buy a vehicle", text: "Find the right car with trusted data." },
  { id: "sell", title: "Sell my vehicle", text: "List privately with confidence." },
  { id: "auction", title: "Bid at auctions", text: "Compete for enthusiast vehicles." },
  { id: "dealer", title: "Grow a dealership", text: "Manage inventory and leads." },
];

export default function LoginPage() {
  const [email, setEmail] = useState(""); const [selected, setSelected] = useState<string[]>([]); const [sent, setSent] = useState(false); const [error, setError] = useState(""); const [loading, setLoading] = useState(false);
  function toggle(id: string) { setSelected((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]); }
  async function submit(event: React.FormEvent) { event.preventDefault(); setError(""); if (!email.includes("@")) return setError("Enter a valid email address."); setLoading(true); try { const supabase = createClient(); const { error: authError } = await supabase.auth.signInWithOtp({ email, options: { data: { intents: selected } } }); if (authError) throw authError; setSent(true); } catch (cause) { setError(cause instanceof Error ? cause.message : "Could not send the login code."); } finally { setLoading(false); } }
  return <main className="mx-auto max-w-4xl py-8"><div className="mx-auto max-w-xl"><div className="mb-8 text-center"><div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-brand-red text-white"><ShieldCheck size={24} /></div><h1 className="text-3xl font-extrabold tracking-tight">Welcome to TrueWheels</h1><p className="mt-2 text-gray-600">Tell us what brings you here, then we&apos;ll send a secure sign-in code.</p></div><form onSubmit={submit} className="space-y-6"><div className="grid gap-3 sm:grid-cols-2">{intents.map((intent) => <button key={intent.id} type="button" onClick={() => toggle(intent.id)} className={`rounded-xl border p-4 text-left transition ${selected.includes(intent.id) ? "border-brand-red bg-red-50 ring-2 ring-brand-red/20" : "border-brand-silver bg-white hover:border-brand-red/50"}`}><span className="flex items-center justify-between font-bold">{intent.title}{selected.includes(intent.id) && <Check size={18} className="text-brand-red" />}</span><span className="mt-1 block text-sm text-gray-500">{intent.text}</span></button>)}</div><label className="block"><span className="mb-2 block text-sm font-semibold">Email address</span><span className="flex items-center gap-2 rounded-lg border border-brand-silver bg-white px-3 focus-within:border-brand-red"><Mail size={17} className="text-gray-400" /><input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" className="w-full border-0 px-2 py-3 outline-none" /></span></label>{error && <p role="alert" className="text-sm text-red-600">{error}</p>}{sent ? <div className="rounded-lg bg-emerald-50 p-4 text-sm text-emerald-700">Check your inbox for the secure TrueWheels sign-in link.</div> : <button disabled={loading} className="w-full rounded-lg bg-brand-red px-4 py-3 font-semibold text-white hover:bg-brand-red-dark disabled:opacity-60">{loading ? "Sending code..." : "Continue with email"}</button>}</form></div></main>;
}
