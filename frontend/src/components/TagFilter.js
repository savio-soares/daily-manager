import React, { useEffect, useState } from 'react';
import { Box, Chip, Typography, Stack } from '@mui/material';
import axios from 'axios';

/**
 * Filtro visual de tags. Mostra todas as tags das tarefas visíveis e permite filtrar.
 * Props:
 *   view, date: usados para buscar as tarefas do período
 *   tag: tag selecionada
 *   onTagChange: função para mudar a tag
 */
export default function TagFilter({ view, date, tag, onTagChange }) {
  const [tags, setTags] = useState([]);

  useEffect(() => {
    // Busca tarefas para extrair as tags únicas
    let url = `/api/tasks/?view=${view}&date=${date.format('YYYY-MM-DD')}`;
    axios.get(url).then(res => {
      const allTags = res.data.flatMap(t => t.tags ? t.tags.split(',').map(s => s.trim()) : []);
      setTags([...new Set(allTags)].filter(Boolean));
    });
  }, [view, date]);

  return (
    <Box sx={{ my: 2, textAlign: 'center' }}>
      <Typography variant="subtitle2" color="text.secondary" gutterBottom>Filtrar por tag:</Typography>
      <Stack direction="row" spacing={1} justifyContent="center">
        <Chip label="Todas" clickable color={!tag ? 'primary' : 'default'} onClick={() => onTagChange('')} />
        {tags.length === 0 && <Chip label="Nenhuma tag encontrada" disabled />}
        {tags.map(t => (
          <Chip key={t} label={t} clickable color={tag === t ? 'primary' : 'default'} onClick={() => onTagChange(t)} />
        ))}
      </Stack>
    </Box>
  );
}
