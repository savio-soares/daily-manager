import React from 'react';
import { CircularProgress, Box } from '@mui/material';

/**
 * Componente que mostra um círculo de progresso customizado para o calendário financeiro,
 * mostrando o valor total do dia (R$) no centro.
 * Props:
 *   value: valor total do dia (number)
 *   size: tamanho do círculo
 */
export default function CalendarDayFinance({ value, size = 40 }) {
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
        value={100}
        size={size}
        thickness={4}
        sx={{
          color: '#90caf9',
          position: 'absolute',
          left: 0,
        }}
      />
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
          fontWeight: 700,
          color: '#fff',
          fontSize: size * 0.32,
        }}
      >
        {`R$ ${value ? value.toFixed(2) : '0,00'}`}
      </Box>
    </Box>
  );
}
