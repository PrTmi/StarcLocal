import React from 'react';
import { Box, Chip, ListItem, Typography } from '@mui/material';
import List from '@mui/material/List';
import { blue, grey } from '@mui/material/colors';
import { Event } from '../../../models/models';
import { useSelector } from 'react-redux';
import { ordersSelector } from '../../../state/ordersSlice';
import { AssetDetailsComponent } from '../../shared/AssetDetailsComponent';
import { formatTime } from '../../../services/formatting';
import { eventsSelector } from '../../../state/eventsSlice';

type EventDetailsSideBarProps = {
  event: Event;
};

export const EventDetailsSideBarView = ({ event }: EventDetailsSideBarProps) => {
  const { selectedAsset, selectedPlacements, selectedClient } = useSelector(ordersSelector);
  const { eventDetails } = useSelector(eventsSelector);

  let placementsMap = {} as any;

  if (eventDetails?.location?.locationPlacements.length > 0) {
    placementsMap = eventDetails.location.locationPlacements.reduce((prev: any, curr: any) => {
      prev[curr.id] = curr.name;
      return prev;
    }, {});
  }

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
          <Typography variant='body1'>{formatTime(event.startAt)}</Typography>
        </ListItem>
        <ListItem sx={{ flexDirection: 'column', alignItems: 'flex-start' }}>
          <Typography variant='caption'>Broadcaster</Typography>
          <Typography variant='body1'>TV2</Typography>
        </ListItem>
      </List>
      <Box p={2} sx={{ borderTop: '1px solid', borderColor: grey[300] }}>
        {!selectedClient ? (
          'No advertiser selected'
        ) : (
          <>
            <Typography mb={1} fontSize={16}>
              Advertiser
            </Typography>
            <Typography variant='h5' fontSize={14}>
              {selectedClient?.name}
            </Typography>
          </>
        )}
      </Box>

      <Box p={2} sx={{ borderTop: '1px solid', borderBottom: '1px solid', borderColor: grey[300] }}>
        {selectedAsset == null || !selectedClient ? (
          'No asset selected'
        ) : (
          <>
            <Typography fontSize={16} pb={2}>
              Asset
            </Typography>
            <AssetDetailsComponent
              clientName={false}
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
        {!selectedPlacements.length ? (
          'No placement selected'
        ) : (
          <>
            <Typography mb={1} fontSize={16}>
              Placement
            </Typography>
            {selectedPlacements.map((id: string) => (
              <Chip key={placementsMap[id]} label={placementsMap[id]} variant='outlined' sx={{ color: blue[500], borderColor: blue[500], mr: 1 }} />
            ))}
          </>
        )}
      </Box>
    </Box>
  );
};
