import { l as useActor, m as useQuery, n as useQueryClient, o as createActor } from "./index-Bcm1BYaZ.js";
import { u as useMutation } from "./useMutation-BjpTJhfH.js";
function useBookings() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["bookings"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listBookings();
    },
    enabled: !!actor && !isFetching
  });
}
function useCreateBooking() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      input,
      busyIntervals
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.createBooking(input, busyIntervals, "");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      queryClient.invalidateQueries({ queryKey: ["availableSlots"] });
    }
  });
}
function useCancelBooking() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (bookingId) => {
      if (!actor) throw new Error("Actor not available");
      return actor.cancelBooking(bookingId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    }
  });
}
function useToggleBusyOverride() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      linkId,
      slotStart,
      slotEnd,
      isBookable
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.toggleBusyOverride(linkId, slotStart, slotEnd, isBookable);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["overrides", variables.linkId]
      });
    }
  });
}
function useOverridesForLink(linkId) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["overrides", linkId],
    queryFn: async () => {
      if (!actor || !linkId) return [];
      return actor.getOverridesForLink(linkId);
    },
    enabled: !!actor && !isFetching && !!linkId
  });
}
function useGetBookingByToken(token) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["bookingByToken", token],
    queryFn: async () => {
      if (!actor || !token) return null;
      return actor.getBookingByToken(token);
    },
    enabled: !!actor && !isFetching && !!token
  });
}
function useRescheduleBookingByToken() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      token,
      newTimeSlotStart,
      newTimeSlotEnd,
      busyIntervals
    }) => {
      if (!actor) throw new Error("Actor not available");
      const result = await actor.rescheduleBookingByToken(
        token,
        newTimeSlotStart,
        newTimeSlotEnd,
        busyIntervals,
        ""
      );
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["bookingByToken", variables.token]
      });
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      queryClient.invalidateQueries({ queryKey: ["availableSlots"] });
    }
  });
}
function useCancelBookingByToken() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (token) => {
      if (!actor) throw new Error("Actor not available");
      const result = await actor.cancelBookingByToken(token);
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: (_data, token) => {
      queryClient.invalidateQueries({ queryKey: ["bookingByToken", token] });
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    }
  });
}
export {
  useCancelBooking as a,
  useOverridesForLink as b,
  useToggleBusyOverride as c,
  useCreateBooking as d,
  useGetBookingByToken as e,
  useCancelBookingByToken as f,
  useRescheduleBookingByToken as g,
  useBookings as u
};
