import * as React from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useDispatch, useSelector } from 'react-redux';
import { assetsSelector } from '../../../state/assetsSlice';
import { Typography } from '@mui/material';
import { Asset } from '../../../models/models';
import { styled } from '@mui/material/styles';
import { blue } from '@mui/material/colors';
import { grey } from '@mui/material/colors';
import BrokenImageIcon from '@mui/icons-material/BrokenImage';
import { ordersSelector, setSelectedAsset } from '../../../state/ordersSlice';
// @ts-ignore
import { Image } from 'mui-image';

const CustomizedListItemButton = styled(ListItemButton)(() => ({
  '&.MuiListItemButton-root': {
    border: '1px solid',
    borderColor: grey[300],
    borderRadius: '4px'
  },
  '&.Mui-selected': {
    backgroundColor: 'transparent',
    outline: '2px solid',
    outlineColor: blue[700]
  }
}));

export const ListOfAssets = (): JSX.Element => {
  const dispatch = useDispatch();
  const { assets } = useSelector(assetsSelector);
  const { selectedAsset } = useSelector(ordersSelector);

  const onSelectedAsset = (event: React.MouseEvent<HTMLElement>, asset: Asset) => {
    dispatch(setSelectedAsset(asset));
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant='h5' mt={4}>
        Select Asset
      </Typography>
      <Typography variant='body2' mb={3}>
        Select asset to display
      </Typography>

      <List
        sx={{
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
          backgroundColor: '#ffffff',
          padding: '24px',
          borderRadius: '4px',
          justifyContent: 'flex-start',
          maxHeight: '500px',
          overflow: 'auto',
          boxShadow: '0px 2px 1px -1px rgb(0 0 0 / 20%)'
        }}
      >
        {assets.map((a: Asset) => {
          return (
            <CustomizedListItemButton
              sx={{
                flexDirection: 'column',
                maxWidth: '260px',
                height: '208px',
                m: '8px',
                justifyContent: 'flex-start',
                padding: '0px'
              }}
              key={a.id}
              selected={selectedAsset?.id === a.id}
              onClick={event => onSelectedAsset(event, a)}
            >
              <Box sx={{ width: 'auto', height: '100px', m: '12px', display: 'flex', alignItems: 'center' }}>
                {a.imageUrl == null ? <BrokenImageIcon sx={{ color: grey[400], fontSize: 60 }} /> : <Image fit='contain' src={a.imageUrl} showLoading />}
              </Box>

              <Box sx={{ width: '260px', maxWidth: '260px', textAlign: 'center', pb: '12px' }}>
                {selectedAsset?.id === a.id && (
                  <CheckCircleIcon
                    color='primary'
                    sx={{
                      position: 'absolute',
                      top: '-13px',
                      right: '-13px',
                      borderRadius: '50px',
                      backgroundColor: '#ffffff'
                    }}
                  />
                )}

                <Typography variant='body1'>{a.name}</Typography>
                <Typography variant='caption' align={'center'}>
                  {a.fileFullName}
                </Typography>
              </Box>
            </CustomizedListItemButton>
          );
        })}
      </List>
    </Box>
  );
};
