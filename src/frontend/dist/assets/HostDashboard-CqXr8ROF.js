import { c as createLucideIcon, r as reactExports, j as jsxRuntimeExports, C as Calendar, a as cn, L as Link2, B as Button, f as formatDate, b as formatTime, d as LoaderCircle, X } from "./index-Bcm1BYaZ.js";
import { S as Skeleton } from "./skeleton-DAUgWFtR.js";
import { u as useHasGoogleCalendarCredentials } from "./useAvailableSlots-CgEvFERY.js";
import { u as useBookingLinks } from "./useBookingLinks-OKODmVBH.js";
import { u as useBookings, a as useCancelBooking } from "./useBookings-DGlOSDIl.js";
import { F as FileText } from "./file-text-DySO-kf3.js";
import "./useMutation-BjpTJhfH.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M15 3h6v6", key: "1q9fwt" }],
  ["path", { d: "M10 14 21 3", key: "gplh6r" }],
  ["path", { d: "M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6", key: "a6xqqp" }]
];
const ExternalLink = createLucideIcon("external-link", __iconNode);
function StatCard({
  label,
  value,
  loading,
  icon: Icon,
  accent
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: cn(
        "bg-card border rounded-xl p-5 flex items-start gap-3 transition-colors",
        accent ? "border-primary/30 shadow-[0_0_0_1px_oklch(var(--primary)/0.12)]" : "border-border"
      ),
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: cn(
              "w-9 h-9 rounded-lg flex items-center justify-center shrink-0",
              accent ? "bg-primary/15" : "bg-muted/60"
            ),
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Icon,
              {
                size: 16,
                className: accent ? "text-primary" : "text-muted-foreground"
              }
            )
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] font-medium text-muted-foreground uppercase tracking-widest mb-1", children: label }),
          loading ? /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-7 w-10 mt-1 bg-muted/60" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(
            "p",
            {
              className: cn(
                "text-3xl font-display font-bold leading-none",
                accent ? "text-primary" : "text-foreground"
              ),
              children: value
            }
          )
        ] })
      ]
    }
  );
}
function BookingCard({
  booking,
  index,
  onCancel,
  cancelling
}) {
  const [showFiles, setShowFiles] = reactExports.useState(false);
  const initials = booking.clientName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "bg-card border border-border rounded-xl overflow-hidden hover:border-primary/20 transition-colors",
      "data-ocid": `dashboard.booking.item.${index}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 py-3.5 flex items-start gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-9 h-9 rounded-full bg-primary/15 flex items-center justify-center shrink-0 mt-0.5 ring-1 ring-primary/20", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-bold text-primary", children: initials }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground truncate", children: booking.clientName }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground truncate", children: booking.clientEmail })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right shrink-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-foreground", children: formatDate(booking.timeSlotStart) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
                  formatTime(booking.timeSlotStart),
                  " –",
                  " ",
                  formatTime(booking.timeSlotEnd)
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 flex items-center gap-2 flex-wrap", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-primary/10 text-primary border border-primary/20", children: booking.purpose }),
              booking.fileUrls.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => setShowFiles((v) => !v),
                  className: "flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors",
                  "data-ocid": `dashboard.booking.files_toggle.${index}`,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { size: 11 }),
                    booking.fileUrls.length,
                    " file",
                    booking.fileUrls.length > 1 ? "s" : ""
                  ]
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: () => onCancel(booking.bookingId),
              disabled: cancelling,
              className: "p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md transition-colors shrink-0 disabled:opacity-40",
              "aria-label": "Cancel booking",
              "data-ocid": `dashboard.booking.cancel_button.${index}`,
              children: cancelling ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { size: 14, className: "animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 14 })
            }
          )
        ] }),
        showFiles && booking.fileUrls.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-t border-border bg-muted/20 px-4 py-2.5 space-y-1", children: booking.fileUrls.map((file, fi) => {
          const url = file.getDirectURL();
          const name = url.split("/").pop() ?? `File ${fi + 1}`;
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "a",
            {
              href: url,
              target: "_blank",
              rel: "noopener noreferrer",
              className: "flex items-center gap-2 text-xs text-primary hover:underline",
              "data-ocid": `dashboard.booking.file_link.${index}.${fi + 1}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { size: 11 }),
                name
              ]
            },
            url
          );
        }) })
      ]
    }
  );
}
function HostDashboard() {
  const { data: bookings, isLoading: bookingsLoading } = useBookings();
  const { data: links, isLoading: linksLoading } = useBookingLinks();
  const { data: hasCalendar, isLoading: calendarLoading } = useHasGoogleCalendarCredentials();
  const cancelBooking = useCancelBooking();
  const [cancellingId, setCancellingId] = reactExports.useState(null);
  const now = BigInt(Date.now()) * 1000000n;
  const sevenDays = now + BigInt(7 * 24 * 60 * 60 * 1e3) * 1000000n;
  const activeBookings = (bookings == null ? void 0 : bookings.filter((b) => !b.isCancelled)) ?? [];
  const upcoming = activeBookings.filter((b) => b.timeSlotStart >= now && b.timeSlotStart <= sevenDays).sort((a, b) => a.timeSlotStart < b.timeSlotStart ? -1 : 1);
  const activeLinks = (links == null ? void 0 : links.filter((l) => l.isActive).length) ?? 0;
  const totalBookings = activeBookings.length;
  const handleCancel = async (bookingId) => {
    setCancellingId(bookingId);
    try {
      await cancelBooking.mutateAsync(bookingId);
    } finally {
      setCancellingId(null);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "max-w-5xl mx-auto px-4 md:px-6 py-8",
      "data-ocid": "dashboard.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between mb-8", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl font-bold text-foreground tracking-tight", children: "Dashboard" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-1", children: "Overview of your upcoming schedule" })
          ] }),
          !calendarLoading && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "a",
            {
              href: "/host/calendar",
              className: cn(
                "hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors",
                hasCalendar ? "bg-primary/10 border-primary/25 text-primary hover:bg-primary/15" : "bg-muted/40 border-border text-muted-foreground hover:text-foreground hover:border-primary/30"
              ),
              "data-ocid": "dashboard.calendar_status_link",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { size: 13 }),
                hasCalendar ? "Google Calendar connected" : "Connect Google Calendar"
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 md:grid-cols-3 gap-3 mb-8", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            StatCard,
            {
              label: "Upcoming (7 days)",
              value: bookingsLoading ? "—" : upcoming.length,
              loading: bookingsLoading,
              icon: Calendar,
              accent: true
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            StatCard,
            {
              label: "Active Links",
              value: linksLoading ? "—" : activeLinks,
              loading: linksLoading,
              icon: Link2
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            StatCard,
            {
              label: "Total Bookings",
              value: bookingsLoading ? "—" : totalBookings,
              loading: bookingsLoading,
              icon: FileText
            }
          )
        ] }),
        !calendarLoading && !hasCalendar && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "bg-primary/8 border border-primary/20 rounded-xl px-4 py-3 flex items-center justify-between mb-7",
            "data-ocid": "dashboard.cal_banner",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { size: 14, className: "text-primary shrink-0" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-foreground/80", children: "Connect Google Calendar to see your real availability" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "a",
                {
                  href: "/host/settings",
                  className: "flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary/80 transition-colors shrink-0 ml-3 px-2.5 py-1.5 rounded-md bg-primary/10 hover:bg-primary/15 border border-primary/20",
                  "data-ocid": "dashboard.connect_calendar_link",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { size: 12 }),
                    "Connect"
                  ]
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-between mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-base font-semibold text-foreground", children: [
          "Upcoming Bookings",
          !bookingsLoading && upcoming.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-2 text-xs font-normal text-muted-foreground", children: "· Next 7 days" })
        ] }) }),
        bookingsLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", "data-ocid": "dashboard.loading_state", children: [1, 2, 3].map((n) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-20 w-full rounded-xl bg-card" }, n)) }) : upcoming.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "bg-card border border-border rounded-xl p-12 text-center",
            "data-ocid": "dashboard.empty_state",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { size: 22, className: "text-primary" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground mb-1", children: "No upcoming bookings" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mb-5", children: "Share your booking links to receive new bookings." }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  size: "sm",
                  className: "bg-primary text-primary-foreground hover:bg-primary/90 gap-1.5",
                  asChild: true,
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "/host/links", "data-ocid": "dashboard.view_links_button", children: "View Booking Links" })
                }
              )
            ]
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", "data-ocid": "dashboard.bookings_list", children: upcoming.map((booking, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          BookingCard,
          {
            booking,
            index: i + 1,
            onCancel: handleCancel,
            cancelling: cancellingId === booking.bookingId
          },
          booking.bookingId
        )) })
      ]
    }
  );
}
export {
  HostDashboard as default
};
