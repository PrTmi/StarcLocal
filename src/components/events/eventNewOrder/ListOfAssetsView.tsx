import * as React from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useDispatch, useSelector } from 'react-redux';
import { assetsSelector, fetchAssetsByQuery } from '../../../state/assetsSlice';
import { Autocomplete, FormControl, Stack, TextField, Typography } from '@mui/material';
import { Asset, Client } from '../../../models/models';
import { styled } from '@mui/material/styles';
import { blue } from '@mui/material/colors';
import { grey } from '@mui/material/colors';
import BrokenImageIcon from '@mui/icons-material/BrokenImage';
import { ordersSelector, setSelectedAsset, setSelectedClient } from '../../../state/ordersSlice';
import { clientsSelector, fetchClientsByQuery } from '../../../state/clientsSlice';
import { useEffect } from 'react';
import { AppDispatch } from '../../../state/store';

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

export const ListOfAssetsView = (): JSX.Element => {
  const dispatch = useDispatch<AppDispatch>();
  const { assets } = useSelector(assetsSelector);
  const { selectedAsset, selectedClient } = useSelector(ordersSelector);
  const [client, setClient] = React.useState(selectedClient?.id);
  const { clients } = useSelector(clientsSelector);

  const handleSetClient = (id: string) => {
    setClient(id);
    if (!id) {
      dispatch(setSelectedAsset(null));
    }
  };

  const onSelectedAsset = (event: React.MouseEvent<HTMLElement>, asset: Asset) => {
    dispatch(setSelectedAsset(asset));
  };

  const refreshAssets = (clientId: string | number | null = null) => {
    dispatch(fetchAssetsByQuery(clientId));
  };

  useEffect(() => {
    refreshAssets(client);
    dispatch(setSelectedClient(clients.find((it: Client) => it.id === client)));
  }, [client]);

  useEffect(() => {
    const load = async () => {
      dispatch(fetchClientsByQuery());
    };
    load();
  }, []);

  const Item = styled(Box)(() => ({
    flexDirection: 'column',
    width: '260px',
    height: '208px',
    margin: '8px',
    justifyContent: 'flex-start',
    backgroundColor: grey[100],
    borderRadius: '4px'
  }));

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant='h5' mt={4}>
        Select Asset
      </Typography>
      <Typography variant='body2' mb={3}>
        Select asset to display
      </Typography>

      <Stack spacing={1} sx={{ backgroundColor: grey[200], p: 2, borderRadius: '4px' }}>
        <FormControl sx={{ minWidth: 120, py: 0, backgroundColor: 'white', borderRadius: '4px' }} size='medium'>
          <Autocomplete
            loading={!clients.length}
            loadingText='Loading advertisers...'
            id='client'
            getOptionLabel={(option: any) => {
              if (option == null || option === '') {
                return option;
              } else if (typeof option == 'string') {
                return clients.find((it: Client) => it.id === option)?.name;
              } else {
                return option?.name;
              }
            }}
            isOptionEqualToValue={(option: any, value: string) => {
              return value === option.id;
            }}
            openOnFocus={!client}
            options={clients}
            value={client || null}
            autoHighlight
            onChange={(e, value: any) => handleSetClient(value ? value.id : '')}
            renderInput={params => (
              <TextField
                {...params}
                autoFocus={!client}
                label='Advertiser'
                inputProps={{
                  ...params.inputProps
                }}
              />
            )}
          />
        </FormControl>
        <List
          sx={{
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            paddingTop: '16px',
            paddingBottom: '24px',
            borderRadius: '4px',
            justifyContent: 'flex-start',
            maxHeight: '500px',
            overflow: 'auto',
            boxShadow: 'none'
          }}
        >
          {client && assets?.filter((it: Asset) => !it.archived).length ? (
            <>
              {assets
                .filter((a: Asset) => {
                  return !a.archived;
                })
                .map((a: Asset) => {
                  return (
                    <CustomizedListItemButton
                      sx={{
                        flexDirection: 'column',
                        maxWidth: '260px',
                        height: '208px',
                        m: '8px',
                        justifyContent: 'flex-start',
                        padding: '0px',
                        backgroundColor: 'white'
                      }}
                      key={a.id}
                      selected={selectedAsset?.id === a.id}
                      onClick={event => onSelectedAsset(event, a)}
                    >
                      <Box sx={{ width: 'auto', height: '100px', m: '12px', display: 'flex', alignItems: 'center' }}>
                        {a.imageUrl == null ? (
                          <BrokenImageIcon sx={{ color: grey[400], fontSize: 60 }} />
                        ) : (
                          <Image fit='contain' src={a.imageUrl} showLoading />
                        )}
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
            </>
          ) : (
            <>
              <Item></Item>
              <Item></Item>
              <Item></Item>
            </>
          )}
        </List>
      </Stack>
    </Box>
  );
};
