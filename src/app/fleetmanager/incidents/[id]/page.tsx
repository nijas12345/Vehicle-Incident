"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import { useIncidents } from "../../../../../lib/queries/incidents";
import Link from "next/link";
import { Incident } from "@prisma/client";

export default function IncidentDetailsPage() {
  const params = useParams();
  const incidentId = Number(params.id);
  const { data: incidents, isLoading, isError } = useIncidents({});
  const [modalImage, setModalImage] = useState<string | null>(null);

  if (isLoading)
    return (
      <div className="p-6 flex justify-center items-center min-h-[200px]">
        <div className="bg-white px-6 py-4 rounded-lg shadow-md text-gray-700">
          Loading incidents...
        </div>
      </div>
    );
  if (isError)
    return <div className="p-6 text-red-600">Failed to load incident</div>;

  const incident = incidents?.find((i: Incident) => i.id === incidentId);
  if (!incident)
    return <div className="p-6 text-gray-600">Incident not found</div>;

  const details = [
    { label: "Title", value: incident.title },
    {
      label: "Description",
      value: incident.description,
      isDescription: true, // flag for special treatment
    },
    {
      label: "Car",
      value: `${incident.car?.plateNo} - ${incident.car?.model}`,
    },
    { label: "Reported By", value: incident.reportedBy?.name },
    { label: "Assigned To", value: incident.assignedTo?.name || "N/A" },
    { label: "Severity", value: incident.severity },
    { label: "Status", value: incident.status },
    {
      label: "Occurred At",
      value: new Date(incident.occurredAt).toLocaleString(),
    },
    { label: "Location", value: incident.location || "N/A" },
  ];

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl  font-bold mb-6 text-white-800">
        Incident Details
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {details.map((item, index) => (
          <div
            key={index}
            className="border rounded-lg p-4 bg-white shadow hover:shadow-lg transition-shadow"
          >
            <div className="text-gray-500 font-semibold mb-2">{item.label}</div>
            {item.isDescription ? (
              <div
                className="text-gray-800 max-h-20 overflow-hidden relative group cursor-pointer"
                title={item.value}
              >
                {item.value}
                {/* On hover, show full content */}
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-100 p-4 overflow-auto z-10 shadow-lg rounded">
                  {item.value}
                </div>
              </div>
            ) : (
              <div className="text-gray-800">{item.value}</div>
            )}
          </div>
        ))}
      </div>

      {/* Display images */}
      {incident.images && incident.images.length > 0 && (
        <div className="mb-6">
          <strong className="text-gray-700 text-lg">Images:</strong>
          <div className="mt-2 flex flex-wrap gap-3">
            {incident.images.map((url: string, index: number) => (
              <img
                key={index}
                src={url}
                alt={`Incident Image ${index + 1}`}
                className="w-32 h-32 object-cover rounded border cursor-pointer hover:scale-105 transition-transform"
                onClick={() => setModalImage(url)}
              />
            ))}
          </div>
        </div>
      )}

      <Link
        href="/fleetmanager/incidents"
        className="text-blue-600 hover:underline"
      >
        ← Back to Incidents
      </Link>

      {/* Modal */}
      {modalImage && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex justify-center items-center z-50 transition-opacity duration-300">
          <button
            className="absolute top-4 right-6 text-white text-3xl font-bold hover:text-gray-300"
            onClick={() => setModalImage(null)}
          >
            &times;
          </button>
          <img
            src={modalImage}
            alt="Full Image"
            className="max-h-[90%] max-w-[90%] rounded shadow-xl"
          />
        </div>
      )}
    </div>
  );
}
