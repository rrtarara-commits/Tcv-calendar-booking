import { c as createLucideIcon, k as useParams, r as reactExports, H as msToNanoseconds, j as jsxRuntimeExports, x as CircleCheck, C as Calendar, f as formatDate, b as formatTime, I as formatDuration, d as LoaderCircle, K as User, X } from "./index-Bcm1BYaZ.js";
import { a as useGoogleCalendarFreeBusy, b as useAvailableSlots } from "./useAvailableSlots-CgEvFERY.js";
import { e as useBookingLink } from "./useBookingLinks-OKODmVBH.js";
import { e as useGetBookingByToken, f as useCancelBookingByToken, g as useRescheduleBookingByToken } from "./useBookings-DGlOSDIl.js";
import { a as ChevronLeft, C as ChevronRight } from "./chevron-right-ChuTWYGB.js";
import { R as RefreshCw } from "./refresh-cw-9yGrPfkU.js";
import { C as CircleAlert } from "./circle-alert-nsbdDCBx.js";
import { C as Clock } from "./clock-B8La_BYV.js";
import { T as Trash2 } from "./trash-2-sp5uBwt4.js";
import "./useMutation-BjpTJhfH.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  ["path", { d: "M8 2v4", key: "1cmpym" }],
  ["path", { d: "M16 2v4", key: "4m81vk" }],
  ["path", { d: "M21 14V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h8", key: "bce9hv" }],
  ["path", { d: "M3 10h18", key: "8toen8" }],
  ["path", { d: "m16 20 2 2 4-4", key: "13tcca" }]
];
const CalendarCheck2 = createLucideIcon("calendar-check-2", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["path", { d: "M8 2v4", key: "1cmpym" }],
  ["path", { d: "M16 2v4", key: "4m81vk" }],
  ["path", { d: "M21 13V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h8", key: "3spt84" }],
  ["path", { d: "M3 10h18", key: "8toen8" }],
  ["path", { d: "m17 22 5-5", key: "1k6ppv" }],
  ["path", { d: "m17 17 5 5", key: "p7ous7" }]
];
const CalendarX2 = createLucideIcon("calendar-x-2", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7", key: "132q7q" }],
  ["rect", { x: "2", y: "4", width: "20", height: "16", rx: "2", key: "izxlao" }]
];
const Mail = createLucideIcon("mail", __iconNode);
function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}
function getFirstDayOfMonth(year, month) {
  return new Date(year, month, 1).getDay();
}
const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
];
const DAY_LABELS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
function dateToRangeNs(year, month, day) {
  const start = new Date(year, month, day, 0, 0, 0, 0);
  const end = new Date(year, month, day, 23, 59, 59, 999);
  return {
    rangeStart: msToNanoseconds(start.getTime()),
    rangeEnd: msToNanoseconds(end.getTime())
  };
}
function isSameDay(date, y, m, d) {
  return date.getFullYear() === y && date.getMonth() === m && date.getDate() === d;
}
function isPastDay(year, month, day) {
  const today = /* @__PURE__ */ new Date();
  const target = new Date(year, month, day);
  today.setHours(0, 0, 0, 0);
  return target < today;
}
function getMeetingCountdown(slotStart) {
  const msStart = Number(slotStart) / 1e6;
  const now = Date.now();
  const diff = msStart - now;
  if (diff < 0) return "This meeting has passed";
  const days = Math.floor(diff / (1e3 * 60 * 60 * 24));
  const hours = Math.floor(diff % (1e3 * 60 * 60 * 24) / (1e3 * 60 * 60));
  if (days > 30) {
    const weeks = Math.floor(days / 7);
    return `In ${weeks} week${weeks !== 1 ? "s" : ""}`;
  }
  if (days > 0)
    return `In ${days} day${days !== 1 ? "s" : ""}${hours > 0 ? ` and ${hours}h` : ""}`;
  if (hours > 0) return `In ${hours} hour${hours !== 1 ? "s" : ""}`;
  const mins = Math.floor(diff / (1e3 * 60));
  return mins > 0 ? `In ${mins} minute${mins !== 1 ? "s" : ""}` : "Starting soon";
}
function MonthCalendar({
  year,
  month,
  selectedDate,
  onSelectDate,
  onPrevMonth,
  onNextMonth
}) {
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const today = /* @__PURE__ */ new Date();
  const cells = [
    ...Array.from(
      { length: firstDay },
      (_, i) => ({ kind: "pad", pos: i })
    ),
    ...Array.from(
      { length: daysInMonth },
      (_, i) => ({ kind: "day", day: i + 1 })
    )
  ];
  while (cells.length % 7 !== 0) cells.push({ kind: "pad", pos: cells.length });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          onClick: onPrevMonth,
          className: "w-8 h-8 rounded-lg border border-border hover:border-primary/50 hover:text-primary hover:bg-primary/5 transition-colors flex items-center justify-center",
          "aria-label": "Previous month",
          "data-ocid": "manage.calendar_prev_month",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { size: 15, className: "text-muted-foreground" })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm font-bold text-foreground tracking-wide", children: [
        MONTH_NAMES[month],
        " ",
        year
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          onClick: onNextMonth,
          className: "w-8 h-8 rounded-lg border border-border hover:border-primary/50 hover:text-primary hover:bg-primary/5 transition-colors flex items-center justify-center",
          "aria-label": "Next month",
          "data-ocid": "manage.calendar_next_month",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { size: 15, className: "text-muted-foreground" })
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-7 mb-2", children: DAY_LABELS.map((d) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "text-center text-[10px] font-bold text-muted-foreground/60 py-1 uppercase tracking-widest",
        children: d
      },
      d
    )) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-7 gap-1", children: cells.map((cell) => {
      if (cell.kind === "pad")
        return /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "aspect-square"
          },
          `pad-${year}-${month}-${cell.pos}`
        );
      const { day } = cell;
      const past = isPastDay(year, month, day);
      const isToday = isSameDay(today, year, month, day);
      const selected = selectedDate ? isSameDay(selectedDate, year, month, day) : false;
      return /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          disabled: past,
          onClick: () => onSelectDate(new Date(year, month, day)),
          className: [
            "aspect-square rounded-lg text-xs font-semibold transition-all flex items-center justify-center",
            past ? "text-muted-foreground/25 cursor-not-allowed" : selected ? "bg-primary text-primary-foreground shadow-md scale-105 font-bold" : isToday ? "border-2 border-primary/70 text-primary hover:bg-primary/15" : "hover:bg-primary/10 hover:text-primary text-foreground hover:scale-105"
          ].join(" "),
          "data-ocid": `manage.calendar_day.${day}`,
          children: day
        },
        day
      );
    }) })
  ] });
}
function TimeSlotGrid({
  slots,
  isLoading,
  selectedSlotStart,
  onSelect
}) {
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", "data-ocid": "manage.slots_loading_state", children: [1, 2, 3, 4].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-14 rounded-xl bg-muted/40 animate-pulse" }, i)) });
  }
  if (!(slots == null ? void 0 : slots.length)) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex flex-col items-center justify-center py-10 text-center",
        "data-ocid": "manage.slots_empty_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-full bg-muted/50 flex items-center justify-center mb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { size: 18, className: "text-muted-foreground/50" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground", children: "No available slots" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "Try selecting a different day." })
        ]
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", "data-ocid": "manage.slots_list", children: slots.map((slot, i) => {
    const selected = selectedSlotStart === slot.start;
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        type: "button",
        onClick: () => onSelect(slot),
        className: [
          "w-full px-4 py-3 rounded-xl border text-sm text-left transition-all flex items-center justify-between group",
          selected ? "bg-primary text-primary-foreground border-primary shadow-lg scale-[1.01]" : "border-border bg-card hover:border-primary/60 hover:bg-primary/8 text-foreground hover:scale-[1.01]"
        ].join(" "),
        "data-ocid": `manage.slot.item.${i + 1}`,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold", children: formatTime(slot.start) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "span",
            {
              className: `text-xs ${selected ? "opacity-75" : "text-muted-foreground"}`,
              children: [
                "– ",
                formatTime(slot.end)
              ]
            }
          )
        ]
      },
      `${slot.start}`
    );
  }) });
}
function CancelModal({
  onConfirm,
  onClose,
  isPending,
  meetingTitle,
  meetingDate,
  meetingTime
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: "fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-background/80 backdrop-blur-sm",
      "data-ocid": "manage.dialog",
      onClick: (e) => {
        if (e.target === e.currentTarget && !isPending) onClose();
      },
      onKeyDown: (e) => {
        if (e.key === "Escape" && !isPending) onClose();
      },
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full max-w-md bg-card border border-border rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 sm:slide-in-from-bottom-0 duration-300", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between px-6 pt-6 pb-4 border-b border-border", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-9 h-9 rounded-xl bg-destructive/10 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CalendarX2, { size: 17, className: "text-destructive" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-base font-bold text-foreground", children: "Cancel appointment?" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: onClose,
              disabled: isPending,
              className: "w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors",
              "aria-label": "Close",
              "data-ocid": "manage.close_button",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 15 })
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-6 py-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-muted/30 border border-border rounded-xl px-4 py-3 mb-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2", children: "Meeting to be cancelled" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-bold text-foreground mb-1", children: meetingTitle }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 text-xs text-muted-foreground", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { size: 11 }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: meetingDate }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-border", children: "·" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { size: 11 }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: meetingTime })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground leading-relaxed", children: "This will permanently remove the meeting from your calendar. This action cannot be undone." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-6 pb-6 flex flex-col sm:flex-row gap-2.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: onClose,
              disabled: isPending,
              className: "flex-1 h-11 rounded-xl border border-border text-sm font-semibold text-foreground hover:bg-muted transition-colors order-2 sm:order-1",
              "data-ocid": "manage.cancel_button",
              children: "Keep it"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: onConfirm,
              disabled: isPending,
              className: "flex-1 h-11 rounded-xl bg-destructive text-destructive-foreground text-sm font-bold hover:brightness-110 disabled:opacity-50 transition-smooth flex items-center justify-center gap-2 order-1 sm:order-2",
              "data-ocid": "manage.confirm_button",
              children: isPending ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { size: 14, className: "animate-spin" }),
                " Cancelling…"
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { size: 14 }),
                " Yes, Cancel Meeting"
              ] })
            }
          )
        ] })
      ] })
    }
  );
}
function PageSkeleton() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: "min-h-screen bg-background py-10 px-4",
      "data-ocid": "manage.loading_state",
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-lg mx-auto", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-5 w-48 bg-muted/50 rounded-full animate-pulse mb-3" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-9 w-72 bg-muted/40 rounded-xl animate-pulse mb-2" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-4 w-32 bg-muted/30 rounded-full animate-pulse mb-8" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-24 rounded-2xl bg-card border border-border animate-pulse mb-4" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-card border border-border rounded-2xl p-6 mb-5 space-y-4", children: [1, 2, 3, 4].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          i > 1 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-px bg-border mb-4" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded-lg bg-muted/50 animate-pulse shrink-0" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5 flex-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-3 w-16 bg-muted/40 rounded animate-pulse" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-4 w-40 bg-muted/30 rounded animate-pulse" })
            ] })
          ] })
        ] }, i)) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 h-12 rounded-xl bg-primary/20 animate-pulse" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 h-12 rounded-xl bg-muted/30 animate-pulse" })
        ] })
      ] })
    }
  );
}
function ManageAppointmentPage() {
  const params = useParams({ strict: false });
  const token = params.managementToken ?? "";
  const { data: booking, isLoading, isError } = useGetBookingByToken(token);
  const { data: link } = useBookingLink((booking == null ? void 0 : booking.linkId) ?? "");
  const cancelMutation = useCancelBookingByToken();
  const rescheduleMutation = useRescheduleBookingByToken();
  const [view, setView] = reactExports.useState("details");
  const [showCancelModal, setShowCancelModal] = reactExports.useState(false);
  const [done, setDone] = reactExports.useState(null);
  const [previousSlot, setPreviousSlot] = reactExports.useState(null);
  const [rescheduleError, setRescheduleError] = reactExports.useState(null);
  const today = /* @__PURE__ */ new Date();
  const [calYear, setCalYear] = reactExports.useState(today.getFullYear());
  const [calMonth, setCalMonth] = reactExports.useState(today.getMonth());
  const [selectedDate, setSelectedDate] = reactExports.useState(null);
  const [selectedSlot, setSelectedSlot] = reactExports.useState(null);
  const slotRange = selectedDate ? dateToRangeNs(
    selectedDate.getFullYear(),
    selectedDate.getMonth(),
    selectedDate.getDate()
  ) : null;
  const timeMin = selectedDate ? (() => {
    const d = new Date(selectedDate);
    d.setHours(0, 0, 0, 0);
    return d.toISOString();
  })() : "";
  const timeMax = selectedDate ? (() => {
    const d = new Date(selectedDate);
    d.setHours(23, 59, 59, 999);
    return d.toISOString();
  })() : "";
  const { data: freeBusyJson } = useGoogleCalendarFreeBusy(
    selectedDate ? "primary" : void 0,
    timeMin,
    timeMax
  );
  const busyIntervals = reactExports.useMemo(() => {
    if (!freeBusyJson) return [];
    try {
      const parsed = JSON.parse(freeBusyJson);
      const calendars = parsed.calendars;
      if (!calendars) return [];
      return Object.values(calendars).flatMap(
        (cal) => cal.busy.map((b) => ({
          start: msToNanoseconds(new Date(b.start).getTime()),
          end: msToNanoseconds(new Date(b.end).getTime())
        }))
      );
    } catch {
      return [];
    }
  }, [freeBusyJson]);
  const { data: slots, isLoading: slotsLoading } = useAvailableSlots({
    linkId: booking == null ? void 0 : booking.linkId,
    rangeStart: (slotRange == null ? void 0 : slotRange.rangeStart) ?? 0n,
    rangeEnd: (slotRange == null ? void 0 : slotRange.rangeEnd) ?? 0n,
    busyIntervals,
    enabled: !!booking && !!selectedDate && view === "reschedule"
  });
  const handlePrevMonth = () => {
    if (calMonth === 0) {
      setCalYear((y) => y - 1);
      setCalMonth(11);
    } else setCalMonth((m) => m - 1);
  };
  const handleNextMonth = () => {
    if (calMonth === 11) {
      setCalYear((y) => y + 1);
      setCalMonth(0);
    } else setCalMonth((m) => m + 1);
  };
  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setSelectedSlot(null);
    setCalYear(date.getFullYear());
    setCalMonth(date.getMonth());
  };
  const handleCancel = async () => {
    try {
      await cancelMutation.mutateAsync(token);
      setShowCancelModal(false);
      setDone("cancelled");
    } catch {
      setShowCancelModal(false);
    }
  };
  const handleReschedule = async () => {
    if (!selectedSlot || !booking) return;
    setRescheduleError(null);
    setPreviousSlot({ start: booking.timeSlotStart, end: booking.timeSlotEnd });
    try {
      await rescheduleMutation.mutateAsync({
        token,
        newTimeSlotStart: selectedSlot.start,
        newTimeSlotEnd: selectedSlot.end,
        busyIntervals
      });
      setDone("rescheduled");
    } catch (err) {
      setPreviousSlot(null);
      setRescheduleError(
        err instanceof Error ? err.message : "Something went wrong."
      );
    }
  };
  const dateLabel = selectedDate ? selectedDate.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric"
  }) : null;
  if (isLoading) return /* @__PURE__ */ jsxRuntimeExports.jsx(PageSkeleton, {});
  if (isError || !booking || booking.isCancelled) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "min-h-screen flex items-center justify-center px-4 bg-background",
        "data-ocid": "manage.error_state",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-sm w-full text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 rounded-2xl bg-card border border-border flex items-center justify-center mx-auto mb-5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CalendarX2, { size: 28, className: "text-muted-foreground" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-xl font-bold text-foreground mb-2", children: (booking == null ? void 0 : booking.isCancelled) ? "Appointment cancelled" : "Appointment not found" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground leading-relaxed", children: (booking == null ? void 0 : booking.isCancelled) ? "This appointment has already been cancelled and removed from the calendar." : "This link is invalid or has expired. Please check your calendar invite for the correct link." })
        ] })
      }
    );
  }
  if (done === "cancelled") {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "min-h-screen flex items-center justify-center px-4 bg-background",
        "data-ocid": "manage.success_state",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-sm w-full text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-20 h-20 rounded-2xl bg-muted/40 border border-border flex items-center justify-center mx-auto mb-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { size: 34, className: "text-muted-foreground" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-2xl font-bold text-foreground mb-2", children: "Appointment cancelled" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground leading-relaxed mb-6", children: "Your appointment has been cancelled. The calendar invite has been removed from your calendar." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-card border border-border rounded-xl px-5 py-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Want to book a new time? Ask the host to share their booking link with you again." }) })
        ] })
      }
    );
  }
  if (done === "rescheduled" && selectedSlot) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "min-h-screen flex items-center justify-center px-4 bg-background",
        "data-ocid": "manage.success_state",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-sm w-full", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center mb-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-20 h-20 rounded-2xl border-2 border-primary/40 bg-primary/10 flex items-center justify-center mx-auto mb-5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CalendarCheck2, { size: 34, className: "text-primary" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-2xl font-bold text-foreground mb-1", children: "You're all set!" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Your appointment has been rescheduled." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded-2xl overflow-hidden mb-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-5 pt-4 pb-3 border-b border-border", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-bold uppercase tracking-widest text-muted-foreground", children: "Meeting updated" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-bold text-foreground mt-0.5", children: (link == null ? void 0 : link.name) ?? "Your meeting" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-5 py-4 space-y-3", children: [
              previousSlot && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3 opacity-50", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-7 h-7 rounded-lg bg-muted/50 flex items-center justify-center shrink-0 mt-0.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { size: 13, className: "text-muted-foreground" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] uppercase tracking-widest text-muted-foreground font-semibold mb-0.5", children: "Previous time" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-muted-foreground line-through", children: formatDate(previousSlot.start) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground/70", children: [
                    formatTime(previousSlot.start),
                    " –",
                    " ",
                    formatTime(previousSlot.end)
                  ] })
                ] })
              ] }),
              previousSlot && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-3 pl-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-5 flex justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-4 w-px bg-border" }) }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-7 h-7 rounded-lg bg-primary/15 border border-primary/30 flex items-center justify-center shrink-0 mt-0.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { size: 13, className: "text-primary" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] uppercase tracking-widest text-primary font-bold mb-0.5", children: "New time" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-bold text-foreground", children: formatDate(selectedSlot.start) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-0.5", children: [
                    formatTime(selectedSlot.start),
                    " –",
                    " ",
                    formatTime(selectedSlot.end),
                    link ? ` · ${formatDuration(link.duration)}` : ""
                  ] })
                ] })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5 bg-primary/8 border border-primary/20 rounded-xl px-4 py-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { size: 15, className: "text-primary shrink-0" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-foreground font-medium", children: "Your calendar invite has been updated with the new time." })
          ] })
        ] })
      }
    );
  }
  const meetingFullDate = new Date(
    Number(booking.timeSlotStart) / 1e6
  ).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric"
  });
  const meetingTimeStr = `${formatTime(booking.timeSlotStart)} – ${formatTime(booking.timeSlotEnd)}`;
  const countdown = getMeetingCountdown(booking.timeSlotStart);
  const isFuture = Number(booking.timeSlotStart) / 1e6 > Date.now();
  if (view === "reschedule") {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "min-h-screen bg-background py-10 px-4",
        "data-ocid": "manage.page",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-3xl mx-auto", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              onClick: () => {
                setView("details");
                setSelectedDate(null);
                setSelectedSlot(null);
              },
              className: "flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors mb-8",
              "data-ocid": "manage.back_button",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { size: 16 }),
                " Back to appointment"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-8", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/8 text-primary text-xs font-bold mb-3 tracking-wide", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { size: 11 }),
              " Reschedule"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-3xl font-bold text-foreground mb-2", children: "Pick a new time" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-muted-foreground text-sm", children: [
              "Currently:",
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-foreground font-semibold", children: [
                meetingFullDate,
                " at ",
                formatTime(booking.timeSlotStart)
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded-2xl overflow-hidden", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid md:grid-cols-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 md:border-r md:border-border", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground mb-5", children: "Select a Date" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  MonthCalendar,
                  {
                    year: calYear,
                    month: calMonth,
                    selectedDate,
                    onSelectDate: handleDateSelect,
                    onPrevMonth: handlePrevMonth,
                    onNextMonth: handleNextMonth
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-6 border-t md:border-t-0 border-border", children: !selectedDate ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center h-full py-12 text-center", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-14 h-14 rounded-2xl bg-primary/8 border border-primary/15 flex items-center justify-center mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { size: 22, className: "text-primary/50" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground mb-1", children: "Choose a date" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Select a date on the left to see available times." })
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "h-full flex flex-col", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-4", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground mb-0.5", children: "Available Times" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-bold text-foreground", children: dateLabel })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-y-auto max-h-72", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  TimeSlotGrid,
                  {
                    slots,
                    isLoading: slotsLoading,
                    selectedSlotStart: (selectedSlot == null ? void 0 : selectedSlot.start) ?? null,
                    onSelect: setSelectedSlot
                  }
                ) })
              ] }) })
            ] }),
            selectedSlot && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-t border-border px-6 py-4 bg-primary/5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-0.5", children: "New time selected" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm font-bold text-primary", children: [
                    dateLabel,
                    " · ",
                    formatTime(selectedSlot.start),
                    " –",
                    " ",
                    formatTime(selectedSlot.end)
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 w-full sm:w-auto", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      onClick: () => setSelectedSlot(null),
                      className: "h-10 px-4 rounded-xl border border-border text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors font-medium",
                      "data-ocid": "manage.change_slot_button",
                      children: "Change"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      onClick: handleReschedule,
                      disabled: rescheduleMutation.isPending,
                      className: "flex-1 sm:flex-none h-10 px-5 bg-primary text-primary-foreground text-sm font-bold rounded-xl hover:brightness-110 active:scale-[0.98] disabled:opacity-50 transition-smooth flex items-center justify-center gap-2 shadow-md min-w-[160px]",
                      "data-ocid": "manage.submit_button",
                      children: rescheduleMutation.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { size: 14, className: "animate-spin" }),
                        " ",
                        "Rescheduling…"
                      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                        "Change to ",
                        formatTime(selectedSlot.start)
                      ] })
                    }
                  )
                ] })
              ] }),
              rescheduleError && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "flex items-center gap-2 mt-3 px-3 py-2.5 bg-destructive/10 border border-destructive/30 rounded-lg",
                  "data-ocid": "manage.error_state",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      CircleAlert,
                      {
                        size: 13,
                        className: "text-destructive shrink-0"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-destructive", children: rescheduleError })
                  ]
                }
              )
            ] })
          ] })
        ] })
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    showCancelModal && /* @__PURE__ */ jsxRuntimeExports.jsx(
      CancelModal,
      {
        onConfirm: handleCancel,
        onClose: () => setShowCancelModal(false),
        isPending: cancelMutation.isPending,
        meetingTitle: (link == null ? void 0 : link.name) ?? "Your meeting",
        meetingDate: meetingFullDate,
        meetingTime: meetingTimeStr
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "min-h-screen bg-background py-10 px-4",
        "data-ocid": "manage.page",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-lg mx-auto", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-8", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/8 text-primary text-xs font-bold mb-3 tracking-wide", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { size: 11 }),
              " Manage appointment"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-3xl font-bold text-foreground mb-1", children: (link == null ? void 0 : link.name) ?? "Your appointment" }),
            link && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
              formatDuration(link.duration),
              " meeting"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "bg-card border border-primary/20 rounded-2xl px-5 py-4 mb-4 flex items-center justify-between gap-4",
              "data-ocid": "manage.date_banner",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 rounded-xl bg-primary/10 border border-primary/25 flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { size: 22, className: "text-primary" }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-bold text-foreground", children: meetingFullDate }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: meetingTimeStr })
                  ] })
                ] }),
                isFuture && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "shrink-0 text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-flex items-center px-3 py-1 rounded-full bg-primary/10 border border-primary/25 text-primary text-xs font-bold", children: countdown }) })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "bg-card border border-border rounded-2xl overflow-hidden mb-5",
              "data-ocid": "manage.card",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-5 py-3 border-b border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground", children: "Appointment Details" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "divide-y divide-border", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 px-5 py-4", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded-lg bg-muted/50 flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(User, { size: 14, className: "text-muted-foreground" }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground font-bold uppercase tracking-wider mb-0.5", children: "Name" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground truncate", children: booking.clientName })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 px-5 py-4", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded-lg bg-muted/50 flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { size: 14, className: "text-muted-foreground" }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground font-bold uppercase tracking-wider mb-0.5", children: "Email" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-foreground truncate", children: booking.clientEmail })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3 px-5 py-4", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded-lg bg-muted/50 flex items-center justify-center shrink-0 mt-0.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { size: 14, className: "text-muted-foreground" }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground font-bold uppercase tracking-wider mb-0.5", children: "Meeting Purpose" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-foreground leading-relaxed break-words", children: booking.purpose })
                    ] })
                  ] })
                ] })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-3", "data-ocid": "manage.actions", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                onClick: () => setView("reschedule"),
                className: "w-full flex items-center justify-center gap-2 h-12 bg-primary text-primary-foreground text-sm font-bold rounded-xl hover:brightness-110 active:scale-[0.98] transition-smooth shadow-md",
                "data-ocid": "manage.reschedule_button",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { size: 15 }),
                  " Reschedule"
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                onClick: () => setShowCancelModal(true),
                className: "w-full flex items-center justify-center gap-2 h-12 border border-destructive/40 bg-destructive/5 text-destructive text-sm font-semibold rounded-xl hover:bg-destructive/10 hover:border-destructive/60 active:scale-[0.98] transition-smooth",
                "data-ocid": "manage.cancel_appointment_button",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { size: 15 }),
                  " Cancel Appointment"
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground/50 text-center mt-6", children: "Need help? Contact the meeting organizer directly." })
        ] })
      }
    )
  ] });
}
export {
  ManageAppointmentPage as default
};
