import * as React from 'react';
import { AppBar, Dialog, DialogContent, IconButton, Toolbar, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { ClientDetailsView } from './ClientDetailsView';
import { grey } from '@mui/material/colors';
import { Transition } from '../../services/animation';

type ClientProps = {
  onClose: () => void;
  open: boolean;
  clientId: string;
  scroll: string;
};

export const ClientDetailsDialog = ({ onClose, open, clientId, scroll }: ClientProps): JSX.Element => {
  return (
    <Dialog
      TransitionComponent={Transition}
      fullScreen
      open={open}
      onClose={onClose}
      sx={{
        '.MuiDialog-paper': {
          backgroundColor: grey[200]
        },
        '.MuiContainer-root': {
          paddingTop: '32px'
        }
      }}
    >
      <AppBar sx={{ position: 'relative' }}>
        <Toolbar sx={{ backgroundColor: grey[800] }}>
          <IconButton edge='start' color='inherit' onClick={onClose} aria-label='close' sx={{ color: '#ffffff' }}>
            <CloseIcon />
          </IconButton>
          <Typography sx={{ ml: 2, flex: 1 }} variant='h6' component='div'>
            {clientId === 'new' ? 'New client' : 'Edit client'}
          </Typography>
        </Toolbar>
      </AppBar>

      <DialogContent dividers={scroll === 'paper'}>
        <ClientDetailsView onClose={onClose} clientId={clientId} />
      </DialogContent>
    </Dialog>
  );
};
