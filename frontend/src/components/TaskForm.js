import React, { useState } from 'react';
import { Box, TextField, Button, Stack, Chip } from '@mui/material';
import dayjs from 'dayjs';
import { authFetch } from '../utils/authFetch';

/**
 * Formulário para adicionar nova tarefa com tags.
 * Props:
 *   onTaskCreated: função chamada após criar tarefa
 *   date: data base para a tarefa
 *   editMode: booleano (opcional, se true edita)
 *   initialData: dados iniciais da tarefa (opcional)
 *   onClose: função para fechar modal (opcional)
 */
export default function TaskForm({ onTaskCreated, date, editMode = false, initialData = null, onClose }) {
  const [title, setTitle] = useState(initialData ? initialData.title : '');
  const [description, setDescription] = useState(initialData ? initialData.description : '');
  const [tags, setTags] = useState(initialData ? (initialData.tags ? initialData.tags.split(',').map(t => t.trim()) : []) : []);
  const [tagInput, setTagInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(initialData ? dayjs(initialData.created_at) : date);

  React.useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setDescription(initialData.description || '');
      setTags(initialData.tags ? initialData.tags.split(',').map(t => t.trim()) : []);
      setSelectedDate(dayjs(initialData.created_at));
    }
  }, [initialData]);

  const handleAddTag = () => {
    if (tagInput && !tags.includes(tagInput)) setTags([...tags, tagInput]);
    setTagInput('');
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        title,
        description,
        tags: tags.join(','),
        created_at: selectedDate.format('YYYY-MM-DD'),
      };
      let response;
      if (editMode && initialData) {
        response = await authFetch(`/api/tasks/${initialData.id}/`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        response = await authFetch('/api/tasks/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }
      if (!response.ok) throw new Error('Erro ao salvar tarefa');
      if (!editMode) {
        setTitle(''); setDescription(''); setTags([]); setTagInput(''); setSelectedDate(date);
      }
      onTaskCreated && onTaskCreated();
      onClose && onClose();
    } catch (err) {
      // Se der erro, não limpa lista
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: editMode ? 'block' : 'none' }}>
      {/* Formulário só aparece em modo edição ou modal */}
      <Box sx={{ mb: 2, width: '100%', maxWidth: 340, mx: 'auto' }}>
        <div style={{ color: '#90caf9', fontWeight: 500, marginBottom: 4 }}>Data da tarefa</div>
        <TextField
          type="date"
          value={selectedDate.format('YYYY-MM-DD')}
          onChange={e => setSelectedDate(dayjs(e.target.value))}
          fullWidth
          InputLabelProps={{ shrink: true }}
          sx={{ background: '#23272f', borderRadius: 1 }}
        />
      </Box>
      <Stack spacing={2} direction="row">
        <TextField label="Título" value={title} onChange={e => setTitle(e.target.value)} required fullWidth />
        <TextField label="Descrição" value={description} onChange={e => setDescription(e.target.value)} fullWidth />
      </Stack>
      <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 2 }}>
        <TextField label="Adicionar tag" value={tagInput} onChange={e => setTagInput(e.target.value)} size="small" onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddTag())} />
        <Button onClick={handleAddTag} variant="outlined" size="small">Adicionar</Button>
        {tags.map(t => <Chip key={t} label={t} onDelete={() => setTags(tags.filter(x => x !== t))} />)}
      </Stack>
      <Button type="submit" variant="contained" sx={{ mt: 2 }} disabled={loading || !title} fullWidth>
        {loading ? (editMode ? 'Salvando...' : 'Adicionando...') : (editMode ? 'Salvar Alterações' : 'Adicionar Tarefa')}
      </Button>
    </Box>
  );
}
