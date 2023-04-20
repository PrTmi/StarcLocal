import * as React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Box, Checkbox, FormControlLabel, FormGroup, Stack } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { ordersSelector, setSelectedPlacements } from '../../../state/ordersSlice';
import { eventsSelector } from '../../../state/eventsSlice';
import { grey } from '@mui/material/colors';
import BrokenImageIcon from '@mui/icons-material/BrokenImage';
import { AppDispatch } from '../../../state/store';

// @ts-ignore
import { Image } from 'mui-image';

export const SelectPlacementView = (): JSX.Element => {
  const dispatch = useDispatch<AppDispatch>();

  const [nameExpanded, setNameExpanded] = React.useState<boolean>(true);

  const { selectedPlacements } = useSelector(ordersSelector);

  const { eventDetails } = useSelector(eventsSelector);

  const onSelectedPlacements = (event: React.SyntheticEvent) => {
    let val = [...selectedPlacements];
    if ((event.target as HTMLInputElement).checked) {
      val = [...selectedPlacements, (event.target as HTMLInputElement).value];
    } else {
      val.splice(selectedPlacements.indexOf((event.target as HTMLInputElement).value), 1);
    }
    dispatch(setSelectedPlacements(val));
  };

  const toggleName = () => {
    setNameExpanded(!nameExpanded);
  };

  const placements = eventDetails?.location?.locationPlacements?.map((it: any) => {
    return it;
  });

  return (
    <Box maxWidth='lg'>
      <Typography variant='h5' mt={4}>
        Select Placement
      </Typography>
      <Typography variant='body2' mb={3}>
        Select where you would like your asset to be displayed
      </Typography>
      <Accordion sx={{ padding: '0px' }} expanded={nameExpanded} onChange={() => toggleName()}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls='name-content' id='name-header'>
          <Stack width='100%' direction='row' justifyContent='space-between' alignItems='center' spacing={2}>
            <Box>
              <Typography sx={{ color: 'text.secondary', textTransform: 'uppercase' }}>
                {placements?.filter((it: any) => it.available).length > 1 ? (
                  <>{placements?.filter((it: any) => it.available).length} PLACEMENTS AVAILABLE</>
                ) : (
                  <>{placements?.filter((it: any) => it.available).length} PLACEMENT AVAILABLE</>
                )}
              </Typography>

              <Typography variant='h6' component='h4'>
                Full broadcast
              </Typography>
            </Box>

            {/*
            <Typography sx={{ color: 'text.secondary', textTransform: 'uppercase', pr: 3 }}>
              {!selectedPlacements ? placements.length + ' placements available' : selectedPlacements}
            </Typography>
            */}
          </Stack>
        </AccordionSummary>
        <AccordionDetails sx={{ display: 'flex', pr: 4, pl: 4, pb: 4 }}>
          <Stack spacing={8} direction='row'>
            <Box>
              {selectedPlacements && eventDetails ? (
                <Image fit='contain' src={eventDetails.location.imageUrl} showLoading />
              ) : (
                <BrokenImageIcon sx={{ color: grey[300], fontSize: 100 }} />
              )}
            </Box>
            <FormGroup>
              {placements?.map((item: any, index: any) => (
                <FormControlLabel
                  key={index}
                  value={item.id}
                  control={<Checkbox color='primary' onChange={onSelectedPlacements} />}
                  label={item.name}
                  disabled={!item.available}
                  checked={selectedPlacements.includes(item.id)}
                />
              ))}
            </FormGroup>
          </Stack>
        </AccordionDetails>
      </Accordion>
      <Accordion sx={{ padding: '0px' }} expanded={!nameExpanded} disabled onChange={() => toggleName()}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls='name-content' id='name-header'>
          <Stack>
            <Typography sx={{ color: 'text.secondary', textTransform: 'uppercase' }}>Scenario-specific placement coming soon</Typography>

            <Typography variant='h6' component='h4'>
              Pre-game, Intermissions, Post-game
            </Typography>
          </Stack>
        </AccordionSummary>
        {/*
        <AccordionDetails sx={{ display: 'flex', pr: 4, pl: 4, pb: 4 }}>
          <Stack spacing={12} direction='row'>
            More details here
          </Stack>
        </AccordionDetails>
        */}
      </Accordion>
    </Box>
  );
};
