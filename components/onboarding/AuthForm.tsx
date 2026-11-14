"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { ArrowLeft, Loader2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

interface AuthFormProps { intents: string[]; onBack: () => void; onSuccess: () => void; }
type TurnstileStatus = "idle" | "verifying" | "success";

export function AuthForm({ intents, onBack, onSuccess }: AuthFormProps) {
  const [email, setEmail] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [turnstileStatus, setTurnstileStatus] = useState<TurnstileStatus>("idle");
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const otpRefs = useRef<Array<HTMLInputElement | null>>([]);
  const verifyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const otpTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => { if (verifyTimer.current) clearTimeout(verifyTimer.current); if (otpTimer.current) clearTimeout(otpTimer.current); }, []);
  function handleEmailSubmit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); if (!email || turnstileStatus !== "success") return; setIsVerifying(true); }
  function handleTurnstile() { setTurnstileStatus("verifying"); verifyTimer.current = setTimeout(() => setTurnstileStatus("success"), 1500); }
  function handleOtpChange(index: number, value: string) { const digit = value.replace(/\D/g, "").slice(-1); const next = [...otp]; next[index] = digit; setOtp(next); if (digit && index < 5) otpRefs.current[index + 1]?.focus(); }
  function handleOtpSubmit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); if (otp.some((digit) => !digit)) return; otpTimer.current = setTimeout(onSuccess, 1000); }
  const intentLabel = intents.length === 6 ? "full TrueWheels ecosystem" : `${intents.map((intent) => intent.charAt(0).toUpperCase() + intent.slice(1)).join(", ")} experience`;
  return <div className="mx-auto max-w-md animate-in px-4 py-12 fade-in slide-in-from-right-8 duration-500"><button type="button" onClick={onBack} className="mb-8 flex items-center gap-2 text-sm text-gray-500 hover:text-brand-graphite"><ArrowLeft size={16} />Back to intents</button><div className="rounded-2xl border border-brand-silver bg-surface-white p-8 shadow-sm"><div className="mb-8 text-center"><h2 className="mb-2 text-2xl font-bold text-brand-graphite">Create your account</h2><p className="text-sm text-gray-500">Unlock your {intentLabel}.</p></div>{!isVerifying ? <form onSubmit={handleEmailSubmit} className="space-y-6"><Input label="Email Address" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" required /><button type="button" onClick={handleTurnstile} disabled={turnstileStatus === "verifying" || turnstileStatus === "success"} className="flex w-full items-center justify-between rounded-lg border border-brand-silver bg-surface-grey p-4 text-left"><span className="flex items-center gap-3"><span className={`flex h-6 w-6 items-center justify-center rounded border-2 transition-all ${turnstileStatus === "success" ? "border-green-500 bg-green-500 text-white" : "border-gray-300"}`}>{turnstileStatus === "success" && <ShieldCheck size={14} />}{turnstileStatus === "verifying" && <Loader2 size={14} className="animate-spin text-gray-400" />}</span><span className="text-xs"><span className="block font-medium text-gray-700">Cloudflare Turnstile</span><span className="text-gray-400">{turnstileStatus === "idle" ? "Click to verify you are human." : turnstileStatus === "verifying" ? "Checking browser telemetry..." : "Verified secure."}</span></span></span><span className="font-mono text-[10px] text-gray-400">cf-turnstile</span></button><Button type="submit" className="h-11 w-full" disabled={!email || turnstileStatus !== "success"}>Send Verification Code</Button></form> : <form onSubmit={handleOtpSubmit} className="animate-in space-y-6 fade-in"><p className="mb-4 text-center text-sm text-gray-500">We sent a 6-digit code to <span className="font-semibold text-brand-graphite">{email}</span></p><div className="mb-6 flex justify-center gap-2">{otp.map((digit, index) => <input key={index} ref={(element) => { otpRefs.current[index] = element; }} type="text" inputMode="numeric" maxLength={1} value={digit} onChange={(event) => handleOtpChange(index, event.target.value)} aria-label={`Verification code digit ${index + 1}`} className="h-14 w-12 rounded-lg border border-brand-silver text-center text-xl font-bold transition-all focus:border-brand-red focus:outline-none focus:ring-2 focus:ring-brand-red/20" />)}</div><Button type="submit" className="h-11 w-full" disabled={otp.some((digit) => !digit)}>Verify &amp; Create Account</Button><button type="button" onClick={() => setIsVerifying(false)} className="w-full text-sm text-gray-500 transition-colors hover:text-brand-red">Use a different email</button></form>}</div></div>;
}
