import React, { useState, useCallback, useMemo } from 'react';
import { Box, Typography, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import CustomCalendarView from './CustomCalendarView';
import FinanceList from './FinanceList';
import TagFilter from './TagFilter';
import FinanceTagFilter from './FinanceTagFilter';
import useFinanceByDay from '../hooks/useFinanceByDay';
import useFinanceTotal from '../hooks/useFinanceTotal';
import dayjs from 'dayjs';

export default function FinanceManager() {
  const [view, setView] = useState('day');
  const [date, setDate] = useState(dayjs());
  const [tag, setTag] = useState('');
  const [refresh, setRefresh] = useState(0);

  // Memoriza o primeiro dia do mês para evitar dependência instável
  const monthDate = useMemo(() => date.startOf('month'), [date]);
  // Hook para buscar gastos por dia
  const dayFinance = useFinanceByDay(monthDate, refresh);
  // Hook para total semanal/mensal
  const weekTotal = useFinanceTotal('week', date, refresh);
  const monthTotal = useFinanceTotal('month', date, refresh);

  // Geração de opções de mês/ano (últimos 24 meses)
  const months = useMemo(() => {
    const arr = [];
    const now = dayjs();
    for (let i = 0; i < 24; i++) {
      const d = now.subtract(i, 'month');
      arr.push({ label: d.format('MMMM [de] YYYY'), value: d.startOf('month') });
    }
    return arr.reverse();
  }, []);

  // Memoriza a função para não disparar useEffect infinito
  const handleFinanceChanged = useCallback(() => {
    setRefresh(r => r + 1);
  }, []);

  return (
    <Box sx={{ mt: 6 }}>
      <Typography variant="h4" gutterBottom align="center" sx={{ mb: 3 }}>
        Controle Financeiro
      </Typography>
      <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
        <Box sx={{ flex: 1, minWidth: 320, maxWidth: 420 }}>
          {/* Seletor de mês/ano na visão mensal */}
          {view === 'month' && (
            <FormControl fullWidth size="small" sx={{ mb: 2 }}>
              <InputLabel id="select-mes-label">Mês</InputLabel>
              <Select
                labelId="select-mes-label"
                value={date.startOf('month').format('YYYY-MM')}
                label="Mês"
                onChange={e => {
                  const [year, month] = e.target.value.split('-');
                  setDate(dayjs(`${year}-${month}-01`));
                }}
              >
                {months.map(m => (
                  <MenuItem key={m.value.format('YYYY-MM')} value={m.value.format('YYYY-MM')}>
                    {m.label.charAt(0).toUpperCase() + m.label.slice(1)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
          {/* Total semanal/mensal acima do calendário */}
          {view === 'week' && (
            <Typography variant="h6" align="center" sx={{ mb: 1, color: '#00e676', fontWeight: 700, fontSize: { xs: 18, sm: 22 } }}>
              Total da semana: R$ {weekTotal.toFixed(2)}
            </Typography>
          )}
          {view === 'month' && (
            <Typography variant="h6" align="center" sx={{ mb: 1, color: '#00e676', fontWeight: 700, fontSize: { xs: 18, sm: 22 } }}>
              Total do mês: R$ {monthTotal.toFixed(2)}
            </Typography>
          )}
          <CustomCalendarView
            view={view}
            setView={setView}
            date={date}
            setDate={setDate}
            dayProgress={dayFinance}
            onFinanceChanged={handleFinanceChanged}
            isFinance={true}
          />
        </Box>
        <Box sx={{ flex: 2, minWidth: 320 }}>
          <FinanceTagFilter view={view} date={date} tag={tag} onTagChange={setTag} />
          <FinanceList view={view} date={date} tag={tag} key={refresh} onFinanceChanged={handleFinanceChanged} />
        </Box>
      </Box>
    </Box>
  );
}
