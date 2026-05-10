import { useParams } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight, Clock, Loader2 } from "lucide-react";
import { useMemo, useState } from "react";
import type { BusyOverride } from "../backend";
import { useGoogleCalendarFreeBusy } from "../hooks/useAvailableSlots";
import { useBookingLinks } from "../hooks/useBookingLinks";
import {
  useOverridesForLink,
  useToggleBusyOverride,
} from "../hooks/useBookings";
import { cn } from "../lib/utils";

// ----- Helpers -----

const WORK_START = 9; // 9 AM
const WORK_END = 18; // 6 PM

function buildHourlySlots(
  date: Date,
): Array<{ hour: number; start: Date; end: Date }> {
  return Array.from({ length: WORK_END - WORK_START }, (_, i) => {
    const h = WORK_START + i;
    const start = new Date(date);
    start.setHours(h, 0, 0, 0);
    const end = new Date(date);
    end.setHours(h + 1, 0, 0, 0);
    return { hour: h, start, end };
  });
}

function dateToNs(d: Date): bigint {
  return BigInt(d.getTime()) * 1_000_000n;
}

function fmtHour(h: number): string {
  const ampm = h < 12 ? "AM" : "PM";
  const display = h % 12 === 0 ? 12 : h % 12;
  return `${display}:00 ${ampm}`;
}

function parseBusyIntervalsFromJson(
  json: string,
): Array<{ start: Date; end: Date }> {
  try {
    const parsed: Record<string, unknown> = JSON.parse(json);
    const calendars = parsed.calendars as
      | Record<string, { busy: Array<{ start: string; end: string }> }>
      | undefined;
    if (!calendars) return [];
    return Object.values(calendars).flatMap((cal) =>
      cal.busy.map((b) => ({
        start: new Date(b.start),
        end: new Date(b.end),
      })),
    );
  } catch {
    return [];
  }
}

function isSlotBusy(
  slot: { start: Date; end: Date },
  busyIntervals: Array<{ start: Date; end: Date }>,
): boolean {
  return busyIntervals.some((b) => b.start < slot.end && b.end > slot.start);
}

function findOverride(
  slot: { start: Date; end: Date },
  overrides: BusyOverride[],
): BusyOverride | undefined {
  const startNs = dateToNs(slot.start);
  const endNs = dateToNs(slot.end);
  return overrides.find((o) => o.slotStart === startNs && o.slotEnd === endNs);
}

// ----- Mini Calendar -----

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
  "December",
];

function MiniCalendar({
  year,
  month,
  selectedDate,
  onSelectDate,
  onPrevMonth,
  onNextMonth,
}: {
  year: number;
  month: number;
  selectedDate: Date | null;
  onSelectDate: (d: Date) => void;
  onPrevMonth: () => void;
  onNextMonth: () => void;
}) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();

  const cells: Array<{ day: number | null }> = [];
  for (let i = 0; i < firstDay; i++) cells.push({ day: null });
  for (let d = 1; d <= daysInMonth; d++) cells.push({ day: d });

  return (
    <div className="bg-card border border-border rounded-xl p-4 select-none">
      {/* Month navigation */}
      <div className="flex items-center justify-between mb-3">
        <button
          type="button"
          onClick={onPrevMonth}
          className="p-1.5 rounded-md text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-colors"
          aria-label="Previous month"
          data-ocid="calendar.prev_month_button"
        >
          <ChevronLeft size={14} />
        </button>
        <span className="text-sm font-semibold text-foreground">
          {MONTHS[month]} {year}
        </span>
        <button
          type="button"
          onClick={onNextMonth}
          className="p-1.5 rounded-md text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-colors"
          aria-label="Next month"
          data-ocid="calendar.next_month_button"
        >
          <ChevronRight size={14} />
        </button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 mb-1">
        {DAYS.map((d) => (
          <div
            key={d}
            className="text-center text-[10px] font-semibold text-muted-foreground py-1 tracking-wide uppercase"
          >
            {d}
          </div>
        ))}
      </div>

      {/* Day cells */}
      <div className="grid grid-cols-7 gap-y-0.5">
        {cells.map((cell, idx) => {
          if (!cell.day) return <div key={`empty-${String(idx)}`} />;
          const d = new Date(year, month, cell.day);
          const isToday = d.toDateString() === today.toDateString();
          const isSelected =
            selectedDate && d.toDateString() === selectedDate.toDateString();

          return (
            <button
              key={cell.day}
              type="button"
              onClick={() => onSelectDate(d)}
              className={cn(
                "w-8 h-8 mx-auto flex items-center justify-center rounded-full text-xs transition-colors font-medium",
                isSelected
                  ? "bg-primary text-primary-foreground shadow-[0_0_8px_oklch(var(--primary)/0.4)]"
                  : isToday
                    ? "border border-primary/60 text-primary hover:bg-primary/10"
                    : "text-foreground/80 hover:bg-muted/50",
              )}
              data-ocid={`calendar.day.${cell.day}`}
            >
              {cell.day}
            </button>
          );
        })}
      </div>

      {/* Today button */}
      <div className="mt-3 pt-2.5 border-t border-border text-center">
        <button
          type="button"
          onClick={() => onSelectDate(today)}
          className="text-xs text-primary hover:text-primary/80 font-medium transition-colors"
          data-ocid="calendar.today_button"
        >
          Today
        </button>
      </div>
    </div>
  );
}

// ----- Slot Row -----

function SlotRow({
  slot,
  isBusy,
  override,
  onToggle,
  toggling,
  linkId,
}: {
  slot: { hour: number; start: Date; end: Date };
  isBusy: boolean;
  override: BusyOverride | undefined;
  onToggle: (params: {
    linkId: string;
    slotStart: bigint;
    slotEnd: bigint;
    isBookable: boolean;
  }) => void;
  toggling: boolean;
  linkId: string;
}) {
  const isOverrideActive = override?.isBookable === true;

  return (
    <div
      className={cn(
        "flex items-center gap-3 px-3 py-2 rounded-lg border transition-all",
        isOverrideActive
          ? "border-primary/40 bg-primary/8 shadow-[inset_0_0_0_1px_oklch(var(--primary)/0.15)]"
          : isBusy
            ? "border-border bg-muted/25 opacity-70"
            : "border-border bg-background hover:bg-muted/20",
      )}
    >
      {/* Time label */}
      <span className="text-xs font-mono text-muted-foreground w-16 shrink-0">
        {fmtHour(slot.hour)}
      </span>

      {/* Slot state */}
      <div className="flex-1 min-w-0">
        {isBusy ? (
          <div className="flex items-center gap-1.5">
            <div
              className={cn(
                "flex-1 h-7 rounded flex items-center px-2",
                isOverrideActive
                  ? "bg-primary/15 border border-primary/30"
                  : "bg-muted/40",
              )}
            >
              <span
                className={cn(
                  "text-xs font-semibold",
                  isOverrideActive ? "text-primary" : "text-muted-foreground",
                )}
              >
                {isOverrideActive ? "\u2713 Bookable Override" : "Busy"}
              </span>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-1.5">
            <div className="flex-1 h-7 rounded bg-primary/6 border border-primary/15 flex items-center px-2">
              <span className="text-xs text-primary/80 font-medium">
                Available
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Override toggle — only for busy slots */}
      {isBusy && (
        <div className="flex items-center gap-2 shrink-0">
          {isOverrideActive && (
            <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
              Override
            </span>
          )}
          <button
            type="button"
            disabled={toggling}
            onClick={() =>
              onToggle({
                linkId,
                slotStart: dateToNs(slot.start),
                slotEnd: dateToNs(slot.end),
                isBookable: !isOverrideActive,
              })
            }
            className={cn(
              "relative inline-flex h-5 w-9 items-center rounded-full transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
              isOverrideActive
                ? "bg-primary shadow-[0_0_8px_oklch(var(--primary)/0.35)]"
                : "bg-muted",
              toggling && "opacity-60 cursor-not-allowed",
            )}
            aria-label={isOverrideActive ? "Remove override" : "Allow bookings"}
          >
            {toggling ? (
              <Loader2
                size={10}
                className="animate-spin absolute left-1/2 -translate-x-1/2 text-foreground"
              />
            ) : (
              <span
                className={cn(
                  "inline-block h-3.5 w-3.5 rounded-full shadow transition-transform",
                  isOverrideActive
                    ? "translate-x-[18px] bg-primary-foreground"
                    : "translate-x-[2px] bg-muted-foreground",
                )}
              />
            )}
          </button>
        </div>
      )}
    </div>
  );
}

// ----- Main Component -----

export default function HostCalendar() {
  const params = useParams({ strict: false }) as { linkId?: string };
  const linkId = params.linkId;

  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState<Date | null>(today);
  const [togglingSlot, setTogglingSlot] = useState<string | null>(null);

  const { data: links, isLoading: linksLoading } = useBookingLinks();
  const { data: overrides } = useOverridesForLink(linkId);
  const toggleOverride = useToggleBusyOverride();

  const currentLink = links?.find((l) => l.id === linkId);

  const timeMin = selectedDate
    ? (() => {
        const d = new Date(selectedDate);
        d.setHours(0, 0, 0, 0);
        return d.toISOString();
      })()
    : "";
  const timeMax = selectedDate
    ? (() => {
        const d = new Date(selectedDate);
        d.setHours(23, 59, 59, 999);
        return d.toISOString();
      })()
    : "";

  const { data: freeBusyJson, isLoading: freeBusyLoading } =
    useGoogleCalendarFreeBusy("primary", timeMin, timeMax);

  const busyIntervals = useMemo(
    () => (freeBusyJson ? parseBusyIntervalsFromJson(freeBusyJson) : []),
    [freeBusyJson],
  );

  const hourlySlots = useMemo(
    () => (selectedDate ? buildHourlySlots(selectedDate) : []),
    [selectedDate],
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

  const handleSelectDate = (d: Date) => {
    setSelectedDate(d);
    setViewYear(d.getFullYear());
    setViewMonth(d.getMonth());
  };

  const handleToggle = async (params: {
    linkId: string;
    slotStart: bigint;
    slotEnd: bigint;
    isBookable: boolean;
  }) => {
    const key = `${params.slotStart}`;
    setTogglingSlot(key);
    try {
      await toggleOverride.mutateAsync(params);
    } finally {
      setTogglingSlot(null);
    }
  };

  // No linkId → show link selector
  if (!linkId) {
    return (
      <div
        className="max-w-2xl mx-auto px-4 md:px-6 py-8"
        data-ocid="calendar.page"
      >
        <h1 className="font-display text-2xl font-bold text-foreground mb-1 tracking-tight">
          Calendar Availability
        </h1>
        <p className="text-sm text-muted-foreground mb-7">
          Select a booking link to manage busy-time overrides.
        </p>

        {linksLoading ? (
          <div
            className="flex items-center justify-center py-12"
            data-ocid="calendar.loading_state"
          >
            <Loader2 size={22} className="animate-spin text-primary" />
          </div>
        ) : !links?.length ? (
          <div
            className="bg-card border border-border rounded-xl p-10 text-center"
            data-ocid="calendar.empty_state"
          >
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Clock size={22} className="text-primary" />
            </div>
            <p className="text-sm font-semibold text-foreground mb-1">
              No booking links yet
            </p>
            <p className="text-xs text-muted-foreground mb-4">
              Create a booking link first to manage its availability.
            </p>
            <a
              href="/host/links"
              className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary/80 transition-colors"
              data-ocid="calendar.create_link_button"
            >
              Create a booking link \u2192
            </a>
          </div>
        ) : (
          <div className="space-y-2">
            {links.map((link, i) => (
              <a
                key={link.id}
                href={`/host/calendar/${link.id}`}
                className="flex items-center justify-between bg-card border border-border rounded-lg px-4 py-3.5 hover:border-primary/30 hover:bg-muted/20 transition-colors group"
                data-ocid={`calendar.link.item.${i + 1}`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-md bg-primary/10 flex items-center justify-center">
                    <Clock size={13} className="text-primary" />
                  </div>
                  <div>
                    <span className="text-sm font-medium text-foreground">
                      {link.name}
                    </span>
                    <span className="ml-2 text-xs text-muted-foreground">
                      {link.duration.replace("min", "")} min
                    </span>
                  </div>
                </div>
                <ChevronRight
                  size={15}
                  className="text-muted-foreground group-hover:text-primary transition-colors"
                />
              </a>
            ))}
          </div>
        )}
      </div>
    );
  }

  const selectedDateLabel = selectedDate
    ? selectedDate.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "";

  return (
    <div
      className="max-w-5xl mx-auto px-4 md:px-6 py-8"
      data-ocid="calendar.page"
    >
      {/* Page header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <a
              href="/host/calendar"
              className="text-xs text-muted-foreground hover:text-primary transition-colors flex items-center gap-0.5"
              data-ocid="calendar.back_link"
            >
              \u2190 All links
            </a>
          </div>
          <h1 className="font-display text-2xl font-bold text-foreground tracking-tight">
            {currentLink?.name ?? "Calendar"}
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Click a date to view slots. Toggle busy times to make them bookable.
          </p>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-5 mb-5 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-muted/40 border border-border inline-block" />
          Busy
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-primary/15 border border-primary/35 inline-block" />
          Override Active
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-primary/6 border border-primary/15 inline-block" />
          Available
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-5">
        {/* Calendar picker */}
        <div>
          <MiniCalendar
            year={viewYear}
            month={viewMonth}
            selectedDate={selectedDate}
            onSelectDate={handleSelectDate}
            onPrevMonth={handlePrevMonth}
            onNextMonth={handleNextMonth}
          />
        </div>

        {/* Day slot view */}
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-border bg-muted/15">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-foreground">
                {selectedDateLabel}
              </h2>
              <span className="text-xs text-muted-foreground">
                9 AM \u2013 6 PM
              </span>
            </div>
          </div>

          {freeBusyLoading ? (
            <div
              className="flex items-center justify-center py-12"
              data-ocid="calendar.slots.loading_state"
            >
              <Loader2 size={20} className="animate-spin text-primary" />
              <span className="ml-2 text-sm text-muted-foreground">
                Loading availability\u2026
              </span>
            </div>
          ) : (
            <div className="p-3 space-y-1.5" data-ocid="calendar.slots_list">
              {hourlySlots.map((slot) => {
                const busy = isSlotBusy(slot, busyIntervals);
                const override = linkId
                  ? findOverride(slot, overrides ?? [])
                  : undefined;
                const slotKey = `${dateToNs(slot.start)}`;

                return (
                  <SlotRow
                    key={slotKey}
                    slot={slot}
                    isBusy={busy}
                    override={override}
                    onToggle={handleToggle}
                    toggling={togglingSlot === slotKey}
                    linkId={linkId}
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
