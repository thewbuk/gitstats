import { NextResponse } from 'next/server';
import { flights } from '@2bad/ryanair';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');
  const from = searchParams.get('from');
  const to = searchParams.get('to');
  const dateOut = searchParams.get('dateOut');

  if (!from || !to) {
    return NextResponse.json(
      { error: 'Origin and destination are required' },
      { status: 400 }
    );
  }

  try {
    switch (action) {
      case 'dates':
        const dates = await flights.getDates(from, to);
        return NextResponse.json(dates);

      case 'available':
        if (!dateOut) {
          return NextResponse.json(
            { error: 'Date is required for flight search' },
            { status: 400 }
          );
        }
        const options = {
          ADT: '1',
          DateOut: dateOut,
          Origin: from,
          Destination: to,
          FlexDaysBeforeOut: '2',
          FlexDaysOut: '2',
          RoundTrip: 'false',
          ToUs: 'AGREED',
        };
        const availableFlights = await flights.getAvailable(options);
        return NextResponse.json(availableFlights);

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Flights API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch flight data' },
      { status: 500 }
    );
  }
}
