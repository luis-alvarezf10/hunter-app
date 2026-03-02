'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/core/config';
import {
  StatCards,
  SalesChart,
  AppointmentsList,
  SalesTable,
} from '../components';
import { HiOutlineTrendingUp } from 'react-icons/hi';

export function DashboardPage() {
  const [nickname, setNickname] = useState('');
  const [uiColor, setUiColor] = useState('#6b1e2e');
  const supabase = createClient();

  useEffect(() => {
    async function loadUserData() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data: stakeholderData } = await supabase
          .from('stakeholders')
          .select('nickname, name, ui_color')
          .eq('id', user.id)
          .single();

        if (stakeholderData) {
          setNickname(stakeholderData.nickname || stakeholderData.name || '');
          setUiColor(stakeholderData.ui_color || '#6b1e2e');
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      }
    }

    loadUserData();
  }, [supabase]);

  return (
    <div className="p-8 space-y-8">
      <h3 className="text-lg lg:text-2xl font-medium">Hola, {nickname} bienvenido de nuevo! 👋</h3>
      <StatCards />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <SalesChart />
        </div>
        <AppointmentsList />
      </div>

      <SalesTable />
    </div>
  );
}
