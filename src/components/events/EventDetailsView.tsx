import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, Breadcrumbs, Button, Card, LinearProgress, Link, Stack, Typography } from '@mui/material';
import { eventsSelector, fetchEventDetails, fetchEventOrders } from '../../state/eventsSlice';
import { grey } from '@mui/material/colors';
import footballField from '../../images/footballField.svg';
import footballFieldNoPlace from '../../images/foorballFieldNoPlace.svg';
import { ToggleButton, ToggleButtonGroup } from '@mui/material';
import { EventHeader } from './EventHeader';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { EventOrdersTable } from './EventOrdersTable';
import { EventOrder } from '../../models/models';
import { NewOrderDialog } from './eventNewOrder/NewOrderDialog';
import { resetOrderSave } from '../../state/ordersSlice';
import { AppDispatch } from '../../state/store';

// @ts-ignore
import { Image } from 'mui-image';

export const EventDetailsView = (): JSX.Element => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const params = useParams();
  const id = params['id'];

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
  };

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
            <Button variant='contained' onClick={onCreateOrder}>
              Create order
            </Button>
          </Box>

          <Stack>
            <EventHeader event={eventDetails} />
            {!eventOrders ? (
              <Box
                sx={{
                  height: 70,
                  width: '100%',
                  background: grey[100],
                  display: 'flex',
                  alignItems: 'center',
                  p: 2,
                  borderTop: '1px solid',
                  borderBottom: '1px solid',
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
                <Typography variant='h6' component='h4' mt={2} mb={1} ml={1}>
                  Orders
                </Typography>

                {isLoadingOrders ? (
                  <LinearProgress sx={{ mb: 2 }} />
                ) : (
                  <div style={{ width: '100%', marginBottom: '16px' }}>
                    <EventOrdersTable
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
              <Stack spacing={4}>
                {!eventDetails.ad_Placements ? (
                  <>
                    <Typography variant='h6' component='h4'>
                      No Ad placements available
                    </Typography>
                    <Box sx={{ height: '250px', width: '300px', mt: 3 }}>
                      <Image sx={{ width: '100%', height: '100%' }} src={footballFieldNoPlace} showLoading />
                    </Box>
                  </>
                ) : (
                  <>
                    <Typography variant='h6' component='h4'>
                      1 Ad placement available
                    </Typography>
                    <Box sx={{ height: '250px', width: '300px', mt: 3 }}>
                      <Image sx={{ width: '100%', height: '100%' }} src={footballField} showLoading />
                    </Box>
                  </>
                )}
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
      <NewOrderDialog onClose={closeOrderDialog} open={orderDialogOpen} event={eventDetails} />
    </>
  );
};
