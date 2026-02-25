'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/core/config/supabase';
import { useRouter } from 'next/navigation';
import { ScheduleCalendar, ScheduleList } from '../components';

interface ScheduleItem {
  id: string;
  id_advisor: string;
  id_property: string;
  description: string;
  client_name: string;
  date: string;
  status: string;
  created_at: string;
  property?: {
    name: string;
    address: string;
  };
}

export default function SchedulePage() {
  const router = useRouter();
  const [schedules, setSchedules] = useState<ScheduleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'calendar' | 'list'>('calendar');

  useEffect(() => {
    fetchSchedules();
  }, []);

  const fetchSchedules = async () => {
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      console.log('Current user:', user);

      if (!user) {
        console.log('No user found');
        return;
      }

      // First, get schedules without the join
      const { data: schedulesData, error: schedulesError } = await supabase
        .from('schedule')
        .select('*')
        .eq('id_advisdor', user.id)
        .order('date', { ascending: true });

      if (schedulesError) {
        console.error('Supabase error:', schedulesError);
        throw schedulesError;
      }

      console.log('Raw schedules from Supabase:', schedulesData);

      // Then, get properties for each schedule
      const transformedData = await Promise.all(
        (schedulesData || []).map(async (schedule) => {
          if (schedule.id_property) {
            const { data: propertyData } = await supabase
              .from('properties')
              .select('name, address')
              .eq('id', schedule.id_property)
              .single();

            return {
              ...schedule,
              property: propertyData || undefined
            };
          }
          return schedule;
        })
      );

      console.log('Schedules loaded:', transformedData);
      console.log('Total schedules:', transformedData.length);
      setSchedules(transformedData);
    } catch (error) {
      console.error('Error fetching schedules:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen text-gray-900 dark:text-white">Cargando agenda...</div>;
  }

  return (
    <div className="p-3 sm:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Mi Agenda</h1>
        <div className="flex gap-2 w-full sm:w-auto">
          <button
            onClick={() => setView('calendar')}
            className={`flex-1 sm:flex-none px-3 sm:px-4 py-2 rounded text-sm sm:text-base ${
              view === 'calendar' 
                ? 'bg-blue-600 dark:bg-blue-700 text-white' 
                : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            Calendario
          </button>
          <button
            onClick={() => setView('list')}
            className={`flex-1 sm:flex-none px-3 sm:px-4 py-2 rounded text-sm sm:text-base ${
              view === 'list' 
                ? 'bg-blue-600 dark:bg-blue-700 text-white' 
                : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            Lista
          </button>
          <button
            onClick={() => router.push('/schedule/add')}
            className="flex-1 sm:flex-none px-3 sm:px-4 py-2 bg-green-600 dark:bg-green-700 text-white rounded hover:bg-green-700 dark:hover:bg-green-800 text-sm sm:text-base"
          >
            + Nueva Cita
          </button>
        </div>
      </div>

      {view === 'calendar' ? (
        <ScheduleCalendar schedules={schedules} onRefresh={fetchSchedules} />
      ) : (
        <ScheduleList schedules={schedules} onRefresh={fetchSchedules} />
      )}
    </div>
  );
}
