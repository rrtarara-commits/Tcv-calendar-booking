import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface GoogleCredentialStatus {
    expiresAt?: bigint;
    isExpired: boolean;
    hasCredentials: boolean;
}
export interface BookingLinkView {
    id: string;
    duration: Duration;
    name: string;
    createdAt: bigint;
    description: string;
    isActive: boolean;
    updatedAt: bigint;
}
export interface TimeSlot {
    end: bigint;
    start: bigint;
}
export interface TransformationOutput {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface UserView {
    status: UserStatus;
    principal?: string;
    name: string;
    createdAt: bigint;
    role: UserRole;
    email: string;
}
export interface CreateBookingInput {
    clientName: string;
    clientEmail: string;
    timeSlotStart: bigint;
    fileUrls: Array<ExternalBlob>;
    timeSlotEnd: bigint;
    purpose: string;
    linkId: string;
}
export interface BusyInterval {
    end: bigint;
    start: bigint;
}
export interface http_header {
    value: string;
    name: string;
}
export interface http_request_result {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface BookingView {
    isCancelled: boolean;
    managementToken: string;
    bookingId: string;
    clientName: string;
    createdAt: bigint;
    clientEmail: string;
    timeSlotStart: bigint;
    fileUrls: Array<ExternalBlob>;
    timeSlotEnd: bigint;
    purpose: string;
    linkId: string;
}
export interface BookingLinkInput {
    duration: Duration;
    name: string;
    description: string;
}
export interface BusyOverride {
    slotEnd: bigint;
    slotStart: bigint;
    isBookable: boolean;
    linkId: string;
}
export interface TransformationInput {
    context: Uint8Array;
    response: http_request_result;
}
export interface InviteInput {
    name: string;
    role: UserRole;
    email: string;
}
export enum Duration {
    min15 = "min15",
    min30 = "min30",
    min45 = "min45",
    min60 = "min60"
}
export enum UserRole {
    admin = "admin",
    user = "user"
}
export enum UserRole__1 {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export enum UserStatus {
    active = "active",
    invited = "invited"
}
export interface backendInterface {
    acceptInvite(token: string): Promise<{
        __kind__: "ok";
        ok: UserView;
    } | {
        __kind__: "err";
        err: string;
    }>;
    assignCallerUserRole(user: Principal, role: UserRole__1): Promise<void>;
    cancelBooking(bookingId: string): Promise<boolean>;
    cancelBookingByToken(token: string): Promise<{
        __kind__: "ok";
        ok: boolean;
    } | {
        __kind__: "err";
        err: string;
    }>;
    changeUserRole(email: string, role: UserRole): Promise<boolean>;
    createBooking(input: CreateBookingInput, busyIntervals: Array<BusyInterval>, appBaseUrl: string): Promise<BookingView>;
    createBookingLink(input: BookingLinkInput): Promise<BookingLinkView>;
    deleteBookingLink(linkId: string): Promise<boolean>;
    /**
     * / Set the base URL used in management links sent to clients.
     */
    fetchGoogleCalendarFreeBusy(calendarId: string, timeMin: string, timeMax: string): Promise<string>;
    /**
     * / Get the current app base URL (for debugging).
     */
    getAppBaseUrl(): Promise<string>;
    getAvailableSlots(linkId: string, rangeStart: bigint, rangeEnd: bigint, busyIntervals: Array<BusyInterval>): Promise<Array<TimeSlot>>;
    getBookingByToken(token: string): Promise<BookingView | null>;
    getBookingLink(linkId: string): Promise<BookingLinkView | null>;
    getCallerUserRole(): Promise<UserRole__1>;
    getGoogleCalendarCredentialStatus(): Promise<GoogleCredentialStatus>;
    getGoogleOAuthClientId(): Promise<string>;
    getMyUserInfo(): Promise<UserView | null>;
    getOverridesForLink(linkId: string): Promise<Array<BusyOverride>>;
    hasGoogleCalendarCredentials(): Promise<boolean>;
    inviteUser(input: InviteInput): Promise<string>;
    isCallerAdmin(): Promise<boolean>;
    listBookingLinks(): Promise<Array<BookingLinkView>>;
    listBookings(): Promise<Array<BookingView>>;
    listUsers(): Promise<Array<UserView>>;
    refreshGoogleCalendarCredentials(): Promise<{
        __kind__: "ok";
        ok: boolean;
    } | {
        __kind__: "err";
        err: string;
    }>;
    removeUser(email: string): Promise<boolean>;
    rescheduleBookingByToken(token: string, newTimeSlotStart: bigint, newTimeSlotEnd: bigint, busyIntervals: Array<BusyInterval>, appBaseUrl: string): Promise<{
        __kind__: "ok";
        ok: BookingView;
    } | {
        __kind__: "err";
        err: string;
    }>;
    /**
     * / Set the base URL used in management links sent to clients.
     */
    setAppBaseUrl(url: string): Promise<void>;
    setBookingLinkActive(linkId: string, isActive: boolean): Promise<boolean>;
    setGoogleCalendarCredentials(accessToken: string, refreshToken: string, expiresAt: bigint): Promise<void>;
    setGoogleOAuthClientId(clientId: string): Promise<void>;
    setHostPrincipal(p: Principal): Promise<void>;
    setUsersAppBaseUrl(url: string): Promise<void>;
    toggleBusyOverride(linkId: string, slotStart: bigint, slotEnd: bigint, isBookable: boolean): Promise<boolean>;
    transform(input: TransformationInput): Promise<TransformationOutput>;
    updateBookingLink(linkId: string, input: BookingLinkInput): Promise<BookingLinkView | null>;
}
