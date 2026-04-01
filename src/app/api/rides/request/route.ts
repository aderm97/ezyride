import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth-utils';
import { Role, RideStatus } from '@prisma/client';

export async function POST(req: Request) {
  try {
    const session = await getSessionUser(req);
    if (!session || session.role !== Role.RIDER) {
      return NextResponse.json({ error: 'Unauthorized. Only riders can request rides.' }, { status: 401 });
    }

    const { pickupLat, pickupLng, dropoffLat, dropoffLng, fare } = await req.json();

    const existingRide = await prisma.ride.findFirst({
      where: {
        riderId: session.id,
        status: { in: [RideStatus.PENDING, RideStatus.ACCEPTED, RideStatus.ARRIVED, RideStatus.IN_PROGRESS] },
      },
    });

    if (existingRide) {
      return NextResponse.json({ error: 'You already have an active ride' }, { status: 400 });
    }

    const ride = await prisma.ride.create({
      data: {
        riderId: session.id,
        pickupLat,
        pickupLng,
        dropoffLat,
        dropoffLng,
        fare,
        status: RideStatus.PENDING,
      },
    });

    return NextResponse.json(ride, { status: 201 });
  } catch (error) {
    console.error('Ride request API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
