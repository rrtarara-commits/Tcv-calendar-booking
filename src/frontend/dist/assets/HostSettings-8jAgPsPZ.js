import { c as createLucideIcon, l as useActor, m as useQuery, n as useQueryClient, o as createActor, p as useAuth, q as useGoogleCalendarCredentialStatus, s as useDisconnectGoogleCalendar, t as useRefreshGoogleCalendarTokens, v as useAutoRefreshGoogleCalendar, r as reactExports, w as getGoogleClientId, j as jsxRuntimeExports, a as cn, B as Button, d as LoaderCircle, x as CircleCheck, C as Calendar, L as Link2, y as setGoogleClientId, z as initiateGoogleOAuth, U as UserStatus, A as UserRole } from "./index-Bcm1BYaZ.js";
import { L as Label, I as Input, l as Dialog, m as DialogContent, n as DialogHeader, o as DialogTitle } from "./label-DTuzpOoc.js";
import { u as useHasGoogleCalendarCredentials } from "./useAvailableSlots-CgEvFERY.js";
import { u as useMutation } from "./useMutation-BjpTJhfH.js";
import { R as RefreshCw } from "./refresh-cw-9yGrPfkU.js";
import { T as Trash2 } from "./trash-2-sp5uBwt4.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$8 = [
  ["rect", { width: "8", height: "4", x: "8", y: "2", rx: "1", ry: "1", key: "tgr4d6" }],
  ["path", { d: "M8 4H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2", key: "4jdomd" }],
  ["path", { d: "M16 4h2a2 2 0 0 1 2 2v4", key: "3hqy98" }],
  ["path", { d: "M21 14H11", key: "1bme5i" }],
  ["path", { d: "m15 10-4 4 4 4", key: "5dvupr" }]
];
const ClipboardCopy = createLucideIcon("clipboard-copy", __iconNode$8);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$7 = [
  [
    "path",
    {
      d: "M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49",
      key: "ct8e1f"
    }
  ],
  ["path", { d: "M14.084 14.158a3 3 0 0 1-4.242-4.242", key: "151rxh" }],
  [
    "path",
    {
      d: "M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143",
      key: "13bj9a"
    }
  ],
  ["path", { d: "m2 2 20 20", key: "1ooewy" }]
];
const EyeOff = createLucideIcon("eye-off", __iconNode$7);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$6 = [
  [
    "path",
    {
      d: "M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0",
      key: "1nclc0"
    }
  ],
  ["circle", { cx: "12", cy: "12", r: "3", key: "1v7zrd" }]
];
const Eye = createLucideIcon("eye", __iconNode$6);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$5 = [
  [
    "path",
    {
      d: "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",
      key: "oel41y"
    }
  ],
  ["path", { d: "m9 12 2 2 4-4", key: "dzmm74" }]
];
const ShieldCheck = createLucideIcon("shield-check", __iconNode$5);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$4 = [
  [
    "path",
    {
      d: "m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3",
      key: "wmoenq"
    }
  ],
  ["path", { d: "M12 9v4", key: "juzpu7" }],
  ["path", { d: "M12 17h.01", key: "p32p05" }]
];
const TriangleAlert = createLucideIcon("triangle-alert", __iconNode$4);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$3 = [
  ["path", { d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2", key: "1yyitq" }],
  ["circle", { cx: "9", cy: "7", r: "4", key: "nufk8" }],
  ["line", { x1: "19", x2: "19", y1: "8", y2: "14", key: "1bvyxn" }],
  ["line", { x1: "22", x2: "16", y1: "11", y2: "11", key: "1shjgl" }]
];
const UserPlus = createLucideIcon("user-plus", __iconNode$3);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  ["path", { d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2", key: "1yyitq" }],
  ["path", { d: "M16 3.128a4 4 0 0 1 0 7.744", key: "16gr8j" }],
  ["path", { d: "M22 21v-2a4 4 0 0 0-3-3.87", key: "kshegd" }],
  ["circle", { cx: "9", cy: "7", r: "4", key: "nufk8" }]
];
const Users = createLucideIcon("users", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["path", { d: "M12 20h.01", key: "zekei9" }],
  ["path", { d: "M8.5 16.429a5 5 0 0 1 7 0", key: "1bycff" }],
  ["path", { d: "M5 12.859a10 10 0 0 1 5.17-2.69", key: "1dl1wf" }],
  ["path", { d: "M19 12.859a10 10 0 0 0-2.007-1.523", key: "4k23kn" }],
  ["path", { d: "M2 8.82a15 15 0 0 1 4.177-2.643", key: "1grhjp" }],
  ["path", { d: "M22 8.82a15 15 0 0 0-11.288-3.764", key: "z3jwby" }],
  ["path", { d: "m2 2 20 20", key: "1ooewy" }]
];
const WifiOff = createLucideIcon("wifi-off", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M12 20h.01", key: "zekei9" }],
  ["path", { d: "M2 8.82a15 15 0 0 1 20 0", key: "dnpr2z" }],
  ["path", { d: "M5 12.859a10 10 0 0 1 14 0", key: "1x1e6c" }],
  ["path", { d: "M8.5 16.429a5 5 0 0 1 7 0", key: "1bycff" }]
];
const Wifi = createLucideIcon("wifi", __iconNode);
function useListUsers() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listUsers();
    },
    enabled: !!actor && !isFetching
  });
}
function useInviteUser() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input) => {
      if (!actor) throw new Error("Not connected");
      return actor.inviteUser(input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    }
  });
}
function useRemoveUser() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (email) => {
      if (!actor) throw new Error("Not connected");
      return actor.removeUser(email);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    }
  });
}
function useIsAdmin() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching
  });
}
function SectionCard({
  children,
  className
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: cn(
        "bg-card border border-border rounded-xl p-5 mb-5",
        className
      ),
      children
    }
  );
}
function RoleBadge({ role }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "span",
    {
      className: cn(
        "inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide",
        role === UserRole.admin ? "bg-primary/20 text-primary border border-primary/30" : "bg-muted/60 text-muted-foreground border border-border"
      ),
      children: role === UserRole.admin ? "Admin" : "User"
    }
  );
}
function StatusBadge({ status }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "span",
    {
      className: cn(
        "inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide",
        status === UserStatus.active ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/25" : "bg-amber-500/15 text-amber-400 border border-amber-500/25"
      ),
      children: status === UserStatus.active ? "Active" : "Invited"
    }
  );
}
function InviteModal({
  open,
  onClose
}) {
  const [form, setForm] = reactExports.useState({
    email: "",
    name: "",
    role: UserRole.user
  });
  const [inviteToken, setInviteToken] = reactExports.useState(null);
  const [copied, setCopied] = reactExports.useState(false);
  const inviteUser = useInviteUser();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = await inviteUser.mutateAsync({
        email: form.email,
        name: form.name,
        role: form.role
      });
      setInviteToken(token);
    } catch (_err) {
    }
  };
  const inviteUrl = inviteToken ? `${window.location.origin}/accept-invite/${inviteToken}` : null;
  const handleCopy = () => {
    if (!inviteUrl) return;
    navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };
  const handleClose = () => {
    setForm({ email: "", name: "", role: UserRole.user });
    setInviteToken(null);
    setCopied(false);
    inviteUser.reset();
    onClose();
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange: (v) => !v && handleClose(), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    DialogContent,
    {
      className: "bg-card border-border max-w-md",
      "data-ocid": "team.invite_dialog",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "text-foreground font-display text-base", children: "Invite Team Member" }) }),
        !inviteToken ? /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "space-y-4 pt-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground mb-1.5 block", children: "Full Name" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                required: true,
                value: form.name,
                onChange: (e) => setForm({ ...form, name: e.target.value }),
                placeholder: "Jane Smith",
                className: "text-sm bg-input border-border focus-visible:ring-primary/50 text-foreground placeholder:text-muted-foreground",
                "data-ocid": "team.invite_name_input"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground mb-1.5 block", children: "Email Address" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                required: true,
                type: "email",
                value: form.email,
                onChange: (e) => setForm({ ...form, email: e.target.value }),
                placeholder: "jane@company.com",
                className: "text-sm bg-input border-border focus-visible:ring-primary/50 text-foreground placeholder:text-muted-foreground",
                "data-ocid": "team.invite_email_input"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground mb-1.5 block", children: "Role" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2", "data-ocid": "team.invite_role_select", children: [UserRole.user, UserRole.admin].map((r) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => setForm({ ...form, role: r }),
                className: cn(
                  "flex-1 py-1.5 rounded-md text-sm font-medium border transition-colors",
                  form.role === r ? "bg-primary/15 text-primary border-primary/40" : "bg-muted/30 text-muted-foreground border-border hover:border-primary/30"
                ),
                children: r === UserRole.admin ? "Admin" : "User"
              },
              r
            )) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-muted-foreground mt-1.5", children: form.role === UserRole.admin ? "Full access including user management." : "Can view bookings and manage booking links." })
          ] }),
          inviteUser.error && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "p",
            {
              className: "text-xs text-destructive bg-destructive/10 border border-destructive/25 rounded-lg px-3 py-2",
              "data-ocid": "team.invite_error_state",
              children: inviteUser.error.message
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 pt-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                type: "submit",
                disabled: inviteUser.isPending,
                size: "sm",
                className: "flex-1 bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-40",
                "data-ocid": "team.invite_submit_button",
                children: [
                  inviteUser.isPending && /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { size: 13, className: "animate-spin mr-1.5" }),
                  "Send Invite"
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                type: "button",
                variant: "outline",
                size: "sm",
                onClick: handleClose,
                className: "border-border text-muted-foreground hover:text-foreground",
                "data-ocid": "team.invite_cancel_button",
                children: "Cancel"
              }
            )
          ] })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 pt-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-emerald-400", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { size: 16 }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium", children: "Invite created!" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground mb-1.5 block", children: "Share this invite link" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  readOnly: true,
                  value: inviteUrl ?? "",
                  className: "text-xs bg-muted/30 border-border text-foreground/80 font-mono"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  type: "button",
                  size: "sm",
                  onClick: handleCopy,
                  className: "shrink-0 bg-primary text-primary-foreground hover:bg-primary/90",
                  "data-ocid": "team.copy_invite_link_button",
                  children: copied ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { size: 13 }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ClipboardCopy, { size: 13 })
                }
              )
            ] }),
            copied && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "p",
              {
                className: "text-[11px] text-primary mt-1",
                "data-ocid": "team.invite_success_state",
                children: "Copied to clipboard!"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              type: "button",
              size: "sm",
              onClick: handleClose,
              variant: "outline",
              className: "w-full border-border text-muted-foreground hover:text-foreground",
              "data-ocid": "team.invite_close_button",
              children: "Done"
            }
          )
        ] })
      ]
    }
  ) });
}
function TeamSection() {
  const { data: users, isLoading } = useListUsers();
  const removeUser = useRemoveUser();
  const reinvite = useInviteUser();
  const [showInvite, setShowInvite] = reactExports.useState(false);
  const [reinvitedEmail, setReinvitedEmail] = reactExports.useState(null);
  const [confirmRemove, setConfirmRemove] = reactExports.useState(null);
  const handleResendInvite = async (user) => {
    try {
      await reinvite.mutateAsync({
        email: user.email,
        name: user.name,
        role: user.role
      });
      setReinvitedEmail(user.email);
      setTimeout(() => setReinvitedEmail(null), 2500);
    } catch (_err) {
    }
  };
  const handleRemove = async (email) => {
    if (confirmRemove !== email) {
      setConfirmRemove(email);
      return;
    }
    await removeUser.mutateAsync(email);
    setConfirmRemove(null);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-ocid": "team.section", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-9 h-9 rounded-lg bg-primary/15 flex items-center justify-center shrink-0 ring-1 ring-primary/20", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { size: 15, className: "text-primary" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-semibold text-foreground", children: "Team Members" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Manage who can access BookSlot." })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          type: "button",
          size: "sm",
          onClick: () => setShowInvite(true),
          className: "bg-primary text-primary-foreground hover:bg-primary/90 gap-1.5",
          "data-ocid": "team.invite_open_modal_button",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(UserPlus, { size: 13 }),
            "Invite"
          ]
        }
      )
    ] }),
    isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "flex items-center justify-center py-10",
        "data-ocid": "team.loading_state",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { size: 20, className: "animate-spin text-primary" })
      }
    ) : !users || users.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex flex-col items-center gap-2 py-10 text-center",
        "data-ocid": "team.empty_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { size: 28, className: "text-muted-foreground/40" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "No team members yet." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground/70", children: "Invite someone to get started." })
        ]
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: users.map((user, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex items-center gap-3 px-3 py-2.5 rounded-lg bg-muted/20 border border-border hover:bg-muted/30 transition-colors",
        "data-ocid": `team.item.${idx + 1}`,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded-full bg-primary/15 border border-primary/20 flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold text-primary", children: user.name.charAt(0).toUpperCase() }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground truncate", children: user.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground truncate", children: user.email })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 shrink-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(RoleBadge, { role: user.role }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status: user.status })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 shrink-0", children: [
            user.status === UserStatus.invited && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                title: reinvitedEmail === user.email ? "Invite resent!" : "Resend invite",
                onClick: () => handleResendInvite(user),
                disabled: reinvite.isPending,
                className: cn(
                  "flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium transition-colors",
                  reinvitedEmail === user.email ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-primary hover:bg-primary/10"
                ),
                "data-ocid": `team.resend_invite_button.${idx + 1}`,
                children: [
                  reinvitedEmail === user.email ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { size: 12, className: "text-primary" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(UserPlus, { size: 12 }),
                  reinvitedEmail === user.email ? "Sent" : "Resend"
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                title: confirmRemove === user.email ? "Confirm remove" : "Remove user",
                onClick: () => handleRemove(user.email),
                disabled: removeUser.isPending,
                className: cn(
                  "p-1.5 rounded-md transition-colors",
                  confirmRemove === user.email ? "text-destructive bg-destructive/15 hover:bg-destructive/25" : "text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                ),
                "data-ocid": `team.delete_button.${idx + 1}`,
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { size: 13 })
              }
            )
          ] })
        ]
      },
      user.email
    )) }),
    confirmRemove && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 flex items-center gap-2 px-3 py-2 rounded-lg bg-destructive/10 border border-destructive/25", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-destructive flex-1", children: [
        "Remove ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: confirmRemove }),
        "? This cannot be undone."
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          onClick: () => setConfirmRemove(null),
          className: "text-xs text-muted-foreground hover:text-foreground px-2",
          "data-ocid": "team.remove_cancel_button",
          children: "Cancel"
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(InviteModal, { open: showInvite, onClose: () => setShowInvite(false) })
  ] });
}
function HostSettings() {
  const { actor } = useActor(createActor);
  const { principal } = useAuth();
  const {
    data: hasCredentials,
    isLoading: credLoading,
    refetch
  } = useHasGoogleCalendarCredentials();
  const { data: credStatus } = useGoogleCalendarCredentialStatus();
  const { data: isAdmin } = useIsAdmin();
  const { disconnect, isDisconnecting } = useDisconnectGoogleCalendar();
  const { refresh: manualRefresh, isRefreshing } = useRefreshGoogleCalendarTokens();
  useAutoRefreshGoogleCalendar();
  const [activeTab, setActiveTab] = reactExports.useState("general");
  const [clientId, setClientIdState] = reactExports.useState(() => getGoogleClientId());
  const [clientIdSaved, setClientIdSaved] = reactExports.useState(false);
  const [showClientId, setShowClientId] = reactExports.useState(false);
  const [initiating, setInitiating] = reactExports.useState(false);
  const [oauthError, setOauthError] = reactExports.useState(null);
  const [calConnectedFlash, setCalConnectedFlash] = reactExports.useState(false);
  reactExports.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("cal") === "connected") {
      setCalConnectedFlash(true);
      refetch();
      window.history.replaceState({}, "", "/host/settings");
      setTimeout(() => setCalConnectedFlash(false), 5e3);
    }
  }, [refetch]);
  const handleSaveClientId = () => {
    setGoogleClientId(clientId.trim());
    setClientIdSaved(true);
    setTimeout(() => setClientIdSaved(false), 2500);
  };
  const handleConnect = async () => {
    const id = clientId.trim();
    if (!id) {
      setOauthError("Please enter and save your Google OAuth Client ID first.");
      return;
    }
    setInitiating(true);
    setOauthError(null);
    try {
      await initiateGoogleOAuth(id);
    } catch (err) {
      setOauthError(
        err instanceof Error ? err.message : "Failed to start OAuth flow."
      );
      setInitiating(false);
    }
  };
  const handleDisconnect = async () => {
    await disconnect();
    await refetch();
  };
  const handleManualRefresh = async () => {
    await manualRefresh();
    await refetch();
  };
  const [settingPrincipal, setSettingPrincipal] = reactExports.useState(false);
  const [principalSaved, setPrincipalSaved] = reactExports.useState(false);
  const handleSetPrincipal = async () => {
    if (!actor || !principal) return;
    setSettingPrincipal(true);
    try {
      await actor.setHostPrincipal(principal);
      setPrincipalSaved(true);
      setTimeout(() => setPrincipalSaved(false), 4e3);
    } finally {
      setSettingPrincipal(false);
    }
  };
  const expiryLabel = (() => {
    if (!(credStatus == null ? void 0 : credStatus.expiresAt)) return null;
    const expiresAtMs = Number(credStatus.expiresAt / 1000000n);
    const diffMs = expiresAtMs - Date.now();
    if (diffMs <= 0) return "Expired";
    const diffMin = Math.floor(diffMs / 6e4);
    if (diffMin < 60)
      return `Expires in ${diffMin} minute${diffMin !== 1 ? "s" : ""}`;
    const diffHr = Math.floor(diffMin / 60);
    if (diffHr < 24)
      return `Expires in ${diffHr} hour${diffHr !== 1 ? "s" : ""}`;
    const at = new Date(expiresAtMs);
    return `Expires ${at.toLocaleDateString(void 0, { month: "short", day: "numeric" })} at ${at.toLocaleTimeString(void 0, { hour: "numeric", minute: "2-digit" })}`;
  })();
  const isTokenExpired = (credStatus == null ? void 0 : credStatus.isExpired) ?? false;
  const canRefresh = !!(getGoogleClientId() && localStorage.getItem("bookslot_google_refresh_token"));
  const tabs = [
    { id: "general", label: "General" },
    { id: "team", label: "Team", adminOnly: true }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "max-w-2xl mx-auto px-4 md:px-6 py-8",
      "data-ocid": "settings.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl font-bold text-foreground tracking-tight", children: "Settings" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-1", children: "Configure your host identity, calendar integration, and team." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "flex gap-0.5 p-1 bg-muted/30 border border-border rounded-lg mb-6",
            "data-ocid": "settings.tab",
            children: tabs.filter((t) => !t.adminOnly || isAdmin).map((tab) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => setActiveTab(tab.id),
                className: cn(
                  "flex-1 py-1.5 text-sm font-medium rounded-md transition-colors",
                  activeTab === tab.id ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                ),
                "data-ocid": `settings.${tab.id}_tab`,
                children: tab.label
              },
              tab.id
            ))
          }
        ),
        activeTab === "general" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(SectionCard, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-9 h-9 rounded-lg bg-primary/15 flex items-center justify-center shrink-0 ring-1 ring-primary/20", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { size: 15, className: "text-primary" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-semibold text-foreground", children: "Host Identity" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Register your Internet Identity principal as the host." })
              ] })
            ] }),
            principal && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-muted/30 border border-border rounded-lg px-3 py-2.5 mb-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-1", children: "Your Principal" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "p",
                {
                  className: "text-xs font-mono text-foreground/90 break-all",
                  "data-ocid": "settings.principal_display",
                  children: principal.toText()
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  type: "button",
                  onClick: handleSetPrincipal,
                  disabled: settingPrincipal || !principal,
                  size: "sm",
                  className: "bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-40",
                  "data-ocid": "settings.set_principal_button",
                  children: [
                    settingPrincipal && /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { size: 13, className: "animate-spin mr-1.5" }),
                    "Set as Host Principal"
                  ]
                }
              ),
              principalSaved && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "span",
                {
                  className: "flex items-center gap-1 text-xs text-primary font-medium",
                  "data-ocid": "settings.principal_success_state",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { size: 13 }),
                    "Saved!"
                  ]
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(SectionCard, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-3 mb-5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-9 h-9 rounded-lg bg-primary/15 flex items-center justify-center shrink-0 ring-1 ring-primary/20", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { size: 15, className: "text-primary" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-semibold text-foreground", children: "Google Calendar" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Connect your calendar so clients see your real availability." })
                ] })
              ] }),
              !credLoading && /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: cn(
                    "text-[11px] font-semibold px-2.5 py-1 rounded-full border shrink-0 flex items-center gap-1.5",
                    hasCredentials ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/25" : "bg-muted/50 text-muted-foreground border-border"
                  ),
                  children: hasCredentials ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Wifi, { size: 10 }),
                    " Connected"
                  ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(WifiOff, { size: 10 }),
                    " Not connected"
                  ] })
                }
              )
            ] }),
            !credLoading && isTokenExpired && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "flex items-start gap-3 px-3 py-3 rounded-lg bg-amber-500/10 border border-amber-500/30 mb-4",
                "data-ocid": "settings.cal_expired_warning",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    TriangleAlert,
                    {
                      size: 14,
                      className: "text-amber-400 shrink-0 mt-0.5"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-amber-400", children: "Google Calendar connection has expired" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-amber-400/80 mt-0.5", children: "Click Reconnect to restore availability syncing." })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Button,
                    {
                      type: "button",
                      size: "sm",
                      onClick: handleConnect,
                      disabled: initiating,
                      className: "shrink-0 bg-amber-500/20 text-amber-400 border border-amber-500/30 hover:bg-amber-500/30 disabled:opacity-40 text-xs",
                      "data-ocid": "settings.reconnect_expired_button",
                      children: initiating ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { size: 11, className: "animate-spin" }) : "Reconnect"
                    }
                  )
                ]
              }
            ),
            calConnectedFlash && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "flex items-center gap-2 px-3 py-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/25 mb-4",
                "data-ocid": "settings.cal_connected_success_state",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { size: 14, className: "text-emerald-400 shrink-0" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-emerald-400 font-medium", children: "Google Calendar connected successfully!" })
                ]
              }
            ),
            !credLoading && hasCredentials ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 px-3 py-3 rounded-lg bg-emerald-500/8 border border-emerald-500/20", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded-full bg-emerald-500/15 flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { size: 15, className: "text-emerald-400" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground", children: "Calendar connected" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: expiryLabel ?? "Your availability is synced with Google Calendar." })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                canRefresh && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Button,
                  {
                    type: "button",
                    variant: "outline",
                    size: "sm",
                    onClick: handleManualRefresh,
                    disabled: isRefreshing,
                    className: "border-border text-muted-foreground hover:text-foreground hover:border-primary/40 disabled:opacity-40 gap-1.5",
                    "data-ocid": "settings.refresh_connection_button",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        RefreshCw,
                        {
                          size: 12,
                          className: isRefreshing ? "animate-spin" : ""
                        }
                      ),
                      isRefreshing ? "Refreshing…" : "Refresh connection"
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Button,
                  {
                    type: "button",
                    variant: "outline",
                    size: "sm",
                    onClick: handleDisconnect,
                    disabled: isDisconnecting,
                    className: "border-destructive/40 text-destructive hover:bg-destructive/10 hover:border-destructive/60 disabled:opacity-40",
                    "data-ocid": "settings.disconnect_calendar_button",
                    children: [
                      isDisconnecting && /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { size: 12, className: "animate-spin mr-1.5" }),
                      "Disconnect Calendar"
                    ]
                  }
                )
              ] })
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Label,
                  {
                    htmlFor: "google-client-id",
                    className: "text-xs mb-1.5 block text-muted-foreground",
                    children: [
                      "Google OAuth Client ID",
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-1 text-muted-foreground/50 font-normal", children: "(from Google Cloud Console)" })
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Input,
                      {
                        id: "google-client-id",
                        type: showClientId ? "text" : "password",
                        value: clientId,
                        onChange: (e) => setClientIdState(e.target.value),
                        placeholder: "123456789-xxxx.apps.googleusercontent.com",
                        className: "text-sm bg-input border-border focus-visible:ring-primary/50 text-foreground placeholder:text-muted-foreground pr-9",
                        "data-ocid": "settings.google_client_id_input"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        type: "button",
                        onClick: () => setShowClientId((v) => !v),
                        className: "absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors",
                        "aria-label": showClientId ? "Hide client ID" : "Show client ID",
                        children: showClientId ? /* @__PURE__ */ jsxRuntimeExports.jsx(EyeOff, { size: 13 }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { size: 13 })
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Button,
                    {
                      type: "button",
                      size: "sm",
                      onClick: handleSaveClientId,
                      disabled: !clientId.trim(),
                      className: "shrink-0 bg-muted/50 text-foreground hover:bg-muted/80 border border-border disabled:opacity-40",
                      "data-ocid": "settings.save_client_id_button",
                      children: clientIdSaved ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { size: 13, className: "text-primary" }) : "Save"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[11px] text-muted-foreground mt-1.5 flex items-center gap-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Link2, { size: 10, className: "shrink-0" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "a",
                    {
                      href: "https://console.cloud.google.com/apis/credentials",
                      target: "_blank",
                      rel: "noopener noreferrer",
                      className: "text-primary hover:text-primary/80 transition-colors",
                      children: "Create OAuth 2.0 credentials"
                    }
                  ),
                  " ",
                  "in Google Cloud Console. Set the redirect URI to:",
                  " ",
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("code", { className: "text-foreground/70 font-mono text-[10px]", children: [
                    window.location.origin,
                    "/host/google-callback"
                  ] })
                ] })
              ] }),
              oauthError && /* @__PURE__ */ jsxRuntimeExports.jsx(
                "p",
                {
                  className: "text-xs text-destructive bg-destructive/10 border border-destructive/25 rounded-lg px-3 py-2.5",
                  "data-ocid": "settings.oauth_error_state",
                  children: oauthError
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  type: "button",
                  size: "sm",
                  onClick: handleConnect,
                  disabled: initiating || !clientId.trim(),
                  className: "bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-40 gap-1.5",
                  "data-ocid": "settings.connect_calendar_button",
                  children: [
                    initiating ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { size: 13, className: "animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { size: 13 }),
                    "Connect Google Calendar"
                  ]
                }
              )
            ] })
          ] })
        ] }),
        activeTab === "team" && (isAdmin ? /* @__PURE__ */ jsxRuntimeExports.jsx(SectionCard, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(TeamSection, {}) }) : /* @__PURE__ */ jsxRuntimeExports.jsx(SectionCard, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex flex-col items-center gap-2 py-8 text-center",
            "data-ocid": "team.no_access_state",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { size: 28, className: "text-muted-foreground/40" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Only admins can manage team members." })
            ]
          }
        ) }))
      ]
    }
  );
}
export {
  HostSettings as default
};
