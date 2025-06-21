import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { ThemeProvider, createTheme, CssBaseline, Container, Typography, Grid, Box, Button } from '@mui/material';
import CustomCalendarView from './components/CustomCalendarView';
import TaskList from './components/TaskList';
import TagFilter from './components/TagFilter';
import FinanceManager from './components/FinanceManager';
import Login from './components/Login';
import dayjs from 'dayjs';
import './App.css';
import useTasksProgressByDay from './hooks/useTasksProgressByDay';

// Cria um tema escuro global usando o Material UI
const darkTheme = createTheme({
  palette: {
    mode: 'dark', // Ativa o modo escuro
    primary: {
      main: '#90caf9', // Azul claro
    },
    background: {
      default: '#181a20', // Fundo escuro
      paper: '#23272f', // Cartões escuros
    },
  },
  typography: {
    fontFamily: 'JetBrains Mono, Fira Mono, Roboto Mono, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace', // Fonte monoespaçada moderna
    fontWeightRegular: 500,
    fontWeightMedium: 600,
    fontWeightBold: 700,
    letterSpacing: 0.5,
  },
});

function App() {
  // Estado para tipo de visualização e data selecionada
  const [view, setView] = useState('day'); // padrão: diário
  const [date, setDate] = useState(dayjs());
  const [tag, setTag] = useState(''); // Tag selecionada (filtro)
  const [refresh, setRefresh] = useState(0); // Para atualizar lista ao criar tarefa
  // Novo estado para filtro visual
  const [filter, setFilter] = useState('hoje'); // 'hoje' | 'semana' | 'mes' | 'qualquer'
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));

  // Checa se o token ainda existe ao montar
  useEffect(() => {
    setIsAuthenticated(!!localStorage.getItem('token'));
  }, []);

  // Função para logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  // Função chamada após login
  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  // Memoriza funções para evitar loops de renderização
  const handleSetView = useCallback((v) => setView(v), []);
  const handleSetDate = useCallback((d) => setDate(d), []);
  const handleSetTag = useCallback((t) => setTag(t), []);
  const handleTaskChanged = useCallback(() => setRefresh(r => r + 1), []);

  // Memoriza o primeiro dia do mês para evitar dependência instável
  const monthDate = useMemo(() => date.startOf('month'), [date]);
  // Progresso de tarefas por dia do mês
  const dayProgress = useTasksProgressByDay(monthDate, refresh);

  // Memoriza o FinanceManager para evitar re-render desnecessário ao atualizar tarefas
  const MemoizedFinanceManager = useMemo(() => <FinanceManager />, []);

  if (!isAuthenticated) {
    return (
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <Login onLogin={handleLogin} />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={darkTheme}> {/* Aplica o tema escuro em toda a aplicação */}
      <CssBaseline /> {/* Normaliza o CSS para o tema escuro */}
      {/* Header fixo */}
      <Box sx={{ width: '100%', bgcolor: '#181a20', borderBottom: '2px solid #222', py: 2, mb: 4, position: 'sticky', top: 0, zIndex: 10 }}>
        <Container maxWidth="lg" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h4" align="center" sx={{ fontWeight: 700, letterSpacing: 1, color: '#90caf9' }}>
            Daily Task Manager
          </Typography>
          <Button color="primary" variant="outlined" onClick={handleLogout} sx={{ ml: 2 }}>
            Sair
          </Button>
        </Container>
      </Box>
      <Container maxWidth="lg" sx={{ py: 2, minHeight: '80vh', height: '100%' }}>
        <Grid container spacing={4} justifyContent="center" alignItems="stretch" sx={{ height: '100%' }}>
          {/* Área de tarefas: calendário e lista lado a lado no mesmo card */}
          <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <Box sx={{ width: '100%', p: 3, borderRadius: 3, bgcolor: '#232b3a', boxShadow: 2, mx: 1, minHeight: 540, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                <Box sx={{ flex: 1, minWidth: 260, maxWidth: 320 }}>
                  <CustomCalendarView
                    view={view}
                    setView={handleSetView}
                    date={date}
                    setDate={handleSetDate}
                    dayProgress={dayProgress}
                    onTaskCreated={handleTaskChanged}
                    onTaskChanged={handleTaskChanged}
                    isFinance={false}
                  />
                </Box>
                <Box sx={{ flex: 2, minWidth: 260 }}>
                  <TagFilter
                    view={view}
                    date={date}
                    tag={tag}
                    onTagChange={handleSetTag}
                  />
                  <TaskList
                    view={view}
                    date={date}
                    tag={tag}
                    filter={filter}
                    onTaskChanged={handleTaskChanged}
                  />
                </Box>
              </Box>
            </Box>
          </Grid>
          {/* Área de finanças: calendário e lista lado a lado no mesmo card */}
          <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <Box sx={{ width: '100%', p: 3, borderRadius: 3, bgcolor: '#232b3a', boxShadow: 2, mx: 1, minHeight: 540, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <FinanceManager />
            </Box>
          </Grid>
        </Grid>
      </Container>
      {/* Footer */}
      <Box sx={{ width: '100%', bgcolor: '#181a20', borderTop: '2px solid #222', py: 2, mt: 6 }}>
        <Container maxWidth="lg">
          <Typography variant="body2" align="center" color="#90caf9">
            © {new Date().getFullYear()} Daily Task Manager
          </Typography>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;
