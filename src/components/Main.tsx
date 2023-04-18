import * as React from 'react';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import { TitleBar } from './TitleBar';
import { MainMenu } from './MainMenu';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { Orders } from './Orders';
import { Events } from './events/Events';
import { Assets } from './assets/Assets';
import { Clients } from './clients/Clients';
import backendService from '../services/backendService';
import { useMsal } from '@azure/msal-react';
import { useEffect } from 'react';
import { EventDetails } from './events/EventDetails';
import { OrderDetails } from './events/OrderDetails';

export const Main = () => {
  const { instance, accounts } = useMsal();
  backendService.setMsalInstance(instance, accounts[0]);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === '/') {
      navigate('/assets');
    }
  }, []);

  const [open, setOpen] = React.useState(true);

  const toggleDrawer = () => {
    setOpen(!open);
  };

  // const overriddenColor = location.pathname.indexOf('/events/') > -1 ? 'blue' : null;
  // backgroundColor: theme => (overriddenColor ? overriddenColor : theme.palette.mode === 'light' ? theme.palette.grey[100] : theme.palette.grey[900]),

  return (
    <Box sx={{ display: 'flex' }}>
      <TitleBar toggleDrawer={() => toggleDrawer()} open={open} />
      <MainMenu open={open} />
      <Box
        component='main'
        sx={{
          backgroundColor: theme => (theme.palette.mode === 'light' ? theme.palette.grey[100] : theme.palette.grey[900]),
          flexGrow: 1,
          height: '100vh',
          overflow: 'auto'
        }}
      >
        <Toolbar />
        <Container maxWidth='xl' sx={{ mt: 3, mb: 3 }}>
          <Routes>
            <Route element={<Clients />} path='/clients' />
            <Route element={<Orders />} path='/orders/:type' />
            <Route element={<Events />} path='/events' />
            <Route element={<EventDetails />} path='/events/:id' />
            <Route element={<OrderDetails />} path='/events/:id/orders/:orderId' />
            <Route element={<Assets />} path='/assets' />
          </Routes>
        </Container>
      </Box>
    </Box>
  );
};
