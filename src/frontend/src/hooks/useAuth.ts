import { useActor, useInternetIdentity } from "@caffeineai/core-infrastructure";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createActor } from "../backend";
import type { UserView } from "../backend";

export function useAuth() {
  const {
    login,
    clear,
    isAuthenticated,
    isInitializing,
    isLoggingIn,
    identity,
    loginStatus,
  } = useInternetIdentity();
  const { actor, isFetching } = useActor(createActor);
  const queryClient = useQueryClient();

  const userQuery = useQuery<UserView | null>({
    queryKey: ["myUserInfo"],
    queryFn: async () => {
      if (!actor) return null;
      const result = await actor.getMyUserInfo();
      return result ?? null;
    },
    enabled: !!actor && !isFetching && isAuthenticated,
    staleTime: 60_000,
    retry: 3,
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 8000),
  });

  const handleLogin = () => login();

  const handleLogout = () => {
    clear();
    queryClient.clear();
  };

  const user = userQuery.data ?? null;
  const isAdmin = user?.role === "admin";
  const userError = userQuery.isError ? userQuery.error : null;
  // After 3 retries exhausted, isError is true and data won't be fetched again
  const hasUserFetchFailed = userQuery.isError && !userQuery.isFetching;

  return {
    isAuthenticated,
    isInitializing,
    isLoggingIn,
    isLoading:
      isInitializing || isLoggingIn || (isAuthenticated && userQuery.isLoading),
    identity,
    loginStatus,
    login: handleLogin,
    logout: handleLogout,
    principal: identity?.getPrincipal() ?? null,
    user,
    isAdmin,
    isActiveUser: user?.status === "active",
    isUserLoading: userQuery.isLoading,
    userError,
    hasUserFetchFailed,
  };
}
