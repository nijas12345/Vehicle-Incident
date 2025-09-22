import React from "react";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Welcome to Fleet Manager</h1>

      <Link
        href="/fleetmanager/incidents"
        className="text-blue-600 hover:underline"
      >
        Go to Incidents
      </Link>
    </div>
  );
}

