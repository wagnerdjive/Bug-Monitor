import { useQuery } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";

interface UseProjectEventsOptions {
  projectId: number;
  limit?: number;
  offset?: number;
}

export function useProjectEvents({ projectId, limit = 50, offset = 0 }: UseProjectEventsOptions) {
  return useQuery({
    queryKey: [api.events.list.path, projectId, limit, offset],
    queryFn: async () => {
      const url = buildUrl(api.events.list.path, { projectId });
      const params = new URLSearchParams();
      if (limit) params.set("limit", limit.toString());
      if (offset) params.set("offset", offset.toString());

      const res = await fetch(`${url}?${params.toString()}`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch events");
      return api.events.list.responses[200].parse(await res.json());
    },
    enabled: !!projectId,
    refetchInterval: 5000, // Poll every 5s for new errors
  });
}

export function useEvent(id: number) {
  return useQuery({
    queryKey: [api.events.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.events.get.path, { id });
      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch event details");
      return api.events.get.responses[200].parse(await res.json());
    },
    enabled: !!id,
  });
}
