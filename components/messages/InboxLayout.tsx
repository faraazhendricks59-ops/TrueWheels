"use client";

import { useState } from "react";
import { ChatConversation, ChatWindow } from "./ChatWindow";
import { ConversationList } from "./ConversationList";
import { ListingContextCard } from "./ListingContextCard";

const SELECTED_CONVERSATION: ChatConversation = { id: "c1", userName: "Sarah Jenkins", userAvatar: "https://i.pravatar.cc/150?img=5", lastSeen: "Active 5m ago", messages: [{ id: 1, sender: "them", text: "Hi there! Is the 2021 VW Golf GTI still available?", time: "10:30 AM" }, { id: 2, sender: "me", text: "Hi Sarah, yes it is! Are you interested in coming for a viewing?", time: "10:32 AM" }, { id: 3, sender: "them", text: "Definitely. Would you be open to R620,000? I can pay cash this week.", time: "10:35 AM" }], listing: { id: "l1", title: "2021 Volkswagen Golf 8 GTI", price: 649000, image: "https://images.unsplash.com/photo-1609521263047-f8f205293f24?auto=format&fit=crop&w=200&q=80" } };

export function InboxLayout() { const [activeChatId, setActiveChatId] = useState<string | null>("c1"); return <div className="flex h-[calc(100vh-8rem)] overflow-hidden rounded-2xl border border-brand-silver bg-surface-white shadow-sm"><div className={`flex w-full flex-shrink-0 flex-col border-r border-brand-silver md:w-80 lg:w-96 ${activeChatId ? "hidden md:flex" : "flex"}`}><ConversationList activeChatId={activeChatId} onSelectChat={setActiveChatId} /></div><div className={`min-w-0 flex-1 ${!activeChatId ? "hidden md:flex" : "flex"}`}>{activeChatId ? <><div className="min-w-0 flex-1"><ChatWindow conversation={SELECTED_CONVERSATION} onBack={() => setActiveChatId(null)} /></div><aside className="hidden w-80 flex-shrink-0 border-l border-brand-silver bg-surface-grey/30 xl:block"><ListingContextCard listing={SELECTED_CONVERSATION.listing} /></aside></> : <div className="flex flex-1 items-center justify-center bg-surface-grey/20 text-gray-400"><p>Select a conversation to start messaging</p></div>}</div></div>; }
