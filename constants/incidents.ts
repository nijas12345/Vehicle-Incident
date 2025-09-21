// constants/incidents.ts

export const SEVERITY_LEVELS = ["LOW", "MEDIUM", "HIGH", "CRITICAL"];

export const STATUS_OPTIONS = [
  "PENDING",
  "IN_PROGRESS",
  "RESOLVED",
  "CLOSED",
  "CANCELLED",
];

export const INCIDENT_TYPES = [
  "ACCIDENT",
  "BREAKDOWN",
  "THEFT",
  "VANDALISM",
  "MAINTENANCE_ISSUE",
  "TRAFFIC_VIOLATION",
  "FUEL_ISSUE",
  "OTHER",
];

export const getStatusClass = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-gray-400 text-white';
      case 'IN_PROGRESS': return 'bg-yellow-500 text-white';
      case 'RESOLVED': return 'bg-green-600 text-white';
      case 'CLOSED': return 'bg-blue-500 text-white';
      case 'CANCELLED': return 'bg-red-600 text-white';
      default: return 'bg-gray-300 text-black';
    }
  };

export const getSeverityClass = (severity: string) => {
    switch (severity) {
      case 'LOW': return 'bg-green-500';
      case 'MEDIUM': return 'bg-yellow-500';
      case 'HIGH': return 'bg-red-500';
      case 'CRITICAL': return 'bg-pink-600';
      default: return 'bg-gray-400';
    }
  };

