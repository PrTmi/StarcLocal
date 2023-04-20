import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Button, LinearProgress, Stack, Typography } from '@mui/material';
import { archiveClient, clientsSelector, fetchClientsByQuery, unArchiveClient } from '../../state/clientsSlice';

import { Client } from '../../models/models';
import IconButton from '@mui/material/IconButton';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { ClientDetailsDialog } from './ClientDetailsDialog';

import Collapse from '@mui/material/Collapse';
import GroupIcon from '@mui/icons-material/Group';
import { ClientsTable } from './ClientsTable';
import { EmptyStateComponent } from '../shared/EmptyStateComponent';
import { useNavigate } from 'react-router-dom';
import { AppDispatch } from '../../state/store';

export const Clients = (): JSX.Element => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const [clientId, setClientId] = useState<string>('new');
  const [scroll, setScroll] = React.useState('paper');
  const [detailsOpen, setDetailsOpen] = useState<boolean>(false);
  const [open, setOpen] = React.useState(false);
  const { clients, isLoading } = useSelector(clientsSelector);

  useEffect(() => {
    dispatch(fetchClientsByQuery());
  }, []);

  const openDetails = (c: Client) => {
    setClientId(c.id!!);
    setDetailsOpen(true);
    setScroll('paper');
  };

  const createClient = () => {
    setClientId('new');
    setDetailsOpen(true);
  };

  const unArchive = async (c: Client) => {
    await dispatch(unArchiveClient(c.id!!));
    dispatch(fetchClientsByQuery());
  };

  const archive = async (c: Client) => {
    await dispatch(archiveClient(c.id!!));
    dispatch(fetchClientsByQuery());
  };

  const closeDetailsDialog = () => {
    setDetailsOpen(false);
    dispatch(fetchClientsByQuery());
  };

  const showDetails = (c: Client, routeName: string) => {
    navigate(`${routeName}/?clientId=${c.id}`);
  };

  return (
    <>
      <Box pb={2} sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant='h5' sx={{ lineHeight: 1.5 }}>
          Clients
        </Typography>
        <Button variant='outlined' onClick={createClient}>
          New client
        </Button>
      </Box>
      {!isLoading ? (
        <div style={{ width: '100%' }}>
          {clients.length ? (
            <ClientsTable
              clients={clients.filter((it: Client) => !it.archived)}
              onEdit={openDetails}
              onArchive={archive}
              onUnArchive={unArchive}
              onDetails={showDetails}
            />
          ) : (
            <EmptyStateComponent icon={<GroupIcon fontSize={'large'} />} text='clients' />
          )}
        </div>
      ) : (
        <LinearProgress />
      )}

      <Stack
        mt={2}
        direction='row'
        alignItems='center'
        onClick={() => setOpen(!open)}
        sx={{
          cursor: 'pointer',
          mb: 1,
          opacity: clients.filter((it: Client) => it.archived).length < 1 ? '0.4' : '1',
          pointerEvents: clients.filter((it: Client) => it.archived).length < 1 ? 'none' : 'pointer'
        }}
      >
        {clients.filter((it: any) => it.archived).length > 1 || clients.filter((it: any) => it.archived).length === 0 ? (
          <Typography>{clients.filter((it: Client) => it.archived).length} ARCHIVED CLIENTS</Typography>
        ) : (
          <Typography>{clients.filter((it: Client) => it.archived).length} ARCHIVED CLIENT</Typography>
        )}
        <IconButton aria-label='expand row' size='small'>
          {open && clients.filter((it: Client) => it.archived).length > 0 ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
        </IconButton>
      </Stack>

      <Collapse in={open} timeout='auto' unmountOnExit>
        <div style={{ width: '100%' }}>
          <ClientsTable
            clients={clients.filter((it: Client) => it.archived)}
            onEdit={openDetails}
            onArchive={archive}
            onUnArchive={unArchive}
            onDetails={showDetails}
          />
        </div>
      </Collapse>
      <ClientDetailsDialog onClose={closeDetailsDialog} open={detailsOpen} clientId={clientId} scroll={scroll} />
    </>
  );
};
