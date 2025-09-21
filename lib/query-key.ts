export const queryKeys = {
  incidents: {
    lists: (filters?: any) => ['incidents', filters],
    detail: (id: string) => ['incident', id],
    stats: () => ['incidentStats'],
  },
};