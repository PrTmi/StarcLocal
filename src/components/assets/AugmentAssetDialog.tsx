import * as React from 'react';
import { Asset } from '../../models/models';
import { Alert, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, IconButton, LinearProgress } from '@mui/material';
import { augmentAsset } from '../../state/assetsSlice';
import { useDispatch } from 'react-redux';
import CloseIcon from '@mui/icons-material/Close';
import { AppDispatch } from '../../state/store';
// @ts-ignore
import { Image } from 'mui-image';

type AugmentAssetDialogProps = {
  onClose: () => void;
  asset: Asset | null;
  open: boolean;
};

export const AugmentAssetDialog = ({ onClose, asset, open }: AugmentAssetDialogProps): JSX.Element => {
  const dispatch = useDispatch<AppDispatch>();

  const handleAugment = async () => {
    if (asset?.id) {
      await dispatch(augmentAsset(asset.id));
    }
    onClose();
  };

  return (
    <Dialog onClose={onClose} open={open} maxWidth='sm'>
      <DialogTitle>
        Augment your asset
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
      {asset?.status === 'augment_started' ? <LinearProgress /> : null}
      <DialogContent sx={{ mr: 6, ml: 6, textAlign: 'center', mx: 0 }}>
        <Alert severity='info'>
          To advertise with your asset, it needs augmentation to prepare for accurate prediction of how your ad performs in a broadcast.
        </Alert>
        <Box sx={{ height: '150px', width: 'auto', mt: 3 }}>
          {asset?.imageUrl ? <Image fit='contain' src={asset?.imageUrl} showLoading alt={asset?.name} /> : null}
        </Box>
      </DialogContent>

      <DialogActions sx={{ m: 2, justifyContent: 'space-between' }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant='contained' onClick={handleAugment}>
          Start augmentation
        </Button>
      </DialogActions>
    </Dialog>
  );
};
