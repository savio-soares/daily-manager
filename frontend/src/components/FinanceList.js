import React, { useEffect, useState } from 'react';
import { List, ListItem, ListItemText, Chip, Box, Typography, CircularProgress, Stack, IconButton, Menu, MenuItem, Tooltip, TextField, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import LabelOutlinedIcon from '@mui/icons-material/LabelOutlined';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import EditIcon from '@mui/icons-material/Edit';
import axios from 'axios';
import dayjs from 'dayjs';

export default function FinanceList({ view, date, tag, onFinanceChanged }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [desc, setDesc] = useState('');
  const [value, setValue] = useState('');
  const [tags, setTags] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuItem, setMenuItem] = useState(null);

  useEffect(() => {
    setLoading(true);
    let url = `/api/finances/?view=${view}&date=${date.format('YYYY-MM-DD')}`;
    if (tag) url += `&tag=${encodeURIComponent(tag)}`;
    axios.get(url)
      .then(res => setItems(res.data))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, [view, date, tag, onFinanceChanged]);

  const handleAdd = async () => {
    if (!desc || !value) return;
    await axios.post('/api/finances/', {
      description: desc,
      value: parseFloat(value),
      tags,
      created_at: date.format('YYYY-MM-DD'),
    });
    setDesc(''); setValue(''); setTags('');
    setModalOpen(false);
    onFinanceChanged && onFinanceChanged();
  };

  const handleDelete = async (item) => {
    await axios.delete(`/api/finances/${item.id}/`);
    onFinanceChanged && onFinanceChanged();
  };

  const handleMenuOpen = (event, item) => {
    setAnchorEl(event.currentTarget);
    setMenuItem(item);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuItem(null);
  };

  const handleEdit = () => {
    setEditItem(menuItem);
    setDesc(menuItem.description);
    setValue(menuItem.value);
    setTags(menuItem.tags);
    setEditModalOpen(true);
    handleMenuClose();
  };

  const handleEditSave = async () => {
    if (!desc || !value) return;
    await axios.patch(`/api/finances/${editItem.id}/`, {
      description: desc,
      value: parseFloat(value),
      tags,
    });
    setEditModalOpen(false);
    setEditItem(null);
    setDesc(''); setValue(''); setTags('');
    onFinanceChanged && onFinanceChanged();
  };

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}><CircularProgress /></Box>;
  return (
    <>
      {/* Lista de gastos */}
      <List sx={{ width: '100%', maxWidth: '100%', minWidth: 0 }}>
        {items.map(item => (
          <ListItem key={item.id} sx={{ bgcolor: 'background.paper', mb: 1, borderRadius: 2, px: 2, py: 1.5 }}>
            <Box sx={{ flex: 1 }}>
              <Stack direction="row" alignItems="center" spacing={1} flexWrap="wrap">
                <Typography variant="subtitle1" sx={{ fontWeight: 500, flex: 1, minWidth: 0 }}>
                  {item.description}
                </Typography>
                <Chip icon={<LabelOutlinedIcon sx={{ color: '#bdbdbd' }} />} label={item.tags} size="small" sx={{ bgcolor: 'background.default', color: '#bdbdbd', fontSize: 12, ml: 0.5 }} />
                <Chip icon={<CalendarTodayIcon sx={{ color: '#bdbdbd' }} />} label={dayjs(item.created_at).format('DD/MM/YYYY')} size="small" sx={{ bgcolor: 'background.default', color: '#bdbdbd', fontSize: 12, minWidth: 110, justifyContent: 'center', mr: 1 }} />
                <Chip label={`R$ ${(Number(item.value) || 0).toFixed(2)}`} size="small" sx={{ bgcolor: '#90caf9', color: '#23272f', fontWeight: 700, fontSize: 13, ml: 1 }} />
                <Tooltip title="Mais opções">
                  <IconButton edge="end" onClick={e => handleMenuOpen(e, item)}>
                    <MoreVertIcon />
                  </IconButton>
                </Tooltip>
              </Stack>
            </Box>
          </ListItem>
        ))}
      </List>
      {/* Botão Novo gasto movido para baixo da lista */}
      <Box sx={{ mt: 2, display: 'flex', gap: 1, justifyContent: 'center' }}>
        <Button onClick={() => setModalOpen(true)} variant="contained" startIcon={<AddCircleOutlineIcon />}>Novo gasto</Button>
      </Box>
      {/* Dialogs e menus */}
      <Dialog open={modalOpen} onClose={() => setModalOpen(false)}>
        <DialogTitle>Novo Gasto</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 320 }}>
          <TextField label="Descrição" value={desc} onChange={e => setDesc(e.target.value)} size="small" autoFocus />
          <TextField label="Valor" value={value} onChange={e => setValue(e.target.value)} size="small" type="number" />
          <TextField label="Tags" value={tags} onChange={e => setTags(e.target.value)} size="small" />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setModalOpen(false)}>Cancelar</Button>
          <Button onClick={handleAdd} variant="contained">Adicionar</Button>
        </DialogActions>
      </Dialog>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={handleEdit}><EditIcon fontSize="small" sx={{ mr: 1 }} />Editar</MenuItem>
        <MenuItem onClick={() => { handleDelete(menuItem); handleMenuClose(); }}>Apagar</MenuItem>
      </Menu>
      <Dialog open={editModalOpen} onClose={() => setEditModalOpen(false)}>
        <DialogTitle>Editar Gasto</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 320 }}>
          <TextField label="Descrição" value={desc} onChange={e => setDesc(e.target.value)} size="small" autoFocus />
          <TextField label="Valor" value={value} onChange={e => setValue(e.target.value)} size="small" type="number" />
          <TextField label="Tags" value={tags} onChange={e => setTags(e.target.value)} size="small" />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditModalOpen(false)}>Cancelar</Button>
          <Button onClick={handleEditSave} variant="contained">Salvar</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
