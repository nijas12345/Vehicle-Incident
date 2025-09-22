import { prisma } from '../../../../../../lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> } // ✅ params is a Promise
) {
  try {
    const { id } = await context.params; // ✅ await required
    const incidentId = Number(id);

    if (isNaN(incidentId)) {
      return NextResponse.json({ error: 'Invalid incident ID' }, { status: 400 });
    }

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
  } catch (err: unknown) {
    return NextResponse.json(
      { error: 'Failed to update incident', details: (err as Error).message },
      { status: 500 }
    );
  }
}
