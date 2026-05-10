import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  Calendar,
  ChevronDown,
  LayoutDashboard,
  Link2,
  LogOut,
  Menu,
  Settings,
  User,
  X,
} from "lucide-react";
import { useRef, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useAutoRefreshGoogleCalendar } from "../hooks/useGoogleCalendar";
import { cn } from "../lib/utils";

const navItems = [
  { path: "/host", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { path: "/host/links", label: "Booking Links", icon: Link2 },
  { path: "/host/calendar", label: "Calendar", icon: Calendar },
  { path: "/host/settings", label: "Settings", icon: Settings },
];

interface LayoutProps {
  children: React.ReactNode;
  showSidebar?: boolean;
}

function getInitials(name: string, email: string): string {
  if (name?.trim()) {
    const parts = name.trim().split(" ");
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return parts[0].slice(0, 2).toUpperCase();
  }
  return email.slice(0, 2).toUpperCase();
}

export function Layout({ children, showSidebar = false }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { isAuthenticated, logout, user } = useAuth();
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Globally maintain Google Calendar token freshness for authenticated users
  useAutoRefreshGoogleCalendar();

  const initials = user ? getInitials(user.name, user.email) : "";

  const handleLogout = () => {
    setDropdownOpen(false);
    logout();
    navigate({ to: "/" });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-40">
        <div className="flex items-center justify-between h-14 px-4 md:px-6 max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            {showSidebar && (
              <button
                type="button"
                className="md:hidden p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                aria-label="Toggle navigation"
                data-ocid="nav.toggle"
              >
                {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
            )}
            <Link
              to={isAuthenticated && user ? "/host" : "/"}
              className="flex items-center gap-2 font-display font-semibold text-foreground hover:opacity-80 transition-opacity"
              data-ocid="nav.logo_link"
            >
              <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center">
                <Calendar size={13} className="text-primary-foreground" />
              </div>
              <span className="text-sm tracking-tight text-foreground">
                BookSlot
              </span>
            </Link>
          </div>

          {isAuthenticated && user && showSidebar && (
            <nav className="hidden md:flex items-center gap-0.5">
              {navItems.map((item) => {
                const isActive = item.exact
                  ? currentPath === item.path
                  : currentPath.startsWith(item.path) && item.path !== "/host";
                const activeExact =
                  item.path === "/host" && currentPath === "/host";
                const isNavActive = item.exact ? activeExact : isActive;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={cn(
                      "relative flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-sm font-medium transition-colors",
                      isNavActive
                        ? "text-primary"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/40",
                    )}
                    data-ocid={`nav.${item.label.toLowerCase().replace(" ", "_")}_link`}
                  >
                    <item.icon size={14} />
                    {item.label}
                    {isNavActive && (
                      <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-primary rounded-full" />
                    )}
                  </Link>
                );
              })}
            </nav>
          )}

          <div className="flex items-center gap-2">
            {isAuthenticated && user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-muted/40 transition-colors group"
                  data-ocid="nav.user_menu_button"
                  aria-label="User menu"
                  aria-expanded={dropdownOpen}
                >
                  <div className="w-7 h-7 rounded-full bg-primary/15 border border-primary/25 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-semibold text-primary">
                      {initials}
                    </span>
                  </div>
                  <span className="hidden sm:block text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors max-w-[140px] truncate">
                    {user.email}
                  </span>
                  <ChevronDown
                    size={13}
                    className={cn(
                      "text-muted-foreground transition-transform",
                      dropdownOpen && "rotate-180",
                    )}
                  />
                </button>

                {dropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setDropdownOpen(false)}
                      onKeyDown={(e) =>
                        e.key === "Escape" && setDropdownOpen(false)
                      }
                      role="presentation"
                    />
                    <div
                      className="absolute right-0 top-full mt-1.5 w-56 bg-card border border-border rounded-xl shadow-2xl z-50 py-1.5 overflow-hidden"
                      data-ocid="nav.user_dropdown"
                    >
                      <div className="px-3.5 py-2.5 border-b border-border mb-1">
                        <p className="text-xs font-semibold text-foreground truncate">
                          {user.name || user.email}
                        </p>
                        <p className="text-xs text-muted-foreground truncate mt-0.5">
                          {user.email}
                        </p>
                        {user.role === "admin" && (
                          <span className="inline-flex items-center gap-1 mt-1.5 px-1.5 py-0.5 rounded bg-primary/15 text-primary text-xs font-medium">
                            Admin
                          </span>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setDropdownOpen(false);
                          navigate({ to: "/host/settings" });
                        }}
                        className="w-full flex items-center gap-2.5 px-3.5 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors"
                        data-ocid="nav.my_account_button"
                      >
                        <User size={14} />
                        My account
                      </button>
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-3.5 py-2 text-sm text-muted-foreground hover:text-destructive hover:bg-destructive/5 transition-colors"
                        data-ocid="nav.logout_button"
                      >
                        <LogOut size={14} />
                        Sign out
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="px-4 py-1.5 text-sm font-semibold bg-primary text-primary-foreground rounded-md hover:opacity-90 transition-opacity"
                data-ocid="nav.login_link"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Mobile sidebar overlay */}
      {showSidebar && sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-foreground/10 md:hidden"
          onClick={() => setSidebarOpen(false)}
          onKeyDown={(e) => e.key === "Escape" && setSidebarOpen(false)}
          role="presentation"
        />
      )}

      {/* Mobile sidebar */}
      {showSidebar && (
        <aside
          className={cn(
            "fixed left-0 top-14 bottom-0 z-30 w-56 bg-card border-r border-border transition-transform duration-200 md:hidden",
            sidebarOpen ? "translate-x-0" : "-translate-x-full",
          )}
        >
          <nav className="p-3 space-y-0.5">
            {navItems.map((item) => {
              const isActive =
                item.path === "/host"
                  ? currentPath === "/host"
                  : currentPath.startsWith(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    "flex items-center gap-2.5 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary/15 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/40",
                  )}
                  data-ocid={`nav.mobile_${item.label.toLowerCase().replace(" ", "_")}_link`}
                >
                  <item.icon size={16} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>
      )}

      {/* Page content */}
      <main className="flex-1 bg-background">{children}</main>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-4 px-6">
        <p className="text-xs text-muted-foreground text-center">
          &copy; {new Date().getFullYear()}. Built with love using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:opacity-80 transition-opacity"
          >
            caffeine.ai
          </a>
        </p>
      </footer>
    </div>
  );
}
