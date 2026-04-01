import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth-utils';

export async function GET(req: Request) {
  try {
    const session = await getSessionUser(req);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const riderId = searchParams.get('riderId');
    const driverId = searchParams.get('driverId');
    const status = searchParams.get('status');

    const query: any = { where: {} };
    if (riderId) query.where.riderId = riderId;
    if (driverId) query.where.driverId = driverId;
    if (status) query.where.status = status;

    const rides = await prisma.ride.findMany({
      ...query,
      include: {
        rider: { select: { id: true, name: true, lat: true, lng: true } },
        driver: { select: { id: true, name: true, lat: true, lng: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(rides);
  } catch (error) {
    console.error('Fetch rides API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
