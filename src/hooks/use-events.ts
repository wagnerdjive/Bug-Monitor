import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";

export interface ErrorEvent {
  id: number;
  projectId: number;
  type: string;
  status: string;
  severity: string;
  message: string;
  stackTrace: string | null;
  deviceInfo: Record<string, unknown> | null;
  platformInfo: Record<string, unknown> | null;
  tags: Record<string, string> | null;
  breadcrumbs: unknown[] | null;
  occurredAt: string;
  createdAt: string;
  userName?: string;
  traceId?: string;
}

interface UseProjectEventsOptions {
  projectId: number;
  limit?: number;
  offset?: number;
  status?: string;
  severity?: string;
  type?: string;
  search?: string;
}

export function useProjectEvents({ 
  projectId, 
  limit = 50, 
  offset = 0,
  status,
  severity,
  type,
  search
}: UseProjectEventsOptions) {
  return useQuery<ErrorEvent[]>({
    queryKey: ["/api/projects", projectId, "events", { limit, offset, status, severity, type, search }],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (limit) params.set("limit", limit.toString());
      if (offset) params.set("offset", offset.toString());
      if (status && status !== "all") params.set("status", status);
      if (severity && severity !== "all") params.set("severity", severity);
      if (type && type !== "all") params.set("type", type);
      if (search) params.set("search", search);

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

export function useUpdateEventStatus() {
  return useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      const res = await apiRequest("PATCH", `/api/events/${id}`, { status });
      return res.json();
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["/api/events", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
    },
  });
}
