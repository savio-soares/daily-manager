import { useEffect, useState } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';

/**
 * Hook para buscar o total de gastos por dia do mês atual.
 * Retorna um objeto { 'YYYY-MM-DD': valor }
 * monthDate: dayjs do mês desejado
 * refresh: número para forçar atualização
 */
export default function useFinanceByDay(monthDate, refresh = 0) {
  const [finance, setFinance] = useState({});
  useEffect(() => {
    const start = monthDate.startOf('month').format('YYYY-MM-DD');
    const end = monthDate.endOf('month').format('YYYY-MM-DD');
    axios.get(`/api/finances/by_day/?start=${start}&end=${end}`)
      .then(res => {
        // Backend retorna array de objetos {created_at__date, total}
        // Transformar em { 'YYYY-MM-DD': valor }
        const map = {};
        res.data.forEach(item => {
          map[item.created_at__date] = parseFloat(item.total);
        });
        setFinance(map);
      })
      .catch(() => setFinance({}));
  }, [monthDate, refresh]);
  return finance;
}
