import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createActor } from "../backend";
import type { BookingLinkInput, BookingLinkView } from "../backend";

export function useBookingLinks() {
  const { actor, isFetching } = useActor(createActor);

  return useQuery<BookingLinkView[]>({
    queryKey: ["bookingLinks"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listBookingLinks();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useBookingLink(linkId: string | undefined) {
  const { actor, isFetching } = useActor(createActor);

  return useQuery<BookingLinkView | null>({
    queryKey: ["bookingLink", linkId],
    queryFn: async () => {
      if (!actor || !linkId) return null;
      return actor.getBookingLink(linkId);
    },
    enabled: !!actor && !isFetching && !!linkId,
  });
}

export function useCreateBookingLink() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: BookingLinkInput) => {
      if (!actor) throw new Error("Actor not available");
      return actor.createBookingLink(input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookingLinks"] });
    },
  });
}

export function useUpdateBookingLink() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      linkId,
      input,
    }: { linkId: string; input: BookingLinkInput }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.updateBookingLink(linkId, input);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["bookingLinks"] });
      queryClient.invalidateQueries({
        queryKey: ["bookingLink", variables.linkId],
      });
    },
  });
}

export function useDeleteBookingLink() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (linkId: string) => {
      if (!actor) throw new Error("Actor not available");
      return actor.deleteBookingLink(linkId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookingLinks"] });
    },
  });
}

export function useSetBookingLinkActive() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      linkId,
      isActive,
    }: { linkId: string; isActive: boolean }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.setBookingLinkActive(linkId, isActive);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookingLinks"] });
    },
  });
}
