import { prisma } from '../../../../../lib/prisma';
import { NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const start = searchParams.get('start'); 
    const end = searchParams.get('end');     

    const startDate = start ? new Date(start) : undefined;
    const endDate = end ? new Date(end) : undefined;

    const createdAtFilter: Prisma.DateTimeFilter = {};
    if (startDate) createdAtFilter.gte = startDate;
    if (endDate) createdAtFilter.lte = endDate;

    const whereFilter = Object.keys(createdAtFilter).length ? { createdAt: createdAtFilter } : {};

    const total = await prisma.incident.count({ where: whereFilter });

    const statusGroups = await prisma.incident.groupBy({
      by: ['status'],
      _count: { status: true },
      where: whereFilter,
    });

    const severityGroups = await prisma.incident.groupBy({
      by: ['severity'],
      _count: { severity: true },
      where: whereFilter,
    });

    const openIncidents = await prisma.incident.count({
      where: {
        status: { in: ['PENDING', 'IN_PROGRESS'] },
        ...whereFilter,
      },
    })

    const byStatus: Record<string, number> = {};
    statusGroups.forEach((s) => (byStatus[s.status] = s._count.status));

    const bySeverity: Record<string, number> = {};
    severityGroups.forEach((s) => (bySeverity[s.severity] = s._count.severity));

    return NextResponse.json({
      total,
      openIncidents,
      byStatus,
      bySeverity,
    });
  } catch (error) {
    console.error('Error fetching incident stats:', error);
    return NextResponse.json({ message: 'Failed to fetch stats' }, { status: 500 });
  }
}
