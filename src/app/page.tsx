import React from "react";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md text-center">
        <h1 className="text-3xl font-extrabold mb-4 text-gray-800">
          Welcome to Fleet Manager
        </h1>
        <p className="text-gray-600 mb-6">
          Manage all your vehicle incidents efficiently and effortlessly.
        </p>
        <Link
          href="/fleetmanager/incidents"
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded-full shadow-md hover:bg-blue-700 transition-colors duration-300"
        >
          Go to Incidents
        </Link>
      </div>
    </div>
  );
}

