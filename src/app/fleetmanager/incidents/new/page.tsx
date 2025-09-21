"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from 'next/image';
import {
  useCreateIncident,
  useCars,
  useUsers,
} from "../../../../../lib/queries/incidents";
import { incidentSchema } from "../../../../../constants/incidentValidation";
import { Car, User } from "../../../../../constants/interface";
import { Severity, IncidentType } from "../../../../../constants/interface";
import {
  INCIDENT_TYPES,
  SEVERITY_LEVELS,
} from "../../../../../constants/incidents";

export default function NewIncidentPage() {
  const router = useRouter();
  const mutation = useCreateIncident();

  const {
    data: cars = [],
    isLoading: carsLoading,
    error: carsError,
  } = useCars();
  const {
    data: users = [],
    isLoading: usersLoading,
    error: usersError,
  } = useUsers();

  const fleetManager = users.find((user: User) => user.role === "FleetManager");
  const nonFleetUsers = users.filter(
    (user: User) => user.role !== "FleetManager"
  );

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    setSelectedFiles((prev) => [...prev, ...files]);
    setPreviewUrls((prev) => [
      ...prev,
      ...files.map((file) => URL.createObjectURL(file)),
    ]);
  };

  const handleDeleteImage = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const uploadImages = async () => {
    const uploadedUrls: string[] = [];
    for (const file of selectedFiles) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append(
        "upload_preset",
        process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!
      );
      const res = await fetch(`${process.env.NEXT_PUBLIC_CLOUDINARY_URL}`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      uploadedUrls.push(data.secure_url);
    }
    return uploadedUrls;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!fleetManager) {
      alert("No fleet manager found");
      return;
    }

    const formData = new FormData(e.currentTarget);
    const reportedById = formData.get("reportedById");
    if (!reportedById) {
      alert("Please select a reporting user");
      return;
    }

    let imageUrls: string[] = [];
    if (selectedFiles.length > 0) {
      try {
        imageUrls = await uploadImages();
      } catch (err) {
        console.error("Image upload failed", err);
        alert("Image upload failed");
        return;
      }
    }

    const incidentObj = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      severity: formData.get("severity") as Severity,
      type: formData.get("type") as IncidentType,
      carId: Number(formData.get("carId")),
      reportedById: Number(reportedById),
      assignedToId: fleetManager.id,
      occurredAt: formData.get("occurredAt") as string,
      location: formData.get("location") as string,
      images: imageUrls,
    };
    const parsed = incidentSchema.safeParse(incidentObj);
    if (!parsed.success) {
      const errors = parsed.error.issues.map((issue) => issue.message);
      alert("Validation errors:\n" + errors.join("\n"));
      return;
    }

    const finalData = {
      ...parsed.data,
      occurredAt: new Date(parsed.data.occurredAt),
    };
    mutation.mutate(finalData, {
      onSuccess: () => router.push("/fleetmanager/incidents"),
      onError: (err) => console.error("Failed to create incident", err),
    });
  };

  if (carsLoading || usersLoading)
    return (
      <div className="p-6 flex justify-center items-center min-h-[200px]">
        <div className="bg-white px-6 py-4 rounded-lg shadow-md text-gray-700">
          Loading incidents...
        </div>
      </div>
    );
  if (carsError || usersError)
    return <div className="p-6 text-red-600">Failed to load data</div>;

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">Create New Incident</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="title"
          placeholder="Incident Title"
          className="border p-2 w-full rounded"
        />
        <textarea
          name="description"
          placeholder="Description"
          className="border p-2 w-full rounded"
        />

        <select name="severity" className="border bg-black p-2 w-full rounded">
          <option value="">Select Severity</option>
          {SEVERITY_LEVELS.map((sev) => (
            <option key={sev} value={sev}>
              {sev}
            </option>
          ))}
        </select>

        <select name="type" className="bg-black border p-2 w-full rounded">
          <option value="">Select Type</option>
          {INCIDENT_TYPES.map((type) => (
            <option key={type} value={type}>
              {type.replace("_", " ")}
            </option>
          ))}
        </select>

        <select name="carId" className="border p-2 w-full rounded">
          <option value="">Select Car</option>
          {cars.map((car: Car) => (
            <option className="bg-black" key={car.id} value={car.id}>
              {car.plateNo} - {car.model} ({car.year})
            </option>
          ))}
        </select>

        <select
          name="reportedById"
          className="border bg-black p-2 w-full rounded"
        >
          <option value="">Select Reporting User</option>
          {nonFleetUsers.map((user: User) => (
            <option key={user.id} value={user.id}>
              {user.name} ({user.role})
            </option>
          ))}
        </select>

        <input
          type="datetime-local"
          name="occurredAt"
          defaultValue={new Date().toISOString().slice(0, 16)}
          className="border p-2 w-full rounded"
        />

        <input
          name="location"
          placeholder="Location"
          className="border p-2 w-full rounded"
        />

        {/* Multiple image upload */}
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          className="border p-2 w-full rounded"
        />
        {previewUrls.length > 0 && (
  <div className="mt-2 flex gap-2 flex-wrap">
    {previewUrls.map((url: string, index: number) => (
      <div key={index} className="relative w-32 h-32">
        <Image
          src={url}
          alt={`Preview ${index}`}
          fill
          className="object-cover rounded"
        />
        <button
          type="button"
          onClick={() => handleDeleteImage(index)}
          className="absolute top-1 right-1 bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
        >
          X
        </button>
      </div>
    ))}
  </div>
)}

        {/* Buttons Row */}
        <div className="flex justify-between items-center">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Back
          </button>

          <button
            type="submit"
            disabled={mutation.isPending}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            {mutation.isPending ? "Creating..." : "Create Incident"}
          </button>
        </div>
      </form>
    </div>
  );
}
