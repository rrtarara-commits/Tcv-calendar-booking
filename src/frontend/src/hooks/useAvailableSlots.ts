import { useActor } from "@caffeineai/core-infrastructure";
import { useQuery } from "@tanstack/react-query";
import { createActor } from "../backend";
import type { BusyInterval, TimeSlot } from "../backend";

interface UseAvailableSlotsParams {
  linkId: string | undefined;
  rangeStart: bigint;
  rangeEnd: bigint;
  busyIntervals: BusyInterval[];
  enabled?: boolean;
}

export function useAvailableSlots({
  linkId,
  rangeStart,
  rangeEnd,
  busyIntervals,
  enabled = true,
}: UseAvailableSlotsParams) {
  const { actor, isFetching } = useActor(createActor);

  return useQuery<TimeSlot[]>({
    queryKey: [
      "availableSlots",
      linkId,
      rangeStart.toString(),
      rangeEnd.toString(),
      busyIntervals.length,
    ],
    queryFn: async () => {
      if (!actor || !linkId) return [];
      return actor.getAvailableSlots(
        linkId,
        rangeStart,
        rangeEnd,
        busyIntervals,
      );
    },
    enabled: !!actor && !isFetching && !!linkId && enabled,
    staleTime: 60_000,
  });
}

export function useGoogleCalendarFreeBusy(
  linkId: string | undefined,
  timeMin: string,
  timeMax: string,
) {
  const { actor, isFetching } = useActor(createActor);

  return useQuery<string>({
    queryKey: ["freeBusy", linkId, timeMin, timeMax],
    queryFn: async () => {
      if (!actor || !linkId) return "{}";
      return actor.fetchGoogleCalendarFreeBusyForLink(linkId, timeMin, timeMax);
    },
    enabled: !!actor && !isFetching && !!linkId && !!timeMin && !!timeMax,
    staleTime: 5 * 60_000,
  });
}

export function useHasGoogleCalendarCredentials() {
  const { actor, isFetching } = useActor(createActor);

  return useQuery<boolean>({
    queryKey: ["hasCalendarCredentials"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.hasGoogleCalendarCredentials();
    },
    enabled: !!actor && !isFetching,
  });
}
