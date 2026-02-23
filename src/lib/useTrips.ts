import { useEffect, useState } from 'react';
import { supabase } from './supabase';
import type { TripData } from '../app/types';

export type StoredTrip = { id: string; name: string; data: TripData };

export function useTrips(initial?: TripData) {
  const [trips, setTrips] = useState<StoredTrip[]>([]);
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      const { data, error } = await supabase.from('trips').select('id,name,data');
      if (!cancelled) {
        if (error) return;
        if (data && data.length) {
          setTrips(data as any);
          if (!active) setActive(data[0].id);
        } else if (initial) {
          // no trips yet, create initial one
          const { data: inserted } = await supabase.from('trips').insert({ name: initial.name, data: initial }).select('id').single();
          if (inserted) {
            setTrips([{ ...inserted, data: initial } as any]);
            setActive(inserted.id);
          }
        }
      }
    };

    load();

    const sub = supabase
      .from('trips')
      .on('INSERT', payload => setTrips(prev => [...prev, payload.new as any]))
      .on('UPDATE', payload =>
        setTrips(prev => prev.map(t => (t.id === payload.new.id ? (payload.new as any) : t)))
      )
      .on('DELETE', payload => setTrips(prev => prev.filter(t => t.id !== payload.old.id)))
      .subscribe();

    return () => {
      cancelled = true;
      supabase.removeSubscription(sub);
    };
  }, [initial]);

  const selectTrip = (id: string | null) => {
    setActive(id);
  };

  const updateTrip = async (updates: Partial<TripData>) => {
    if (!active) return;
    const trip = trips.find(t => t.id === active);
    if (!trip) return;
    const newData = { ...trip.data, ...updates } as TripData;
    setTrips(ts => ts.map(t => (t.id === active ? { ...t, data: newData } : t)));
    await supabase.from('trips').upsert({ id: active, name: newData.name, data: newData });
  };

  const createTrip = async (name: string, init: TripData) => {
    const { data } = await supabase.from('trips').insert({ name, data: init }).select('id').single();
    if (data) setActive(data.id);
  };

  return { trips, active, selectTrip, updateTrip, createTrip };
}
