import React from 'react';
import { Box, ListItem, Typography } from '@mui/material';
import List from '@mui/material/List';
import { grey } from '@mui/material/colors';
import { Event } from '../../../models/models';
import { useSelector } from 'react-redux';
import { ordersSelector } from '../../../state/ordersSlice';
import { AssetDetailsComponent } from '../../shared/AssetDetailsComponent';
import { formatTime } from '../../../services/formatting';

type EventDetailsSideBarProps = {
  event: Event;
};

export const EventDetailsSideBar = ({ event }: EventDetailsSideBarProps) => {
  const { selectedAsset, selectedPlacement } = useSelector(ordersSelector);
  return (
    <Box
      sx={{
        width: '320px',
        backgroundColor: '#ffffff',
        borderLeft: '1px solid',
        borderColor: grey[300]
      }}
    >
      <List sx={{ display: 'flex', flexDirection: 'column' }}>
        <ListItem>Event details</ListItem>
        <ListItem sx={{ flexDirection: 'column', alignItems: 'flex-start' }}>
          <Typography variant='caption'>Event</Typography>
          <Typography variant='body1'>{event.name}</Typography>
        </ListItem>
        <ListItem sx={{ flexDirection: 'column', alignItems: 'flex-start' }}>
          <Typography variant='caption'>Broadcast time</Typography>
          <Typography variant='body1'>{formatTime(event.dateStart)}</Typography>
        </ListItem>
        <ListItem sx={{ flexDirection: 'column', alignItems: 'flex-start' }}>
          <Typography variant='caption'>Broadcaster</Typography>
          <Typography variant='body1'>Broadcaster</Typography>
        </ListItem>
      </List>

      <Box p={2} sx={{ borderTop: '1px solid', borderBottom: '1px solid', borderColor: grey[300] }}>
        {selectedAsset == null ? (
          'No asset selected'
        ) : (
          <>
            <Typography fontSize={16} pb={2}>
              Asset
            </Typography>
            <AssetDetailsComponent
              asset={selectedAsset}
              fontSize={14}
              spacing={1.5}
              sizeStyles={{
                height: 'auto',
                width: '80px',
                minWidth: '80px'
              }}
            />
          </>
        )}
      </Box>

      <Box p={2} sx={{ borderBottom: '1px solid', borderColor: grey[300] }}>
        {!selectedPlacement ? (
          'No placement selected'
        ) : (
          <>
            <Typography mb={1} fontSize={16}>
              Placement
            </Typography>
            <Typography variant='h5' fontSize={14}>
              {selectedPlacement}
            </Typography>
          </>
        )}
      </Box>
    </Box>
  );
};
