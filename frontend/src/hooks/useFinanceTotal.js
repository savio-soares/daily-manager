import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { authFetch } from '../utils/authFetch';

/**
 * Hook para buscar o total de gastos por semana ou mês.
 * @param {string} type 'week' | 'month'
 * @param {dayjs} date referência (primeiro dia da semana/mês)
 * @param {number} refresh para forçar atualização
 * @returns valor total
 */
export default function useFinanceTotal(type, date, refresh = 0) {
  const [total, setTotal] = useState(0);
  useEffect(() => {
    let start, end;
    if (type === 'week') {
      start = date.startOf('week').format('YYYY-MM-DD');
      end = date.endOf('week').format('YYYY-MM-DD');
    } else {
      start = date.startOf('month').format('YYYY-MM-DD');
      end = date.endOf('month').format('YYYY-MM-DD');
    }
    authFetch(`/api/finances/by_day/?start=${start}&end=${end}`)      .then(res => res.json())
      .then(data => {
        let sum = 0;
        data.forEach(item => {
          sum += parseFloat(item.total);
        });
        setTotal(sum);
      })
      .catch(() => setTotal(0));
  }, [type, date, refresh]);
  return total;
}
