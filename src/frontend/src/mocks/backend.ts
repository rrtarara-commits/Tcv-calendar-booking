import type { backendInterface, BookingView, BookingLinkView, TimeSlot, BusyOverride, TransformationOutput, UserView, _ImmutableObjectStorageCreateCertificateResult, _ImmutableObjectStorageRefillResult } from "../backend";
import { Duration, UserRole, UserStatus } from "../backend";

const now = BigInt(Date.now()) * BigInt(1000000);
const oneHour = BigInt(3600) * BigInt(1000000000);

export const mockBackend: backendInterface = {
  cancelBooking: async (_bookingId: string) => true,

  cancelBookingByToken: async (_token: string) => ({ __kind__: "ok" as const, ok: true }),

  getBookingByToken: async (token: string): Promise<BookingView | null> => ({
    isCancelled: false,
    managementToken: token,
    bookingId: "booking-001",
    clientName: "Alice Johnson",
    createdAt: now - oneHour * BigInt(24),
    clientEmail: "alice@example.com",
    timeSlotStart: now + oneHour * BigInt(2),
    fileUrls: [],
    timeSlotEnd: now + oneHour * BigInt(3),
    purpose: "Discuss new product launch strategy",
    linkId: "link-001",
  }),

  getAppBaseUrl: async () => "",

  rescheduleBookingByToken: async (_token, newTimeSlotStart, newTimeSlotEnd) => ({
    __kind__: "ok" as const,
    ok: {
      isCancelled: false,
      managementToken: _token,
      bookingId: "booking-001",
      clientName: "Alice Johnson",
      createdAt: now - oneHour * BigInt(24),
      clientEmail: "alice@example.com",
      timeSlotStart: newTimeSlotStart,
      fileUrls: [],
      timeSlotEnd: newTimeSlotEnd,
      purpose: "Discuss new product launch strategy",
      linkId: "link-001",
    },
  }),

  setAppBaseUrl: async () => undefined,

  setUsersAppBaseUrl: async () => undefined,

  createBooking: async (input) => ({
    isCancelled: false,
    bookingId: "booking-new-1",
    clientName: input.clientName,
    createdAt: now,
    clientEmail: input.clientEmail,
    timeSlotStart: input.timeSlotStart,
    fileUrls: [],
    timeSlotEnd: input.timeSlotEnd,
    purpose: input.purpose,
    linkId: input.linkId,
    managementToken: "",
  }),

  createBookingLink: async (input) => ({
    id: "link-new-1",
    duration: input.duration,
    name: input.name,
    createdAt: now,
    description: input.description,
    isActive: true,
    updatedAt: now,
  }),

  deleteBookingLink: async (_linkId: string) => true,

  fetchGoogleCalendarFreeBusy: async () => JSON.stringify({ calendars: { primary: { busy: [] } } }),

  getAvailableSlots: async (): Promise<Array<TimeSlot>> => [
    { start: now + oneHour * BigInt(2), end: now + oneHour * BigInt(3) },
    { start: now + oneHour * BigInt(4), end: now + oneHour * BigInt(5) },
    { start: now + oneHour * BigInt(6), end: now + oneHour * BigInt(7) },
  ],

  getBookingLink: async (linkId: string): Promise<BookingLinkView | null> => ({
    id: linkId,
    duration: Duration.min30,
    name: "30-Minute Consultation",
    createdAt: now,
    description: "A brief consultation to discuss your project needs.",
    isActive: true,
    updatedAt: now,
  }),

  getOverridesForLink: async (): Promise<Array<BusyOverride>> => [
    {
      slotStart: now + oneHour * BigInt(10),
      slotEnd: now + oneHour * BigInt(11),
      isBookable: true,
      linkId: "link-001",
    },
  ],

  hasGoogleCalendarCredentials: async () => false,

  getGoogleCalendarCredentialStatus: async () => ({ hasCredentials: false, isExpired: false, expiresAt: undefined }),

  listBookingLinks: async (): Promise<Array<BookingLinkView>> => [
    {
      id: "link-001",
      duration: Duration.min30,
      name: "30-Minute Intro Call",
      createdAt: now - oneHour * BigInt(48),
      description: "A brief intro call to learn about your goals.",
      isActive: true,
      updatedAt: now - oneHour * BigInt(24),
    },
    {
      id: "link-002",
      duration: Duration.min60,
      name: "1-Hour Strategy Session",
      createdAt: now - oneHour * BigInt(72),
      description: "Deep-dive strategy session to map out your roadmap.",
      isActive: true,
      updatedAt: now - oneHour * BigInt(48),
    },
    {
      id: "link-003",
      duration: Duration.min15,
      name: "Quick Check-In",
      createdAt: now - oneHour * BigInt(96),
      description: "A 15-minute catch-up for existing clients.",
      isActive: false,
      updatedAt: now - oneHour * BigInt(72),
    },
  ],

  listBookings: async (): Promise<Array<BookingView>> => [
    {
      isCancelled: false,
      bookingId: "booking-001",
      clientName: "Alice Johnson",
      createdAt: now - oneHour * BigInt(24),
      clientEmail: "alice@example.com",
      timeSlotStart: now + oneHour * BigInt(2),
      fileUrls: [],
      timeSlotEnd: now + oneHour * BigInt(3),
      purpose: "Discuss new product launch strategy",
      linkId: "link-001",
      managementToken: "token-001",
    },
    {
      isCancelled: false,
      bookingId: "booking-002",
      clientName: "Bob Smith",
      createdAt: now - oneHour * BigInt(48),
      clientEmail: "bob@example.com",
      timeSlotStart: now + oneHour * BigInt(26),
      fileUrls: [],
      timeSlotEnd: now + oneHour * BigInt(27),
      purpose: "Follow-up on marketing campaign performance",
      linkId: "link-002",
      managementToken: "token-002",
    },
    {
      isCancelled: true,
      bookingId: "booking-003",
      clientName: "Carol Williams",
      createdAt: now - oneHour * BigInt(72),
      clientEmail: "carol@example.com",
      timeSlotStart: now - oneHour * BigInt(5),
      fileUrls: [],
      timeSlotEnd: now - oneHour * BigInt(4),
      purpose: "Initial consultation for website redesign",
      linkId: "link-003",
      managementToken: "token-003",
    },
  ],

  setBookingLinkActive: async () => true,

  setGoogleCalendarCredentials: async () => undefined,

  setHostPrincipal: async () => undefined,

  toggleBusyOverride: async () => true,

  transform: async (input): Promise<TransformationOutput> => ({
    status: BigInt(200),
    body: input.response.body,
    headers: input.response.headers,
  }),

  updateBookingLink: async (linkId, input): Promise<BookingLinkView | null> => ({
    id: linkId,
    duration: input.duration,
    name: input.name,
    createdAt: now,
    description: input.description,
    isActive: true,
    updatedAt: now,
  }),

  // New user management + auth methods
  acceptInvite: async (_token: string) => ({ __kind__: "ok" as const, ok: { email: "user@example.com", name: "User", role: UserRole.user, status: UserStatus.active, createdAt: BigInt(Date.now()) } as UserView }),
  assignCallerUserRole: async () => undefined,
  changeUserRole: async () => true,
  getCallerUserRole: async () => ("user" as unknown as import("../backend").UserRole__1),
  getMyUserInfo: async (): Promise<UserView | null> => ({
    email: "ray@tcv.studio",
    name: "Ray",
    role: UserRole.admin,
    status: UserStatus.active,
    principal: undefined,
    createdAt: BigInt(Date.now()),
  }),
  inviteUser: async () => "mock-invite-token-abc123",
  isCallerAdmin: async () => true,
  listUsers: async (): Promise<UserView[]> => [
    { email: "ray@tcv.studio", name: "Ray", role: UserRole.admin, status: UserStatus.active, principal: undefined, createdAt: BigInt(Date.now()) },
    { email: "jane@example.com", name: "Jane Smith", role: UserRole.user, status: UserStatus.active, principal: undefined, createdAt: BigInt(Date.now()) },
    { email: "bob@example.com", name: "Bob Chen", role: UserRole.user, status: UserStatus.invited, principal: undefined, createdAt: BigInt(Date.now()) },
  ],
  removeUser: async () => true,

  // Google OAuth client ID methods
  getGoogleOAuthClientId: async () => "",
  setGoogleOAuthClientId: async (_clientId: string) => undefined,
  refreshGoogleCalendarCredentials: async () => ({ __kind__: "ok" as const, ok: true }),

  // Object storage stubs (required by backendInterface)
  _immutableObjectStorageBlobsAreLive: async () => [],
  _immutableObjectStorageBlobsToDelete: async () => [],
  _immutableObjectStorageConfirmBlobDeletion: async () => undefined,
  _immutableObjectStorageCreateCertificate: async (): Promise<_ImmutableObjectStorageCreateCertificateResult> => ({
    method: "PUT",
    blob_hash: "",
  }),
  _immutableObjectStorageRefillCashier: async (): Promise<_ImmutableObjectStorageRefillResult> => ({
    success: true,
    topped_up_amount: 0n,
  }),
  _initializeAccessControl: async () => undefined,
  _immutableObjectStorageUpdateGatewayPrincipals: async () => undefined,
};
