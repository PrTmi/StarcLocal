import * as React from 'react';
import Box from '@mui/material/Box';
import { blue, grey } from '@mui/material/colors';
import { Client } from '../../../models/models';

type ButtonProps = {
  onDetails: (c: Client) => void;
  param: Client;
};

export const ClickableTableCell = ({ onDetails, param }: ButtonProps): JSX.Element => {
  return (
    <Box
      onClick={() => onDetails(param)}
      sx={{
        display: 'flex',
        alignItems: 'center',
        marginLeft: '-16px',
        paddingLeft: '16px',
        color: blue[500],
        cursor: 'pointer',
        width: '100%',
        height: '100%',
        '&:hover': {
          background: grey[200]
        }
      }}
    >
      {param}
    </Box>
  );
};
