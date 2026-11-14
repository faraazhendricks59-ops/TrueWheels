import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) { return twMerge(clsx(inputs)); }
export function formatRand(value: number) { return `R ${Math.round(value).toLocaleString("en-ZA")}`; }
