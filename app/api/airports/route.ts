import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');
  const code = searchParams.get('code');

  try {
    const { airports } = await import('@2bad/ryanair');

    switch (action) {
      case 'closest':
        const closest = await airports.getClosest();
        return NextResponse.json(closest);

      case 'destinations':
        if (!code) {
          return NextResponse.json(
            { error: 'Airport code is required' },
            { status: 400 }
          );
        }
        const destinations = await airports.getDestinations(code);
        return NextResponse.json(destinations);

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Airport API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch airport data' },
      { status: 500 }
    );
  }
}
