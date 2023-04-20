import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Event } from '../../models/models';
import { eventsSelector, fetchEventDetails, fetchEventsByQuery } from '../../state/eventsSlice';
import { EventsTableComponent } from './components/EventsTableComponent';
import { LinearProgress, Tab, Tabs, Typography } from '@mui/material';
import { NewOrderDialogView } from './eventNewOrder/NewOrderDialogView';
import { resetOrderSave } from '../../state/ordersSlice';
import { AppDispatch } from '../../state/store';
// @ts-ignore
import { DateTime } from 'luxon';

export enum EventDateFilter {
  UPCOMING = 'UPCOMING',
  TODAY = 'TODAY',
  CONCLUDED = 'CONCLUDED',
  ALL = 'ALL'
}

export const EventsView = (): JSX.Element => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { events, isLoading } = useSelector(eventsSelector);

  const [orderDialogOpen, setOrderDialogOpen] = useState<boolean>(false);
  const [event, setEvent] = useState<Event | null>(null);
  const [eventFilter, setEventFilter] = useState<EventDateFilter>(EventDateFilter.UPCOMING);

  useEffect(() => {
    dispatch(fetchEventsByQuery());
  }, []);

  const openDetails = (e: Event) => {
    navigate(`/events/${e.id}`);
  };
  const onCreateOrder = (e: Event) => {
    setEvent(e);
    setOrderDialogOpen(true);
    dispatch(fetchEventDetails(e.id!!));
  };

  const closeOrderDialog = (refresh: boolean) => {
    setOrderDialogOpen(false);
    dispatch(resetOrderSave());
    if (refresh) {
      dispatch(fetchEventsByQuery());
    }
  };

  const filteredEvents = (): Event[] => {
    const now = DateTime.now();
    return events.filter((e: Event) => {
      if (eventFilter === EventDateFilter.ALL) return true;
      else {
        const start = DateTime.fromISO(e.startAt);
        const end = DateTime.fromISO(e.endAt);

        if (eventFilter === EventDateFilter.TODAY && now.startOf('day').toISO() === start.startOf('day').toISO()) {
          return true;
        } else if (eventFilter === EventDateFilter.CONCLUDED && now >= end) {
          return true;
        } else if (eventFilter === EventDateFilter.UPCOMING && now < start) {
          return true;
        }
      }
    });
  };

  return (
    <>
      <Typography variant='h5' sx={{ lineHeight: 1.5 }} pb={2}>
        Events
        <Tabs
          value={eventFilter}
          onChange={(event: React.SyntheticEvent, newValue: EventDateFilter) => {
            setEventFilter(newValue);
          }}
        >
          {Object.keys(EventDateFilter).map(key => {
            return <Tab label={key} key={key} value={key} />;
          })}
        </Tabs>
      </Typography>
      {!isLoading ? (
        <div style={{ width: '100%' }}>
          <EventsTableComponent events={filteredEvents()} onOpen={(e: Event) => openDetails(e)} onCreateOrder={onCreateOrder} />
        </div>
      ) : (
        <LinearProgress />
      )}
      <NewOrderDialogView onClose={closeOrderDialog} open={orderDialogOpen} event={event!!} />
    </>
  );
};
