import { j as jsxRuntimeExports } from "./index-Bcm1BYaZ.js";
function LandingPage() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center min-h-[80vh] px-4 text-center relative overflow-hidden", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "absolute inset-0 pointer-events-none",
        style: {
          backgroundImage: "linear-gradient(oklch(0.195 0.02 248 / 0.35) 1px, transparent 1px), linear-gradient(90deg, oklch(0.195 0.02 248 / 0.35) 1px, transparent 1px)",
          backgroundSize: "48px 48px"
        }
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "absolute inset-0 pointer-events-none",
        style: {
          background: "radial-gradient(ellipse 80% 60% at 50% 40%, oklch(0.76 0.165 65 / 0.07) 0%, transparent 70%)"
        }
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative z-10 flex flex-col items-center gap-6 max-w-2xl", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-card text-xs font-medium text-muted-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-1.5 h-1.5 rounded-full bg-primary animate-pulse-subtle" }),
        "Google Calendar Integration"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "font-display text-5xl md:text-6xl font-semibold text-foreground leading-tight tracking-tight", children: [
        "Smart Booking, ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary", children: "Simplified" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-lg max-w-md leading-relaxed", children: "Share a booking link and let clients schedule time with you — automatically synced to your Google Calendar." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row items-center gap-3 mt-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "a",
          {
            href: "/login",
            className: "px-7 py-3 bg-primary text-primary-foreground text-sm font-semibold rounded-lg hover:opacity-90 transition-opacity shadow-lg",
            "data-ocid": "landing.host_login_button",
            children: "Get Started Free"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: () => {
              var _a;
              (_a = document.getElementById("features")) == null ? void 0 : _a.scrollIntoView({ behavior: "smooth" });
            },
            className: "px-7 py-3 border border-border text-foreground text-sm font-medium rounded-lg hover:border-primary/50 hover:text-primary transition-colors",
            "data-ocid": "landing.features_link",
            children: "See Features"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "a",
          {
            href: "/login",
            className: "px-7 py-3 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors",
            "data-ocid": "landing.signin_link",
            children: "Sign In"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "section",
      {
        id: "features",
        className: "relative z-10 w-full max-w-4xl mt-32 pb-16",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-display font-semibold text-foreground mb-2 text-center", children: "Everything you need" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm text-center mb-10", children: "Powerful scheduling tools for busy professionals" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [
            {
              icon: "📅",
              title: "Calendar Sync",
              desc: "Real-time sync with Google Calendar. No double bookings, ever."
            },
            {
              icon: "🔗",
              title: "Booking Links",
              desc: "Create shareable links with fixed durations. Control your availability."
            },
            {
              icon: "⚡",
              title: "Instant Confirm",
              desc: "Clients book and get confirmed instantly — no approval step needed."
            }
          ].map((feat) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "bg-card border border-border rounded-xl p-6 text-left hover:border-primary/30 transition-colors",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl mb-3", children: feat.icon }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-semibold text-foreground text-sm mb-1", children: feat.title }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-xs leading-relaxed", children: feat.desc })
              ]
            },
            feat.title
          )) })
        ]
      }
    )
  ] });
}
export {
  LandingPage as default
};
