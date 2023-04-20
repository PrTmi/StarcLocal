import { styled } from '@mui/material/styles';
import * as React from 'react';
import { useEffect } from 'react';
import { Badge, LinearProgress, ListItemButton, ListItemIcon, ListItemSecondaryAction, ListSubheader } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import MuiDrawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItemText from '@mui/material/ListItemText';
import OndemandVideoIcon from '@mui/icons-material/OndemandVideo';
import PermMediaIcon from '@mui/icons-material/PermMedia';
import { loadOrdersStats, ordersSelector } from '../state/ordersSlice';
import { OrderStatus, OrderStatusCount } from '../models/models';
import GroupIcon from '@mui/icons-material/Group';
import { Skeleton } from '@mui/material';
import { orderTypesMapping } from '../services/orderTypesMapping';
import { AppDispatch } from '../state/store';

const drawerWidth = 320;

const Drawer = styled(MuiDrawer, { shouldForwardProp: prop => prop !== 'open' })(({ theme, open }) => ({
  '& .MuiDrawer-paper': {
    paddingTop: 64,
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    }),
    boxSizing: 'border-box',
    ...(!open && {
      overflowX: 'hidden',
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen
      }),
      width: theme.spacing(7),
      [theme.breakpoints.up('sm')]: {
        width: theme.spacing(9)
      }
    })
  }
}));

type MenuProps = {
  open: boolean;
};

export const MainMenu = ({ open }: MenuProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();

  const { ordersStats, isStatsLoading } = useSelector(ordersSelector);

  useEffect(() => {
    dispatch(loadOrdersStats());
  }, []);

  const openOrders = (o: OrderStatus) => {
    navigate(`/orders/${o}`);
  };

  const openView = (path: string) => {
    navigate(`/${path}`);
  };

  const createOrderStatsButton = (def: any, o: OrderStatusCount) => {
    return (
      <ListItemButton
        key={o.status.toUpperCase()}
        onClick={() => openOrders(o.status)}
        selected={location.pathname.startsWith('/orders/' + o.status)}
        sx={{ paddingLeft: '20px' }}
      >
        <ListItemIcon>{def.icon}</ListItemIcon>
        <ListItemText primary={def.label} />
        {open ? (
          <ListItemSecondaryAction style={{ paddingRight: 8 }}>
            {isStatsLoading ? (
              <Skeleton variant='circular' animation='wave' width={16} height={16} />
            ) : (
              <Badge badgeContent={o.count === -1 ? '' : o.count + ''} />
            )}
          </ListItemSecondaryAction>
        ) : null}
      </ListItemButton>
    );
  };

  const ordersPanel = (ordersStats: OrderStatusCount[]) => {
    return ordersStats.length > 0 ? (
      <>
        <Divider sx={{ mt: 2, mb: 1 }} />
        <ListSubheader component='div' inset style={{ paddingLeft: 20, visibility: !open ? 'hidden' : 'visible' }}>
          Orders
        </ListSubheader>

        {orderTypesMapping
          .filter(it => it.showInMenu)
          .sort((a, b) => {
            return a.menuPosition - b.menuPosition;
          })
          .map(it => createOrderStatsButton(it, ordersStats.find(stat => it.status === stat.status) as OrderStatusCount))}
      </>
    ) : null;
  };

  return (
    <Drawer variant='permanent' open={open}>
      <List component='nav'>
        <ListItemButton onClick={() => openView('events')} selected={location.pathname.startsWith('/events')} sx={{ paddingLeft: '20px', marginTop: '8px' }}>
          <ListItemIcon>
            <OndemandVideoIcon />
          </ListItemIcon>
          <ListItemText primary='Events' />
        </ListItemButton>

        <Divider sx={{ my: 2 }} />

        <ListItemButton onClick={() => openView('clients')} selected={location.pathname.startsWith('/clients')} sx={{ paddingLeft: '20px' }}>
          <ListItemIcon>
            <GroupIcon />
          </ListItemIcon>
          <ListItemText primary='Advertisers' />
        </ListItemButton>

        <ListItemButton onClick={() => openView('assets')} selected={location.pathname.startsWith('/assets')} sx={{ paddingLeft: '20px' }}>
          <ListItemIcon>
            <PermMediaIcon />
          </ListItemIcon>
          <ListItemText primary='Assets' />
        </ListItemButton>

        {isStatsLoading && ordersStats.length === 0 ? <LinearProgress /> : ordersPanel(ordersStats)}
      </List>
    </Drawer>
  );
};
