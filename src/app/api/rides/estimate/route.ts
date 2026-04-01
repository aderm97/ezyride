import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth-utils';

const calculateFare = (lat1: number, lng1: number, lat2: number, lng2: number) => {
  const R = 6371; // km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLng = (lng2 - lng1) * (Math.PI / 180);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
            Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  const baseFare = 5.0;
  const perKmRate = 2.0;
  return baseFare + (distance * perKmRate);
};

export async function POST(req: Request) {
  try {
    const session = await getSessionUser(req);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { pickupLat, pickupLng, dropoffLat, dropoffLng } = await req.json();
    
    if (!pickupLat || !pickupLng || !dropoffLat || !dropoffLng) {
      return NextResponse.json({ error: 'Missing coordinates' }, { status: 400 });
    }

    const fare = calculateFare(pickupLat, pickupLng, dropoffLat, dropoffLng);
    return NextResponse.json({ estimatedFare: parseFloat(fare.toFixed(2)) });
  } catch (error) {
    console.error('Ride estimate error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
