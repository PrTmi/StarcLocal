import * as React from 'react';
import { AppBar, Box, Collapse, Dialog, IconButton, Toolbar, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { grey } from '@mui/material/colors';
import { useEffect, useState } from 'react';
import { fetchAssetsByQuery } from '../../../state/assetsSlice';
import { useDispatch } from 'react-redux';
import { Event } from '../../../models/models';
import { Transition } from '../../../services/animation';
import Container from '@mui/material/Container';
import { NewOrderFormSteps } from './NewOrderFormSteps';
import { EventDetailsSideBarView } from './EventDetailsSideBarView';
import { AppDispatch } from '../../../state/store';

type EventProps = {
  onClose: (refresh: boolean) => void;
  open: boolean;
  event: Event;
};

export const NewOrderDialogView = ({ onClose, open, event }: EventProps, sidebar: boolean): JSX.Element => {
  const dispatch = useDispatch<AppDispatch>();
  const [sideBarVisible, setSideBarVisible] = useState<boolean>(true);

  useEffect(() => {
    dispatch(fetchAssetsByQuery(null));
  }, []);

  return (
    <Dialog
      TransitionComponent={Transition}
      fullScreen
      open={open}
      onClose={onClose}
      sx={{
        '.MuiDialog-paper': {
          backgroundColor: grey[100],
          display: 'flex',
          height: '100vh'
        }
      }}
    >
      <AppBar sx={{ position: 'relative' }}>
        <Toolbar sx={{ backgroundColor: grey[800] }}>
          <IconButton edge='start' color='inherit' onClick={e => onClose(false)} aria-label='close' sx={{ color: '#ffffff' }}>
            <CloseIcon />
          </IconButton>
          <Typography sx={{ ml: 2, flex: 1 }} variant='h6' component='div'>
            New order
          </Typography>
        </Toolbar>
      </AppBar>
      <Box sx={{ display: 'flex', flex: 1 }}>
        <Container maxWidth='lg' sx={{ flexDirection: 'row', flex: 1, mt: 4, mb: 3 }}>
          <NewOrderFormSteps onClose={onClose} event={event} onVisibilityChange={v => setSideBarVisible(v)} />
        </Container>
        <Collapse orientation='horizontal' in={sideBarVisible} collapsedSize={0} sx={{ background: '#ffffff' }}>
          <EventDetailsSideBarView event={event} />
        </Collapse>
      </Box>
    </Dialog>
  );
};
