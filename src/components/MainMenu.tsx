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
import { OrderStats, OrderStatus } from '../models/models';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import HourglassTopIcon from '@mui/icons-material/HourglassTop';
import PlaylistAddCheckIcon from '@mui/icons-material/PlaylistAddCheck';
import PlaylistPlayIcon from '@mui/icons-material/PlaylistPlay';
import GroupIcon from '@mui/icons-material/Group';
import { Skeleton } from '@mui/material';

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

export const orderTypesMapping = {
  [OrderStatus.archived]: { label: 'Archived', position: 100, icon: <FolderOpenIcon /> },
  [OrderStatus.requires_approval]: { label: 'Pending review', position: 1, icon: <HourglassTopIcon /> },
  [OrderStatus.in_production]: { label: 'In production', position: 20, icon: <PlaylistPlayIcon /> },
  [OrderStatus.delivered]: { label: 'Delivered', position: 40, icon: <PlaylistAddCheckIcon /> },
  [OrderStatus.approved]: { label: 'In production', position: 30, icon: <PlaylistPlayIcon /> }
  //[OrderStatus.requires_augmentation]: { label: 'Requires augmentation', icon: <PlaylistPlayIcon /> }
};

export const MainMenu = ({ open }: MenuProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

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

  const createOrderStatsButton = (o: OrderStats) => {
    return (
      <ListItemButton
        key={o.type.toUpperCase()}
        onClick={() => openOrders(o.type)}
        selected={location.pathname.startsWith('/orders/' + o.type)}
        sx={{ paddingLeft: '20px' }}
      >
        <ListItemIcon>{orderTypesMapping[o.type].icon}</ListItemIcon>
        <ListItemText primary={orderTypesMapping[o.type].label} />
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

  const ordersPanel = (ordersStats: OrderStats[]) => {
    return ordersStats.length > 0 ? (
      <>
        <Divider sx={{ my: 1 }} />
        <ListSubheader component='div' inset style={{ paddingLeft: 20, visibility: !open ? 'hidden' : 'visible' }}>
          Orders
        </ListSubheader>
        {ordersStats
          .filter(it => it.type !== OrderStatus.in_production)
          .sort((a: OrderStats, b: OrderStats) => {
            return orderTypesMapping[a.type].position - orderTypesMapping[b.type].position;
          })
          .map((it: OrderStats) => createOrderStatsButton(it))}
      </>
    ) : null;
  };

  return (
    <Drawer variant='permanent' open={open}>
      <List component='nav'>
        <ListItemButton onClick={() => openView('clients')} selected={location.pathname.startsWith('/clients')} sx={{ paddingLeft: '20px' }}>
          <ListItemIcon>
            <GroupIcon />
          </ListItemIcon>
          <ListItemText primary='Clients' />
        </ListItemButton>

        <ListItemButton onClick={() => openView('assets')} selected={location.pathname.startsWith('/assets')} sx={{ paddingLeft: '20px' }}>
          <ListItemIcon>
            <PermMediaIcon />
          </ListItemIcon>
          <ListItemText primary='Assets' />
        </ListItemButton>

        <ListItemButton onClick={() => openView('events')} selected={location.pathname.startsWith('/events')} sx={{ paddingLeft: '20px' }}>
          <ListItemIcon>
            <OndemandVideoIcon />
          </ListItemIcon>
          <ListItemText primary='Events' />
        </ListItemButton>

        {isStatsLoading && ordersStats.length === 0 ? <LinearProgress /> : ordersPanel(ordersStats)}
      </List>
    </Drawer>
  );
};
