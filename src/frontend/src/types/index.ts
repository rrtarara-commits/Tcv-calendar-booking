import type { ExternalBlob } from "../backend";

export interface BookingLink {
  id: string;
  name: string;
  description: string;
  duration: string;
  isActive: boolean;
  createdAt: bigint;
  updatedAt: bigint;
}

export interface Booking {
  bookingId: string;
  linkId: string;
  clientName: string;
  clientEmail: string;
  purpose: string;
  timeSlotStart: bigint;
  timeSlotEnd: bigint;
  fileUrls: ExternalBlob[];
  isCancelled: boolean;
  createdAt: bigint;
  managementToken: string;
}

export interface BusyOverride {
  linkId: string;
  slotStart: bigint;
  slotEnd: bigint;
  isBookable: boolean;
}

export interface AvailableSlot {
  start: bigint;
  end: bigint;
}

export interface BusyInterval {
  start: bigint;
  end: bigint;
}
export type UserRole = "admin" | "user";
export type UserStatus = "active" | "invited";

export interface UserView {
  email: string;
  name: string;
  role: UserRole;
  status: UserStatus;
  principal?: string;
  createdAt: bigint;
}
