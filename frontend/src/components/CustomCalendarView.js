import React, { useMemo, useState } from 'react';
import { Box, ButtonGroup, Button, Typography, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import dayjs from 'dayjs';
import CalendarDayProgress from './CalendarDayProgress';
import TaskForm from './TaskForm';
import styles from './CustomCalendarView.module.css';

function getMonthDays(date) {
  const start = dayjs(date).startOf('month');
  const end = dayjs(date).endOf('month');
  const days = [];
  for (let d = start; d.isBefore(end) || d.isSame(end, 'day'); d = d.add(1, 'day')) {
    days.push(d);
  }
  return days;
}

function getWeekDays(date) {
  const start = dayjs(date).startOf('week');
  return Array.from({ length: 7 }, (_, i) => start.add(i, 'day'));
}

export default function CustomCalendarView({ view, setView, date, setDate, dayProgress, onTaskCreated, onTaskChanged, onFinanceChanged, isFinance }) {
  const [open, setOpen] = useState(false);
  // Memoiza os dias para performance
  const days = useMemo(() => {
    if (view === 'month') return getMonthDays(date);
    if (view === 'week') return getWeekDays(date);
    return [date];
  }, [view, date]);

  // Tamanhos dos círculos por visão
  const circleSize = view === 'day' ? 90 : view === 'week' ? 60 : 38;
  const labelVariant = view === 'day' ? 'body2' : 'caption';

  return (
    <Box sx={{ mb: 3, border: '2px solid #333', borderRadius: 3, p: 2, background: '#23272f', position: 'relative', minHeight: 220, display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', height: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', mb: 2 }}>
        <ButtonGroup>
          <Button onClick={() => setView('day')} variant={view === 'day' ? 'contained' : 'outlined'}>Diário</Button>
          <Button onClick={() => setView('week')} variant={view === 'week' ? 'contained' : 'outlined'}>Semanal</Button>
          <Button onClick={() => setView('month')} variant={view === 'month' ? 'contained' : 'outlined'}>Mensal</Button>
        </ButtonGroup>
      </Box>
      <Box className={styles.calendarGrid} sx={{ justifyContent: view === 'month' ? 'flex-start' : 'center', flex: 1 }}>
        {days.map((d, i) => {
          const key = d.format('YYYY-MM-DD');
          const progress = dayProgress?.[key] ?? 0;
          return (
            <Box key={key} className={styles.dayBox} sx={{ width: circleSize + 8, display: 'flex', flexDirection: 'column', alignItems: 'center', p: 0, m: 0 }}>
              {isFinance ? (
                <>
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: circleSize, fontWeight: 900, color: '#fff', fontSize: view === 'day' ? 28 : (view === 'week' ? 16 : 13), mb: 0.5 }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <AttachMoneyIcon sx={{ fontSize: view === 'day' ? 28 : (view === 'week' ? 16 : 13), mr: 0.5, color: '#00e676' }} />
                      <span style={{ fontWeight: 900, color: '#00e676', fontSize: view === 'day' ? 28 : (view === 'week' ? 16 : 13) }}>
                        {progress ? progress.toFixed(2) : '0,00'}
                      </span>
                    </span>
                  </Box>
                  <Typography
                    variant={labelVariant}
                    sx={{ mt: 0.5, color: '#90caf9', fontWeight: d.isSame(dayjs(), 'day') ? 700 : 400, fontSize: view === 'day' ? 13 : 11, textAlign: 'center', lineHeight: 1.2 }}
                  >
                    {view === 'day'
                      ? (<>
                          <span style={{ display: 'block', fontWeight: 600 }}>{d.format('dddd')}</span>
                          <span style={{ display: 'block', fontWeight: 400 }}>{d.format('DD/MM')}</span>
                        </>)
                      : view === 'week' ? d.format('dd') : d.date()}
                  </Typography>
                </>
              ) : (
                <>
                  <CalendarDayProgress value={progress} size={circleSize} showPercent={view === 'day'} />
                  <Typography
                    variant={labelVariant}
                    sx={{ mt: 0.5, color: '#90caf9', fontWeight: d.isSame(dayjs(), 'day') ? 700 : 400, fontSize: view === 'day' ? 13 : 11, textAlign: 'center', lineHeight: 1.2 }}
                  >
                    {view === 'day'
                      ? (<>
                          <span style={{ display: 'block', fontWeight: 600 }}>{d.format('dddd')}</span>
                          <span style={{ display: 'block', fontWeight: 400 }}>{d.format('DD/MM')}</span>
                        </>)
                      : view === 'week' ? d.format('dd') : d.date()}
                  </Typography>
                </>
              )}
            </Box>
          );
        })}
      </Box>
      {/* Botão/modal só para tarefas, centralizado abaixo do calendário */}
      {!isFinance && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <Button
            variant="outlined"
            color="inherit"
            startIcon={<AddIcon />}
            onClick={() => setOpen(true)}
            sx={{
              borderColor: '#888',
              color: '#fff',
              fontWeight: 700,
              borderRadius: 2,
              px: 2.5,
              py: 0.5,
              fontSize: 15,
              textTransform: 'none',
              minWidth: 0,
              '&:hover': { borderColor: '#90caf9', background: 'rgba(0,230,118,0.08)' }
            }}
          >
            Nova tarefa
          </Button>
        </Box>
      )}
      <Dialog open={open.open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Adicionar Tarefa</DialogTitle>
        <DialogContent>
          {!isFinance && (
            <TaskForm key={open.open ? 'open' : 'closed'} onTaskCreated={() => { setOpen(false); onTaskCreated && onTaskCreated(); onTaskChanged && onTaskChanged(); }} date={open.date} editMode />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancelar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
