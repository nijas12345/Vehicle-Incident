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


export interface IncidentTableRow {
  id: number;
  title: string;
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL"; // match SEVERITY_LEVELS
  type: "ACCIDENT" | "BREAKDOWN" | "OTHER"; // match INCIDENT_TYPES
  status: "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED"; // match STATUS_OPTIONS
  occurredAt?: string;
  car?: {
    id: number;
    plateNo: string;
    model: string;
    year: number;
  };
  reportedBy?: {
    id: number;
    name: string;
    role: string;
  };
  assignedTo?: {
    id: number;
    name: string;
    role: string;
  };
  location?: string;
}

export interface IncidentStats {
  total: number;
  openIncidents: number;
  byStatus: Record<string, number>;
  bySeverity: Record<string, number>;
}

export interface Incident {
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
