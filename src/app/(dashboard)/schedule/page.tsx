import { SchedulePage } from '@/features/schedule';
import type { Metadata } from 'next'; 

export const metadata: Metadata = {
  title: 'Agenda | Go Hunter',
};

export default function Schedule() {
  return <SchedulePage />;
}
