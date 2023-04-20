import * as React from 'react';
import Box from '@mui/material/Box';
import { useDispatch, useSelector } from 'react-redux';
import { Chip, CircularProgress, Collapse, Grid, Stack, Typography } from '@mui/material';
import { blue, grey } from '@mui/material/colors';
import Container from '@mui/material/Container';
import { useState } from 'react';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { createOrder, loadOrdersStats, ordersSelector } from '../../../state/ordersSlice';
import { Event, EventOrder } from '../../../models/models';
import Button from '@mui/material/Button';
import { AssetDetailsComponent } from '../../shared/AssetDetailsComponent';
import { eventsSelector } from '../../../state/eventsSlice';
import { EventDetailsComponent } from './components/EventDetailsComponent';
import BrokenImageIcon from '@mui/icons-material/BrokenImage';
import { AppDispatch } from '../../../state/store';

// @ts-ignore
import { Image } from 'mui-image';

type ConfirmOrderProps = {
  event: Event;
  goBack: () => void;
  onClose: (refresh: boolean) => void;
};

export const ConfirmSubmitOrderView = ({ event, goBack, onClose }: ConfirmOrderProps): JSX.Element => {
  const dispatch = useDispatch<AppDispatch>();
  const { selectedAsset, selectedPlacements, savingOrder } = useSelector(ordersSelector);
  const [saved, setSaved] = useState<boolean>(false);
  const { eventDetails } = useSelector(eventsSelector);

  let placementsMap = {} as any;

  if (eventDetails?.location?.locationPlacements.length > 0) {
    placementsMap = eventDetails.location.locationPlacements.reduce((prev: any, curr: any) => {
      prev[curr.id] = curr.name;
      return prev;
    }, {});
  }

  const handleSave = async () => {
    await dispatch(
      createOrder({
        // id: '',
        assetId: selectedAsset.id,
        clientId: selectedAsset.clientId,
        eventId: event.id,
        campaignId: null,
        locationPlacementIds: selectedPlacements
      } as EventOrder)
    );
    dispatch(loadOrdersStats());

    setSaved(true);
  };

  return (
    <Box flexGrow={1}>
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
        <Grid container spacing={3}>
          <Grid item sm={6}>
            <EventDetailsComponent event={event} />
          </Grid>
          <Grid item sm={6}>
            <Container sx={{ backgroundColor: '#ffffff', pt: 2, pb: 2, borderRadius: '4px' }}>
              <Typography sx={{ mb: 1.5 }} color='text.secondary'>
                ASSET
              </Typography>
              <AssetDetailsComponent
                asset={selectedAsset}
                fontSize={20}
                spacing={4}
                sizeStyles={{ height: '60px', width: 'auto', maxHeight: '60px' }}
                clientName={true}
              />

              <Typography sx={{ mb: 1.5, pt: 3 }} color='text.secondary'>
                PLACEMENTS
              </Typography>
              {selectedPlacements.map((id: string) => (
                <Chip key={placementsMap[id]} label={placementsMap[id]} variant='outlined' sx={{ color: blue[500], borderColor: blue[500], mr: 1 }} />
              ))}

              <Box sx={{ pt: 2 }}>
                {selectedPlacements ? (
                  <Image fit='contain' src={event.location.imageUrl} showLoading />
                ) : (
                  <BrokenImageIcon sx={{ color: grey[300], fontSize: 100 }} />
                )}
              </Box>
            </Container>
          </Grid>
        </Grid>
      </Container>
      <Box sx={{ display: 'flex', pt: 2 }}>
        {saved ? (
          <Button color='primary' sx={{ mr: 1 }} disabled={savingOrder} onClick={e => onClose(true)} variant='contained'>
            Close
          </Button>
        ) : (
          <Button sx={{ mr: 1 }} disabled={savingOrder} onClick={e => onClose(saved)}>
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
