import { useParams } from "@tanstack/react-router";
import {
  AlertCircle,
  Calendar,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  FileText,
  Globe,
  Loader2,
  Upload,
  X,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ExternalBlob } from "../backend";
import type { BusyInterval } from "../backend";
import {
  useAvailableSlots,
  useGoogleCalendarFreeBusy,
} from "../hooks/useAvailableSlots";
import { useBookingLink } from "../hooks/useBookingLinks";
import { useCreateBooking } from "../hooks/useBookings";
import {
  formatDate,
  formatDuration,
  formatTime,
  msToNanoseconds,
} from "../lib/utils";

// ─── Helpers ────────────────────────────────────────────────────────────────

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}
function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}
function isPastDay(year: number, month: number, day: number) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return new Date(year, month, day) < today;
}
function isSameDay(date: Date, y: number, m: number, d: number) {
  return (
    date.getFullYear() === y && date.getMonth() === m && date.getDate() === d
  );
}
function dateToRangeNs(year: number, month: number, day: number) {
  return {
    rangeStart: msToNanoseconds(
      new Date(year, month, day, 0, 0, 0, 0).getTime(),
    ),
    rangeEnd: msToNanoseconds(
      new Date(year, month, day, 23, 59, 59, 999).getTime(),
    ),
  };
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

function getUserTimezone() {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

// ─── Skeleton ────────────────────────────────────────────────────────────────

function SlotSkeleton() {
  return (
    <div
      className="grid grid-cols-2 gap-2"
      data-ocid="book.slots_loading_state"
    >
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          // biome-ignore lint/suspicious/noArrayIndexKey: stable skeleton
          key={i}
          className="h-[52px] rounded-lg bg-muted/40 animate-pulse"
        />
      ))}
    </div>
  );
}

// ─── Calendar ────────────────────────────────────────────────────────────────

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
  const today = new Date();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

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

  // Keyboard navigation on the container
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (!selectedDate) return;
      let next = new Date(selectedDate);
      if (e.key === "ArrowRight") next.setDate(next.getDate() + 1);
      else if (e.key === "ArrowLeft") next.setDate(next.getDate() - 1);
      else if (e.key === "ArrowDown") next.setDate(next.getDate() + 7);
      else if (e.key === "ArrowUp") next.setDate(next.getDate() - 7);
      else return;
      e.preventDefault();
      const nowDay = new Date();
      nowDay.setHours(0, 0, 0, 0);
      if (next >= nowDay) onSelectDate(next);
    },
    [selectedDate, onSelectDate],
  );

  return (
    <div
      aria-label="Calendar"
      onKeyDown={handleKeyDown}
      className="outline-none focus-visible:ring-1 focus-visible:ring-primary/40 rounded-xl"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <button
          type="button"
          onClick={onPrevMonth}
          className="w-9 h-9 flex items-center justify-center rounded-lg border border-border hover:border-primary/50 hover:bg-primary/8 hover:text-primary text-muted-foreground transition-colors"
          aria-label="Previous month"
          data-ocid="book.calendar_prev_month"
        >
          <ChevronLeft size={15} />
        </button>
        <span className="text-sm font-semibold text-foreground tracking-wide">
          {MONTH_NAMES[month]} {year}
        </span>
        <button
          type="button"
          onClick={onNextMonth}
          className="w-9 h-9 flex items-center justify-center rounded-lg border border-border hover:border-primary/50 hover:bg-primary/8 hover:text-primary text-muted-foreground transition-colors"
          aria-label="Next month"
          data-ocid="book.calendar_next_month"
        >
          <ChevronRight size={15} />
        </button>
      </div>

      {/* Day labels */}
      <div className="grid grid-cols-7 mb-1.5">
        {DAY_LABELS.map((d) => (
          <div
            key={d}
            className="text-center text-[10px] font-semibold text-muted-foreground/60 py-1 uppercase tracking-widest"
          >
            {d}
          </div>
        ))}
      </div>

      {/* Days */}
      <div className="grid grid-cols-7 gap-0.5">
        {cells.map((cell) => {
          if (cell.kind === "pad")
            return (
              <div
                key={`pad-${year}-${month}-${cell.pos}`}
                aria-hidden="true"
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
              aria-pressed={selected}
              aria-label={`${MONTH_NAMES[month]} ${day}, ${year}${
                isToday ? " (today)" : ""
              }${past ? " (unavailable)" : ""}`}
              onClick={() => onSelectDate(new Date(year, month, day))}
              className={[
                "aspect-square min-h-[40px] md:min-h-0 rounded-lg text-xs font-medium transition-all duration-200 flex items-center justify-center select-none",
                past
                  ? "text-muted-foreground/20 cursor-not-allowed"
                  : selected
                    ? "bg-primary text-primary-foreground shadow-md font-bold scale-105"
                    : isToday
                      ? "border border-primary text-primary font-semibold hover:bg-primary/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
                      : "hover:bg-primary/10 hover:text-primary text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60",
              ].join(" ")}
              data-ocid={`book.calendar_day.${day}`}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Time Slots ───────────────────────────────────────────────────────────────

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
  if (isLoading) return <SlotSkeleton />;

  if (!slots?.length) {
    return (
      <div
        className="flex flex-col items-center justify-center py-12 text-center"
        data-ocid="book.slots_empty_state"
      >
        <div className="w-12 h-12 rounded-full bg-muted/40 flex items-center justify-center mb-3">
          <Clock size={20} className="text-muted-foreground/50" />
        </div>
        <p className="text-sm font-medium text-foreground mb-1">
          No availability found
        </p>
        <p className="text-xs text-muted-foreground leading-relaxed max-w-[200px]">
          Please check back later or contact the host.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-2" data-ocid="book.slots_list">
      {slots.map((slot, i) => {
        const selected = selectedSlotStart === slot.start;
        return (
          <button
            key={`${slot.start}`}
            type="button"
            onClick={() => onSelect(slot)}
            className={[
              "px-3 py-3 rounded-lg border text-sm text-left transition-all duration-200 min-h-[52px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 active:scale-[0.97]",
              selected
                ? "bg-primary text-primary-foreground border-primary shadow-md font-semibold"
                : "border-border bg-card hover:border-primary/60 hover:bg-primary/8 text-foreground hover:shadow-sm",
            ].join(" ")}
            data-ocid={`book.slot.item.${i + 1}`}
          >
            <span className="block font-semibold text-[13px]">
              {formatTime(slot.start)}
            </span>
            <span
              className={`block text-[11px] mt-0.5 ${selected ? "opacity-70" : "text-muted-foreground"}`}
            >
              {formatTime(slot.end)}
            </span>
          </button>
        );
      })}
    </div>
  );
}

// ─── Booking Form ─────────────────────────────────────────────────────────────

interface FormState {
  name: string;
  email: string;
  purpose: string;
}
interface FormErrors {
  name?: string;
  email?: string;
}

function BookingForm({
  selectedSlot,
  onChangeSlot,
  dateLabel,
  linkName,
  duration,
  onBooked,
  linkId,
  busyIntervals,
}: {
  selectedSlot: { start: bigint; end: bigint };
  onChangeSlot: () => void;
  dateLabel: string;
  linkName: string;
  duration: string;
  onBooked: (data: { name: string; email: string; token?: string }) => void;
  linkId: string;
  busyIntervals: BusyInterval[];
}) {
  const createBooking = useCreateBooking();
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    purpose: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [files, setFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const nameRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-focus name
  useEffect(() => {
    const t = setTimeout(() => nameRef.current?.focus(), 100);
    return () => clearTimeout(t);
  }, []);

  const validate = useCallback(
    (field: keyof FormState, value: string): string | undefined => {
      if (field === "name" && !value.trim()) return "Name is required";
      if (field === "email") {
        if (!value.trim()) return "Email is required";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
          return "Enter a valid email";
      }
      return undefined;
    },
    [],
  );

  const handleBlur = (field: keyof FormState) => {
    setTouched((t) => ({ ...t, [field]: true }));
    const err = validate(field, form[field]);
    setErrors((e) => ({ ...e, [field]: err }));
  };

  const handleChange = (field: keyof FormState, value: string) => {
    setForm((f) => ({ ...f, [field]: value }));
    if (touched[field]) {
      const err = validate(field, value);
      setErrors((e) => ({ ...e, [field]: err }));
    }
  };

  const addFiles = (incoming: FileList | null) => {
    if (!incoming) return;
    setFiles((prev) => [...prev, ...Array.from(incoming)].slice(0, 3));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    addFiles(e.dataTransfer.files);
  };

  const canSubmit =
    form.name.trim() && form.email.trim() && !errors.name && !errors.email;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Touch all required fields
    const allTouched = { name: true, email: true };
    setTouched(allTouched);
    const nameErr = validate("name", form.name);
    const emailErr = validate("email", form.email);
    setErrors({ name: nameErr, email: emailErr });
    if (nameErr || emailErr) return;

    setSubmitError(null);
    try {
      const fileBlobs: ExternalBlob[] = await Promise.all(
        files.map(async (file) => {
          const bytes = new Uint8Array(await file.arrayBuffer());
          return ExternalBlob.fromBytes(bytes).withUploadProgress((pct) => {
            setUploadProgress(pct);
          });
        }),
      );

      await createBooking.mutateAsync({
        input: {
          linkId,
          clientName: form.name,
          clientEmail: form.email,
          purpose: form.purpose,
          timeSlotStart: selectedSlot.start,
          timeSlotEnd: selectedSlot.end,
          fileUrls: fileBlobs,
        },
        busyIntervals,
      });

      onBooked({ name: form.name, email: form.email });
    } catch {
      setSubmitError("Something went wrong. Please try again.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4"
      data-ocid="book.form"
      noValidate
    >
      {/* Selected slot banner */}
      <div className="flex items-center justify-between bg-primary/10 border border-primary/25 rounded-xl px-4 py-3">
        <div>
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">
            {dateLabel}
          </p>
          <p className="text-sm font-bold text-primary mt-0.5">
            {formatTime(selectedSlot.start)} – {formatTime(selectedSlot.end)}
          </p>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            {duration} · {linkName}
          </p>
        </div>
        <button
          type="button"
          onClick={onChangeSlot}
          className="text-[11px] text-muted-foreground hover:text-primary underline underline-offset-2 transition-colors font-medium shrink-0 ml-3"
          data-ocid="book.change_slot_button"
        >
          Change
        </button>
      </div>

      <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground">
        Your Details
      </p>

      {/* Name */}
      <div>
        <label
          htmlFor="book-name"
          className="block text-xs font-semibold text-foreground mb-1.5"
        >
          Full Name <span className="text-destructive">*</span>
        </label>
        <input
          ref={nameRef}
          id="book-name"
          type="text"
          autoComplete="name"
          value={form.name}
          onChange={(e) => handleChange("name", e.target.value)}
          onBlur={() => handleBlur("name")}
          placeholder="Jane Smith"
          className={[
            "w-full px-3 py-2.5 text-sm bg-input border rounded-lg text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 transition-all duration-200",
            errors.name && touched.name
              ? "border-destructive focus:ring-destructive/30"
              : "border-border focus:border-primary focus:ring-primary/30",
          ].join(" ")}
          data-ocid="book.name_input"
        />
        {errors.name && touched.name && (
          <p
            className="mt-1 text-[11px] text-destructive flex items-center gap-1"
            data-ocid="book.name_field_error"
          >
            <AlertCircle size={11} /> {errors.name}
          </p>
        )}
      </div>

      {/* Email */}
      <div>
        <label
          htmlFor="book-email"
          className="block text-xs font-semibold text-foreground mb-1.5"
        >
          Email <span className="text-destructive">*</span>
        </label>
        <input
          id="book-email"
          type="email"
          autoComplete="email"
          inputMode="email"
          value={form.email}
          onChange={(e) => handleChange("email", e.target.value)}
          onBlur={() => handleBlur("email")}
          placeholder="jane@company.com"
          className={[
            "w-full px-3 py-2.5 text-sm bg-input border rounded-lg text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 transition-all duration-200",
            errors.email && touched.email
              ? "border-destructive focus:ring-destructive/30"
              : "border-border focus:border-primary focus:ring-primary/30",
          ].join(" ")}
          data-ocid="book.email_input"
        />
        {errors.email && touched.email && (
          <p
            className="mt-1 text-[11px] text-destructive flex items-center gap-1"
            data-ocid="book.email_field_error"
          >
            <AlertCircle size={11} /> {errors.email}
          </p>
        )}
      </div>

      {/* Purpose */}
      <div>
        <label
          htmlFor="book-purpose"
          className="block text-xs font-semibold text-foreground mb-1.5"
        >
          What would you like to discuss?{" "}
          <span className="text-muted-foreground font-normal">(optional)</span>
        </label>
        <textarea
          id="book-purpose"
          value={form.purpose}
          onChange={(e) => handleChange("purpose", e.target.value)}
          placeholder="What would you like to discuss?"
          rows={3}
          className="w-full px-3 py-2.5 text-sm bg-input border border-border rounded-lg text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 resize-none transition-all duration-200"
          data-ocid="book.purpose_input"
        />
      </div>

      {/* File upload */}
      <div>
        <p className="block text-xs font-semibold text-foreground mb-1.5">
          Attachments{" "}
          <span className="text-muted-foreground font-normal">
            (optional, up to 3)
          </span>
        </p>
        <label
          htmlFor="book-files"
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragOver(true);
          }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={handleDrop}
          className={[
            "group flex flex-col items-center gap-1.5 px-4 py-4 border border-dashed rounded-xl cursor-pointer transition-all duration-200",
            isDragOver
              ? "border-primary bg-primary/10 scale-[1.01]"
              : files.length >= 3
                ? "border-border/40 opacity-50 cursor-not-allowed"
                : "border-border hover:border-primary/60 hover:bg-primary/5",
          ].join(" ")}
          data-ocid="book.dropzone"
        >
          <Upload
            size={16}
            className={`transition-colors ${isDragOver ? "text-primary" : "text-muted-foreground group-hover:text-primary"}`}
          />
          <span
            className={`text-xs text-center transition-colors ${
              isDragOver
                ? "text-primary"
                : "text-muted-foreground group-hover:text-primary"
            }`}
          >
            {files.length >= 3
              ? "Maximum 3 files"
              : isDragOver
                ? "Drop files here"
                : "Click to upload or drag & drop"}
          </span>
          <input
            ref={fileInputRef}
            id="book-files"
            type="file"
            multiple
            disabled={files.length >= 3}
            onChange={(e) => addFiles(e.target.files)}
            className="hidden"
            data-ocid="book.upload_button"
          />
        </label>

        {files.length > 0 && (
          <ul className="mt-2 space-y-1">
            {files.map((f, i) => (
              <li
                key={`${f.name}-${f.lastModified}`}
                className="flex items-center gap-2 px-3 py-2 bg-muted/30 border border-border rounded-lg"
                data-ocid={`book.file.item.${i + 1}`}
              >
                <FileText size={13} className="text-primary/70 shrink-0" />
                <span className="text-xs text-foreground truncate flex-1 min-w-0">
                  {f.name}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setFiles((prev) => prev.filter((_, j) => j !== i))
                  }
                  aria-label={`Remove ${f.name}`}
                  className="p-0.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors shrink-0"
                  data-ocid={`book.file_remove.${i + 1}`}
                >
                  <X size={12} />
                </button>
              </li>
            ))}
          </ul>
        )}

        {uploadProgress > 0 && uploadProgress < 100 && (
          <div className="mt-2 h-1 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        )}
      </div>

      {/* API error */}
      {submitError && (
        <div
          className="flex items-start gap-2.5 px-3 py-3 bg-destructive/10 border border-destructive/30 rounded-lg"
          data-ocid="book.form_error_state"
        >
          <AlertCircle size={14} className="text-destructive shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="text-xs text-destructive">{submitError}</p>
          </div>
          <button
            type="button"
            onClick={() => setSubmitError(null)}
            className="text-destructive/60 hover:text-destructive transition-colors shrink-0"
            aria-label="Dismiss error"
          >
            <X size={12} />
          </button>
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={!canSubmit || createBooking.isPending}
        className="w-full py-3.5 bg-primary text-primary-foreground text-sm font-bold rounded-xl hover:brightness-110 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2 shadow-md tracking-wide"
        data-ocid="book.submit_button"
      >
        {createBooking.isPending ? (
          <>
            <Loader2 size={15} className="animate-spin" /> Confirming booking…
          </>
        ) : (
          "Confirm Booking"
        )}
      </button>
    </form>
  );
}

// ─── Confirmation Screen ──────────────────────────────────────────────────────

function ConfirmationScreen({
  link,
  selectedSlot,
  attendee,
  onBookAnother,
}: {
  link: { name: string; duration: string };
  selectedSlot: { start: bigint; end: bigint };
  attendee: { name: string; email: string; token?: string };
  onBookAnother: () => void;
}) {
  const dateStr = new Date(
    Number(selectedSlot.start / 1_000_000n),
  ).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-10 bg-background"
      data-ocid="book.success_state"
    >
      <div className="max-w-md w-full">
        {/* Success card */}
        <div className="bg-card border border-primary/25 rounded-2xl p-8 text-center shadow-xl">
          {/* Animated check */}
          <div className="w-18 h-18 rounded-full border-2 border-primary bg-primary/10 flex items-center justify-center mx-auto mb-5 w-[72px] h-[72px]">
            <CheckCircle2 size={34} className="text-primary" />
          </div>

          <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-2">
            Confirmed
          </p>
          <h1 className="font-display text-2xl font-bold text-foreground mb-1">
            You're all set!
          </h1>
          <p className="text-sm text-muted-foreground mb-6">
            {link.name} · {formatDuration(link.duration)}
          </p>

          {/* Booking summary */}
          <div className="bg-muted/30 border border-border rounded-xl px-5 py-4 text-left space-y-3 mb-5">
            <div className="flex items-start gap-3">
              <Calendar size={14} className="text-primary mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-foreground">
                  {dateStr}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {formatTime(selectedSlot.start)} –{" "}
                  {formatTime(selectedSlot.end)}
                </p>
              </div>
            </div>
            <div className="h-px bg-border" />
            <div className="flex items-center gap-3">
              <Clock size={14} className="text-primary shrink-0" />
              <p className="text-sm text-foreground">
                {formatDuration(link.duration)} meeting
              </p>
            </div>
            <div className="h-px bg-border" />
            <div className="flex items-center gap-3">
              <CheckCircle2 size={14} className="text-primary shrink-0" />
              <div>
                <p className="text-sm text-foreground">{attendee.name}</p>
                <p className="text-xs text-muted-foreground">
                  {attendee.email}
                </p>
              </div>
            </div>
          </div>

          {/* Reassurance */}
          <div className="bg-primary/8 border border-primary/20 rounded-xl px-4 py-3 mb-6 text-left">
            <p className="text-xs text-foreground/80 leading-relaxed">
              📧 A calendar invite has been sent to{" "}
              <span className="font-semibold text-foreground">
                {attendee.email}
              </span>{" "}
              with a link to reschedule or cancel your appointment.
            </p>
          </div>

          <button
            type="button"
            onClick={onBookAnother}
            className="w-full py-3 border border-border bg-card text-foreground text-sm font-semibold rounded-xl hover:border-primary/50 hover:bg-primary/5 hover:text-primary transition-all duration-200"
            data-ocid="book.book_another_button"
          >
            Book another time
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function BookPage() {
  const params = useParams({ strict: false }) as { linkId?: string };
  const linkId = params.linkId ?? "";
  const timezone = useMemo(() => getUserTimezone(), []);

  const {
    data: link,
    isLoading: linkLoading,
    isError: linkError,
  } = useBookingLink(linkId);

  // Calendar state — default to current month
  const today = new Date();
  const [calYear, setCalYear] = useState(today.getFullYear());
  const [calMonth, setCalMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<{
    start: bigint;
    end: bigint;
  } | null>(null);
  const [booked, setBooked] = useState(false);
  const [bookedAttendee, setBookedAttendee] = useState<{
    name: string;
    email: string;
    token?: string;
  } | null>(null);

  // Free/busy range for selected date
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

  const slotRange = selectedDate
    ? dateToRangeNs(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        selectedDate.getDate(),
      )
    : null;

  const { data: slots, isLoading: slotsLoading } = useAvailableSlots({
    linkId,
    rangeStart: slotRange?.rangeStart ?? 0n,
    rangeEnd: slotRange?.rangeEnd ?? 0n,
    busyIntervals,
    enabled: !!link && !!selectedDate,
  });

  const handleDateSelect = useCallback((date: Date) => {
    setSelectedDate(date);
    setSelectedSlot(null);
    setCalYear(date.getFullYear());
    setCalMonth(date.getMonth());
  }, []);

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

  const handleBooked = (attendee: {
    name: string;
    email: string;
    token?: string;
  }) => {
    setBookedAttendee(attendee);
    setBooked(true);
  };

  const handleBookAnother = () => {
    setBooked(false);
    setBookedAttendee(null);
    setSelectedDate(null);
    setSelectedSlot(null);
  };

  const dateLabel = selectedDate
    ? selectedDate.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
      })
    : "";

  // ── Loading ────────────────────────────────────────────────────────────────
  if (linkLoading) {
    return (
      <div
        className="flex items-center justify-center min-h-screen bg-background"
        data-ocid="book.loading_state"
      >
        <div className="flex flex-col items-center gap-3">
          <Loader2 size={28} className="animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading booking page…</p>
        </div>
      </div>
    );
  }

  // ── Not found / inactive ──────────────────────────────────────────────────
  if (linkError || !link || !link.isActive) {
    return (
      <div
        className="min-h-screen flex items-center justify-center px-4 bg-background"
        data-ocid="book.error_state"
      >
        <div className="max-w-sm w-full bg-card border border-border rounded-2xl p-8 text-center">
          <div className="w-12 h-12 rounded-full bg-muted/40 flex items-center justify-center mx-auto mb-4">
            <Calendar size={22} className="text-muted-foreground" />
          </div>
          <h2 className="font-display text-lg font-semibold text-foreground mb-2">
            Link not available
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            This booking link is inactive or doesn't exist. Contact the host for
            a valid link.
          </p>
        </div>
      </div>
    );
  }

  // ── Confirmation ──────────────────────────────────────────────────────────
  if (booked && selectedSlot && bookedAttendee) {
    return (
      <ConfirmationScreen
        link={link}
        selectedSlot={selectedSlot}
        attendee={bookedAttendee}
        onBookAnother={handleBookAnother}
      />
    );
  }

  // ── Main booking flow ─────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-background" data-ocid="book.page">
      {/* Page header stripe */}
      <div className="border-b border-border bg-card/60 px-4 py-5">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-primary/30 bg-primary/8 text-primary text-[11px] font-semibold mb-2 tracking-wide">
            <Clock size={11} />
            {formatDuration(link.duration)} meeting
          </div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-1">
            {link.name}
          </h1>
          {link.description && (
            <p className="text-sm text-muted-foreground max-w-md leading-relaxed">
              {link.description}
            </p>
          )}
          {/* Timezone indicator */}
          <div className="flex items-center gap-1.5 mt-2">
            <Globe size={12} className="text-muted-foreground/60" />
            <span className="text-[11px] text-muted-foreground/70">
              All times shown in{" "}
              <span className="font-medium text-muted-foreground">
                {timezone}
              </span>
            </span>
          </div>
        </div>
      </div>

      {/* Booking layout */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-[auto_1fr] gap-0 rounded-2xl border border-border bg-card overflow-hidden shadow-xl">
          {/* ── Left: Calendar ──────────────────────────────────────────────── */}
          <div className="p-6 md:border-r border-border bg-card md:min-w-[310px]">
            <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground mb-4">
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

          {/* ── Right: Slots or Form ─────────────────────────────────────────── */}
          <div className="p-6 border-t border-border md:border-t-0 flex flex-col">
            {!selectedDate ? (
              /* Prompt to pick a date */
              <div
                className="flex flex-col items-center justify-center flex-1 py-12 text-center"
                data-ocid="book.date_prompt"
              >
                <div className="w-14 h-14 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
                  <Calendar size={24} className="text-primary/60" />
                </div>
                <p className="text-base font-semibold text-foreground mb-1">
                  Pick a date to get started
                </p>
                <p className="text-sm text-muted-foreground max-w-[220px] leading-relaxed">
                  Select an available day on the calendar to view open time
                  slots.
                </p>
              </div>
            ) : !selectedSlot ? (
              /* Slot selection */
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground">
                      Available Times
                    </p>
                    <p className="text-base font-semibold text-foreground mt-0.5">
                      {dateLabel}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedDate(null)}
                    className="text-[11px] text-muted-foreground hover:text-primary underline underline-offset-2 transition-colors"
                    data-ocid="book.change_date_button"
                  >
                    Change date
                  </button>
                </div>
                <TimeSlotGrid
                  slots={slots}
                  isLoading={slotsLoading}
                  selectedSlotStart={
                    selectedSlot
                      ? (selectedSlot as { start: bigint; end: bigint }).start
                      : null
                  }
                  onSelect={setSelectedSlot}
                />
              </div>
            ) : (
              /* Booking form */
              <BookingForm
                selectedSlot={selectedSlot}
                onChangeSlot={() => setSelectedSlot(null)}
                dateLabel={dateLabel}
                linkName={link.name}
                duration={formatDuration(link.duration)}
                onBooked={handleBooked}
                linkId={linkId}
                busyIntervals={busyIntervals}
              />
            )}
          </div>
        </div>

        {/* Step indicator */}
        <div
          className="flex items-center justify-center gap-2 mt-6"
          aria-label="Booking steps"
        >
          {(["Date", "Time", "Details"] as const).map((step, i) => {
            const stepNum = i + 1;
            const current = !selectedDate ? 1 : !selectedSlot ? 2 : 3;
            const done = stepNum < current;
            const active = stepNum === current;
            return (
              <div key={step} className="flex items-center gap-2">
                <div
                  className={[
                    "w-6 h-6 rounded-full text-[11px] font-bold flex items-center justify-center transition-all duration-300",
                    done
                      ? "bg-primary text-primary-foreground"
                      : active
                        ? "border-2 border-primary text-primary"
                        : "border border-border text-muted-foreground",
                  ].join(" ")}
                >
                  {done ? <CheckCircle2 size={12} /> : stepNum}
                </div>
                <span
                  className={`text-xs font-medium transition-colors ${
                    active
                      ? "text-foreground"
                      : done
                        ? "text-primary"
                        : "text-muted-foreground"
                  }`}
                >
                  {step}
                </span>
                {i < 2 && (
                  <div
                    className={`h-px w-6 transition-colors ${done ? "bg-primary" : "bg-border"}`}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
