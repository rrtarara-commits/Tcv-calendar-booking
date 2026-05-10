import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createActor } from "../backend";
import type { BookingView, BusyInterval, CreateBookingInput } from "../backend";

export function useBookings() {
  const { actor, isFetching } = useActor(createActor);

  return useQuery<BookingView[]>({
    queryKey: ["bookings"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listBookings();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateBooking() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      input,
      busyIntervals,
    }: {
      input: CreateBookingInput;
      busyIntervals: BusyInterval[];
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.createBooking(input, busyIntervals, "");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      queryClient.invalidateQueries({ queryKey: ["availableSlots"] });
    },
  });
}

export function useCancelBooking() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (bookingId: string) => {
      if (!actor) throw new Error("Actor not available");
      return actor.cancelBooking(bookingId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
  });
}

export function useToggleBusyOverride() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      linkId,
      slotStart,
      slotEnd,
      isBookable,
    }: {
      linkId: string;
      slotStart: bigint;
      slotEnd: bigint;
      isBookable: boolean;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.toggleBusyOverride(linkId, slotStart, slotEnd, isBookable);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["overrides", variables.linkId],
      });
    },
  });
}

export function useOverridesForLink(linkId: string | undefined) {
  const { actor, isFetching } = useActor(createActor);

  return useQuery({
    queryKey: ["overrides", linkId],
    queryFn: async () => {
      if (!actor || !linkId) return [];
      return actor.getOverridesForLink(linkId);
    },
    enabled: !!actor && !isFetching && !!linkId,
  });
}
export function useGetBookingByToken(token: string) {
  const { actor, isFetching } = useActor(createActor);

  return useQuery<BookingView | null>({
    queryKey: ["bookingByToken", token],
    queryFn: async () => {
      if (!actor || !token) return null;
      return actor.getBookingByToken(token);
    },
    enabled: !!actor && !isFetching && !!token,
  });
}

export function useRescheduleBookingByToken() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      token,
      newTimeSlotStart,
      newTimeSlotEnd,
      busyIntervals,
    }: {
      token: string;
      newTimeSlotStart: bigint;
      newTimeSlotEnd: bigint;
      busyIntervals: BusyInterval[];
    }) => {
      if (!actor) throw new Error("Actor not available");
      const result = await actor.rescheduleBookingByToken(
        token,
        newTimeSlotStart,
        newTimeSlotEnd,
        busyIntervals,
        "",
      );
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["bookingByToken", variables.token],
      });
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      queryClient.invalidateQueries({ queryKey: ["availableSlots"] });
    },
  });
}

export function useCancelBookingByToken() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (token: string) => {
      if (!actor) throw new Error("Actor not available");
      const result = await actor.cancelBookingByToken(token);
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: (_data, token) => {
      queryClient.invalidateQueries({ queryKey: ["bookingByToken", token] });
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
  });
}
