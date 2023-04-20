import * as React from 'react';
import Box from '@mui/material/Box';
import { useDispatch, useSelector } from 'react-redux';
import { Card, CircularProgress, Collapse, Stack, Typography } from '@mui/material';
import { grey } from '@mui/material/colors';
import Container from '@mui/material/Container';
import { EventHeader } from '../EventHeader';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { createOrder, loadOrdersStats, ordersSelector } from '../../../state/ordersSlice';
import { Event, EventOrder } from '../../../models/models';
import Button from '@mui/material/Button';
import { AssetDetailsComponent } from '../../shared/AssetDetailsComponent';
import { PlacementDetailsComponent } from '../../shared/PlacementDetailsComponent';
import { AppDispatch } from '../../../state/store';

type ConfirmOrderProps = {
  event: Event;
  goBack: () => void;
  onClose: () => void;
};

export const ConfirmOrder = ({ event, goBack, onClose }: ConfirmOrderProps): JSX.Element => {
  const dispatch = useDispatch<AppDispatch>();
  const { selectedAsset, selectedPlacement, savingOrder } = useSelector(ordersSelector);

  const [saved, setSaved] = useState<boolean>(false);

  const handleSave = async () => {
    await dispatch(
      createOrder({
        // id: '',
        assetId: selectedAsset.id,
        clientId: selectedAsset.clientId,
        eventId: event.id,
        campaignId: null,
        adPlacementId: event.id
      } as EventOrder)
    );
    dispatch(loadOrdersStats());

    setSaved(true);
  };

  return (
    <Box sx={{ width: '100%' }}>
      {!savingOrder ? (
        <Stack direction='row' spacing={2} display='flex' alignItems='center'>
          <Collapse orientation='horizontal' in={saved} timeout={1000}>
            <CheckCircleIcon color='success' fontSize='large' />
          </Collapse>

          {/** {saved ? <CheckCircleIcon color='success' fontSize='large'/> : null}**/}
          <Box>
            <Typography variant='h5' mt={4}>
              {saved ? 'Order submitted successfully' : 'Confirm order'}
            </Typography>
            <Typography variant='body2' mb={3}>
              {saved ? 'Your order has been submitted for review' : 'Review and submit your order'}
            </Typography>
          </Box>
        </Stack>
      ) : (
        <Stack direction='row' spacing={2} display='flex' alignItems='center'>
          <Collapse orientation='horizontal' in={!saved} timeout={1000}>
            <CircularProgress size={35} />
          </Collapse>

          <Box>
            <Typography variant='h5' mt={4}>
              Submitting order
            </Typography>
            <Typography variant='body2' mb={3}>
              This will take a few seconds
            </Typography>
          </Box>
        </Stack>
      )}

      <Container sx={{ backgroundColor: grey[200], pt: 2, pb: 2, borderRadius: '4px' }}>
        <Typography>EVENT</Typography>
        <Typography variant='h6' mt={1} mb={2}>
          {event.name}
        </Typography>

        <EventHeader event={event} />

        <Stack direction='row' spacing={4} justifyContent='space-between' mt={3}>
          <Card sx={{ background: '#ffffff', width: '50%', p: 3, boxShadow: '0px 2px 1px -1px rgb(0 0 0 / 20%)' }}>
            <Typography sx={{ mb: 1.5 }} color='text.secondary'>
              ASSET
            </Typography>
            <AssetDetailsComponent asset={selectedAsset} fontSize={20} spacing={4} sizeStyles={{ height: '120px', width: 'auto', maxHeight: '120px' }} />
          </Card>

          <Card sx={{ background: '#ffffff', width: '50%', p: 3, boxShadow: '0px 2px 1px -1px rgb(0 0 0 / 20%)' }}>
            <Typography sx={{ mb: 1.5 }} color='text.secondary'>
              PLACEMENT
            </Typography>
            <PlacementDetailsComponent placement={selectedPlacement} />
          </Card>
        </Stack>
      </Container>

      <Box sx={{ display: 'flex', pt: 2 }}>
        {saved ? (
          <Button color='primary' sx={{ mr: 1 }} disabled={savingOrder} onClick={onClose} variant='contained'>
            Close
          </Button>
        ) : (
          <Button sx={{ mr: 1 }} disabled={savingOrder} onClick={onClose}>
            {saved ? 'Close' : 'Cancel'}
          </Button>
        )}

        <Box sx={{ flex: '1 1 auto' }} />
        {saved ? null : (
          <>
            <Button disabled={savingOrder} onClick={goBack} sx={{ mr: 1 }}>
              Back
            </Button>

            <Button variant='contained' onClick={handleSave}>
              {savingOrder ? 'Submitting' : 'Submit order'}
            </Button>
          </>
        )}
      </Box>
    </Box>
  );
};
