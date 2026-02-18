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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
        <div 
          className="p-4 rounded-lg text-white relative overflow-hidden" 
          style={{background: uiColor}}
        >
          <HiOutlineTrendingUp className="absolute text-white/10 text-8xl top-1/3 right-0"/>
          <div className="grid md:flex gap-2 items-end relative z-10">
            <h3 className="text-xl md:text-2xl">Bienvenido de nuevo! 👋,</h3>
            <h4 className="text-xl">{nickname}</h4>
          </div>
          <p className="relative z-10">Aquí está un resumen de tu actividad</p>
        </div>
        <div></div>
      </div>

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
