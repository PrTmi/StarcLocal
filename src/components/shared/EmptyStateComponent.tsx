import React from 'react';
import { IconProps, Typography } from '@mui/material';
import { Box, Stack } from '@mui/material';
import { grey } from '@mui/material/colors';

interface EmptyStateProps {
  icon: IconProps;
  text: String;
}

export const EmptyStateComponent = ({ icon, text }: EmptyStateProps): JSX.Element => {
  return (
    <Box
      sx={{
        borderRadius: '4px',
        display: 'flex',
        backgroundColor: grey[200],
        flexDirection: 'column',
        border: '1px solid',
        borderColor: grey[300],
        padding: 4
      }}
    >
      <Stack direction='column' alignItems='center' sx={{ color: grey[500] }}>
        {icon}
        <Typography fontSize={16}>No {text} to see here</Typography>
      </Stack>
    </Box>
  );
};
