"use client";

import {
  useIncidents,
  useDeleteIncident,
} from "../../../../lib/queries/incidents";
import Link from "next/link";
import { useState } from "react";
import {
  getStatusClass,
  getSeverityClass,
} from "../../../../constants/incidents";
import { User } from "@prisma/client";

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

export default function IncidentsPage() {
  const [selectedSeverity, setSelectedSeverity] = useState<string>("All");
  const [selectedStatus, setSelectedStatus] = useState<string>("All");

  const { data, isLoading, isError } = useIncidents({
    severity: selectedSeverity !== "All" ? selectedSeverity : undefined,
    status: selectedStatus !== "All" ? selectedStatus : undefined,
  });

  const deleteMutation = useDeleteIncident();
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  if (isLoading)
    return (
      <div className="p-6 flex justify-center items-center min-h-[200px]">
        <div className="bg-white px-6 py-4 rounded-lg shadow-md text-gray-700">
          Loading incidents...
        </div>
      </div>
    );
  if (isError)
    return <div className="p-4 text-red-500">Error fetching incidents</div>;

  const handleDelete = (id: number) => {
    if (!confirm("Are you sure you want to delete this incident?")) return;
    setDeletingId(id);
    deleteMutation.mutate(id, {
      onSuccess: () => setDeletingId(null),
      onError: () => {
        alert("Failed to delete incident.");
        setDeletingId(null);
      },
    });
  };

  const totalItems = data?.length || 0;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = data?.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold">Incidents</h1>
        <div className="flex gap-2">
          <Link
            href="/fleetmanager/incidents/stats"
            className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
          >
            Dashboard
          </Link>
          <Link
            href="/fleetmanager/incidents/new"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            + Add Incident
          </Link>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 mb-6">
        <select
          value={selectedSeverity}
          onChange={(e) => {
            setSelectedSeverity(e.target.value);
            setCurrentPage(1); // reset pagination when filter changes
          }}
          className="border rounded px-3 py-2"
        >
          <option className="bg-black" value="All">
            All Severities
          </option>
          <option className="bg-black" value="LOW">
            Low
          </option>
          <option className="bg-black" value="MEDIUM">
            Medium
          </option>
          <option className="bg-black" value="HIGH">
            High
          </option>
          <option className="bg-black" value="CRITICAL">
            CRITICAL
          </option>
        </select>

        <select
          value={selectedStatus}
          onChange={(e) => {
            setSelectedStatus(e.target.value);
            setCurrentPage(1);
          }}
          className="border rounded px-3 py-2"
        >
          <option className="bg-black" value="All">
            All Statuses
          </option>
          <option className="bg-black" value="PENDING">
            Pending
          </option>
          <option className="bg-black" value="IN_PROGRESS">
            In Progress
          </option>
          <option className="bg-black" value="CLOSED">
            Closed
          </option>
          <option className="bg-black" value="RESOLVED">
            Resolved
          </option>
          <option className="bg-black" value="CANCELLED">
            Cancelled
          </option>
        </select>
      </div>

      {/* Table for desktop */}
      <div className="hidden md:block overflow-x-auto shadow rounded-lg">
        <table className="min-w-full border-collapse table-auto">
          <thead className="bg-gray-200 sticky top-0">
            <tr>
              <th className="text-left p-3 text-gray-700">Title</th>
              <th className="text-left p-3 text-gray-700">Car</th>
              <th className="text-left p-3 text-gray-700">Reported By</th>
              <th className="text-left p-3 text-gray-700">Severity</th>
              <th className="text-left p-3 text-gray-700">Status</th>
              <th className="text-left p-3 text-gray-700">Occurred At</th>
              <th className="text-left p-3 text-gray-700">Action</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData?.map((incident: IncidentTableRow) => (
              <tr key={incident.id} className="bg-white">
                <td className="p-3 text-gray-700">{incident.title}</td>
                <td className="p-3 text-gray-700">
                  {incident.car?.plateNo || "N/A"}
                </td>
                <td className="p-3 text-gray-700">
                  {incident.reportedBy?.name || "N/A"}
                </td>
                <td className="p-3 text-gray-700">
                  <span
                    className={`px-2 py-1 rounded-full text-white text-sm ${getSeverityClass(
                      incident.severity
                    )}`}
                  >
                    {incident.severity}
                  </span>
                </td>
                <td className="p-3">
                  <span
                    className={`px-2 py-1 rounded-full text-sm ${getStatusClass(
                      incident.status
                    )}`}
                  >
                    {incident.status.replace("_", " ")}
                  </span>
                </td>
                <td className="text-black">
                  {incident.occurredAt
                    ? new Date(incident.occurredAt).toLocaleString()
                    : "N/A"}
                </td>
                <td className="p-3 flex gap-2">
                  <Link
                    href={`/fleetmanager/incidents/${incident.id}`}
                    className="text-blue-600 hover:underline"
                  >
                    View
                  </Link>
                  <Link
                    href={`/fleetmanager/incidents/${incident.id}/edit`}
                    className="text-green-600 hover:underline"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(incident.id)}
                    disabled={deletingId === incident.id}
                    className="text-red-600 hover:underline disabled:opacity-50"
                  >
                    {deletingId === incident.id ? "Deleting..." : "Delete"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center mt-4 gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-3 py-1 rounded ${
                currentPage === page
                  ? "bg-blue-600 text-white"
                  : "bg-gray-800 hover:bg-black-900"
              }`}
            >
              {page}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
