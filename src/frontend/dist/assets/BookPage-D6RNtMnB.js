import { c as createLucideIcon, k as useParams, r as reactExports, H as msToNanoseconds, j as jsxRuntimeExports, d as LoaderCircle, C as Calendar, I as formatDuration, x as CircleCheck, b as formatTime, X, J as ExternalBlob } from "./index-Bcm1BYaZ.js";
import { a as useGoogleCalendarFreeBusy, b as useAvailableSlots } from "./useAvailableSlots-CgEvFERY.js";
import { e as useBookingLink } from "./useBookingLinks-OKODmVBH.js";
import { d as useCreateBooking } from "./useBookings-DGlOSDIl.js";
import { C as Clock } from "./clock-B8La_BYV.js";
import { a as ChevronLeft, C as ChevronRight } from "./chevron-right-ChuTWYGB.js";
import { C as CircleAlert } from "./circle-alert-nsbdDCBx.js";
import { F as FileText } from "./file-text-DySO-kf3.js";
import "./useMutation-BjpTJhfH.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20", key: "13o1zl" }],
  ["path", { d: "M2 12h20", key: "9i4pu4" }]
];
const Globe = createLucideIcon("globe", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M12 3v12", key: "1x0j5s" }],
  ["path", { d: "m17 8-5-5-5 5", key: "7q97r8" }],
  ["path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4", key: "ih7n3h" }]
];
const Upload = createLucideIcon("upload", __iconNode);
function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}
function getFirstDayOfMonth(year, month) {
  return new Date(year, month, 1).getDay();
}
function isPastDay(year, month, day) {
  const today = /* @__PURE__ */ new Date();
  today.setHours(0, 0, 0, 0);
  return new Date(year, month, day) < today;
}
function isSameDay(date, y, m, d) {
  return date.getFullYear() === y && date.getMonth() === m && date.getDate() === d;
}
function dateToRangeNs(year, month, day) {
  return {
    rangeStart: msToNanoseconds(
      new Date(year, month, day, 0, 0, 0, 0).getTime()
    ),
    rangeEnd: msToNanoseconds(
      new Date(year, month, day, 23, 59, 59, 999).getTime()
    )
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
  "December"
];
const DAY_LABELS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
function getUserTimezone() {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}
function SlotSkeleton() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: "grid grid-cols-2 gap-2",
      "data-ocid": "book.slots_loading_state",
      children: Array.from({ length: 6 }).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "h-[52px] rounded-lg bg-muted/40 animate-pulse"
        },
        i
      ))
    }
  );
}
function MonthCalendar({
  year,
  month,
  selectedDate,
  onSelectDate,
  onPrevMonth,
  onNextMonth
}) {
  const today = /* @__PURE__ */ new Date();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
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
  const handleKeyDown = reactExports.useCallback(
    (e) => {
      if (!selectedDate) return;
      let next = new Date(selectedDate);
      if (e.key === "ArrowRight") next.setDate(next.getDate() + 1);
      else if (e.key === "ArrowLeft") next.setDate(next.getDate() - 1);
      else if (e.key === "ArrowDown") next.setDate(next.getDate() + 7);
      else if (e.key === "ArrowUp") next.setDate(next.getDate() - 7);
      else return;
      e.preventDefault();
      const nowDay = /* @__PURE__ */ new Date();
      nowDay.setHours(0, 0, 0, 0);
      if (next >= nowDay) onSelectDate(next);
    },
    [selectedDate, onSelectDate]
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      "aria-label": "Calendar",
      onKeyDown: handleKeyDown,
      className: "outline-none focus-visible:ring-1 focus-visible:ring-primary/40 rounded-xl",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: onPrevMonth,
              className: "w-9 h-9 flex items-center justify-center rounded-lg border border-border hover:border-primary/50 hover:bg-primary/8 hover:text-primary text-muted-foreground transition-colors",
              "aria-label": "Previous month",
              "data-ocid": "book.calendar_prev_month",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { size: 15 })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm font-semibold text-foreground tracking-wide", children: [
            MONTH_NAMES[month],
            " ",
            year
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: onNextMonth,
              className: "w-9 h-9 flex items-center justify-center rounded-lg border border-border hover:border-primary/50 hover:bg-primary/8 hover:text-primary text-muted-foreground transition-colors",
              "aria-label": "Next month",
              "data-ocid": "book.calendar_next_month",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { size: 15 })
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-7 mb-1.5", children: DAY_LABELS.map((d) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "text-center text-[10px] font-semibold text-muted-foreground/60 py-1 uppercase tracking-widest",
            children: d
          },
          d
        )) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-7 gap-0.5", children: cells.map((cell) => {
          if (cell.kind === "pad")
            return /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                "aria-hidden": "true",
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
              "aria-pressed": selected,
              "aria-label": `${MONTH_NAMES[month]} ${day}, ${year}${isToday ? " (today)" : ""}${past ? " (unavailable)" : ""}`,
              onClick: () => onSelectDate(new Date(year, month, day)),
              className: [
                "aspect-square min-h-[40px] md:min-h-0 rounded-lg text-xs font-medium transition-all duration-200 flex items-center justify-center select-none",
                past ? "text-muted-foreground/20 cursor-not-allowed" : selected ? "bg-primary text-primary-foreground shadow-md font-bold scale-105" : isToday ? "border border-primary text-primary font-semibold hover:bg-primary/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60" : "hover:bg-primary/10 hover:text-primary text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
              ].join(" "),
              "data-ocid": `book.calendar_day.${day}`,
              children: day
            },
            day
          );
        }) })
      ]
    }
  );
}
function TimeSlotGrid({
  slots,
  isLoading,
  selectedSlotStart,
  onSelect
}) {
  if (isLoading) return /* @__PURE__ */ jsxRuntimeExports.jsx(SlotSkeleton, {});
  if (!(slots == null ? void 0 : slots.length)) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex flex-col items-center justify-center py-12 text-center",
        "data-ocid": "book.slots_empty_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 rounded-full bg-muted/40 flex items-center justify-center mb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { size: 20, className: "text-muted-foreground/50" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground mb-1", children: "No availability found" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground leading-relaxed max-w-[200px]", children: "Please check back later or contact the host." })
        ]
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-2", "data-ocid": "book.slots_list", children: slots.map((slot, i) => {
    const selected = selectedSlotStart === slot.start;
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        type: "button",
        onClick: () => onSelect(slot),
        className: [
          "px-3 py-3 rounded-lg border text-sm text-left transition-all duration-200 min-h-[52px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 active:scale-[0.97]",
          selected ? "bg-primary text-primary-foreground border-primary shadow-md font-semibold" : "border-border bg-card hover:border-primary/60 hover:bg-primary/8 text-foreground hover:shadow-sm"
        ].join(" "),
        "data-ocid": `book.slot.item.${i + 1}`,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "block font-semibold text-[13px]", children: formatTime(slot.start) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: `block text-[11px] mt-0.5 ${selected ? "opacity-70" : "text-muted-foreground"}`,
              children: formatTime(slot.end)
            }
          )
        ]
      },
      `${slot.start}`
    );
  }) });
}
function BookingForm({
  selectedSlot,
  onChangeSlot,
  dateLabel,
  linkName,
  duration,
  onBooked,
  linkId,
  busyIntervals
}) {
  const createBooking = useCreateBooking();
  const [form, setForm] = reactExports.useState({
    name: "",
    email: "",
    purpose: ""
  });
  const [errors, setErrors] = reactExports.useState({});
  const [touched, setTouched] = reactExports.useState({});
  const [files, setFiles] = reactExports.useState([]);
  const [uploadProgress, setUploadProgress] = reactExports.useState(0);
  const [submitError, setSubmitError] = reactExports.useState(null);
  const [isDragOver, setIsDragOver] = reactExports.useState(false);
  const nameRef = reactExports.useRef(null);
  const fileInputRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    const t = setTimeout(() => {
      var _a;
      return (_a = nameRef.current) == null ? void 0 : _a.focus();
    }, 100);
    return () => clearTimeout(t);
  }, []);
  const validate = reactExports.useCallback(
    (field, value) => {
      if (field === "name" && !value.trim()) return "Name is required";
      if (field === "email") {
        if (!value.trim()) return "Email is required";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
          return "Enter a valid email";
      }
      return void 0;
    },
    []
  );
  const handleBlur = (field) => {
    setTouched((t) => ({ ...t, [field]: true }));
    const err = validate(field, form[field]);
    setErrors((e) => ({ ...e, [field]: err }));
  };
  const handleChange = (field, value) => {
    setForm((f) => ({ ...f, [field]: value }));
    if (touched[field]) {
      const err = validate(field, value);
      setErrors((e) => ({ ...e, [field]: err }));
    }
  };
  const addFiles = (incoming) => {
    if (!incoming) return;
    setFiles((prev) => [...prev, ...Array.from(incoming)].slice(0, 3));
  };
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    addFiles(e.dataTransfer.files);
  };
  const canSubmit = form.name.trim() && form.email.trim() && !errors.name && !errors.email;
  const handleSubmit = async (e) => {
    e.preventDefault();
    const allTouched = { name: true, email: true };
    setTouched(allTouched);
    const nameErr = validate("name", form.name);
    const emailErr = validate("email", form.email);
    setErrors({ name: nameErr, email: emailErr });
    if (nameErr || emailErr) return;
    setSubmitError(null);
    try {
      const fileBlobs = await Promise.all(
        files.map(async (file) => {
          const bytes = new Uint8Array(await file.arrayBuffer());
          return ExternalBlob.fromBytes(bytes).withUploadProgress((pct) => {
            setUploadProgress(pct);
          });
        })
      );
      await createBooking.mutateAsync({
        input: {
          linkId,
          clientName: form.name,
          clientEmail: form.email,
          purpose: form.purpose,
          timeSlotStart: selectedSlot.start,
          timeSlotEnd: selectedSlot.end,
          fileUrls: fileBlobs
        },
        busyIntervals
      });
      onBooked({ name: form.name, email: form.email });
    } catch {
      setSubmitError("Something went wrong. Please try again.");
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "form",
    {
      onSubmit: handleSubmit,
      className: "space-y-4",
      "data-ocid": "book.form",
      noValidate: true,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between bg-primary/10 border border-primary/25 rounded-xl px-4 py-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] uppercase tracking-widest text-muted-foreground font-semibold", children: dateLabel }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm font-bold text-primary mt-0.5", children: [
              formatTime(selectedSlot.start),
              " – ",
              formatTime(selectedSlot.end)
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[11px] text-muted-foreground mt-0.5", children: [
              duration,
              " · ",
              linkName
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: onChangeSlot,
              className: "text-[11px] text-muted-foreground hover:text-primary underline underline-offset-2 transition-colors font-medium shrink-0 ml-3",
              "data-ocid": "book.change_slot_button",
              children: "Change"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground", children: "Your Details" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "label",
            {
              htmlFor: "book-name",
              className: "block text-xs font-semibold text-foreground mb-1.5",
              children: [
                "Full Name ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "*" })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              ref: nameRef,
              id: "book-name",
              type: "text",
              autoComplete: "name",
              value: form.name,
              onChange: (e) => handleChange("name", e.target.value),
              onBlur: () => handleBlur("name"),
              placeholder: "Jane Smith",
              className: [
                "w-full px-3 py-2.5 text-sm bg-input border rounded-lg text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 transition-all duration-200",
                errors.name && touched.name ? "border-destructive focus:ring-destructive/30" : "border-border focus:border-primary focus:ring-primary/30"
              ].join(" "),
              "data-ocid": "book.name_input"
            }
          ),
          errors.name && touched.name && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "p",
            {
              className: "mt-1 text-[11px] text-destructive flex items-center gap-1",
              "data-ocid": "book.name_field_error",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { size: 11 }),
                " ",
                errors.name
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "label",
            {
              htmlFor: "book-email",
              className: "block text-xs font-semibold text-foreground mb-1.5",
              children: [
                "Email ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "*" })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              id: "book-email",
              type: "email",
              autoComplete: "email",
              inputMode: "email",
              value: form.email,
              onChange: (e) => handleChange("email", e.target.value),
              onBlur: () => handleBlur("email"),
              placeholder: "jane@company.com",
              className: [
                "w-full px-3 py-2.5 text-sm bg-input border rounded-lg text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 transition-all duration-200",
                errors.email && touched.email ? "border-destructive focus:ring-destructive/30" : "border-border focus:border-primary focus:ring-primary/30"
              ].join(" "),
              "data-ocid": "book.email_input"
            }
          ),
          errors.email && touched.email && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "p",
            {
              className: "mt-1 text-[11px] text-destructive flex items-center gap-1",
              "data-ocid": "book.email_field_error",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { size: 11 }),
                " ",
                errors.email
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "label",
            {
              htmlFor: "book-purpose",
              className: "block text-xs font-semibold text-foreground mb-1.5",
              children: [
                "What would you like to discuss?",
                " ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground font-normal", children: "(optional)" })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "textarea",
            {
              id: "book-purpose",
              value: form.purpose,
              onChange: (e) => handleChange("purpose", e.target.value),
              placeholder: "What would you like to discuss?",
              rows: 3,
              className: "w-full px-3 py-2.5 text-sm bg-input border border-border rounded-lg text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 resize-none transition-all duration-200",
              "data-ocid": "book.purpose_input"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "block text-xs font-semibold text-foreground mb-1.5", children: [
            "Attachments",
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground font-normal", children: "(optional, up to 3)" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "label",
            {
              htmlFor: "book-files",
              onDragOver: (e) => {
                e.preventDefault();
                setIsDragOver(true);
              },
              onDragLeave: () => setIsDragOver(false),
              onDrop: handleDrop,
              className: [
                "group flex flex-col items-center gap-1.5 px-4 py-4 border border-dashed rounded-xl cursor-pointer transition-all duration-200",
                isDragOver ? "border-primary bg-primary/10 scale-[1.01]" : files.length >= 3 ? "border-border/40 opacity-50 cursor-not-allowed" : "border-border hover:border-primary/60 hover:bg-primary/5"
              ].join(" "),
              "data-ocid": "book.dropzone",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Upload,
                  {
                    size: 16,
                    className: `transition-colors ${isDragOver ? "text-primary" : "text-muted-foreground group-hover:text-primary"}`
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: `text-xs text-center transition-colors ${isDragOver ? "text-primary" : "text-muted-foreground group-hover:text-primary"}`,
                    children: files.length >= 3 ? "Maximum 3 files" : isDragOver ? "Drop files here" : "Click to upload or drag & drop"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    ref: fileInputRef,
                    id: "book-files",
                    type: "file",
                    multiple: true,
                    disabled: files.length >= 3,
                    onChange: (e) => addFiles(e.target.files),
                    className: "hidden",
                    "data-ocid": "book.upload_button"
                  }
                )
              ]
            }
          ),
          files.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "mt-2 space-y-1", children: files.map((f, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "li",
            {
              className: "flex items-center gap-2 px-3 py-2 bg-muted/30 border border-border rounded-lg",
              "data-ocid": `book.file.item.${i + 1}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { size: 13, className: "text-primary/70 shrink-0" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-foreground truncate flex-1 min-w-0", children: f.name }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => setFiles((prev) => prev.filter((_, j) => j !== i)),
                    "aria-label": `Remove ${f.name}`,
                    className: "p-0.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors shrink-0",
                    "data-ocid": `book.file_remove.${i + 1}`,
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 12 })
                  }
                )
              ]
            },
            `${f.name}-${f.lastModified}`
          )) }),
          uploadProgress > 0 && uploadProgress < 100 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2 h-1 bg-muted rounded-full overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "h-full bg-primary rounded-full transition-all duration-300",
              style: { width: `${uploadProgress}%` }
            }
          ) })
        ] }),
        submitError && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex items-start gap-2.5 px-3 py-3 bg-destructive/10 border border-destructive/30 rounded-lg",
            "data-ocid": "book.form_error_state",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { size: 14, className: "text-destructive shrink-0 mt-0.5" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 min-w-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-destructive", children: submitError }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => setSubmitError(null),
                  className: "text-destructive/60 hover:text-destructive transition-colors shrink-0",
                  "aria-label": "Dismiss error",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 12 })
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "submit",
            disabled: !canSubmit || createBooking.isPending,
            className: "w-full py-3.5 bg-primary text-primary-foreground text-sm font-bold rounded-xl hover:brightness-110 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2 shadow-md tracking-wide",
            "data-ocid": "book.submit_button",
            children: createBooking.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { size: 15, className: "animate-spin" }),
              " Confirming booking…"
            ] }) : "Confirm Booking"
          }
        )
      ]
    }
  );
}
function ConfirmationScreen({
  link,
  selectedSlot,
  attendee,
  onBookAnother
}) {
  const dateStr = new Date(
    Number(selectedSlot.start / 1000000n)
  ).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric"
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: "min-h-screen flex items-center justify-center px-4 py-10 bg-background",
      "data-ocid": "book.success_state",
      children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-md w-full", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-primary/25 rounded-2xl p-8 text-center shadow-xl", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-18 h-18 rounded-full border-2 border-primary bg-primary/10 flex items-center justify-center mx-auto mb-5 w-[72px] h-[72px]", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { size: 34, className: "text-primary" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold uppercase tracking-widest text-primary mb-2", children: "Confirmed" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl font-bold text-foreground mb-1", children: "You're all set!" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground mb-6", children: [
          link.name,
          " · ",
          formatDuration(link.duration)
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-muted/30 border border-border rounded-xl px-5 py-4 text-left space-y-3 mb-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { size: 14, className: "text-primary mt-0.5 shrink-0" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground", children: dateStr }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-0.5", children: [
                formatTime(selectedSlot.start),
                " –",
                " ",
                formatTime(selectedSlot.end)
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-px bg-border" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { size: 14, className: "text-primary shrink-0" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-foreground", children: [
              formatDuration(link.duration),
              " meeting"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-px bg-border" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { size: 14, className: "text-primary shrink-0" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-foreground", children: attendee.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: attendee.email })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-primary/8 border border-primary/20 rounded-xl px-4 py-3 mb-6 text-left", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-foreground/80 leading-relaxed", children: [
          "📧 A calendar invite has been sent to",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-foreground", children: attendee.email }),
          " ",
          "with a link to reschedule or cancel your appointment."
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: onBookAnother,
            className: "w-full py-3 border border-border bg-card text-foreground text-sm font-semibold rounded-xl hover:border-primary/50 hover:bg-primary/5 hover:text-primary transition-all duration-200",
            "data-ocid": "book.book_another_button",
            children: "Book another time"
          }
        )
      ] }) })
    }
  );
}
function BookPage() {
  const params = useParams({ strict: false });
  const linkId = params.linkId ?? "";
  const timezone = reactExports.useMemo(() => getUserTimezone(), []);
  const {
    data: link,
    isLoading: linkLoading,
    isError: linkError
  } = useBookingLink(linkId);
  const today = /* @__PURE__ */ new Date();
  const [calYear, setCalYear] = reactExports.useState(today.getFullYear());
  const [calMonth, setCalMonth] = reactExports.useState(today.getMonth());
  const [selectedDate, setSelectedDate] = reactExports.useState(null);
  const [selectedSlot, setSelectedSlot] = reactExports.useState(null);
  const [booked, setBooked] = reactExports.useState(false);
  const [bookedAttendee, setBookedAttendee] = reactExports.useState(null);
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
  const slotRange = selectedDate ? dateToRangeNs(
    selectedDate.getFullYear(),
    selectedDate.getMonth(),
    selectedDate.getDate()
  ) : null;
  const { data: slots, isLoading: slotsLoading } = useAvailableSlots({
    linkId,
    rangeStart: (slotRange == null ? void 0 : slotRange.rangeStart) ?? 0n,
    rangeEnd: (slotRange == null ? void 0 : slotRange.rangeEnd) ?? 0n,
    busyIntervals,
    enabled: !!link && !!selectedDate
  });
  const handleDateSelect = reactExports.useCallback((date) => {
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
  const handleBooked = (attendee) => {
    setBookedAttendee(attendee);
    setBooked(true);
  };
  const handleBookAnother = () => {
    setBooked(false);
    setBookedAttendee(null);
    setSelectedDate(null);
    setSelectedSlot(null);
  };
  const dateLabel = selectedDate ? selectedDate.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric"
  }) : "";
  if (linkLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "flex items-center justify-center min-h-screen bg-background",
        "data-ocid": "book.loading_state",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { size: 28, className: "animate-spin text-primary" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Loading booking page…" })
        ] })
      }
    );
  }
  if (linkError || !link || !link.isActive) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "min-h-screen flex items-center justify-center px-4 bg-background",
        "data-ocid": "book.error_state",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-sm w-full bg-card border border-border rounded-2xl p-8 text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 rounded-full bg-muted/40 flex items-center justify-center mx-auto mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { size: 22, className: "text-muted-foreground" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-lg font-semibold text-foreground mb-2", children: "Link not available" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground leading-relaxed", children: "This booking link is inactive or doesn't exist. Contact the host for a valid link." })
        ] })
      }
    );
  }
  if (booked && selectedSlot && bookedAttendee) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      ConfirmationScreen,
      {
        link,
        selectedSlot,
        attendee: bookedAttendee,
        onBookAnother: handleBookAnother
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background", "data-ocid": "book.page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-b border-border bg-card/60 px-4 py-5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-4xl mx-auto", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-primary/30 bg-primary/8 text-primary text-[11px] font-semibold mb-2 tracking-wide", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { size: 11 }),
        formatDuration(link.duration),
        " meeting"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl md:text-3xl font-bold text-foreground mb-1", children: link.name }),
      link.description && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground max-w-md leading-relaxed", children: link.description }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 mt-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Globe, { size: 12, className: "text-muted-foreground/60" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[11px] text-muted-foreground/70", children: [
          "All times shown in",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-muted-foreground", children: timezone })
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-4xl mx-auto px-4 py-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid md:grid-cols-[auto_1fr] gap-0 rounded-2xl border border-border bg-card overflow-hidden shadow-xl", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 md:border-r border-border bg-card md:min-w-[310px]", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground mb-4", children: "Select a Date" }),
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
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-6 border-t border-border md:border-t-0 flex flex-col", children: !selectedDate ? (
          /* Prompt to pick a date */
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "flex flex-col items-center justify-center flex-1 py-12 text-center",
              "data-ocid": "book.date_prompt",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-14 h-14 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { size: 24, className: "text-primary/60" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-base font-semibold text-foreground mb-1", children: "Pick a date to get started" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground max-w-[220px] leading-relaxed", children: "Select an available day on the calendar to view open time slots." })
              ]
            }
          )
        ) : !selectedSlot ? (
          /* Slot selection */
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground", children: "Available Times" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-base font-semibold text-foreground mt-0.5", children: dateLabel })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => setSelectedDate(null),
                  className: "text-[11px] text-muted-foreground hover:text-primary underline underline-offset-2 transition-colors",
                  "data-ocid": "book.change_date_button",
                  children: "Change date"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              TimeSlotGrid,
              {
                slots,
                isLoading: slotsLoading,
                selectedSlotStart: selectedSlot ? selectedSlot.start : null,
                onSelect: setSelectedSlot
              }
            )
          ] })
        ) : (
          /* Booking form */
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            BookingForm,
            {
              selectedSlot,
              onChangeSlot: () => setSelectedSlot(null),
              dateLabel,
              linkName: link.name,
              duration: formatDuration(link.duration),
              onBooked: handleBooked,
              linkId,
              busyIntervals
            }
          )
        ) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "flex items-center justify-center gap-2 mt-6",
          "aria-label": "Booking steps",
          children: ["Date", "Time", "Details"].map((step, i) => {
            const stepNum = i + 1;
            const current = !selectedDate ? 1 : !selectedSlot ? 2 : 3;
            const done = stepNum < current;
            const active = stepNum === current;
            return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: [
                    "w-6 h-6 rounded-full text-[11px] font-bold flex items-center justify-center transition-all duration-300",
                    done ? "bg-primary text-primary-foreground" : active ? "border-2 border-primary text-primary" : "border border-border text-muted-foreground"
                  ].join(" "),
                  children: done ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { size: 12 }) : stepNum
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: `text-xs font-medium transition-colors ${active ? "text-foreground" : done ? "text-primary" : "text-muted-foreground"}`,
                  children: step
                }
              ),
              i < 2 && /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: `h-px w-6 transition-colors ${done ? "bg-primary" : "bg-border"}`
                }
              )
            ] }, step);
          })
        }
      )
    ] })
  ] });
}
export {
  BookPage as default
};
