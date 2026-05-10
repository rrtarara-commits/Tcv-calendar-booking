import { k as useParams, r as reactExports, j as jsxRuntimeExports, d as LoaderCircle, a as cn } from "./index-Bcm1BYaZ.js";
import { a as useGoogleCalendarFreeBusy } from "./useAvailableSlots-CgEvFERY.js";
import { u as useBookingLinks } from "./useBookingLinks-OKODmVBH.js";
import { b as useOverridesForLink, c as useToggleBusyOverride } from "./useBookings-DGlOSDIl.js";
import { C as Clock } from "./clock-B8La_BYV.js";
import { C as ChevronRight, a as ChevronLeft } from "./chevron-right-ChuTWYGB.js";
import "./useMutation-BjpTJhfH.js";
const WORK_START = 9;
const WORK_END = 18;
function buildHourlySlots(date) {
  return Array.from({ length: WORK_END - WORK_START }, (_, i) => {
    const h = WORK_START + i;
    const start = new Date(date);
    start.setHours(h, 0, 0, 0);
    const end = new Date(date);
    end.setHours(h + 1, 0, 0, 0);
    return { hour: h, start, end };
  });
}
function dateToNs(d) {
  return BigInt(d.getTime()) * 1000000n;
}
function fmtHour(h) {
  const ampm = h < 12 ? "AM" : "PM";
  const display = h % 12 === 0 ? 12 : h % 12;
  return `${display}:00 ${ampm}`;
}
function parseBusyIntervalsFromJson(json) {
  try {
    const parsed = JSON.parse(json);
    const calendars = parsed.calendars;
    if (!calendars) return [];
    return Object.values(calendars).flatMap(
      (cal) => cal.busy.map((b) => ({
        start: new Date(b.start),
        end: new Date(b.end)
      }))
    );
  } catch {
    return [];
  }
}
function isSlotBusy(slot, busyIntervals) {
  return busyIntervals.some((b) => b.start < slot.end && b.end > slot.start);
}
function findOverride(slot, overrides) {
  const startNs = dateToNs(slot.start);
  const endNs = dateToNs(slot.end);
  return overrides.find((o) => o.slotStart === startNs && o.slotEnd === endNs);
}
const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTHS = [
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
function MiniCalendar({
  year,
  month,
  selectedDate,
  onSelectDate,
  onPrevMonth,
  onNextMonth
}) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = /* @__PURE__ */ new Date();
  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push({ day: null });
  for (let d = 1; d <= daysInMonth; d++) cells.push({ day: d });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded-xl p-4 select-none", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          onClick: onPrevMonth,
          className: "p-1.5 rounded-md text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-colors",
          "aria-label": "Previous month",
          "data-ocid": "calendar.prev_month_button",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { size: 14 })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm font-semibold text-foreground", children: [
        MONTHS[month],
        " ",
        year
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          onClick: onNextMonth,
          className: "p-1.5 rounded-md text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-colors",
          "aria-label": "Next month",
          "data-ocid": "calendar.next_month_button",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { size: 14 })
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-7 mb-1", children: DAYS.map((d) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "text-center text-[10px] font-semibold text-muted-foreground py-1 tracking-wide uppercase",
        children: d
      },
      d
    )) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-7 gap-y-0.5", children: cells.map((cell, idx) => {
      if (!cell.day) return /* @__PURE__ */ jsxRuntimeExports.jsx("div", {}, `empty-${String(idx)}`);
      const d = new Date(year, month, cell.day);
      const isToday = d.toDateString() === today.toDateString();
      const isSelected = selectedDate && d.toDateString() === selectedDate.toDateString();
      return /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          onClick: () => onSelectDate(d),
          className: cn(
            "w-8 h-8 mx-auto flex items-center justify-center rounded-full text-xs transition-colors font-medium",
            isSelected ? "bg-primary text-primary-foreground shadow-[0_0_8px_oklch(var(--primary)/0.4)]" : isToday ? "border border-primary/60 text-primary hover:bg-primary/10" : "text-foreground/80 hover:bg-muted/50"
          ),
          "data-ocid": `calendar.day.${cell.day}`,
          children: cell.day
        },
        cell.day
      );
    }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3 pt-2.5 border-t border-border text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        type: "button",
        onClick: () => onSelectDate(today),
        className: "text-xs text-primary hover:text-primary/80 font-medium transition-colors",
        "data-ocid": "calendar.today_button",
        children: "Today"
      }
    ) })
  ] });
}
function SlotRow({
  slot,
  isBusy,
  override,
  onToggle,
  toggling,
  linkId
}) {
  const isOverrideActive = (override == null ? void 0 : override.isBookable) === true;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: cn(
        "flex items-center gap-3 px-3 py-2 rounded-lg border transition-all",
        isOverrideActive ? "border-primary/40 bg-primary/8 shadow-[inset_0_0_0_1px_oklch(var(--primary)/0.15)]" : isBusy ? "border-border bg-muted/25 opacity-70" : "border-border bg-background hover:bg-muted/20"
      ),
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-mono text-muted-foreground w-16 shrink-0", children: fmtHour(slot.hour) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 min-w-0", children: isBusy ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-1.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: cn(
              "flex-1 h-7 rounded flex items-center px-2",
              isOverrideActive ? "bg-primary/15 border border-primary/30" : "bg-muted/40"
            ),
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: cn(
                  "text-xs font-semibold",
                  isOverrideActive ? "text-primary" : "text-muted-foreground"
                ),
                children: isOverrideActive ? "✓ Bookable Override" : "Busy"
              }
            )
          }
        ) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-1.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 h-7 rounded bg-primary/6 border border-primary/15 flex items-center px-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-primary/80 font-medium", children: "Available" }) }) }) }),
        isBusy && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 shrink-0", children: [
          isOverrideActive && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-bold uppercase tracking-wider text-primary", children: "Override" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              disabled: toggling,
              onClick: () => onToggle({
                linkId,
                slotStart: dateToNs(slot.start),
                slotEnd: dateToNs(slot.end),
                isBookable: !isOverrideActive
              }),
              className: cn(
                "relative inline-flex h-5 w-9 items-center rounded-full transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
                isOverrideActive ? "bg-primary shadow-[0_0_8px_oklch(var(--primary)/0.35)]" : "bg-muted",
                toggling && "opacity-60 cursor-not-allowed"
              ),
              "aria-label": isOverrideActive ? "Remove override" : "Allow bookings",
              children: toggling ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                LoaderCircle,
                {
                  size: 10,
                  className: "animate-spin absolute left-1/2 -translate-x-1/2 text-foreground"
                }
              ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: cn(
                    "inline-block h-3.5 w-3.5 rounded-full shadow transition-transform",
                    isOverrideActive ? "translate-x-[18px] bg-primary-foreground" : "translate-x-[2px] bg-muted-foreground"
                  )
                }
              )
            }
          )
        ] })
      ]
    }
  );
}
function HostCalendar() {
  const params = useParams({ strict: false });
  const linkId = params.linkId;
  const today = /* @__PURE__ */ new Date();
  const [viewYear, setViewYear] = reactExports.useState(today.getFullYear());
  const [viewMonth, setViewMonth] = reactExports.useState(today.getMonth());
  const [selectedDate, setSelectedDate] = reactExports.useState(today);
  const [togglingSlot, setTogglingSlot] = reactExports.useState(null);
  const { data: links, isLoading: linksLoading } = useBookingLinks();
  const { data: overrides } = useOverridesForLink(linkId);
  const toggleOverride = useToggleBusyOverride();
  const currentLink = links == null ? void 0 : links.find((l) => l.id === linkId);
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
  const { data: freeBusyJson, isLoading: freeBusyLoading } = useGoogleCalendarFreeBusy("primary", timeMin, timeMax);
  const busyIntervals = reactExports.useMemo(
    () => freeBusyJson ? parseBusyIntervalsFromJson(freeBusyJson) : [],
    [freeBusyJson]
  );
  const hourlySlots = reactExports.useMemo(
    () => selectedDate ? buildHourlySlots(selectedDate) : [],
    [selectedDate]
  );
  const handlePrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  };
  const handleNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  };
  const handleSelectDate = (d) => {
    setSelectedDate(d);
    setViewYear(d.getFullYear());
    setViewMonth(d.getMonth());
  };
  const handleToggle = async (params2) => {
    const key = `${params2.slotStart}`;
    setTogglingSlot(key);
    try {
      await toggleOverride.mutateAsync(params2);
    } finally {
      setTogglingSlot(null);
    }
  };
  if (!linkId) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "max-w-2xl mx-auto px-4 md:px-6 py-8",
        "data-ocid": "calendar.page",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl font-bold text-foreground mb-1 tracking-tight", children: "Calendar Availability" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mb-7", children: "Select a booking link to manage busy-time overrides." }),
          linksLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "flex items-center justify-center py-12",
              "data-ocid": "calendar.loading_state",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { size: 22, className: "animate-spin text-primary" })
            }
          ) : !(links == null ? void 0 : links.length) ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "bg-card border border-border rounded-xl p-10 text-center",
              "data-ocid": "calendar.empty_state",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { size: 22, className: "text-primary" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground mb-1", children: "No booking links yet" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mb-4", children: "Create a booking link first to manage its availability." }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "a",
                  {
                    href: "/host/links",
                    className: "inline-flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary/80 transition-colors",
                    "data-ocid": "calendar.create_link_button",
                    children: "Create a booking link \\u2192"
                  }
                )
              ]
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: links.map((link, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "a",
            {
              href: `/host/calendar/${link.id}`,
              className: "flex items-center justify-between bg-card border border-border rounded-lg px-4 py-3.5 hover:border-primary/30 hover:bg-muted/20 transition-colors group",
              "data-ocid": `calendar.link.item.${i + 1}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-7 h-7 rounded-md bg-primary/10 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { size: 13, className: "text-primary" }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium text-foreground", children: link.name }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "ml-2 text-xs text-muted-foreground", children: [
                      link.duration.replace("min", ""),
                      " min"
                    ] })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  ChevronRight,
                  {
                    size: 15,
                    className: "text-muted-foreground group-hover:text-primary transition-colors"
                  }
                )
              ]
            },
            link.id
          )) })
        ]
      }
    );
  }
  const selectedDateLabel = selectedDate ? selectedDate.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric"
  }) : "";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "max-w-5xl mx-auto px-4 md:px-6 py-8",
      "data-ocid": "calendar.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-start justify-between mb-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2 mb-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "a",
            {
              href: "/host/calendar",
              className: "text-xs text-muted-foreground hover:text-primary transition-colors flex items-center gap-0.5",
              "data-ocid": "calendar.back_link",
              children: "\\u2190 All links"
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl font-bold text-foreground tracking-tight", children: (currentLink == null ? void 0 : currentLink.name) ?? "Calendar" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-0.5", children: "Click a date to view slots. Toggle busy times to make them bookable." })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-5 mb-5 text-xs text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-3 h-3 rounded-sm bg-muted/40 border border-border inline-block" }),
            "Busy"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-3 h-3 rounded-sm bg-primary/15 border border-primary/35 inline-block" }),
            "Override Active"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-3 h-3 rounded-sm bg-primary/6 border border-primary/15 inline-block" }),
            "Available"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            MiniCalendar,
            {
              year: viewYear,
              month: viewMonth,
              selectedDate,
              onSelectDate: handleSelectDate,
              onPrevMonth: handlePrevMonth,
              onNextMonth: handleNextMonth
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded-xl overflow-hidden", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-4 py-3 border-b border-border bg-muted/15", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-semibold text-foreground", children: selectedDateLabel }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "9 AM \\u2013 6 PM" })
            ] }) }),
            freeBusyLoading ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "flex items-center justify-center py-12",
                "data-ocid": "calendar.slots.loading_state",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { size: 20, className: "animate-spin text-primary" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-2 text-sm text-muted-foreground", children: "Loading availability\\u2026" })
                ]
              }
            ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-3 space-y-1.5", "data-ocid": "calendar.slots_list", children: hourlySlots.map((slot) => {
              const busy = isSlotBusy(slot, busyIntervals);
              const override = linkId ? findOverride(slot, overrides ?? []) : void 0;
              const slotKey = `${dateToNs(slot.start)}`;
              return /* @__PURE__ */ jsxRuntimeExports.jsx(
                SlotRow,
                {
                  slot,
                  isBusy: busy,
                  override,
                  onToggle: handleToggle,
                  toggling: togglingSlot === slotKey,
                  linkId
                },
                slotKey
              );
            }) })
          ] })
        ] })
      ]
    }
  );
}
export {
  HostCalendar as default
};
