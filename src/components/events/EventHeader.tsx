import List from '@mui/material/List';
import { Link, ListItem, Typography } from '@mui/material';
import { formatDate, formatTime } from '../../services/formatting';
import { Event } from '../../models/models';
import React from 'react';

interface EventHeaderProps {
  event: Event;
}

export const EventHeader = ({ event }: EventHeaderProps) => {
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
        <Typography variant='body1'>{formatDate(event.dateStart)}</Typography>
      </ListItem>
      <ListItem sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', width: 'auto' }}>
        <Typography variant='caption'>Broadcast time</Typography>
        <Typography variant='body1'>{formatTime(event.dateStart)}</Typography>
      </ListItem>
      <ListItem sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', width: 'auto' }}>
        <Typography variant='caption'>Broadcaster</Typography>
        <Typography variant='body1'>{event.broadcast ? event.broadcast : '-'}</Typography>
      </ListItem>
      <ListItem sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', width: 'auto' }}>
        <Typography variant='caption'>Arena</Typography>
        <Link
          href='https://www.google.com/maps/place/Vallhall+Arena/@59.9205081,10.805118,365m/data=!3m1!1e3!4m5!3m4!1s0x46416fb28c0cbb4f:0xb5f1063a32b8e3e9!8m2!3d59.9204919!4d10.8061455'
          variant='body2'
        >
          Vallhall Arena
        </Link>
      </ListItem>
    </List>
  );
};
