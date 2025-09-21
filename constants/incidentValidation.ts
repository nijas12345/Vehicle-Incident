import { z } from "zod";

export const incidentSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  severity: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']),
  type: z.enum([
    'ACCIDENT','BREAKDOWN','THEFT','VANDALISM','MAINTENANCE_ISSUE',
    'TRAFFIC_VIOLATION','FUEL_ISSUE','OTHER'
  ]),
  status: z.enum(["PENDING", "IN_PROGRESS", "RESOLVED", "CLOSED", "CANCELLED"]).optional(), // optional if not needed on creation
  carId: z.number(),
  reportedById: z.number(),
  assignedToId: z.number(),
  occurredAt: z.string().min(1, "Date & time is required"),
  location: z.string().min(1, "Location is required"),
  images: z.array(z.string()).optional(),
});
