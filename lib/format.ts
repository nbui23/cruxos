import { format } from 'date-fns';

export function formatDateLong(date: Date | string) {
  return format(new Date(date), 'MMM d, yyyy');
}

export function formatHours(hours: number) {
  return `${hours.toFixed(1)}h`;
}
