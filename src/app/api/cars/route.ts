import { prisma } from '../../../../lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try { 
    const cars = await prisma.car.findMany();
    return NextResponse.json(cars);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch users', details: error },
      { status: 500 }
    );
  }
}
