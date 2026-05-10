import { useNavigate } from "@tanstack/react-router";
import {
  Calendar,
  Check,
  Clock,
  Copy,
  Edit2,
  Link2,
  MoreVertical,
  Plus,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { BookingLinkInput, BookingLinkView } from "../backend";
import { Duration as BackendDuration } from "../backend";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader } from "../components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Skeleton } from "../components/ui/skeleton";
import { Switch } from "../components/ui/switch";
import { Textarea } from "../components/ui/textarea";
import {
  useBookingLinks,
  useCreateBookingLink,
  useDeleteBookingLink,
  useSetBookingLinkActive,
  useUpdateBookingLink,
} from "../hooks/useBookingLinks";
import { formatDate } from "../lib/utils";

const DURATIONS: { value: BackendDuration; label: string }[] = [
  { value: BackendDuration.min15, label: "15 min" },
  { value: BackendDuration.min30, label: "30 min" },
  { value: BackendDuration.min45, label: "45 min" },
  { value: BackendDuration.min60, label: "60 min" },
];

function formatDurationLabel(duration: BackendDuration): string {
  switch (duration) {
    case BackendDuration.min15:
      return "15 min";
    case BackendDuration.min30:
      return "30 min";
    case BackendDuration.min45:
      return "45 min";
    case BackendDuration.min60:
      return "60 min";
    default:
      return "—";
  }
}

function durationColor(duration: BackendDuration): string {
  switch (duration) {
    case BackendDuration.min15:
      return "bg-primary/10 text-primary border-primary/25";
    case BackendDuration.min30:
      return "bg-primary/10 text-primary border-primary/25";
    case BackendDuration.min45:
      return "bg-primary/10 text-primary border-primary/25";
    case BackendDuration.min60:
      return "bg-primary/10 text-primary border-primary/25";
    default:
      return "bg-muted/60 text-muted-foreground border-border";
  }
}

// ─── Link Form Dialog ────────────────────────────────────────────────────────

interface LinkFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  existing?: BookingLinkView;
}

function LinkFormDialog({ open, onOpenChange, existing }: LinkFormDialogProps) {
  const [name, setName] = useState(existing?.name ?? "");
  const [description, setDescription] = useState(existing?.description ?? "");
  const [duration, setDuration] = useState<BackendDuration>(
    existing?.duration ?? BackendDuration.min30,
  );

  const createMutation = useCreateBookingLink();
  const updateMutation = useUpdateBookingLink();
  const isPending = createMutation.isPending || updateMutation.isPending;

  function handleOpen(o: boolean) {
    if (!o) {
      setName(existing?.name ?? "");
      setDescription(existing?.description ?? "");
      setDuration(existing?.duration ?? BackendDuration.min30);
    }
    onOpenChange(o);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const input: BookingLinkInput = {
      name: name.trim(),
      description: description.trim(),
      duration,
    };
    try {
      if (existing) {
        await updateMutation.mutateAsync({ linkId: existing.id, input });
        toast.success("Booking link updated");
      } else {
        await createMutation.mutateAsync(input);
        toast.success("Booking link created");
      }
      handleOpen(false);
    } catch {
      toast.error("Something went wrong. Please try again.");
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpen}>
      <DialogContent
        className="sm:max-w-md bg-card border-border"
        data-ocid="link_form.dialog"
      >
        <DialogHeader>
          <DialogTitle className="font-display text-foreground">
            {existing ? "Edit booking link" : "Create booking link"}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {existing
              ? "Update the details for this booking link."
              : "Share this link with clients so they can book time with you."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 pt-1">
          <div className="space-y-1.5">
            <Label htmlFor="link-name" className="text-foreground/80">
              Name
            </Label>
            <Input
              id="link-name"
              placeholder="e.g. Product Demo, Intro Call"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              maxLength={80}
              className="bg-input border-border focus-visible:ring-primary/50 text-foreground placeholder:text-muted-foreground"
              data-ocid="link_form.name_input"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="link-desc" className="text-foreground/80">
              Description{" "}
              <span className="text-muted-foreground font-normal">
                (optional)
              </span>
            </Label>
            <Textarea
              id="link-desc"
              placeholder="What's this meeting for?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              maxLength={300}
              className="resize-none bg-input border-border focus-visible:ring-primary/50 text-foreground placeholder:text-muted-foreground"
              data-ocid="link_form.description_textarea"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-foreground/80">Duration</Label>
            <div className="grid grid-cols-4 gap-2">
              {DURATIONS.map((d) => (
                <button
                  key={d.value}
                  type="button"
                  onClick={() => setDuration(d.value)}
                  className={`py-2 rounded-md border text-sm font-medium transition-colors ${
                    duration === d.value
                      ? "bg-primary text-primary-foreground border-primary shadow-[0_0_10px_oklch(var(--primary)/0.25)]"
                      : "bg-muted/40 text-muted-foreground border-border hover:border-primary/40 hover:text-foreground"
                  }`}
                  data-ocid={`link_form.duration_${d.value}_button`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpen(false)}
              className="border-border text-muted-foreground hover:text-foreground hover:bg-muted/40"
              data-ocid="link_form.cancel_button"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending || !name.trim()}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
              data-ocid="link_form.submit_button"
            >
              {isPending
                ? "Saving\u2026"
                : existing
                  ? "Save changes"
                  : "Create link"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ─── Delete Confirm Dialog ───────────────────────────────────────────────────

interface DeleteDialogProps {
  link: BookingLinkView | null;
  onClose: () => void;
}

function DeleteDialog({ link, onClose }: DeleteDialogProps) {
  const deleteMutation = useDeleteBookingLink();

  async function handleDelete() {
    if (!link) return;
    try {
      await deleteMutation.mutateAsync(link.id);
      toast.success("Booking link deleted");
      onClose();
    } catch {
      toast.error("Could not delete. Please try again.");
    }
  }

  return (
    <Dialog open={!!link} onOpenChange={(o) => !o && onClose()}>
      <DialogContent
        className="sm:max-w-sm bg-card border-border"
        data-ocid="delete.dialog"
      >
        <DialogHeader>
          <DialogTitle className="font-display text-foreground">
            Delete booking link?
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            <strong className="text-foreground">{link?.name}</strong> will be
            permanently deleted. Existing bookings are not affected.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            className="border-border text-muted-foreground hover:text-foreground hover:bg-muted/40"
            data-ocid="delete.cancel_button"
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            disabled={deleteMutation.isPending}
            onClick={handleDelete}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            data-ocid="delete.confirm_button"
          >
            {deleteMutation.isPending ? "Deleting\u2026" : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Link Card ───────────────────────────────────────────────────────────────

interface LinkCardProps {
  link: BookingLinkView;
  index: number;
  onEdit: (link: BookingLinkView) => void;
  onDelete: (link: BookingLinkView) => void;
}

function LinkCard({ link, index, onEdit, onDelete }: LinkCardProps) {
  const navigate = useNavigate();
  const toggleActive = useSetBookingLinkActive();
  const [copied, setCopied] = useState(false);

  const bookUrl = `${window.location.origin}/book/${link.id}`;

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(bookUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success("Link copied to clipboard");
    } catch {
      toast.error("Could not copy link");
    }
  }

  async function handleToggle(checked: boolean) {
    try {
      await toggleActive.mutateAsync({ linkId: link.id, isActive: checked });
      toast.success(checked ? "Link activated" : "Link deactivated");
    } catch {
      toast.error("Could not update link status");
    }
  }

  return (
    <Card
      className="group border-border bg-card hover:border-primary/25 transition-colors duration-200"
      data-ocid={`links.item.${index}`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 min-w-0">
            <div className="mt-0.5 shrink-0 w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center ring-1 ring-primary/20">
              <Link2 size={15} className="text-primary" />
            </div>
            <div className="min-w-0">
              <h3 className="font-display font-semibold text-foreground text-sm leading-snug truncate">
                {link.name}
              </h3>
              {link.description && (
                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                  {link.description}
                </p>
              )}
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 shrink-0 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity text-muted-foreground hover:text-foreground hover:bg-muted/40"
                aria-label="More actions"
                data-ocid={`links.item_menu.${index}`}
              >
                <MoreVertical size={14} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-44 bg-card border-border"
            >
              <DropdownMenuItem
                onClick={() => onEdit(link)}
                className="text-foreground hover:bg-muted/40 focus:bg-muted/40"
                data-ocid={`links.edit_button.${index}`}
              >
                <Edit2 size={13} className="mr-2" />
                Edit link
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  navigate({
                    to: "/host/calendar/$linkId",
                    params: { linkId: link.id },
                  })
                }
                className="text-foreground hover:bg-muted/40 focus:bg-muted/40"
                data-ocid={`links.calendar_button.${index}`}
              >
                <Calendar size={13} className="mr-2" />
                Manage availability
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-border" />
              <DropdownMenuItem
                onClick={() => onDelete(link)}
                className="text-destructive focus:text-destructive focus:bg-destructive/10"
                data-ocid={`links.delete_button.${index}`}
              >
                <Trash2 size={13} className="mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Badges */}
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${durationColor(link.duration)}`}
          >
            <Clock size={10} />
            {formatDurationLabel(link.duration)}
          </span>
          <span
            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${
              link.isActive
                ? "bg-primary/10 text-primary border-primary/25"
                : "bg-muted/40 text-muted-foreground border-border"
            }`}
          >
            {link.isActive ? "Active" : "Inactive"}
          </span>
        </div>

        {/* Created date */}
        <p className="text-xs text-muted-foreground">
          Created {formatDate(link.createdAt)}
        </p>

        {/* Actions row */}
        <div className="flex items-center justify-between pt-2 border-t border-border">
          <Button
            variant="ghost"
            size="sm"
            className="h-7 text-xs gap-1.5 text-muted-foreground hover:text-primary hover:bg-primary/10 px-2"
            onClick={handleCopy}
            data-ocid={`links.copy_button.${index}`}
          >
            {copied ? (
              <>
                <Check size={12} className="text-primary" />
                Copied!
              </>
            ) : (
              <>
                <Copy size={12} />
                Copy link
              </>
            )}
          </Button>

          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">
              {link.isActive ? "On" : "Off"}
            </span>
            <Switch
              checked={link.isActive}
              onCheckedChange={handleToggle}
              disabled={toggleActive.isPending}
              aria-label={`Toggle ${link.name} active`}
              className="data-[state=checked]:bg-primary"
              data-ocid={`links.active_toggle.${index}`}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Skeletons ───────────────────────────────────────────────────────────────

function LinkCardSkeleton() {
  return (
    <Card className="border-border">
      <CardHeader className="pb-3">
        <div className="flex items-start gap-3">
          <Skeleton className="w-8 h-8 rounded-lg shrink-0" />
          <div className="space-y-1.5 flex-1 min-w-0">
            <Skeleton className="h-4 w-36" />
            <Skeleton className="h-3 w-52" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Skeleton className="h-5 w-16 rounded-full" />
          <Skeleton className="h-5 w-14 rounded-full" />
        </div>
        <Skeleton className="h-3 w-32" />
        <div className="flex items-center justify-between pt-1 border-t border-border">
          <Skeleton className="h-7 w-24 rounded-md" />
          <Skeleton className="h-5 w-9 rounded-full" />
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Empty State ─────────────────────────────────────────────────────────────

function EmptyState({ onCreate }: { onCreate: () => void }) {
  return (
    <div
      className="flex flex-col items-center justify-center py-20 px-6 text-center"
      data-ocid="links.empty_state"
    >
      <div className="w-14 h-14 rounded-2xl bg-primary/12 flex items-center justify-center mb-5 ring-1 ring-primary/20">
        <Link2 size={24} className="text-primary" />
      </div>
      <h3 className="font-display font-semibold text-foreground text-lg mb-1">
        No booking links yet
      </h3>
      <p className="text-sm text-muted-foreground max-w-xs mb-6">
        Create your first booking link and share it with clients so they can
        schedule time with you.
      </p>
      <Button
        onClick={onCreate}
        className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_14px_oklch(var(--primary)/0.25)]"
        data-ocid="links.empty_create_button"
      >
        <Plus size={15} />
        Create booking link
      </Button>
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function HostLinks() {
  const { data: links, isLoading } = useBookingLinks();
  const [createOpen, setCreateOpen] = useState(false);
  const [editLink, setEditLink] = useState<BookingLinkView | null>(null);
  const [deleteLink, setDeleteLink] = useState<BookingLinkView | null>(null);

  const sortedLinks = [...(links ?? [])].sort((a, b) =>
    Number(b.createdAt - a.createdAt),
  );

  const activeCount = sortedLinks.filter((l) => l.isActive).length;

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6 py-8" data-ocid="links.page">
      {/* Page header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display font-bold text-2xl text-foreground tracking-tight">
            Booking Links
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Create links with a fixed duration and share them with clients.
          </p>
        </div>
        <Button
          className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_14px_oklch(var(--primary)/0.2)]"
          onClick={() => setCreateOpen(true)}
          data-ocid="links.create_button"
        >
          <Plus size={15} />
          <span className="hidden sm:inline">New link</span>
          <span className="sm:hidden">New</span>
        </Button>
      </div>

      {/* Stats bar */}
      {!isLoading && sortedLinks.length > 0 && (
        <div className="flex items-center gap-4 mb-6 px-4 py-2.5 rounded-lg bg-muted/30 border border-border text-sm text-muted-foreground">
          <span>
            <strong className="text-foreground">{sortedLinks.length}</strong>{" "}
            {sortedLinks.length === 1 ? "link" : "links"}
          </span>
          <span className="text-border">·</span>
          <span>
            <strong className="text-primary">{activeCount}</strong> active
          </span>
        </div>
      )}

      {/* Content */}
      {isLoading ? (
        <div
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4"
          data-ocid="links.loading_state"
        >
          {Array.from({ length: 3 }).map((_, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: skeleton placeholders
            <LinkCardSkeleton key={i} />
          ))}
        </div>
      ) : sortedLinks.length === 0 ? (
        <EmptyState onCreate={() => setCreateOpen(true)} />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedLinks.map((link, i) => (
            <LinkCard
              key={link.id}
              link={link}
              index={i + 1}
              onEdit={setEditLink}
              onDelete={setDeleteLink}
            />
          ))}
        </div>
      )}

      {/* Dialogs */}
      <LinkFormDialog open={createOpen} onOpenChange={setCreateOpen} />
      {editLink && (
        <LinkFormDialog
          open={!!editLink}
          onOpenChange={(o) => !o && setEditLink(null)}
          existing={editLink}
        />
      )}
      <DeleteDialog link={deleteLink} onClose={() => setDeleteLink(null)} />
    </div>
  );
}
