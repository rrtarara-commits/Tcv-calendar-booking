export default function LandingPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 text-center relative overflow-hidden">
      {/* Background grid lines */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(oklch(0.195 0.02 248 / 0.35) 1px, transparent 1px), linear-gradient(90deg, oklch(0.195 0.02 248 / 0.35) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      {/* Radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 40%, oklch(0.76 0.165 65 / 0.07) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 flex flex-col items-center gap-6 max-w-2xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-card text-xs font-medium text-muted-foreground">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse-subtle" />
          Google Calendar Integration
        </div>

        <h1 className="font-display text-5xl md:text-6xl font-semibold text-foreground leading-tight tracking-tight">
          Smart Booking, <span className="text-primary">Simplified</span>
        </h1>

        <p className="text-muted-foreground text-lg max-w-md leading-relaxed">
          Share a booking link and let clients schedule time with you —
          automatically synced to your Google Calendar.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-3 mt-2">
          <a
            href="/login"
            className="px-7 py-3 bg-primary text-primary-foreground text-sm font-semibold rounded-lg hover:opacity-90 transition-opacity shadow-lg"
            data-ocid="landing.host_login_button"
          >
            Get Started Free
          </a>
          <button
            type="button"
            onClick={() => {
              document
                .getElementById("features")
                ?.scrollIntoView({ behavior: "smooth" });
            }}
            className="px-7 py-3 border border-border text-foreground text-sm font-medium rounded-lg hover:border-primary/50 hover:text-primary transition-colors"
            data-ocid="landing.features_link"
          >
            See Features
          </button>
          <a
            href="/login"
            className="px-7 py-3 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            data-ocid="landing.signin_link"
          >
            Sign In
          </a>
        </div>
      </div>

      {/* Feature section */}
      <section
        id="features"
        className="relative z-10 w-full max-w-4xl mt-32 pb-16"
      >
        <h2 className="text-2xl font-display font-semibold text-foreground mb-2 text-center">
          Everything you need
        </h2>
        <p className="text-muted-foreground text-sm text-center mb-10">
          Powerful scheduling tools for busy professionals
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              icon: "📅",
              title: "Calendar Sync",
              desc: "Real-time sync with Google Calendar. No double bookings, ever.",
            },
            {
              icon: "🔗",
              title: "Booking Links",
              desc: "Create shareable links with fixed durations. Control your availability.",
            },
            {
              icon: "⚡",
              title: "Instant Confirm",
              desc: "Clients book and get confirmed instantly — no approval step needed.",
            },
          ].map((feat) => (
            <div
              key={feat.title}
              className="bg-card border border-border rounded-xl p-6 text-left hover:border-primary/30 transition-colors"
            >
              <div className="text-2xl mb-3">{feat.icon}</div>
              <h3 className="font-display font-semibold text-foreground text-sm mb-1">
                {feat.title}
              </h3>
              <p className="text-muted-foreground text-xs leading-relaxed">
                {feat.desc}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
