import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { authFetch } from '../utils/authFetch';

/**
 * Hook para buscar o progresso de tarefas por dia do mês atual.
 * Retorna um objeto { 'YYYY-MM-DD': proporcao }
 * monthDate: dayjs do mês desejado
 * refresh: número para forçar atualização
 */
export default function useTasksProgressByDay(monthDate, refresh = 0) {
  const [progress, setProgress] = useState({});
  useEffect(() => {
    const start = monthDate.startOf('month').format('YYYY-MM-DD');
    const end = monthDate.endOf('month').format('YYYY-MM-DD');
    authFetch(`/api/tasks/?progress_by_day=1&start=${start}&end=${end}`)
      .then(res => res.json())
      .then(data => setProgress(data))
      .catch(() => setProgress({}));
  }, [monthDate, refresh]);
  return progress;
}
