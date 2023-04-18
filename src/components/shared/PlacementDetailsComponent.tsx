import { Stack, Typography } from '@mui/material';
import React from 'react';
import { grey } from '@mui/material/colors';
import Box from '@mui/material/Box';
import footballField from '../../images/footballField.svg';
// @ts-ignore
import { Image } from 'mui-image';

export const PlacementDetailsComponent = (selectedPlace: any): JSX.Element => {
  return (
    <>
      {selectedPlace == null ? null : (
        <>
          <Stack direction='row' spacing={4} alignItems='center'>
            <Box sx={{ height: '120px', width: 'auto', maxHeight: '120px', display: 'flex', alignItems: 'center' }}>
              {selectedPlace ? <Image fit='contain' src={footballField} showLoading /> : null}
            </Box>
            <Box>
              <Typography variant='h5' fontSize={20}>
                {selectedPlace ? 'Full stadium' : '-'}
              </Typography>
              <Typography fontSize={14} color={grey[800]}>
                Full broadcast
              </Typography>
            </Box>
          </Stack>
        </>
      )}
    </>
  );
};
