import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { Suspense, lazy } from "react";
import { Layout } from "./components/Layout";
import { ProtectedRoute } from "./components/ProtectedRoute";
import AcceptInvitePage from "./pages/AcceptInvitePage";
import GoogleCallbackPage from "./pages/GoogleCallbackPage";
import LoginPage from "./pages/LoginPage";

const HostDashboard = lazy(() => import("./pages/HostDashboard"));
const HostLinks = lazy(() => import("./pages/HostLinks"));
const HostCalendar = lazy(() => import("./pages/HostCalendar"));
const HostSettings = lazy(() => import("./pages/HostSettings"));
const BookPage = lazy(() => import("./pages/BookPage"));
const LandingPage = lazy(() => import("./pages/LandingPage"));
const ManageAppointmentPage = lazy(
  () => import("./pages/ManageAppointmentPage"),
);

function PageLoader() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <Loader2 size={24} className="animate-spin text-primary" />
    </div>
  );
}

const rootRoute = createRootRoute({
  component: () => <Outlet />,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: () => (
    <Layout>
      <Suspense fallback={<PageLoader />}>
        <LandingPage />
      </Suspense>
    </Layout>
  ),
});

const hostRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/host",
  component: () => (
    <Layout showSidebar>
      <ProtectedRoute>
        <Suspense fallback={<PageLoader />}>
          <HostDashboard />
        </Suspense>
      </ProtectedRoute>
    </Layout>
  ),
});

const hostLinksRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/host/links",
  component: () => (
    <Layout showSidebar>
      <ProtectedRoute>
        <Suspense fallback={<PageLoader />}>
          <HostLinks />
        </Suspense>
      </ProtectedRoute>
    </Layout>
  ),
});

const hostCalendarRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/host/calendar",
  component: () => (
    <Layout showSidebar>
      <ProtectedRoute>
        <Suspense fallback={<PageLoader />}>
          <HostCalendar />
        </Suspense>
      </ProtectedRoute>
    </Layout>
  ),
});

const hostCalendarLinkRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/host/calendar/$linkId",
  component: () => (
    <Layout showSidebar>
      <ProtectedRoute>
        <Suspense fallback={<PageLoader />}>
          <HostCalendar />
        </Suspense>
      </ProtectedRoute>
    </Layout>
  ),
});

const hostSettingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/host/settings",
  component: () => (
    <Layout showSidebar>
      <ProtectedRoute>
        <Suspense fallback={<PageLoader />}>
          <HostSettings />
        </Suspense>
      </ProtectedRoute>
    </Layout>
  ),
});

const bookRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/book/$linkId",
  component: () => (
    <Layout>
      <Suspense fallback={<PageLoader />}>
        <BookPage />
      </Suspense>
    </Layout>
  ),
});

const manageRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/manage/$managementToken",
  component: () => (
    <Layout>
      <Suspense fallback={<PageLoader />}>
        <ManageAppointmentPage />
      </Suspense>
    </Layout>
  ),
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <LoginPage />
    </Suspense>
  ),
});

const acceptInviteRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/accept-invite/$token",
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <AcceptInvitePage />
    </Suspense>
  ),
});

const googleCallbackRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/host/google-callback",
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <GoogleCallbackPage />
    </Suspense>
  ),
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  loginRoute,
  acceptInviteRoute,
  hostRoute,
  hostLinksRoute,
  hostCalendarRoute,
  hostCalendarLinkRoute,
  hostSettingsRoute,
  googleCallbackRoute,
  bookRoute,
  manageRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
