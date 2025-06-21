import React, { useEffect, useState } from 'react';
import { Box, Chip, Typography, Stack } from '@mui/material';
import { authFetch } from '../utils/authFetch';

/**
 * Filtro visual de tags de gastos. Mostra todas as tags dos gastos visíveis e permite filtrar.
 * Props:
 *   view, date: usados para buscar os gastos do período
 *   tag: tag selecionada
 *   onTagChange: função para mudar a tag
 */
export default function FinanceTagFilter({ view, date, tag, onTagChange }) {
  const [tags, setTags] = useState([]);

  useEffect(() => {
    // Busca gastos para extrair as tags únicas
    let url = `/api/finances/?date=${date.format('YYYY-MM-DD')}`;
    authFetch(url)
      .then(res => res.json())
      .then(data => {
        const allTags = data.flatMap(f => f.tags ? f.tags.split(',').map(s => s.trim()) : []);
        setTags([...new Set(allTags)].filter(Boolean));
      });
  }, [view, date]);

  return (
    <Box sx={{ my: 2, textAlign: 'center' }}>
      <Typography variant="subtitle2" color="text.secondary" gutterBottom>Filtrar por tag:</Typography>
      <Stack direction="row" spacing={1} justifyContent="center">
        <Chip label="Todas" clickable color={!tag ? 'primary' : 'default'} onClick={() => onTagChange('')} />
        {tags.length === 0 && <Chip label="Nenhuma tag encontrada" disabled sx={{ fontWeight: 700, fontSize: 15 }} />}
        {tags.map(t => (
          <Chip key={t} label={t} clickable color={tag === t ? 'primary' : 'default'} onClick={() => onTagChange(t)} />
        ))}
      </Stack>
    </Box>
  );
}
