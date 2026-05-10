import { l as useActor, m as useQuery, o as createActor } from "./index-Bcm1BYaZ.js";
function useAvailableSlots({
  linkId,
  rangeStart,
  rangeEnd,
  busyIntervals,
  enabled = true
}) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: [
      "availableSlots",
      linkId,
      rangeStart.toString(),
      rangeEnd.toString(),
      busyIntervals.length
    ],
    queryFn: async () => {
      if (!actor || !linkId) return [];
      return actor.getAvailableSlots(
        linkId,
        rangeStart,
        rangeEnd,
        busyIntervals
      );
    },
    enabled: !!actor && !isFetching && !!linkId && enabled,
    staleTime: 6e4
  });
}
function useGoogleCalendarFreeBusy(calendarId, timeMin, timeMax) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["freeBusy", calendarId, timeMin, timeMax],
    queryFn: async () => {
      if (!actor || !calendarId) return "{}";
      return actor.fetchGoogleCalendarFreeBusy(calendarId, timeMin, timeMax);
    },
    enabled: !!actor && !isFetching && !!calendarId,
    staleTime: 5 * 6e4
  });
}
function useHasGoogleCalendarCredentials() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["hasCalendarCredentials"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.hasGoogleCalendarCredentials();
    },
    enabled: !!actor && !isFetching
  });
}
export {
  useGoogleCalendarFreeBusy as a,
  useAvailableSlots as b,
  useHasGoogleCalendarCredentials as u
};
