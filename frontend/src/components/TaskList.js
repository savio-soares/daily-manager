import React, { useEffect, useState } from 'react';
import { List, ListItem, ListItemText, Chip, Box, Typography, CircularProgress, Checkbox, Stack, IconButton, Menu, MenuItem, Tooltip } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import LabelOutlinedIcon from '@mui/icons-material/LabelOutlined';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import axios from 'axios';
import dayjs from 'dayjs';
import EditTaskModal from './EditTaskModal';

/**
 * Lista de tarefas filtrada por data e tag.
 * Props:
 *   view: 'day' | 'week' | 'month'
 *   date: objeto dayjs da data selecionada
 *   tag: string da tag selecionada (opcional)
 */
export default function TaskList({ view, date, tag, filter, onTaskChanged }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuTask, setMenuTask] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);

  useEffect(() => {
    setLoading(true);
    let url = '';
    if (filter === 'qualquer') {
      url = '/api/tasks/?no_date=1'; // Suporte para tarefas sem data
    } else {
      // Ajusta o parâmetro date conforme a visão
      let dateParam = date;
      if (view === 'month') {
        dateParam = date.startOf('month');
      }
      url = `/api/tasks/?view=${view}&date=${dateParam.format('YYYY-MM-DD')}`;
      if (tag) url += `&tag=${encodeURIComponent(tag)}`;
    }
    axios.get(url)
      .then(res => setTasks(res.data))
      .catch(() => setTasks([]))
      .finally(() => setLoading(false));
  }, [view, date, tag, filter]);

  const handleToggleComplete = async (task) => {
    await axios.patch(`/api/tasks/${task.id}/`, { is_completed: !task.is_completed });
    setTasks(tasks => tasks.map(t => t.id === task.id ? { ...t, is_completed: !t.is_completed, completed_at: !t.is_completed ? dayjs().toISOString() : null } : t));
    if (onTaskChanged) onTaskChanged(); // Notifica o App para atualizar progresso
  };

  const handleMenuOpen = (event, task) => {
    setAnchorEl(event.currentTarget);
    setMenuTask(task);
    // Se já estava aberto, não abre modal, só menu. Se estava fechado, abre modal se for editar.
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
    // Não limpa menuTask aqui, pois precisamos dele para editar
  };

  const handleDelete = async () => {
    await axios.delete(`/api/tasks/${menuTask.id}/`);
    setTasks(tasks => tasks.filter(t => t.id !== menuTask.id));
    handleMenuClose();
  };

  // Para editar, abriria um modal (não implementado aqui, só placeholder)
  const handleEdit = () => {
    setEditModalOpen(true);
    setAnchorEl(null); // Fecha menu imediatamente
  };

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}><CircularProgress /></Box>;

  if (!tasks.length) return <Typography align="center" color="text.secondary">Nenhuma tarefa encontrada.</Typography>;

  return (
    <>
      <List sx={{ width: '100%', maxWidth: '100%', minWidth: 0 }}>
        {tasks.map(task => (
          <ListItem
            key={task.id}
            alignItems="flex-start"
            sx={{
              bgcolor: task.is_completed ? 'success.dark' : 'background.paper',
              mb: 1,
              borderRadius: 2,
              display: 'flex',
              flexDirection: 'column',
              width: '100%',
              maxWidth: '100%',
              minWidth: 0,
              px: 2,
              py: 1.5,
            }}
          >
            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', width: '100%' }}>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Stack direction="row" alignItems="center" spacing={1} flexWrap="wrap">
                  <Typography
                    variant="subtitle1"
                    sx={{
                      textDecoration: task.is_completed ? 'line-through' : 'none',
                      wordBreak: 'break-word',
                      fontWeight: 500,
                      flex: 1,
                      minWidth: 0,
                    }}
                  >
                    {task.title}
                  </Typography>
                  {task.tags && task.tags.split(',').map(t => (
                    <Chip key={t} icon={<LabelOutlinedIcon sx={{ color: '#bdbdbd' }} />} label={t.trim()} size="small" sx={{ bgcolor: 'background.default', color: '#bdbdbd', fontSize: 12, ml: 0.5 }} />
                  ))}
                </Stack>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', minWidth: 0, ml: 2 }}>
                <Chip icon={<CalendarTodayIcon sx={{ color: '#bdbdbd' }} />} label={dayjs(task.created_at).format('DD/MM/YYYY')} size="small" sx={{ bgcolor: 'background.default', color: '#bdbdbd', fontSize: 12, minWidth: 110, justifyContent: 'center', mr: 1 }} />
                <Checkbox checked={task.is_completed} onChange={() => handleToggleComplete(task)} sx={{ mr: 1 }} />
                <Tooltip title="Mais opções">
                  <IconButton edge="end" onClick={e => handleMenuOpen(e, task)}>
                    <MoreVertIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
            {task.description && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, wordBreak: 'break-word' }}>
                {task.description}
                {task.is_completed && <span style={{ marginLeft: 8, color: '#bdbdbd' }}>--- concluída</span>}
              </Typography>
            )}
          </ListItem>
        ))}
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
          <MenuItem onClick={handleEdit}>Editar</MenuItem>
          <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>Apagar</MenuItem>
        </Menu>
      </List>
      <EditTaskModal
        open={editModalOpen && !!menuTask}
        onClose={() => { setEditModalOpen(false); setMenuTask(null); }}
        task={menuTask}
        onTaskEdited={() => {
          setEditModalOpen(false);
          setMenuTask(null);
          // Atualiza lista após editar
          setLoading(true);
          let dateParam = date;
          if (view === 'month') dateParam = date.startOf('month');
          let url = `/api/tasks/?view=${view}&date=${dateParam.format('YYYY-MM-DD')}`;
          if (tag) url += `&tag=${encodeURIComponent(tag)}`;
          axios.get(url)
            .then(res => setTasks(res.data))
            .catch(() => setTasks([]))
            .finally(() => setLoading(false));
        }}
      />
    </>
  );
}
