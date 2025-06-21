import React from 'react';
import { CircularProgress, Box } from '@mui/material';

/**
 * Componente que mostra um círculo de progresso customizado para o calendário,
 * com cor variando de laranja (incompleto) a verde (completo).
 * Props:
 *   value: número entre 0 e 1 (proporção de tarefas completas)
 *   size: tamanho do círculo
 */
export default function CalendarDayProgress({ value, size = 40, showPercent = true }) {
  // Interpola cor de laranja para verde
  const getColor = (v) => {
    // 0 = laranja (#FFA726), 1 = verde (#66BB6A)
    const from = [255, 167, 38];
    const to = [102, 187, 106];
    const rgb = from.map((c, i) => Math.round(c + (to[i] - c) * v));
    return `rgb(${rgb.join(',')})`;
  };
  return (
    <Box sx={{ position: 'relative', display: 'inline-flex' }}>
      <CircularProgress
        variant="determinate"
        value={100}
        size={size}
        thickness={4}
        sx={{ color: '#333' }} // fundo
      />
      <CircularProgress
        variant="determinate"
        value={value * 100}
        size={size}
        thickness={4}
        sx={{
          color: getColor(value),
          position: 'absolute',
          left: 0,
        }}
      />
      {showPercent && (
        <Box
          sx={{
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            position: 'absolute',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 600,
            color: '#fff',
            fontSize: size * 0.35,
          }}
        >
          {Math.round(value * 100)}%
        </Box>
      )}
    </Box>
  );
}
