"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  useIncidentDetail,
  useCars,
  useUsers,
  useUpdateIncident,
} from "../../../../../../lib/queries/incidents";

import { incidentSchema } from "../../../../../../constants/incidentValidation";
import {
  SEVERITY_LEVELS,
  STATUS_OPTIONS,
  INCIDENT_TYPES,
} from "../../../../../../constants/incidents";
import { User } from "@prisma/client";
import { Car, IncidentBody } from "../../../../../../constants/interface";

export default function UpdateIncidentPage() {
  const router = useRouter();
  const { id } = useParams();
  const incidentId = String(id);

  const { data: incident, isLoading: incidentLoading } =
    useIncidentDetail(incidentId);
  const { data: cars = [], isLoading: carsLoading } = useCars();
  const { data: users = [], isLoading: usersLoading } = useUsers();
  const mutation = useUpdateIncident();

  const fleetManager = users.find((u: User) => u.role === "FleetManager");
  const nonFleetUsers = users.filter((u: User) => u.role !== "FleetManager");

  const [formData, setFormData] = useState<Partial<IncidentBody>>({});

  useEffect(() => {
    if (incident) {
      setFormData({
        title: incident.title,
        description: incident.description,
        severity: incident.severity,
        type: incident.type,
        status: incident.status, // ← added status here
        carId: incident.carId,
        reportedById: incident.reportedById,
        assignedToId: fleetManager?.id || incident.assignedToId,
        occurredAt: new Date(incident.occurredAt).toISOString().slice(0, 16),
        location: incident.location || "",
      });
    }
  }, [incident, fleetManager]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData((prev: Partial<IncidentBody>) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const rawData = {
      ...formData,
      carId: Number(formData.carId), // still numbers for schema
      assignedToId: Number(formData.assignedToId),
      reportedById: Number(formData.reportedById),
    };

    const parsed = incidentSchema.safeParse({
      ...rawData,
      occurredAt: formData.occurredAt, // keep as string for schema
    });

    if (!parsed.success) {
      const errors = parsed.error.issues.map((issue) => issue.message);
      alert("Validation error: " + errors.join(", "));
      return;
    }

    const submissionData = {
      ...parsed.data,
      occurredAt: new Date(parsed.data.occurredAt), // convert string to Date
    };

    mutation.mutate(
      { id: incidentId, data: submissionData },
      {
        onSuccess: async () => {
          router.push("/fleetmanager/incidents");
        },
      }
    );
  };

  if (incidentLoading || carsLoading || usersLoading)
    return (
      <div className="p-6 flex justify-center items-center min-h-[200px]">
        <div className="bg-white px-6 py-4 rounded-lg shadow-md text-gray-700">
          Loading incidents...
        </div>
      </div>
    );

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">Update Incident</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Title</label>
          <input
            name="title"
            value={formData.title || ""}
            onChange={handleChange}
            placeholder="Incident Title"
            className="border p-2 w-full rounded"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Description</label>
          <textarea
            name="description"
            value={formData.description || ""}
            onChange={handleChange}
            placeholder="Description"
            className="border p-2 w-full rounded"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Severity</label>
          <select
            name="severity"
            value={formData.severity || ""}
            onChange={handleChange}
            className="border bg-black p-2 w-full rounded"
          >
            {SEVERITY_LEVELS.map((sev) => (
              <option key={sev} value={sev}>
                {sev}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1 font-medium">Status</label>
          <select
            name="status"
            value={formData.status || ""}
            onChange={handleChange}
            className="border bg-black p-2 w-full rounded"
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s.replace("_", " ")}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1 font-medium">Type</label>
          <select
            name="type"
            value={formData.type || ""}
            onChange={handleChange}
            className="border bg-black p-2 w-full rounded"
          >
            {INCIDENT_TYPES.map((t) => (
              <option key={t} value={t}>
                {t.replace("_", " ")}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1 font-medium">Car</label>
          <select
            name="carId"
            value={formData.carId || ""}
            onChange={handleChange}
            className="border bg-black p-2 w-full rounded"
          >
            {cars.map((car: Car) => (
              <option key={car.id} value={car.id}>
                {car.plateNo} - {car.model} ({car.year})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1 font-medium">Reported By</label>
          <input
            type="text"
            value={
              nonFleetUsers.find((u: User) => u.id === formData.reportedById)
                ?.name || ""
            }
            disabled
            className="border bg-brown p-2 w-full rounded bg-black cursor-not-allowed"
          />
          {/* hidden field so value still submits */}
        </div>

        <div>
          <label className="block mb-1 font-medium">Assigned To</label>
          <select
            name="assignedToId"
            value={formData.assignedToId || ""}
            onChange={handleChange}
            className="border bg-black p-2 w-full rounded"
          >
            {nonFleetUsers.map((user: User) => (
              <option key={user.id} value={user.id}>
                {user.name} ({user.role})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1 font-medium">Occurred At</label>
          <input
            type="datetime-local"
            name="occurredAt"
            value={formData.occurredAt || ""}
            onChange={handleChange}
            className="border p-2 w-full rounded"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Location</label>
          <input
            name="location"
            value={formData.location || ""}
            onChange={handleChange}
            placeholder="Location"
            className="border p-2 w-full rounded"
          />
        </div>

        <button
          type="submit"
          disabled={mutation.isPending}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {mutation.isPending ? "Updating..." : "Update Incident"}
        </button>
      </form>
    </div>
  );
}
