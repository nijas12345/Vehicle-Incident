import { prisma } from "../../../../lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { IncidentBody } from "../../../../constants/interface";
import { Prisma, IncidentStatus, IncidentSeverity } from "@prisma/client";

// GET /api/incidents?status=&severity=&carId=&assignedToId=
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const status = searchParams.get("status");
    const severity = searchParams.get("severity");
    const carId = searchParams.get("carId");
    const assignedToId = searchParams.get("assignedToId");

    const where: Prisma.IncidentWhereInput = {};

    // Validate and assign enum values
    if (status && Object.values(IncidentStatus).includes(status as IncidentStatus)) {
      where.status = status as IncidentStatus;
    }
    if (severity && Object.values(IncidentSeverity).includes(severity as IncidentSeverity)) {
      where.severity = severity as IncidentSeverity;
    }

    if (carId) where.carId = Number(carId);
    if (assignedToId) where.assignedToId = Number(assignedToId);

    const incidents = await prisma.incident.findMany({
      where,
      include: {
        car: true,
        reportedBy: true,
        assignedTo: true,
        updates: true,
      },
      orderBy: { reportedAt: "desc" },
    });

    return NextResponse.json(incidents);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch incidents", details: error },
      { status: 500 }
    );
  }
}

// POST /api/incidents
export async function POST(req: NextRequest) {
  try {
    const body: IncidentBody = await req.json();

    const incident = await prisma.incident.create({
      data: {
        title: body.title,
        description: body.description,
        severity: body.severity as IncidentSeverity,
        status: body.status ? (body.status as IncidentStatus) : IncidentStatus.PENDING,
        type: body.type ?? "OTHER",
        carId: body.carId,
        reportedById: body.reportedById,
        assignedToId: body.assignedToId ?? undefined,
        location: body.location ?? undefined,
        latitude: body.latitude ?? undefined,
        longitude: body.longitude ?? undefined,
        occurredAt: body.occurredAt ? new Date(body.occurredAt) : new Date(),
        images: body.images ?? [],
        documents: body.documents ?? [],
      },
    });

    return NextResponse.json(incident);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create incident", details: error },
      { status: 500 }
    );
  }
}
