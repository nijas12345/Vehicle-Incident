import { prisma } from '../../../../../../lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function PUT(
  req: NextRequest,
  context: { params: { id: string } }
) {
  const { id } = context.params; // <-- just use context.params directly
  const incidentId = Number(id);
  const body = await req.json();

  const updatedIncident = await prisma.incident.update({
    where: { id: incidentId },
    data: {
      title: body.title,
      description: body.description,
      severity: body.severity,
      type: body.type,
      status: body.status,
      carId: body.carId,
      reportedById: body.reportedById,
      assignedToId: body.assignedToId,
      occurredAt: new Date(body.occurredAt),
      location: body.location,
    },
  });

  return NextResponse.json(updatedIncident);
}
