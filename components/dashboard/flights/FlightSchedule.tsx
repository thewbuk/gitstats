'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';
import { format, addDays } from 'date-fns';

type Flight = {
  flightNumber: string;
  regularFare: {
    amount: number;
    hasDiscount: boolean;
  };
  time: string[];
  duration: string;
  operatedBy: string;
};

type AvailabilityResponse = {
  flights: Flight[];
  dates: {
    dateOut: string;
    flights: Flight[];
  }[];
};

export const FlightSchedule = () => {
  const [loading, setLoading] = React.useState(false);
  const [fromCode, setFromCode] = React.useState('');
  const [toCode, setToCode] = React.useState('');
  const [availableDates, setAvailableDates] = React.useState<string[]>([]);
  const [availableFlights, setAvailableFlights] = React.useState<Flight[]>([]);
  const [error, setError] = React.useState('');

  const searchAvailableDates = async () => {
    if (!fromCode || !toCode) {
      setError('Please enter both origin and destination airports');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const response = await fetch(
        `/api/flights?action=dates&from=${fromCode.toUpperCase()}&to=${toCode.toUpperCase()}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch dates');
      }

      const data = await response.json();
      setAvailableDates(data);
    } catch (err) {
      setError('Failed to find available dates');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const searchAvailableFlights = async () => {
    if (!fromCode || !toCode) {
      setError('Please enter both origin and destination airports');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const tomorrow = addDays(new Date(), 1);
      const dateOut = format(tomorrow, 'yyyy-MM-dd');

      const response = await fetch(
        `/api/flights?action=available&from=${fromCode.toUpperCase()}&to=${toCode.toUpperCase()}&dateOut=${dateOut}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch flights');
      }

      const data = await response.json();
      setAvailableFlights(data.flights || []);
    } catch (err) {
      setError('Failed to find available flights');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Available Flight Dates</CardTitle>
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
              onClick={searchAvailableDates}
              disabled={loading}
              className="w-full"
            >
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                'Search Available Dates'
              )}
            </Button>

            {error && <p className="text-sm text-red-500">{error}</p>}

            {availableDates.length > 0 && (
              <div className="mt-4 max-h-[400px] overflow-y-auto grid grid-cols-3 gap-2">
                {availableDates.map((date, index) => (
                  <div
                    key={index}
                    className="p-2 text-center bg-gray-50 rounded"
                  >
                    {format(new Date(date), 'MMM dd, yyyy')}
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Search Available Flights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Button
              onClick={searchAvailableFlights}
              disabled={loading}
              className="w-full"
            >
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                'Search Flights'
              )}
            </Button>

            {availableFlights.length > 0 && (
              <div className="mt-4 max-h-[400px] overflow-y-auto">
                {availableFlights.map((flight, index) => (
                  <div key={index} className="p-3 border rounded mb-2">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold">
                        Flight {flight.flightNumber}
                      </span>
                      <span>€{flight.regularFare.amount.toFixed(2)}</span>
                    </div>
                    <div className="mt-2">
                      <p className="text-sm">
                        <strong>Departure:</strong> {flight.time[0]}
                      </p>
                      <p className="text-sm">
                        <strong>Arrival:</strong> {flight.time[1]}
                      </p>
                      <p className="text-sm">
                        <strong>Duration:</strong> {flight.duration}
                      </p>
                      <p className="text-sm text-gray-500">
                        Operated by: {flight.operatedBy}
                      </p>
                      {flight.regularFare.hasDiscount && (
                        <span className="text-sm text-green-500">
                          Discounted!
                        </span>
                      )}
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
