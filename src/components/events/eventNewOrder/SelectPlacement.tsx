import * as React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Box, Checkbox, FormControlLabel, FormGroup, Stack } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import footballFieldNoPlace from '../../../images/foorballFieldNoPlace.svg';
import footballField from '../../../images/footballField.svg';
import { ordersSelector, setSelectedPlacement } from '../../../state/ordersSlice';

// @ts-ignore
import { Image } from 'mui-image';
import { AppDispatch } from '../../../state/store';

export const SelectPlacement = (): JSX.Element => {
  const dispatch = useDispatch<AppDispatch>();

  const [nameExpanded, setNameExpanded] = React.useState<boolean>(true);

  const { selectedPlacement } = useSelector(ordersSelector);

  const onSelectedPlacement = (event: React.ChangeEvent<HTMLElement>, placement: string) => {
    const val = selectedPlacement === placement ? '' : placement;
    dispatch(setSelectedPlacement(val));
  };

  const toggleName = () => {
    setNameExpanded(!nameExpanded);
  };

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
              <Typography sx={{ color: 'text.secondary', textTransform: 'uppercase' }}>3 placements available</Typography>

              <Typography variant='h6' component='h4'>
                Full broadcast
              </Typography>
            </Box>

            <Typography sx={{ color: 'text.secondary', textTransform: 'uppercase', pr: 3 }}>
              {!selectedPlacement ? '3 placements available' : selectedPlacement}
            </Typography>
          </Stack>
        </AccordionSummary>
        <AccordionDetails sx={{ display: 'flex', pr: 4, pl: 4, pb: 4 }}>
          <Stack spacing={12} direction='row'>
            <Box sx={{ height: '250px', width: '300px' }}>
              {selectedPlacement ? (
                <Image sx={{ width: '100%', height: '100%' }} src={footballField} showLoading />
              ) : (
                <Image sx={{ width: '100%', height: '100%' }} src={footballFieldNoPlace} showLoading />
              )}
            </Box>
            <FormGroup>
              <FormControlLabel
                control={<Checkbox checked={selectedPlacement === 'Full stadium'} onChange={e => onSelectedPlacement(e, 'Full stadium')} />}
                label='Full stadium'
              />
              <FormControlLabel control={<Checkbox disabled />} label='Stadium left (coming soon)' />
              <FormControlLabel control={<Checkbox disabled />} label='Stadium center (coming soon)' />
              <FormControlLabel control={<Checkbox disabled />} label='Stadium right (coming soon)' />
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
        <AccordionDetails sx={{ display: 'flex', pr: 4, pl: 4, pb: 4 }}>
          <Stack spacing={12} direction='row'>
            More details here
          </Stack>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};
