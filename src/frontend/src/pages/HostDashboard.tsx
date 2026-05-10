import {
  Calendar,
  ExternalLink,
  FileText,
  Link2,
  Loader2,
  X,
} from "lucide-react";
import { useState } from "react";
import type { BookingView } from "../backend";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Skeleton } from "../components/ui/skeleton";
import { useHasGoogleCalendarCredentials } from "../hooks/useAvailableSlots";
import { useBookingLinks } from "../hooks/useBookingLinks";
import { useBookings, useCancelBooking } from "../hooks/useBookings";
import { cn } from "../lib/utils";
import { formatDate, formatTime } from "../lib/utils";

function StatCard({
  label,
  value,
  loading,
  icon: Icon,
  accent,
}: {
  label: string;
  value: number | string;
  loading?: boolean;
  icon: React.ElementType;
  accent?: boolean;
}) {
  return (
    <div
      className={cn(
        "bg-card border rounded-xl p-5 flex items-start gap-3 transition-colors",
        accent
          ? "border-primary/30 shadow-[0_0_0_1px_oklch(var(--primary)/0.12)]"
          : "border-border",
      )}
    >
      <div
        className={cn(
          "w-9 h-9 rounded-lg flex items-center justify-center shrink-0",
          accent ? "bg-primary/15" : "bg-muted/60",
        )}
      >
        <Icon
          size={16}
          className={accent ? "text-primary" : "text-muted-foreground"}
        />
      </div>
      <div className="min-w-0">
        <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-widest mb-1">
          {label}
        </p>
        {loading ? (
          <Skeleton className="h-7 w-10 mt-1 bg-muted/60" />
        ) : (
          <p
            className={cn(
              "text-3xl font-display font-bold leading-none",
              accent ? "text-primary" : "text-foreground",
            )}
          >
            {value}
          </p>
        )}
      </div>
    </div>
  );
}

function BookingCard({
  booking,
  index,
  onCancel,
  cancelling,
}: {
  booking: BookingView;
  index: number;
  onCancel: (id: string) => void;
  cancelling: boolean;
}) {
  const [showFiles, setShowFiles] = useState(false);
  const initials = booking.clientName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div
      className="bg-card border border-border rounded-xl overflow-hidden hover:border-primary/20 transition-colors"
      data-ocid={`dashboard.booking.item.${index}`}
    >
      <div className="px-4 py-3.5 flex items-start gap-3">
        {/* Avatar */}
        <div className="w-9 h-9 rounded-full bg-primary/15 flex items-center justify-center shrink-0 mt-0.5 ring-1 ring-primary/20">
          <span className="text-xs font-bold text-primary">{initials}</span>
        </div>

        {/* Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="text-sm font-semibold text-foreground truncate">
                {booking.clientName}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {booking.clientEmail}
              </p>
            </div>
            <div className="text-right shrink-0">
              <p className="text-xs font-semibold text-foreground">
                {formatDate(booking.timeSlotStart)}
              </p>
              <p className="text-xs text-muted-foreground">
                {formatTime(booking.timeSlotStart)} –{" "}
                {formatTime(booking.timeSlotEnd)}
              </p>
            </div>
          </div>

          <div className="mt-2 flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-primary/10 text-primary border border-primary/20">
              {booking.purpose}
            </span>
            {booking.fileUrls.length > 0 && (
              <button
                type="button"
                onClick={() => setShowFiles((v) => !v)}
                className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors"
                data-ocid={`dashboard.booking.files_toggle.${index}`}
              >
                <FileText size={11} />
                {booking.fileUrls.length} file
                {booking.fileUrls.length > 1 ? "s" : ""}
              </button>
            )}
          </div>
        </div>

        {/* Cancel */}
        <button
          type="button"
          onClick={() => onCancel(booking.bookingId)}
          disabled={cancelling}
          className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md transition-colors shrink-0 disabled:opacity-40"
          aria-label="Cancel booking"
          data-ocid={`dashboard.booking.cancel_button.${index}`}
        >
          {cancelling ? (
            <Loader2 size={14} className="animate-spin" />
          ) : (
            <X size={14} />
          )}
        </button>
      </div>

      {/* Files */}
      {showFiles && booking.fileUrls.length > 0 && (
        <div className="border-t border-border bg-muted/20 px-4 py-2.5 space-y-1">
          {booking.fileUrls.map((file, fi) => {
            const url = file.getDirectURL();
            const name = url.split("/").pop() ?? `File ${fi + 1}`;
            return (
              <a
                key={url}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-xs text-primary hover:underline"
                data-ocid={`dashboard.booking.file_link.${index}.${fi + 1}`}
              >
                <ExternalLink size={11} />
                {name}
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function HostDashboard() {
  const { data: bookings, isLoading: bookingsLoading } = useBookings();
  const { data: links, isLoading: linksLoading } = useBookingLinks();
  const { data: hasCalendar, isLoading: calendarLoading } =
    useHasGoogleCalendarCredentials();
  const cancelBooking = useCancelBooking();
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const now = BigInt(Date.now()) * 1_000_000n;
  const sevenDays = now + BigInt(7 * 24 * 60 * 60 * 1000) * 1_000_000n;

  const activeBookings = bookings?.filter((b) => !b.isCancelled) ?? [];
  const upcoming = activeBookings
    .filter((b) => b.timeSlotStart >= now && b.timeSlotStart <= sevenDays)
    .sort((a, b) => (a.timeSlotStart < b.timeSlotStart ? -1 : 1));

  const activeLinks = links?.filter((l) => l.isActive).length ?? 0;
  const totalBookings = activeBookings.length;

  const handleCancel = async (bookingId: string) => {
    setCancellingId(bookingId);
    try {
      await cancelBooking.mutateAsync(bookingId);
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <div
      className="max-w-5xl mx-auto px-4 md:px-6 py-8"
      data-ocid="dashboard.page"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground tracking-tight">
            Dashboard
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Overview of your upcoming schedule
          </p>
        </div>
        {/* Calendar connection badge */}
        {!calendarLoading && (
          <a
            href="/host/calendar"
            className={cn(
              "hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors",
              hasCalendar
                ? "bg-primary/10 border-primary/25 text-primary hover:bg-primary/15"
                : "bg-muted/40 border-border text-muted-foreground hover:text-foreground hover:border-primary/30",
            )}
            data-ocid="dashboard.calendar_status_link"
          >
            <Calendar size={13} />
            {hasCalendar
              ? "Google Calendar connected"
              : "Connect Google Calendar"}
          </a>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-8">
        <StatCard
          label="Upcoming (7 days)"
          value={bookingsLoading ? "—" : upcoming.length}
          loading={bookingsLoading}
          icon={Calendar}
          accent
        />
        <StatCard
          label="Active Links"
          value={linksLoading ? "—" : activeLinks}
          loading={linksLoading}
          icon={Link2}
        />
        <StatCard
          label="Total Bookings"
          value={bookingsLoading ? "—" : totalBookings}
          loading={bookingsLoading}
          icon={FileText}
        />
      </div>

      {/* Google Calendar alert */}
      {!calendarLoading && !hasCalendar && (
        <div
          className="bg-primary/8 border border-primary/20 rounded-xl px-4 py-3 flex items-center justify-between mb-7"
          data-ocid="dashboard.cal_banner"
        >
          <div className="flex items-center gap-2.5">
            <Calendar size={14} className="text-primary shrink-0" />
            <p className="text-sm text-foreground/80">
              Connect Google Calendar to see your real availability
            </p>
          </div>
          <a
            href="/host/settings"
            className="flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary/80 transition-colors shrink-0 ml-3 px-2.5 py-1.5 rounded-md bg-primary/10 hover:bg-primary/15 border border-primary/20"
            data-ocid="dashboard.connect_calendar_link"
          >
            <Calendar size={12} />
            Connect
          </a>
        </div>
      )}

      {/* Upcoming bookings */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold text-foreground">
          Upcoming Bookings
          {!bookingsLoading && upcoming.length > 0 && (
            <span className="ml-2 text-xs font-normal text-muted-foreground">
              · Next 7 days
            </span>
          )}
        </h2>
      </div>

      {bookingsLoading ? (
        <div className="space-y-3" data-ocid="dashboard.loading_state">
          {[1, 2, 3].map((n) => (
            <Skeleton key={n} className="h-20 w-full rounded-xl bg-card" />
          ))}
        </div>
      ) : upcoming.length === 0 ? (
        <div
          className="bg-card border border-border rounded-xl p-12 text-center"
          data-ocid="dashboard.empty_state"
        >
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Calendar size={22} className="text-primary" />
          </div>
          <p className="text-sm font-semibold text-foreground mb-1">
            No upcoming bookings
          </p>
          <p className="text-xs text-muted-foreground mb-5">
            Share your booking links to receive new bookings.
          </p>
          <Button
            size="sm"
            className="bg-primary text-primary-foreground hover:bg-primary/90 gap-1.5"
            asChild
          >
            <a href="/host/links" data-ocid="dashboard.view_links_button">
              View Booking Links
            </a>
          </Button>
        </div>
      ) : (
        <div className="space-y-3" data-ocid="dashboard.bookings_list">
          {upcoming.map((booking, i) => (
            <BookingCard
              key={booking.bookingId}
              booking={booking}
              index={i + 1}
              onCancel={handleCancel}
              cancelling={cancellingId === booking.bookingId}
            />
          ))}
        </div>
      )}
    </div>
  );
}
