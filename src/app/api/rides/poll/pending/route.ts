import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth-utils';
import { Role, RideStatus } from '@prisma/client';

export async function GET(req: Request) {
  try {
    const session = await getSessionUser(req);
    if (!session || session.role !== Role.DRIVER) {
      return NextResponse.json({ error: 'Unauthorized. Only drivers can poll for rides.' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const take = parseInt(searchParams.get('take') || '10');

    const pendingRides = await prisma.ride.findMany({
      where: { status: RideStatus.PENDING },
      orderBy: { createdAt: 'desc' },
      take: take,
    });

    return NextResponse.json(pendingRides);
  } catch (error) {
    console.error('Poll pending rides API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
