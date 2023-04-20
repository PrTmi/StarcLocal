import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, Breadcrumbs, Button, Card, Chip, LinearProgress, Link, Stack, Tooltip, Typography } from '@mui/material';
import { eventsSelector, fetchEventDetails, fetchEventOrders, syncEventOrders } from '../../state/eventsSlice';
import { blue, grey } from '@mui/material/colors';
import { ToggleButton, ToggleButtonGroup } from '@mui/material';
import { EventHeaderComponent } from './components/EventHeaderComponent';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { EventOrdersTableComponent } from './components/EventOrdersTableComponent';
import { EventOrder } from '../../models/models';
import { NewOrderDialogView } from './eventNewOrder/NewOrderDialogView';
import { resetOrderSave } from '../../state/ordersSlice';
import { LoadingButton } from '@mui/lab';
import { Autorenew, Circle } from '@mui/icons-material';
import BrokenImageIcon from '@mui/icons-material/BrokenImage';
import { AppDispatch } from '../../state/store';

// @ts-ignore
import { Image } from 'mui-image';
// @ts-ignore
import { DateTime } from 'luxon';

export const EventDetailsView = (): JSX.Element => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const params = useParams();
  const id = params['id'];
  const now = DateTime.now();

  const [orderDialogOpen, setOrderDialogOpen] = useState<boolean>(false);

  useEffect(() => {
    dispatch(fetchEventDetails(id!!));
    dispatch(fetchEventOrders(id!!));
  }, []);

  const { eventDetails, eventOrders, isLoadingOrders } = useSelector(eventsSelector);

  const [place, setPlace] = React.useState('web');

  const handleChange = (e: React.MouseEvent<HTMLElement>, place: string) => {
    setPlace(place);
  };

  const handleSyncEvent = async () => {
    if (eventDetails?.id) {
      await dispatch(syncEventOrders(eventDetails.id));
      await dispatch(fetchEventDetails(eventDetails.id));
    }
  };

  useEffect(() => {
    let intervalId: number;

    if (eventDetails?.isOrdersAssetSynchronizing) {
      intervalId = window.setTimeout(() => {
        console.log('Refreshing...');
        dispatch(fetchEventDetails(id!!));
      }, 2000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [eventDetails]);

  const openOrderDetails = (o: EventOrder) => {
    navigate(`/events/${eventDetails.id}/orders/${o.id}`);
  };

  const onCreateOrder = () => {
    setOrderDialogOpen(true);
  };

  const closeOrderDialog = () => {
    setOrderDialogOpen(false);
    dispatch(resetOrderSave());
    dispatch(fetchEventOrders(id!!));
    dispatch(fetchEventDetails(id!!));
  };

  const placements = eventDetails?.location?.locationPlacements?.map((it: any) => {
    return it;
  });

  return (
    <>
      {eventDetails ? (
        <Box>
          <Breadcrumbs separator={<NavigateNextIcon fontSize='small' />}>
            <Link underline='hover' color='inherit' href='/events'>
              Events
            </Link>
            <Link underline='hover' color='inherit'>
              {/*{eventDetails.name}*/}
            </Link>
          </Breadcrumbs>

          <Box pb={2} sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant='h5' sx={{ lineHeight: 1.5 }}>
              {eventDetails.name}
            </Typography>

            {placements?.filter((it: any) => it.available).length >= 1 && DateTime.fromISO(eventDetails.startAt) > now ? (
              <Button variant='contained' onClick={onCreateOrder}>
                Create order
              </Button>
            ) : (
              <Tooltip
                title={DateTime.fromISO(eventDetails.startAt) < now ? 'Event is closed for new orders' : 'No placements available for this event'}
                placement='top-start'
                arrow
              >
                <div>
                  <Button variant='contained' onClick={onCreateOrder} disabled>
                    Create order
                  </Button>
                </div>
              </Tooltip>
            )}
          </Box>

          <Stack>
            <EventHeaderComponent event={eventDetails} />
            {!eventOrders.length ? (
              <Box
                sx={{
                  height: 70,
                  width: '100%',
                  background: grey[100],
                  display: 'flex',
                  alignItems: 'center',
                  p: 2,
                  borderTop: '1px solid',
                  borderColor: grey[300],
                  color: grey[600]
                }}
              >
                <Typography variant='body1' component='h5' color={grey[700]}>
                  No orders created for this event
                </Typography>
              </Box>
            ) : (
              <Box sx={{ backgroundColor: grey[100] }}>
                <Box pt={2} pb={1.5} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant='h6' component='h4' ml={1} sx={{ lineHeight: 1.5 }}>
                    Orders
                  </Typography>
                  {!eventDetails.isOrdersAssetInSync ? (
                    <LoadingButton
                      onClick={handleSyncEvent}
                      startIcon={<Autorenew />}
                      loading={eventDetails.isOrdersAssetSynchronizing}
                      variant='contained'
                      loadingPosition='start'
                    >
                      Sync to venue
                    </LoadingButton>
                  ) : (
                    <LoadingButton
                      sx={{
                        '&.Mui-disabled': {
                          backgroundColor: 'rgba(0, 0, 0, 0.05)',
                          color: grey[700]
                        }
                      }}
                      onClick={handleSyncEvent}
                      startIcon={<Circle color='success' />}
                      variant='contained'
                      loadingPosition='start'
                      disabled
                    >
                      Sync to venue
                    </LoadingButton>
                  )}
                </Box>

                {isLoadingOrders ? (
                  <LinearProgress sx={{ mb: 2 }} />
                ) : (
                  <div style={{ width: '100%', marginBottom: '16px' }}>
                    <EventOrdersTableComponent
                      includeAdPlace={false}
                      includeBroadcastTime={true}
                      includeEvent={true}
                      rowsPerPageOptions={[3]}
                      orders={eventOrders}
                      onClick={o => {
                        openOrderDetails(o);
                      }}
                    />
                  </div>
                )}
              </Box>
            )}

            <Card sx={{ p: 2, background: '#ffffff', boxShadow: '0px 2px 1px -1px rgb(0 0 0 / 20%)' }}>
              <Stack spacing={2}>
                <Typography sx={{ color: 'text.secondary', textTransform: 'uppercase' }}>
                  {placements?.filter((it: any) => it.available).length > 1 ? (
                    <>{placements?.filter((it: any) => it.available).length} PLACEMENTS AVAILABLE</>
                  ) : (
                    <>{placements?.filter((it: any) => it.available).length} PLACEMENT AVAILABLE</>
                  )}
                </Typography>
                <Stack direction='row'>
                  {placements?.map((item: any, index: number) => (
                    <Chip
                      key={index}
                      label={item.name}
                      variant='outlined'
                      sx={{ color: blue[500], borderColor: blue[500], mr: 1 }}
                      disabled={!item.available}
                    />
                  ))}
                </Stack>
                <Box sx={{ maxWidth: '600px', position: 'relative' }}>
                  {placements && eventDetails ? (
                    <Box sx={{ position: 'relative' }}>
                      <Image fit='contain' src={eventDetails.location.imageUrl} showLoading />

                      <Card
                        sx={{
                          position: 'absolute',
                          top: '16px',
                          left: '16px',
                          px: 2,
                          py: 1,
                          textTransform: 'uppercase'
                        }}
                      >
                        {eventDetails.location.name}
                      </Card>
                    </Box>
                  ) : (
                    <BrokenImageIcon sx={{ color: grey[300], fontSize: 100 }} />
                  )}
                </Box>
              </Stack>
              <ToggleButtonGroup color='primary' value={place} exclusive onChange={handleChange} sx={{ mt: 6 }} disabled>
                <ToggleButton value='preGame'>Pre-game (coming soon)</ToggleButton>
                <ToggleButton value='replays'>Replays (coming soon)</ToggleButton>
                <ToggleButton value='halfTime'>Half-time (coming soon)</ToggleButton>
              </ToggleButtonGroup>
            </Card>
          </Stack>
        </Box>
      ) : (
        <LinearProgress />
      )}
      <NewOrderDialogView onClose={closeOrderDialog} open={orderDialogOpen} event={eventDetails} />
    </>
  );
};
