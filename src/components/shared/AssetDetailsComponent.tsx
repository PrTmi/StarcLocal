import { SxProps, Typography } from '@mui/material';
import { Asset } from '../../models/models';
import React from 'react';
import { Box, Stack } from '@mui/material';
import { grey } from '@mui/material/colors';
import BrokenImageIcon from '@mui/icons-material/BrokenImage';
import { useSelector } from 'react-redux';
import { ordersSelector } from '../../state/ordersSlice';

// @ts-ignore
import { Image } from 'mui-image';

interface AssetProps {
  asset: Asset;
  fontSize: number;
  spacing: number;
  sizeStyles: SxProps;
  clientName: boolean;
}

export const AssetDetailsComponent = ({ asset, fontSize, spacing, sizeStyles, clientName }: AssetProps): JSX.Element => {
  const { selectedClient } = useSelector(ordersSelector);

  return (
    <>
      {asset == null ? null : (
        <>
          <Stack direction='row' spacing={spacing} alignItems='center'>
            <Box sx={sizeStyles}>
              {asset.imageUrl == null ? <BrokenImageIcon sx={{ color: grey[400], fontSize: 60 }} /> : <Image fit='contain' src={asset.imageUrl} showLoading />}
            </Box>
            <Box>
              <Typography variant='h5' fontSize={fontSize}>
                {asset.name}
              </Typography>

              {!clientName ? (
                <Typography fontSize={14} color={grey[800]}>
                  {asset.fileFullName}
                </Typography>
              ) : (
                <Typography fontSize={14} color={grey[800]}>
                  {selectedClient ? selectedClient.name : null}
                </Typography>
              )}
            </Box>
          </Stack>
        </>
      )}
    </>
  );
};
