import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createActor } from "../backend";
import type { InviteInput, UserRole, UserView } from "../backend";

export function useListUsers() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<UserView[]>({
    queryKey: ["users"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listUsers();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useInviteUser() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation<string, Error, InviteInput>({
    mutationFn: async (input) => {
      if (!actor) throw new Error("Not connected");
      return actor.inviteUser(input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
}

export function useRemoveUser() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation<boolean, Error, string>({
    mutationFn: async (email) => {
      if (!actor) throw new Error("Not connected");
      return actor.removeUser(email);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
}

export function useChangeUserRole() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation<boolean, Error, { email: string; role: UserRole }>({
    mutationFn: async ({ email, role }) => {
      if (!actor) throw new Error("Not connected");
      return actor.changeUserRole(email, role);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
}

export function useIsAdmin() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<boolean>({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}
