import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
  useLocation,
} from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Container,
  Button,
  CssBaseline,
  ThemeProvider,
  Paper,
  Breadcrumbs,
  Stack,
  Fade,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Settings as SettingsIcon,
  Science as ScienceIcon,
  Memory as MemoryIcon,
} from '@mui/icons-material';
import { BackendManagement } from './pages/BackendManagement';
import { CourseRules } from './pages/CourseRules';
import { ABTestRules } from './pages/ABTestRules';
import { theme } from './theme';

const NavigationBreadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  const breadcrumbNameMap: { [key: string]: string } = {
    backends: 'Управление бекендами',
    'course-rules': 'Базовые правила',
    'ab-test-rules': 'A/B тесты',
  };

  return (
    <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 3 }}>
      {pathnames.map((value, index) => {
        const last = index === pathnames.length - 1;
        const to = `/${pathnames.slice(0, index + 1).join('/')}`;

        return last ? (
          <Typography color="text.primary" key={to}>
            {breadcrumbNameMap[value]}
          </Typography>
        ) : (
          <Link color="inherit" to={to} key={to}>
            {breadcrumbNameMap[value]}
          </Link>
        );
      })}
    </Breadcrumbs>
  );
};

const NavButton = ({ to, icon, children }: { to: string; icon: React.ReactNode; children: React.ReactNode }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Button
      component={Link}
      to={to}
      color="inherit"
      startIcon={icon}
      sx={{
        mx: 1,
        py: 1,
        position: 'relative',
        '&::after': {
          content: '""',
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '100%',
          height: '3px',
          backgroundColor: '#ffffff',
          transform: isActive ? 'scaleX(1)' : 'scaleX(0)',
          transition: 'transform 0.3s ease-in-out',
        },
        '&:hover::after': {
          transform: 'scaleX(1)',
        },
      }}
    >
      {children}
    </Button>
  );
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <AppBar position="static" elevation={0}>
            <Toolbar>
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mr: 4 }}>
                <MemoryIcon sx={{ fontSize: 28 }} />
                <Typography variant="h6" component="div">
                  Управление бекендами
                </Typography>
              </Stack>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <NavButton to="/backends" icon={<DashboardIcon />}>
                  Бекенды
                </NavButton>
                <NavButton to="/course-rules" icon={<SettingsIcon />}>
                  Базовые правила
                </NavButton>
                <NavButton to="/ab-test-rules" icon={<ScienceIcon />}>
                  A/B тесты
                </NavButton>
              </Box>
            </Toolbar>
          </AppBar>

          <Container maxWidth="lg" sx={{ mt: 4, mb: 4, flex: 1 }}>
            <NavigationBreadcrumbs />
            <Fade in timeout={500}>
              <Paper elevation={0} sx={{ p: 3 }}>
                <Routes>
                  <Route path="/backends" element={<BackendManagement />} />
                  <Route path="/course-rules" element={<CourseRules />} />
                  <Route path="/ab-test-rules" element={<ABTestRules />} />
                  <Route path="/" element={<Navigate to="/backends" replace />} />
                </Routes>
              </Paper>
            </Fade>
          </Container>

          <Box component="footer" sx={{ py: 3, px: 2, mt: 'auto', backgroundColor: 'background.paper' }}>
            <Container maxWidth="lg">
              <Typography variant="body2" color="text.secondary" align="center">
                © 2025 Backend Management System
              </Typography>
            </Container>
          </Box>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;
