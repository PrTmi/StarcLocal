import List from '@mui/material/List';
import { ListItem, Typography } from '@mui/material';
import { formatDate, formatTime } from '../../../services/formatting';
import { Event } from '../../../models/models';
import React from 'react';

interface EventHeaderProps {
  event: Event;
}

export const EventHeaderComponent = ({ event }: EventHeaderProps) => {
  return (
    <List
      sx={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        backgroundColor: '#ffffff',
        boxShadow: '0px 2px 1px -1px rgb(0 0 0 / 20%)',
        borderRadius: '4px'
      }}
    >
      <ListItem sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', width: 'auto' }}>
        <Typography variant='caption'>Broadcast date</Typography>
        <Typography variant='body1'>{formatDate(event.startAt)}</Typography>
      </ListItem>
      <ListItem sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', width: 'auto' }}>
        <Typography variant='caption'>Broadcast time</Typography>
        <Typography variant='body1'>{formatTime(event.startAt)}</Typography>
      </ListItem>
      <ListItem sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', width: 'auto' }}>
        <Typography variant='caption'>Broadcaster</Typography>
        {/*Hardcoded Broadcast to TV2*/}
        <Typography variant='body1'>{event.broadcast ? event.broadcast : 'TV2'}</Typography>
      </ListItem>
      <ListItem sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', width: 'auto' }}>
        <Typography variant='caption'>Venue</Typography>
        {event.location.name ? event.location.name : '-'}
      </ListItem>
    </List>
  );
};
