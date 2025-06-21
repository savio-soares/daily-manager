import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TaskForm from './TaskForm';

/**
 * Modal reutilizável para editar tarefa usando o mesmo formulário de criação.
 * Props:
 *   open: boolean
 *   onClose: função para fechar
 *   task: objeto da tarefa a editar
 *   onTaskEdited: função chamada após editar
 */
export default function EditTaskModal({ open, onClose, task, onTaskEdited }) {
  // Estado local para forçar TaskForm a resetar ao abrir nova tarefa
  const [formKey, setFormKey] = useState(0);

  React.useEffect(() => {
    setFormKey(k => k + 1); // Força TaskForm a resetar ao abrir nova tarefa
  }, [task]);

  if (!task) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Editar Tarefa</DialogTitle>
      <DialogContent>
        <TaskForm
          key={formKey}
          editMode
          initialData={task}
          onTaskCreated={onTaskEdited}
          onClose={onClose}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
      </DialogActions>
    </Dialog>
  );
}
