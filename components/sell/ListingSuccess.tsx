"use client";

import { Eye, LayoutDashboard, Plus, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface ListingSuccessProps { onListAnother: () => void; onViewListing: () => void; }

export function ListingSuccess({ onListAnother, onViewListing }: ListingSuccessProps) { return <div className="flex animate-in flex-col items-center justify-center py-16 text-center fade-in slide-in-from-bottom-4 duration-500"><div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100"><CheckCircle2 size={40} className="text-green-600" /></div><h2 className="mb-2 text-3xl font-extrabold text-brand-graphite">Listing Published!</h2><p className="mb-8 max-w-md text-gray-500">Your vehicle is now live on the TrueWheels marketplace. We&apos;ve notified potential buyers matching your criteria.</p><div className="flex w-full max-w-md flex-col gap-4 sm:flex-row"><Button type="button" variant="outline" className="h-12 flex-1" onClick={onViewListing}><Eye size={18} className="mr-2" />View Listing</Button><Button type="button" className="h-12 flex-1" onClick={onListAnother}><Plus size={18} className="mr-2" />List Another</Button></div><div className="mt-8 w-full max-w-md border-t border-brand-silver pt-8"><Button type="button" variant="ghost" className="text-sm" onClick={() => { window.location.href = "/dashboard"; }}><LayoutDashboard size={16} className="mr-2" />Go to Seller Dashboard</Button></div></div>; }
