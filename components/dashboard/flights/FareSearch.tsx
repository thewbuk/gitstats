'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';
import { format, addMonths } from 'date-fns';

type Fare = {
  amount: number;
  hasDiscount: boolean;
  dateOut: string;
  dateIn?: string;
  flightNumber?: string;
};

type RoundTrip = {
  outbound: Fare;
  inbound: Fare;
  total: number;
};

export const FareSearch = () => {
  const [loading, setLoading] = React.useState(false);
  const [fromCode, setFromCode] = React.useState('');
  const [toCode, setToCode] = React.useState('');
  const [dailyFares, setDailyFares] = React.useState<Fare[]>([]);
  const [roundTrips, setRoundTrips] = React.useState<RoundTrip[]>([]);
  const [error, setError] = React.useState('');

  const searchDailyFares = async () => {
    if (!fromCode || !toCode) {
      setError('Please enter both origin and destination airports');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const startDate = format(new Date(), 'yyyy-MM-dd');
      const endDate = format(addMonths(new Date(), 3), 'yyyy-MM-dd');

      const response = await fetch(
        `/api/fares?action=daily&from=${fromCode.toUpperCase()}&to=${toCode.toUpperCase()}&startDate=${startDate}&endDate=${endDate}&currency=EUR`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch fares');
      }

      const data = await response.json();
      setDailyFares(data);
    } catch (err) {
      setError('Failed to find fares');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const searchRoundTrips = async () => {
    if (!fromCode || !toCode) {
      setError('Please enter both origin and destination airports');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const startDate = format(new Date(), 'yyyy-MM-dd');
      const endDate = format(addMonths(new Date(), 3), 'yyyy-MM-dd');

      const response = await fetch(
        `/api/fares?action=roundtrip&from=${fromCode.toUpperCase()}&to=${toCode.toUpperCase()}&startDate=${startDate}&endDate=${endDate}&currency=EUR`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch round trips');
      }

      const data = await response.json();
      setRoundTrips(data);
    } catch (err) {
      setError('Failed to find round trips');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Search Daily Fares</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <Input
                placeholder="From (e.g., BER)"
                value={fromCode}
                onChange={(e) => setFromCode(e.target.value)}
                maxLength={3}
              />
              <Input
                placeholder="To (e.g., DUB)"
                value={toCode}
                onChange={(e) => setToCode(e.target.value)}
                maxLength={3}
              />
            </div>

            <Button
              onClick={searchDailyFares}
              disabled={loading}
              className="w-full"
            >
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                'Search Daily Fares'
              )}
            </Button>

            {error && <p className="text-sm text-red-500">{error}</p>}

            {dailyFares.length > 0 && (
              <div className="mt-4 max-h-[400px] overflow-y-auto">
                {dailyFares.map((fare, index) => (
                  <div key={index} className="p-2 hover:bg-gray-50 rounded">
                    <p>
                      <strong>Date:</strong>{' '}
                      {format(new Date(fare.dateOut), 'MMM dd, yyyy')}
                    </p>
                    <p>
                      <strong>Price:</strong> €{fare.amount.toFixed(2)}
                    </p>
                    {fare.hasDiscount && (
                      <span className="text-sm text-green-500">
                        Discounted!
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Find Cheapest Round Trips</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Button
              onClick={searchRoundTrips}
              disabled={loading}
              className="w-full"
            >
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                'Search Round Trips'
              )}
            </Button>

            {roundTrips.length > 0 && (
              <div className="mt-4 max-h-[400px] overflow-y-auto">
                {roundTrips.map((trip, index) => (
                  <div key={index} className="p-3 border rounded mb-2">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold">
                        Total: €{trip.total.toFixed(2)}
                      </span>
                    </div>
                    <div className="mt-2 space-y-2">
                      <div>
                        <p className="text-sm font-medium">Outbound</p>
                        <p className="text-sm">
                          Date:{' '}
                          {format(
                            new Date(trip.outbound.dateOut),
                            'MMM dd, yyyy'
                          )}
                        </p>
                        <p className="text-sm">
                          Price: €{trip.outbound.amount.toFixed(2)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Return</p>
                        <p className="text-sm">
                          Date:{' '}
                          {format(
                            new Date(trip.inbound.dateOut),
                            'MMM dd, yyyy'
                          )}
                        </p>
                        <p className="text-sm">
                          Price: €{trip.inbound.amount.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
