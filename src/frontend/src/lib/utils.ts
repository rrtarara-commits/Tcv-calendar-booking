import type { ClassValue } from "clsx";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export function formatDuration(duration: string): string {
  switch (duration) {
    case "min15":
      return "15 min";
    case "min30":
      return "30 min";
    case "min45":
      return "45 min";
    case "min60":
      return "60 min";
    default:
      return "Unknown";
  }
}

export function formatDate(ts: bigint): string {
  const date = new Date(Number(ts / 1_000_000n));
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatTime(ts: bigint): string {
  const date = new Date(Number(ts / 1_000_000n));
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

export function formatDateShort(ts: bigint): string {
  const date = new Date(Number(ts / 1_000_000n));
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export function msToNanoseconds(ms: number): bigint {
  return BigInt(ms) * 1_000_000n;
}

export function nanosecondsToMs(ns: bigint): number {
  return Number(ns / 1_000_000n);
}
