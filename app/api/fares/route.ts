import { NextResponse } from 'next/server';
import { fares } from '@2bad/ryanair';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');
  const from = searchParams.get('from');
  const to = searchParams.get('to');
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');
  const currency = searchParams.get('currency') || 'EUR';

  if (!from || !to || !startDate) {
    return NextResponse.json(
      { error: 'Missing required parameters' },
      { status: 400 }
    );
  }

  try {
    switch (action) {
      case 'daily':
        if (!endDate) {
          return NextResponse.json(
            { error: 'End date is required for daily fares' },
            { status: 400 }
          );
        }
        const dailyFares = await fares.findDailyFaresInRange(
          from,
          to,
          startDate,
          endDate,
          currency
        );
        return NextResponse.json(dailyFares);

      case 'roundtrip':
        if (!endDate) {
          return NextResponse.json(
            { error: 'End date is required for round trips' },
            { status: 400 }
          );
        }
        const roundTrips = await fares.findCheapestRoundTrip(
          from,
          to,
          startDate,
          endDate,
          currency,
          5
        );
        return NextResponse.json(roundTrips);

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Fares API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch fare data' },
      { status: 500 }
    );
  }
}
