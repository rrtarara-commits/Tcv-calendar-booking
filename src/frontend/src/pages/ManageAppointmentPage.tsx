import { useParams } from "@tanstack/react-router";
import {
  AlertCircle,
  Calendar,
  CalendarCheck2,
  CalendarX2,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Loader2,
  Mail,
  RefreshCw,
  Trash2,
  User,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import type { BusyInterval } from "../backend";
import {
  useAvailableSlots,
  useGoogleCalendarFreeBusy,
} from "../hooks/useAvailableSlots";
import { useBookingLink } from "../hooks/useBookingLinks";
import {
  useCancelBookingByToken,
  useGetBookingByToken,
  useRescheduleBookingByToken,
} from "../hooks/useBookings";
import {
  formatDate,
  formatDuration,
  formatTime,
  msToNanoseconds,
} from "../lib/utils";

// ─── Calendar helpers ───────────────────────────────────────────────────────

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}
function getFirstDayOfMonth(year: number, month: number): number {
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
  "December",
];
const DAY_LABELS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

function dateToRangeNs(year: number, month: number, day: number) {
  const start = new Date(year, month, day, 0, 0, 0, 0);
  const end = new Date(year, month, day, 23, 59, 59, 999);
  return {
    rangeStart: msToNanoseconds(start.getTime()),
    rangeEnd: msToNanoseconds(end.getTime()),
  };
}
function isSameDay(date: Date, y: number, m: number, d: number) {
  return (
    date.getFullYear() === y && date.getMonth() === m && date.getDate() === d
  );
}
function isPastDay(year: number, month: number, day: number) {
  const today = new Date();
  const target = new Date(year, month, day);
  today.setHours(0, 0, 0, 0);
  return target < today;
}

function getMeetingCountdown(slotStart: bigint): string {
  const msStart = Number(slotStart) / 1_000_000;
  const now = Date.now();
  const diff = msStart - now;
  if (diff < 0) return "This meeting has passed";
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  if (days > 30) {
    const weeks = Math.floor(days / 7);
    return `In ${weeks} week${weeks !== 1 ? "s" : ""}`;
  }
  if (days > 0)
    return `In ${days} day${days !== 1 ? "s" : ""}${hours > 0 ? ` and ${hours}h` : ""}`;
  if (hours > 0) return `In ${hours} hour${hours !== 1 ? "s" : ""}`;
  const mins = Math.floor(diff / (1000 * 60));
  return mins > 0
    ? `In ${mins} minute${mins !== 1 ? "s" : ""}`
    : "Starting soon";
}

// ─── MonthCalendar ──────────────────────────────────────────────────────────

function MonthCalendar({
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
  onSelectDate: (date: Date) => void;
  onPrevMonth: () => void;
  onNextMonth: () => void;
}) {
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const today = new Date();

  type Cell = { kind: "pad"; pos: number } | { kind: "day"; day: number };
  const cells: Cell[] = [
    ...Array.from(
      { length: firstDay },
      (_, i): Cell => ({ kind: "pad", pos: i }),
    ),
    ...Array.from(
      { length: daysInMonth },
      (_, i): Cell => ({ kind: "day", day: i + 1 }),
    ),
  ];
  while (cells.length % 7 !== 0) cells.push({ kind: "pad", pos: cells.length });

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <button
          type="button"
          onClick={onPrevMonth}
          className="w-8 h-8 rounded-lg border border-border hover:border-primary/50 hover:text-primary hover:bg-primary/5 transition-colors flex items-center justify-center"
          aria-label="Previous month"
          data-ocid="manage.calendar_prev_month"
        >
          <ChevronLeft size={15} className="text-muted-foreground" />
        </button>
        <span className="text-sm font-bold text-foreground tracking-wide">
          {MONTH_NAMES[month]} {year}
        </span>
        <button
          type="button"
          onClick={onNextMonth}
          className="w-8 h-8 rounded-lg border border-border hover:border-primary/50 hover:text-primary hover:bg-primary/5 transition-colors flex items-center justify-center"
          aria-label="Next month"
          data-ocid="manage.calendar_next_month"
        >
          <ChevronRight size={15} className="text-muted-foreground" />
        </button>
      </div>
      <div className="grid grid-cols-7 mb-2">
        {DAY_LABELS.map((d) => (
          <div
            key={d}
            className="text-center text-[10px] font-bold text-muted-foreground/60 py-1 uppercase tracking-widest"
          >
            {d}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {cells.map((cell) => {
          if (cell.kind === "pad")
            return (
              <div
                key={`pad-${year}-${month}-${cell.pos}`}
                className="aspect-square"
              />
            );
          const { day } = cell;
          const past = isPastDay(year, month, day);
          const isToday = isSameDay(today, year, month, day);
          const selected = selectedDate
            ? isSameDay(selectedDate, year, month, day)
            : false;
          return (
            <button
              key={day}
              type="button"
              disabled={past}
              onClick={() => onSelectDate(new Date(year, month, day))}
              className={[
                "aspect-square rounded-lg text-xs font-semibold transition-all flex items-center justify-center",
                past
                  ? "text-muted-foreground/25 cursor-not-allowed"
                  : selected
                    ? "bg-primary text-primary-foreground shadow-md scale-105 font-bold"
                    : isToday
                      ? "border-2 border-primary/70 text-primary hover:bg-primary/15"
                      : "hover:bg-primary/10 hover:text-primary text-foreground hover:scale-105",
              ].join(" ")}
              data-ocid={`manage.calendar_day.${day}`}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── TimeSlotGrid ────────────────────────────────────────────────────────────

function TimeSlotGrid({
  slots,
  isLoading,
  selectedSlotStart,
  onSelect,
}: {
  slots: Array<{ start: bigint; end: bigint }> | undefined;
  isLoading: boolean;
  selectedSlotStart: bigint | null;
  onSelect: (slot: { start: bigint; end: bigint }) => void;
}) {
  if (isLoading) {
    return (
      <div className="space-y-2" data-ocid="manage.slots_loading_state">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-14 rounded-xl bg-muted/40 animate-pulse" />
        ))}
      </div>
    );
  }
  if (!slots?.length) {
    return (
      <div
        className="flex flex-col items-center justify-center py-10 text-center"
        data-ocid="manage.slots_empty_state"
      >
        <div className="w-10 h-10 rounded-full bg-muted/50 flex items-center justify-center mb-3">
          <Clock size={18} className="text-muted-foreground/50" />
        </div>
        <p className="text-sm font-semibold text-foreground">
          No available slots
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Try selecting a different day.
        </p>
      </div>
    );
  }
  return (
    <div className="space-y-2" data-ocid="manage.slots_list">
      {slots.map((slot, i) => {
        const selected = selectedSlotStart === slot.start;
        return (
          <button
            key={`${slot.start}`}
            type="button"
            onClick={() => onSelect(slot)}
            className={[
              "w-full px-4 py-3 rounded-xl border text-sm text-left transition-all flex items-center justify-between group",
              selected
                ? "bg-primary text-primary-foreground border-primary shadow-lg scale-[1.01]"
                : "border-border bg-card hover:border-primary/60 hover:bg-primary/8 text-foreground hover:scale-[1.01]",
            ].join(" ")}
            data-ocid={`manage.slot.item.${i + 1}`}
          >
            <span className="font-bold">{formatTime(slot.start)}</span>
            <span
              className={`text-xs ${selected ? "opacity-75" : "text-muted-foreground"}`}
            >
              – {formatTime(slot.end)}
            </span>
          </button>
        );
      })}
    </div>
  );
}

// ─── Cancel Confirm Modal ────────────────────────────────────────────────────

function CancelModal({
  onConfirm,
  onClose,
  isPending,
  meetingTitle,
  meetingDate,
  meetingTime,
}: {
  onConfirm: () => void;
  onClose: () => void;
  isPending: boolean;
  meetingTitle: string;
  meetingDate: string;
  meetingTime: string;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
      data-ocid="manage.dialog"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isPending) onClose();
      }}
      onKeyDown={(e) => {
        if (e.key === "Escape" && !isPending) onClose();
      }}
    >
      <div className="w-full max-w-md bg-card border border-border rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 sm:slide-in-from-bottom-0 duration-300">
        {/* Modal header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-destructive/10 flex items-center justify-center">
              <CalendarX2 size={17} className="text-destructive" />
            </div>
            <h3 className="font-display text-base font-bold text-foreground">
              Cancel appointment?
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            aria-label="Close"
            data-ocid="manage.close_button"
          >
            <X size={15} />
          </button>
        </div>

        {/* Meeting details recap */}
        <div className="px-6 py-4">
          <div className="bg-muted/30 border border-border rounded-xl px-4 py-3 mb-4">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              Meeting to be cancelled
            </p>
            <p className="text-sm font-bold text-foreground mb-1">
              {meetingTitle}
            </p>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Calendar size={11} />
              <span>{meetingDate}</span>
              <span className="text-border">·</span>
              <Clock size={11} />
              <span>{meetingTime}</span>
            </div>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            This will permanently remove the meeting from your calendar. This
            action cannot be undone.
          </p>
        </div>

        {/* Actions */}
        <div className="px-6 pb-6 flex flex-col sm:flex-row gap-2.5">
          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="flex-1 h-11 rounded-xl border border-border text-sm font-semibold text-foreground hover:bg-muted transition-colors order-2 sm:order-1"
            data-ocid="manage.cancel_button"
          >
            Keep it
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isPending}
            className="flex-1 h-11 rounded-xl bg-destructive text-destructive-foreground text-sm font-bold hover:brightness-110 disabled:opacity-50 transition-smooth flex items-center justify-center gap-2 order-1 sm:order-2"
            data-ocid="manage.confirm_button"
          >
            {isPending ? (
              <>
                <Loader2 size={14} className="animate-spin" /> Cancelling…
              </>
            ) : (
              <>
                <Trash2 size={14} /> Yes, Cancel Meeting
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Loading skeleton ────────────────────────────────────────────────────────

function PageSkeleton() {
  return (
    <div
      className="min-h-screen bg-background py-10 px-4"
      data-ocid="manage.loading_state"
    >
      <div className="max-w-lg mx-auto">
        <div className="h-5 w-48 bg-muted/50 rounded-full animate-pulse mb-3" />
        <div className="h-9 w-72 bg-muted/40 rounded-xl animate-pulse mb-2" />
        <div className="h-4 w-32 bg-muted/30 rounded-full animate-pulse mb-8" />
        {/* Meeting date banner skeleton */}
        <div className="h-24 rounded-2xl bg-card border border-border animate-pulse mb-4" />
        {/* Details card skeleton */}
        <div className="bg-card border border-border rounded-2xl p-6 mb-5 space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i}>
              {i > 1 && <div className="h-px bg-border mb-4" />}
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-muted/50 animate-pulse shrink-0" />
                <div className="space-y-1.5 flex-1">
                  <div className="h-3 w-16 bg-muted/40 rounded animate-pulse" />
                  <div className="h-4 w-40 bg-muted/30 rounded animate-pulse" />
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* Buttons skeleton */}
        <div className="flex gap-3">
          <div className="flex-1 h-12 rounded-xl bg-primary/20 animate-pulse" />
          <div className="flex-1 h-12 rounded-xl bg-muted/30 animate-pulse" />
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────

type ViewMode = "details" | "reschedule";
type DoneState = "cancelled" | "rescheduled";

export default function ManageAppointmentPage() {
  const params = useParams({ strict: false }) as { managementToken?: string };
  const token = params.managementToken ?? "";

  const { data: booking, isLoading, isError } = useGetBookingByToken(token);
  const { data: link } = useBookingLink(booking?.linkId ?? "");
  const cancelMutation = useCancelBookingByToken();
  const rescheduleMutation = useRescheduleBookingByToken();

  const [view, setView] = useState<ViewMode>("details");
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [done, setDone] = useState<DoneState | null>(null);
  const [previousSlot, setPreviousSlot] = useState<{
    start: bigint;
    end: bigint;
  } | null>(null);
  const [rescheduleError, setRescheduleError] = useState<string | null>(null);

  // Reschedule calendar state
  const today = new Date();
  const [calYear, setCalYear] = useState(today.getFullYear());
  const [calMonth, setCalMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<{
    start: bigint;
    end: bigint;
  } | null>(null);

  const slotRange = selectedDate
    ? dateToRangeNs(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        selectedDate.getDate(),
      )
    : null;

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

  const { data: freeBusyJson } = useGoogleCalendarFreeBusy(
    selectedDate ? "primary" : undefined,
    timeMin,
    timeMax,
  );

  const busyIntervals = useMemo((): BusyInterval[] => {
    if (!freeBusyJson) return [];
    try {
      const parsed = JSON.parse(freeBusyJson) as Record<string, unknown>;
      const calendars = parsed.calendars as
        | Record<string, { busy: Array<{ start: string; end: string }> }>
        | undefined;
      if (!calendars) return [];
      return Object.values(calendars).flatMap((cal) =>
        cal.busy.map((b) => ({
          start: msToNanoseconds(new Date(b.start).getTime()),
          end: msToNanoseconds(new Date(b.end).getTime()),
        })),
      );
    } catch {
      return [];
    }
  }, [freeBusyJson]);

  const { data: slots, isLoading: slotsLoading } = useAvailableSlots({
    linkId: booking?.linkId,
    rangeStart: slotRange?.rangeStart ?? 0n,
    rangeEnd: slotRange?.rangeEnd ?? 0n,
    busyIntervals,
    enabled: !!booking && !!selectedDate && view === "reschedule",
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
  const handleDateSelect = (date: Date) => {
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
        busyIntervals,
      });
      setDone("rescheduled");
    } catch (err) {
      setPreviousSlot(null);
      setRescheduleError(
        err instanceof Error ? err.message : "Something went wrong.",
      );
    }
  };

  const dateLabel = selectedDate
    ? selectedDate.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
      })
    : null;

  // ── Loading ──────────────────────────────────────────────────────────────

  if (isLoading) return <PageSkeleton />;

  // ── Not found / cancelled ────────────────────────────────────────────────

  if (isError || !booking || booking.isCancelled) {
    return (
      <div
        className="min-h-screen flex items-center justify-center px-4 bg-background"
        data-ocid="manage.error_state"
      >
        <div className="max-w-sm w-full text-center">
          <div className="w-16 h-16 rounded-2xl bg-card border border-border flex items-center justify-center mx-auto mb-5">
            <CalendarX2 size={28} className="text-muted-foreground" />
          </div>
          <h2 className="font-display text-xl font-bold text-foreground mb-2">
            {booking?.isCancelled
              ? "Appointment cancelled"
              : "Appointment not found"}
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {booking?.isCancelled
              ? "This appointment has already been cancelled and removed from the calendar."
              : "This link is invalid or has expired. Please check your calendar invite for the correct link."}
          </p>
        </div>
      </div>
    );
  }

  // ── Done: Cancelled ──────────────────────────────────────────────────────

  if (done === "cancelled") {
    return (
      <div
        className="min-h-screen flex items-center justify-center px-4 bg-background"
        data-ocid="manage.success_state"
      >
        <div className="max-w-sm w-full text-center">
          <div className="w-20 h-20 rounded-2xl bg-muted/40 border border-border flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={34} className="text-muted-foreground" />
          </div>
          <h2 className="font-display text-2xl font-bold text-foreground mb-2">
            Appointment cancelled
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed mb-6">
            Your appointment has been cancelled. The calendar invite has been
            removed from your calendar.
          </p>
          <div className="bg-card border border-border rounded-xl px-5 py-4">
            <p className="text-xs text-muted-foreground">
              Want to book a new time? Ask the host to share their booking link
              with you again.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ── Done: Rescheduled ────────────────────────────────────────────────────

  if (done === "rescheduled" && selectedSlot) {
    return (
      <div
        className="min-h-screen flex items-center justify-center px-4 bg-background"
        data-ocid="manage.success_state"
      >
        <div className="max-w-sm w-full">
          {/* Success header */}
          <div className="text-center mb-6">
            <div className="w-20 h-20 rounded-2xl border-2 border-primary/40 bg-primary/10 flex items-center justify-center mx-auto mb-5">
              <CalendarCheck2 size={34} className="text-primary" />
            </div>
            <h2 className="font-display text-2xl font-bold text-foreground mb-1">
              You're all set!
            </h2>
            <p className="text-sm text-muted-foreground">
              Your appointment has been rescheduled.
            </p>
          </div>

          {/* Time change card */}
          <div className="bg-card border border-border rounded-2xl overflow-hidden mb-4">
            <div className="px-5 pt-4 pb-3 border-b border-border">
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                Meeting updated
              </p>
              <p className="text-sm font-bold text-foreground mt-0.5">
                {link?.name ?? "Your meeting"}
              </p>
            </div>
            <div className="px-5 py-4 space-y-3">
              {/* Old time */}
              {previousSlot && (
                <div className="flex items-start gap-3 opacity-50">
                  <div className="w-7 h-7 rounded-lg bg-muted/50 flex items-center justify-center shrink-0 mt-0.5">
                    <Calendar size={13} className="text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold mb-0.5">
                      Previous time
                    </p>
                    <p className="text-sm font-semibold text-muted-foreground line-through">
                      {formatDate(previousSlot.start)}
                    </p>
                    <p className="text-xs text-muted-foreground/70">
                      {formatTime(previousSlot.start)} –{" "}
                      {formatTime(previousSlot.end)}
                    </p>
                  </div>
                </div>
              )}
              {/* Divider with arrow */}
              {previousSlot && (
                <div className="flex items-center gap-3 pl-1">
                  <div className="w-5 flex justify-center">
                    <div className="h-4 w-px bg-border" />
                  </div>
                </div>
              )}
              {/* New time */}
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-primary/15 border border-primary/30 flex items-center justify-center shrink-0 mt-0.5">
                  <Calendar size={13} className="text-primary" />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-primary font-bold mb-0.5">
                    New time
                  </p>
                  <p className="text-sm font-bold text-foreground">
                    {formatDate(selectedSlot.start)}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {formatTime(selectedSlot.start)} –{" "}
                    {formatTime(selectedSlot.end)}
                    {link ? ` · ${formatDuration(link.duration)}` : ""}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Calendar invite notice */}
          <div className="flex items-center gap-2.5 bg-primary/8 border border-primary/20 rounded-xl px-4 py-3">
            <CheckCircle2 size={15} className="text-primary shrink-0" />
            <p className="text-xs text-foreground font-medium">
              Your calendar invite has been updated with the new time.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ── Meeting date display ─────────────────────────────────────────────────

  const meetingFullDate = new Date(
    Number(booking.timeSlotStart) / 1_000_000,
  ).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const meetingTimeStr = `${formatTime(booking.timeSlotStart)} – ${formatTime(booking.timeSlotEnd)}`;
  const countdown = getMeetingCountdown(booking.timeSlotStart);
  const isFuture = Number(booking.timeSlotStart) / 1_000_000 > Date.now();

  // ── Reschedule view ──────────────────────────────────────────────────────

  if (view === "reschedule") {
    return (
      <div
        className="min-h-screen bg-background py-10 px-4"
        data-ocid="manage.page"
      >
        <div className="max-w-3xl mx-auto">
          {/* Back nav */}
          <button
            type="button"
            onClick={() => {
              setView("details");
              setSelectedDate(null);
              setSelectedSlot(null);
            }}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors mb-8"
            data-ocid="manage.back_button"
          >
            <ChevronLeft size={16} /> Back to appointment
          </button>

          {/* Header */}
          <div className="mb-8">
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/8 text-primary text-xs font-bold mb-3 tracking-wide">
              <RefreshCw size={11} /> Reschedule
            </div>
            <h1 className="font-display text-3xl font-bold text-foreground mb-2">
              Pick a new time
            </h1>
            <p className="text-muted-foreground text-sm">
              Currently:{" "}
              <span className="text-foreground font-semibold">
                {meetingFullDate} at {formatTime(booking.timeSlotStart)}
              </span>
            </p>
          </div>

          {/* Calendar + slots */}
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            <div className="grid md:grid-cols-2">
              {/* Calendar panel */}
              <div className="p-6 md:border-r md:border-border">
                <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground mb-5">
                  Select a Date
                </p>
                <MonthCalendar
                  year={calYear}
                  month={calMonth}
                  selectedDate={selectedDate}
                  onSelectDate={handleDateSelect}
                  onPrevMonth={handlePrevMonth}
                  onNextMonth={handleNextMonth}
                />
              </div>

              {/* Time slots panel */}
              <div className="p-6 border-t md:border-t-0 border-border">
                {!selectedDate ? (
                  <div className="flex flex-col items-center justify-center h-full py-12 text-center">
                    <div className="w-14 h-14 rounded-2xl bg-primary/8 border border-primary/15 flex items-center justify-center mb-4">
                      <Calendar size={22} className="text-primary/50" />
                    </div>
                    <p className="text-sm font-semibold text-foreground mb-1">
                      Choose a date
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Select a date on the left to see available times.
                    </p>
                  </div>
                ) : (
                  <div className="h-full flex flex-col">
                    <div className="mb-4">
                      <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground mb-0.5">
                        Available Times
                      </p>
                      <p className="text-sm font-bold text-foreground">
                        {dateLabel}
                      </p>
                    </div>

                    <div className="flex-1 overflow-y-auto max-h-72">
                      <TimeSlotGrid
                        slots={slots}
                        isLoading={slotsLoading}
                        selectedSlotStart={selectedSlot?.start ?? null}
                        onSelect={setSelectedSlot}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Confirm strip — shown when slot selected */}
            {selectedSlot && (
              <div className="border-t border-border px-6 py-4 bg-primary/5">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-0.5">
                      New time selected
                    </p>
                    <p className="text-sm font-bold text-primary">
                      {dateLabel} · {formatTime(selectedSlot.start)} –{" "}
                      {formatTime(selectedSlot.end)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button
                      type="button"
                      onClick={() => setSelectedSlot(null)}
                      className="h-10 px-4 rounded-xl border border-border text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors font-medium"
                      data-ocid="manage.change_slot_button"
                    >
                      Change
                    </button>
                    <button
                      type="button"
                      onClick={handleReschedule}
                      disabled={rescheduleMutation.isPending}
                      className="flex-1 sm:flex-none h-10 px-5 bg-primary text-primary-foreground text-sm font-bold rounded-xl hover:brightness-110 active:scale-[0.98] disabled:opacity-50 transition-smooth flex items-center justify-center gap-2 shadow-md min-w-[160px]"
                      data-ocid="manage.submit_button"
                    >
                      {rescheduleMutation.isPending ? (
                        <>
                          <Loader2 size={14} className="animate-spin" />{" "}
                          Rescheduling…
                        </>
                      ) : (
                        <>Change to {formatTime(selectedSlot.start)}</>
                      )}
                    </button>
                  </div>
                </div>
                {rescheduleError && (
                  <div
                    className="flex items-center gap-2 mt-3 px-3 py-2.5 bg-destructive/10 border border-destructive/30 rounded-lg"
                    data-ocid="manage.error_state"
                  >
                    <AlertCircle
                      size={13}
                      className="text-destructive shrink-0"
                    />
                    <p className="text-xs text-destructive">
                      {rescheduleError}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ── Details view (default) ───────────────────────────────────────────────

  return (
    <>
      {showCancelModal && (
        <CancelModal
          onConfirm={handleCancel}
          onClose={() => setShowCancelModal(false)}
          isPending={cancelMutation.isPending}
          meetingTitle={link?.name ?? "Your meeting"}
          meetingDate={meetingFullDate}
          meetingTime={meetingTimeStr}
        />
      )}

      <div
        className="min-h-screen bg-background py-10 px-4"
        data-ocid="manage.page"
      >
        <div className="max-w-lg mx-auto">
          {/* Page header */}
          <div className="mb-8">
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/8 text-primary text-xs font-bold mb-3 tracking-wide">
              <Calendar size={11} /> Manage appointment
            </div>
            <h1 className="font-display text-3xl font-bold text-foreground mb-1">
              {link?.name ?? "Your appointment"}
            </h1>
            {link && (
              <p className="text-sm text-muted-foreground">
                {formatDuration(link.duration)} meeting
              </p>
            )}
          </div>

          {/* Meeting date banner */}
          <div
            className="bg-card border border-primary/20 rounded-2xl px-5 py-4 mb-4 flex items-center justify-between gap-4"
            data-ocid="manage.date_banner"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/25 flex items-center justify-center shrink-0">
                <Calendar size={22} className="text-primary" />
              </div>
              <div>
                <p className="text-sm font-bold text-foreground">
                  {meetingFullDate}
                </p>
                <p className="text-sm text-muted-foreground">
                  {meetingTimeStr}
                </p>
              </div>
            </div>
            {isFuture && (
              <div className="shrink-0 text-right">
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 border border-primary/25 text-primary text-xs font-bold">
                  {countdown}
                </span>
              </div>
            )}
          </div>

          {/* Details card */}
          <div
            className="bg-card border border-border rounded-2xl overflow-hidden mb-5"
            data-ocid="manage.card"
          >
            <div className="px-5 py-3 border-b border-border">
              <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground">
                Appointment Details
              </p>
            </div>
            <div className="divide-y divide-border">
              {/* Client name */}
              <div className="flex items-center gap-3 px-5 py-4">
                <div className="w-8 h-8 rounded-lg bg-muted/50 flex items-center justify-center shrink-0">
                  <User size={14} className="text-muted-foreground" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider mb-0.5">
                    Name
                  </p>
                  <p className="text-sm font-semibold text-foreground truncate">
                    {booking.clientName}
                  </p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-center gap-3 px-5 py-4">
                <div className="w-8 h-8 rounded-lg bg-muted/50 flex items-center justify-center shrink-0">
                  <Mail size={14} className="text-muted-foreground" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider mb-0.5">
                    Email
                  </p>
                  <p className="text-sm text-foreground truncate">
                    {booking.clientEmail}
                  </p>
                </div>
              </div>

              {/* Purpose */}
              <div className="flex items-start gap-3 px-5 py-4">
                <div className="w-8 h-8 rounded-lg bg-muted/50 flex items-center justify-center shrink-0 mt-0.5">
                  <Clock size={14} className="text-muted-foreground" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider mb-0.5">
                    Meeting Purpose
                  </p>
                  <p className="text-sm text-foreground leading-relaxed break-words">
                    {booking.purpose}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col gap-3" data-ocid="manage.actions">
            <button
              type="button"
              onClick={() => setView("reschedule")}
              className="w-full flex items-center justify-center gap-2 h-12 bg-primary text-primary-foreground text-sm font-bold rounded-xl hover:brightness-110 active:scale-[0.98] transition-smooth shadow-md"
              data-ocid="manage.reschedule_button"
            >
              <RefreshCw size={15} /> Reschedule
            </button>
            <button
              type="button"
              onClick={() => setShowCancelModal(true)}
              className="w-full flex items-center justify-center gap-2 h-12 border border-destructive/40 bg-destructive/5 text-destructive text-sm font-semibold rounded-xl hover:bg-destructive/10 hover:border-destructive/60 active:scale-[0.98] transition-smooth"
              data-ocid="manage.cancel_appointment_button"
            >
              <Trash2 size={15} /> Cancel Appointment
            </button>
          </div>

          {/* Footer note */}
          <p className="text-xs text-muted-foreground/50 text-center mt-6">
            Need help? Contact the meeting organizer directly.
          </p>
        </div>
      </div>
    </>
  );
}
