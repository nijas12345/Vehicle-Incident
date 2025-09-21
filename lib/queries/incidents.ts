import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../api-client';
import { keepPreviousData } from '@tanstack/react-query';

interface Incident {
  title: string;
  description: string;
  severity: string;
  type: string;
  carId?: number;
  assignedToId?: number;
  occurredAt?: Date;
  location?: string;
  images?:string[]
}

export const fetchIncidents = async (filters: { severity?: string; status?: string }) => {
  const params = new URLSearchParams();
  if (filters.severity && filters.severity !== 'All') params.append('severity', filters.severity);
  if (filters.status && filters.status !== 'All') params.append('status', filters.status);

  const { data } = await apiClient.get(`/incidents?${params.toString()}`);
  return data;
};

export const useIncidents = (filters: { severity?: string; status?: string }) => {
  return useQuery({
    queryKey: ['incidents', filters],
    queryFn: () => fetchIncidents(filters),
    placeholderData: keepPreviousData, // ✅ correct for v5
    staleTime: 2 * 60 * 1000,
  });
};

export const createIncident = async (incident: Incident) => {
  const response = await apiClient.post<Incident>('/incidents', incident);
  return response.data;
};

export const useCars = () => {
  return useQuery({
    queryKey: ['cars'],
    queryFn: async () => {
      const res = await fetch('/api/cars');
      if (!res.ok) throw new Error('Failed to fetch cars');
      return res.json();
    },
  });
};

// Fetch all users
export const useUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const res = await fetch('/api/users');
      if (!res.ok) throw new Error('Failed to fetch users');
      return res.json();
    },
  });
};

export const useCreateIncident = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createIncident, // should be a function that takes data
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['incidents'] }); // refresh incident list
    },
  });
};

export const fetchIncidentDetail = async (id: string | number) => {
  const { data } = await apiClient.get(`/incidents/${id}`);
  return data;
};

export const useIncidentDetail = (id: string | number) => {
  return useQuery({
    queryKey: ['incidents', id],
    queryFn: () => fetchIncidentDetail(id),
    enabled: !!id,
    staleTime: 60 * 1000, // cache for 1 min
  });
};

export const updateIncident = async (id: string | number, incident: Partial<Incident>) => {
  const { data } = await apiClient.put(`/incidents/${id}/edit`, incident);
  return data;
};

export const useUpdateIncident = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string | number; data: Partial<Incident> }) =>
      updateIncident(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['incidents'] }); // refresh list
      queryClient.invalidateQueries({ queryKey: ['incidents', variables.id] }); // refresh detail
      queryClient.invalidateQueries({ queryKey: ['incidentStats'] });
    },
  });
};

export const useDeleteIncident = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/incidents/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Failed to delete incident');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['incidents'] }); // Refresh incident list
    },
  });
};


export interface IncidentStats {
  total: number;
  openIncidents: number;
  byStatus: Record<string, number>;
  bySeverity: Record<string, number>;
}

// Fetch function
export const fetchIncidentStats = async (
  start?: string,
  end?: string
): Promise<IncidentStats> => {
  // Only include params if defined
  const params: Record<string, string> = {};
  if (start) params.start = start;
  if (end) params.end = end;

  // If params object is empty, Axios will call '/incidents/stats' without query string
  const response = await apiClient.get('/incidents/stats', { 
    params: Object.keys(params).length ? params : undefined 
  });

  return response.data;
};



// Hook with optional filters
export const useIncidentStats = (start?: string, end?: string) => {
  return useQuery({
    queryKey: ['incidentStats', start, end], // include filters in cache key
    queryFn: () => fetchIncidentStats(start, end),
    staleTime:0, // cache for 5 minutes
  });
};