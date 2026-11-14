"use client";

import { KeyboardEvent, useState } from "react";
import { Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useOffline } from "@/components/providers/OfflineProvider";
import { syncQueue } from "@/lib/sync-queue";

interface OfflineAwareMessageInputProps { conversationId: string; onMessageSent: () => void; }
export function OfflineAwareMessageInput({ conversationId, onMessageSent }: OfflineAwareMessageInputProps) { const [message, setMessage] = useState(""); const [sending, setSending] = useState(false); const { isOnline } = useOffline(); const send = async () => { const content = message.trim(); if (!content || sending) return; setSending(true); if (!isOnline) syncQueue.addAction("message", { conversation_id: conversationId, content }); setMessage(""); onMessageSent(); setSending(false); }; const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => { if (event.key === "Enter") void send(); }; return <div className="border-t border-brand-silver bg-surface-white p-4">{!isOnline && <div className="mb-2 flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs text-amber-700"><Loader2 size={12} className="animate-spin" />Message will be sent when you're back online</div>}<div className="flex items-center gap-2 rounded-xl border border-brand-silver bg-surface-grey p-2"><input value={message} onChange={(event) => setMessage(event.target.value)} onKeyDown={onKeyDown} placeholder={isOnline ? "Type a message..." : "Message (will send when online)"} className="flex-1 bg-transparent px-2 text-sm text-brand-graphite focus:outline-none" /><Button type="button" size="sm" onClick={() => void send()} disabled={!message.trim() || sending} className="h-9 w-9 !px-0 rounded-lg"><Send size={16} /></Button></div></div>; }
