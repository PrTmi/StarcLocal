import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Event } from '../../models/models';
import { eventsSelector, fetchEventsByQuery } from '../../state/eventsSlice';
import { EventsTable } from './EventsTable';
import { LinearProgress, Typography } from '@mui/material';
import { NewOrderDialog } from './eventNewOrder/NewOrderDialog';
import { resetOrderSave } from '../../state/ordersSlice';

export const Events = (): JSX.Element => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { events, isLoading } = useSelector(eventsSelector);

  const [orderDialogOpen, setOrderDialogOpen] = useState<boolean>(false);
  const [event, setEvent] = useState<Event | null>(null);

  useEffect(() => {
    dispatch(fetchEventsByQuery());
  }, []);

  const openDetails = (e: Event) => {
    navigate(`/events/${e.id}`);
  };
  const onCreateOrder = (e: Event) => {
    setEvent(e);
    setOrderDialogOpen(true);
  };

  const closeOrderDialog = () => {
    setOrderDialogOpen(false);
    dispatch(resetOrderSave());
    dispatch(fetchEventsByQuery());
  };

  return (
    <>
      <Typography variant='h5' sx={{ lineHeight: 1.5 }} pb={2}>
        Events
      </Typography>
      {!isLoading ? (
        <div style={{ width: '100%' }}>
          <EventsTable events={events} onOpen={(e: Event) => openDetails(e)} onCreateOrder={onCreateOrder} />
        </div>
      ) : (
        <LinearProgress />
      )}
      <NewOrderDialog onClose={closeOrderDialog} open={orderDialogOpen} event={event!!} />
    </>
  );
};
