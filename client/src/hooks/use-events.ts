import { useQuery } from "@tanstack/react-query";

interface ErrorEvent {
  id: number;
  projectId: number;
  message: string;
  stackTrace: string | null;
  level: string;
  environment: string | null;
  release: string | null;
  userAgent: string | null;
  url: string | null;
  tags: Record<string, string> | null;
  extra: Record<string, unknown> | null;
  breadcrumbs: unknown[] | null;
  fingerprint: string | null;
  occurredAt: string;
}

interface UseProjectEventsOptions {
  projectId: number;
  limit?: number;
  offset?: number;
}

export function useProjectEvents({ projectId, limit = 50, offset = 0 }: UseProjectEventsOptions) {
  return useQuery<ErrorEvent[]>({
    queryKey: ["/api/projects", projectId, "events", limit, offset],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (limit) params.set("limit", limit.toString());
      if (offset) params.set("offset", offset.toString());

      const res = await fetch(`/api/projects/${projectId}/events?${params.toString()}`, { 
        credentials: "include" 
      });
      if (!res.ok) throw new Error("Failed to fetch events");
      return res.json();
    },
    enabled: !!projectId,
    refetchInterval: 5000,
  });
}

export function useEvent(id: number) {
  return useQuery<ErrorEvent>({
    queryKey: ["/api/events", id],
    queryFn: async () => {
      const res = await fetch(`/api/events/${id}`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch event details");
      return res.json();
    },
    enabled: !!id,
  });
}
