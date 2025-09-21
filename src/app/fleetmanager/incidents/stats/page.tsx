"use client";

import React, { useState } from "react";
import { useIncidentStats } from "../../../../../lib/queries/incidents";
import Link from "next/link";
import {
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const COLORS = ["#4ade80", "#facc15", "#f87171", "#db2777"];

const SeverityPieChart = ({ data }: { data: Record<string, number> }) => {
  const chartData = Object.entries(data).map(([name, value]) => ({
    name,
    value,
  }));
  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={chartData}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={80}
          label
        >
          {chartData.map((_, index) => (
            <Cell key={index} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
};

const StatusBarChart = ({ data }: { data: Record<string, number> }) => {
  const chartData = Object.entries(data).map(([name, value]) => ({
    name,
    value,
  }));
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData}>
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="value" fill="#4ade80" />
      </BarChart>
    </ResponsiveContainer>
  );
};

const StatCard = ({ title, value }: { title: string; value: number }) => (
  <div className="bg-white p-4 rounded shadow hover:shadow-lg transition-shadow flex flex-col items-center justify-center">
    <div className="text-gray-500 font-medium">{title}</div>
    <div className="text-2xl font-bold text-gray-800 mt-2">{value}</div>
  </div>
);

export default function IncidentsDashboardPage() {
  const [dateRange, setDateRange] = useState<{ start?: string; end?: string }>(
    {}
  );
  // applied filter state
  const [appliedFilter, setAppliedFilter] = useState<{
    start?: string;
    end?: string;
  }>({});

  // fetch data based on appliedFilter; initially undefined -> fetches all
  const {
    data: stats,
    isLoading,
    isError,
    refetch,
  } = useIncidentStats(appliedFilter.start, appliedFilter.end);

  const applyFilter = () => {
    setAppliedFilter({ ...dateRange });
    // optional: refetch immediately (if hook doesn't auto-refetch on queryKey change)
    refetch?.();
  };

  if (isLoading)
    return (
      <div className="p-6 flex justify-center items-center min-h-[200px]">
        <div className="bg-white px-6 py-4 rounded-lg shadow-md text-gray-700">
          Loading incidents...
        </div>
      </div>
    );
  if (isError || !stats)
    return <div className="p-6 text-red-600">Failed to load dashboard</div>;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-white-800">
        Incidents Dashboard
      </h1>

      <div className="mb-6">
        <Link
          href="/fleetmanager/incidents"
          className="inline-block bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow"
        >
          View All Incidents
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6 items-start sm:items-center">
        <div className="flex gap-2 items-center">
          <label className="text-gray-700 font-medium">Start Date:</label>
          <input
            type="date"
            className="border p-2 rounded"
            value={dateRange.start || ""}
            onChange={(e) =>
              setDateRange({ ...dateRange, start: e.target.value })
            }
          />
        </div>
        <div className="flex gap-2 items-center">
          <label className="text-gray-700 font-medium">End Date:</label>
          <input
            type="date"
            className="border p-2 rounded"
            value={dateRange.end || ""}
            onChange={(e) =>
              setDateRange({ ...dateRange, end: e.target.value })
            }
          />
        </div>

        <button
          className="bg-blue-500 text-white px-4 py-2 rounded mt-2 sm:mt-0"
          onClick={applyFilter}
        >
          Apply Filter
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatCard title="Total Incidents" value={stats.total} />
        <StatCard title="Open Incidents" value={stats.openIncidents} />
        <StatCard title="Critical" value={stats.bySeverity.CRITICAL || 0} />
        <StatCard title="Resolved" value={stats.byStatus.RESOLVED || 0} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <SeverityPieChart data={stats.bySeverity} />
        <StatusBarChart data={stats.byStatus} />
      </div>
    </div>
  );
}
