'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';

type Airport = {
  code: string;
  name: string;
  seoName: string;
  aliases: string[];
  base: boolean;
  city: { name: string; code: string };
  region: { name: string; code: string };
  country: { name: string; code: string };
  coordinates: { latitude: number; longitude: number };
};

export const AirportSearch = () => {
  const [loading, setLoading] = React.useState(false);
  const [nearestAirport, setNearestAirport] = React.useState<Airport | null>(
    null
  );
  const [searchCode, setSearchCode] = React.useState('');
  const [destinations, setDestinations] = React.useState<Airport[]>([]);
  const [error, setError] = React.useState('');

  const findNearestAirport = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await fetch('/api/airports?action=closest');
      if (!response.ok) {
        throw new Error('Failed to fetch nearest airport');
      }
      const data = await response.json();
      setNearestAirport(data);
    } catch (err) {
      setError('Failed to find nearest airport');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const findDestinations = async () => {
    if (!searchCode) {
      setError('Please enter an airport code');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const response = await fetch(
        `/api/airports?action=destinations&code=${searchCode.toUpperCase()}`
      );
      if (!response.ok) {
        throw new Error('Failed to fetch destinations');
      }
      const data = await response.json();
      setDestinations(data);
    } catch (err) {
      setError('Failed to find destinations');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Find Nearest Airport</CardTitle>
        </CardHeader>
        <CardContent>
          <Button
            onClick={findNearestAirport}
            disabled={loading}
            className="w-full"
          >
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              'Find Nearest Airport'
            )}
          </Button>

          {nearestAirport && (
            <div className="mt-4 space-y-2">
              <p>
                <strong>Code:</strong> {nearestAirport.code}
              </p>
              <p>
                <strong>Name:</strong> {nearestAirport.name}
              </p>
              <p>
                <strong>City:</strong> {nearestAirport.city?.name}
              </p>
              <p>
                <strong>Country:</strong> {nearestAirport.country?.name}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Find Destinations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2">
            <Input
              placeholder="Enter airport code (e.g., BER)"
              value={searchCode}
              onChange={(e) => setSearchCode(e.target.value)}
              maxLength={3}
              className="flex-1"
            />
            <Button onClick={findDestinations} disabled={loading}>
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                'Search'
              )}
            </Button>
          </div>

          {error && <p className="mt-2 text-sm text-red-500">{error}</p>}

          {destinations.length > 0 && (
            <div className="mt-4 space-y-2">
              <p className="font-semibold">Available Destinations:</p>
              <div className="max-h-[300px] overflow-y-auto">
                {destinations.map((dest) => (
                  <div key={dest.code} className="p-2 hover:bg-gray-50 rounded">
                    <p>
                      <strong>{dest.code}</strong> - {dest.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {dest.city?.name}, {dest.country?.name}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
