import List from '@mui/material/List';
import { ListItem, Typography } from '@mui/material';
import { formatDateTime } from '../../../../services/formatting';
import { Event } from '../../../../models/models';
import React from 'react';

interface EventDetailsProps {
  event: Event;
}

export const EventDetailsComponent = ({ event }: EventDetailsProps) => {
  return (
    <List sx={{ display: 'flex', flexDirection: 'column' }}>
      <ListItem sx={{ flexDirection: 'column', alignItems: 'flex-start' }}>
        <Typography sx={{ mb: 1.5 }} color='text.secondary'>
          EVENT
        </Typography>
        <Typography variant='body1'>{event.name}</Typography>
      </ListItem>
      <ListItem sx={{ flexDirection: 'column', alignItems: 'flex-start' }}>
        <Typography variant='caption'>Broadcast time</Typography>
        <Typography variant='body1'>{formatDateTime(event.startAt)}</Typography>
      </ListItem>
      <ListItem sx={{ flexDirection: 'column', alignItems: 'flex-start' }}>
        <Typography variant='caption'>Event type</Typography>
        <Typography variant='body1'>Eliteserien</Typography>
      </ListItem>
      {event.broadcast ? (
        <ListItem sx={{ flexDirection: 'column', alignItems: 'flex-start' }}>
          <Typography variant='caption'>Broadcaster</Typography>
          {/*Hardcoded Broadcast to TV2*/}
          <Typography variant='body1'>TV2</Typography>
        </ListItem>
      ) : null}

      <ListItem sx={{ flexDirection: 'column', alignItems: 'flex-start' }}>
        <Typography variant='caption'>Venue</Typography>
        <Typography variant='body1'>{event.location.name}</Typography>
      </ListItem>
    </List>
  );
};
