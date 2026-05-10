import { l as useActor, m as useQuery, n as useQueryClient, o as createActor } from "./index-Bcm1BYaZ.js";
import { u as useMutation } from "./useMutation-BjpTJhfH.js";
function useBookingLinks() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["bookingLinks"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listBookingLinks();
    },
    enabled: !!actor && !isFetching
  });
}
function useBookingLink(linkId) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["bookingLink", linkId],
    queryFn: async () => {
      if (!actor || !linkId) return null;
      return actor.getBookingLink(linkId);
    },
    enabled: !!actor && !isFetching && !!linkId
  });
}
function useCreateBookingLink() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input) => {
      if (!actor) throw new Error("Actor not available");
      return actor.createBookingLink(input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookingLinks"] });
    }
  });
}
function useUpdateBookingLink() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      linkId,
      input
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.updateBookingLink(linkId, input);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["bookingLinks"] });
      queryClient.invalidateQueries({
        queryKey: ["bookingLink", variables.linkId]
      });
    }
  });
}
function useDeleteBookingLink() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (linkId) => {
      if (!actor) throw new Error("Actor not available");
      return actor.deleteBookingLink(linkId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookingLinks"] });
    }
  });
}
function useSetBookingLinkActive() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      linkId,
      isActive
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.setBookingLinkActive(linkId, isActive);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookingLinks"] });
    }
  });
}
export {
  useSetBookingLinkActive as a,
  useCreateBookingLink as b,
  useUpdateBookingLink as c,
  useDeleteBookingLink as d,
  useBookingLink as e,
  useBookingLinks as u
};
