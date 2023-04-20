import List from '@mui/material/List';
import { ListItem, Typography } from '@mui/material';
import { EventOrder } from '../../../models/models';
import React from 'react';
import { formatDateTime } from '../../../services/formatting';
import { useSelector } from 'react-redux';
import { eventsSelector } from '../../../state/eventsSlice';

interface OrderHeaderProps {
  order: EventOrder;
}

export const OrderDetailsHeaderComponent = ({ order }: OrderHeaderProps): JSX.Element => {
  const { eventDetails } = useSelector(eventsSelector);
  return (
    <List sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', backgroundColor: '#ffffff' }}>
      <ListItem sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', width: 'auto', paddingLeft: '0px' }}>
        <Typography variant='caption'>Order ID</Typography>
        <Typography variant='body1'>{order.id}</Typography>
      </ListItem>
      <ListItem sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', width: 'auto' }}>
        <Typography variant='caption'>Order created</Typography>
        <Typography variant='body1'>{formatDateTime(order.createdAt)}</Typography>
      </ListItem>
      <ListItem sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', width: 'auto' }}>
        <Typography variant='caption'>Broadcast time</Typography>
        <Typography variant='body1'>{formatDateTime(eventDetails.startAt)}</Typography>
      </ListItem>
    </List>
  );
};
