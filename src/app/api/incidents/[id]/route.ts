import { prisma } from '../../../../../lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params; 
  const incidentId = Number(id);

  if (isNaN(incidentId)) {
    return NextResponse.json({ error: 'Invalid incident ID' }, { status: 400 });
  }

  const incident = await prisma.incident.findUnique({
    where: { id: incidentId },
    include: {
      car: true,
      reportedBy: true,
      assignedTo: true,
      updates: {
        include: { user: true },
      },
    },
  });

  if (!incident) {
    return NextResponse.json({ error: 'Incident not found' }, { status: 404 });
  }
  return NextResponse.json(incident);
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const incidentId = Number(params.id);

    if (isNaN(incidentId)) {
      return NextResponse.json({ error: 'Invalid incident ID' }, { status: 400 });
    }

    // Delete the incident
    const deletedIncident = await prisma.incident.delete({
      where: { id: incidentId },
    });

    return NextResponse.json(deletedIncident);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete incident', details: error },
      { status: 500 }
    );
  }
}
