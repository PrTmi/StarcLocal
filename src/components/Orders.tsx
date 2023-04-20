import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, LinearProgress, Typography } from '@mui/material';
import { grey } from '@mui/material/colors';
import { EventOrdersTableComponent } from './events/components/EventOrdersTableComponent';
import { loadOrders, ordersSelector } from '../state/ordersSlice';
import { EventOrder, OrderStatus } from '../models/models';
import { orderTypesMapping } from '../services/orderTypesMapping';
import { AppDispatch } from '../state/store';

export const Orders = (): JSX.Element => {
  const params = useParams();
  const type = params['type'];
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { orders, isLoading } = useSelector(ordersSelector);

  useEffect(() => {
    dispatch(loadOrders(type as OrderStatus));
  }, [type]);

  const openOrderDetails = (o: EventOrder) => {
    navigate(`/events/${o.event!.id}/orders/${o.id}`);
  };

  return (
    <Box sx={{ backgroundColor: grey[100] }}>
      <Typography variant='h5' sx={{ lineHeight: 1.5 }} pb={2}>
        Orders {orderTypesMapping.find(it => it.status === type)!!.label}
      </Typography>
      {isLoading ? (
        <LinearProgress />
      ) : (
        <div style={{ width: '100%', marginBottom: '16px' }}>
          <EventOrdersTableComponent
            includeAdPlace={true}
            includeBroadcastTime={false}
            includeEvent={false}
            rowsPerPageOptions={[10, 15]}
            orders={orders}
            onClick={o => {
              openOrderDetails(o);
            }}
          />
        </div>
      )}
    </Box>
  );
};
