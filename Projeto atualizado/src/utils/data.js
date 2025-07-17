import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';
import timezone from 'dayjs/plugin/timezone.js';

dayjs.extend(utc);
dayjs.extend(timezone);

export function dataHoraLocal() {
  return dayjs().tz('America/Sao_Paulo').toDate(); 
}
