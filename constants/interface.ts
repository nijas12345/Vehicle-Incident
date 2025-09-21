import { IncidentSeverity,IncidentStatus } from "@prisma/client";

export interface IncidentBody {
  title: string;
  description: string;
  severity: IncidentSeverity;
  type: IncidentType;
  status?: IncidentStatus;
  carId: number;
  reportedById: number;
  assignedToId?: number;
  location?: string;
  latitude?: number;
  longitude?: number;
  occurredAt?: string;
  images?: string[];
  documents?: string[];
}

export interface Car {
  id: number;
  plateNo: string;
  model: string;
  year: number;
}

export interface User {
  id: number;
  name: string;
  role: string;
}

export type Severity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type IncidentType =
  | 'ACCIDENT'
  | 'BREAKDOWN'
  | 'THEFT'
  | 'VANDALISM'
  | 'MAINTENANCE_ISSUE'
  | 'TRAFFIC_VIOLATION'
  | 'FUEL_ISSUE'
  | 'OTHER';

