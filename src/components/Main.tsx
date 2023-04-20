import * as React from 'react';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import { TitleBar } from './TitleBar';
import { MainMenu } from './MainMenu';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { Orders } from './Orders';
import { EventsView } from './events/EventsView';
import { AssetsView } from './assets/AssetsView';
import { ClientsView } from './clients/ClientsView';
import backendService from '../services/backendService';
import { useMsal } from '@azure/msal-react';
import { useEffect } from 'react';
import { EventDetailsView } from './events/EventDetailsView';
import { OrderDetailsView } from './events/OrderDetailsView';

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
            <Route element={<ClientsView />} path='/clients' />
            <Route element={<Orders />} path='/orders/:type' />
            <Route element={<EventsView />} path='/events' />
            <Route element={<EventDetailsView />} path='/events/:id' />
            <Route element={<OrderDetailsView />} path='/events/:id/orders/:orderId' />
            <Route element={<AssetsView />} path='/assets' />
          </Routes>
        </Container>
      </Box>
    </Box>
  );
};
