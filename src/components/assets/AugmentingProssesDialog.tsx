import * as React from 'react';
import { Asset } from '../../models/models';
import { Alert, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, IconButton, LinearProgress } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import augmentImg from '../../images/augmentImg.gif';
// @ts-ignore
import { Image } from 'mui-image';

type AugmentAssetDialogProps = {
  onClose: () => void;
  asset: Asset | null;
  open: boolean;
};

export const AugmentingProssessDialog = ({ onClose, asset, open }: AugmentAssetDialogProps): JSX.Element => {
  return (
    <Dialog onClose={onClose} open={open} maxWidth='sm'>
      <DialogTitle>
        Asset is being augmented...
        <IconButton
          aria-label='close'
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 10
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <Divider />
      <LinearProgress />
      <DialogContent sx={{ mr: 6, ml: 6 }}>
        <Alert severity='info'>
          To advertise with your asset, it needs augmentation to prepare for accurate prediction of how your ad performs in a broadcast.
        </Alert>
        <Box sx={{ height: '250px', width: '400px', mt: 3 }}>
          <Image sx={{ width: '100%', height: '100%' }} src={augmentImg} showLoading />
        </Box>
      </DialogContent>
      <DialogActions sx={{ m: 2, justifyContent: 'space-between' }}>
        <Button onClick={onClose}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
};
