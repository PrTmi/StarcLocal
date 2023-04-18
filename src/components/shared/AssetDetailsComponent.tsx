import { SxProps, Typography } from '@mui/material';
import { Asset } from '../../models/models';
import React from 'react';
import { Box, Stack } from '@mui/material';
import { grey } from '@mui/material/colors';
import BrokenImageIcon from '@mui/icons-material/BrokenImage';

// @ts-ignore
import { Image } from 'mui-image';

interface AssetProps {
  asset: Asset;
  fontSize: number;
  spacing: number;
  sizeStyles: SxProps;
}

export const AssetDetailsComponent = ({ asset, fontSize, spacing, sizeStyles }: AssetProps): JSX.Element => {
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
              <Typography fontSize={14} color={grey[800]}>
                {asset.fileFullName}
              </Typography>
            </Box>
          </Stack>
        </>
      )}
    </>
  );
};
