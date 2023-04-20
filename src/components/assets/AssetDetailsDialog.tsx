import * as React from 'react';
import { AppBar, Dialog, DialogContent, IconButton, Toolbar, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { AssetDetailsView } from './AssetDetailsView';
import { grey } from '@mui/material/colors';
import { Transition } from '../../services/animation';

type AssetsProps = {
  onClose: (refresh: boolean) => void;
  open: boolean;
  assetId: string;
  scroll: string;
  clientId: string;
};

export const AssetDetailsDialog = ({ onClose, open, assetId, scroll, clientId }: AssetsProps): JSX.Element => {
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
          <IconButton edge='start' color='inherit' onClick={e => onClose(false)} aria-label='close' sx={{ color: '#ffffff' }}>
            <CloseIcon />
          </IconButton>
          <Typography sx={{ ml: 2, flex: 1 }} variant='h6' component='div'>
            {assetId === 'new' ? 'New asset' : 'Edit asset'}
          </Typography>
        </Toolbar>
      </AppBar>

      <DialogContent dividers={scroll === 'paper'}>
        <AssetDetailsView onClose={onClose} assetId={assetId} clientId={clientId} />
      </DialogContent>
    </Dialog>
  );
};
