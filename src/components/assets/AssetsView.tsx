import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Chip, FormControl, LinearProgress, MenuItem, Select, SelectChangeEvent, Stack, Typography } from '@mui/material';
import { archiveAsset, assetsSelector, fetchAssetsByQuery, unArchiveAsset } from '../../state/assetsSlice';
import { Asset, Client } from '../../models/models';
import { AugmentAssetDialog } from './AugmentAssetDialog';
import IconButton from '@mui/material/IconButton';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Collapse from '@mui/material/Collapse';
import { AssetDetailsDialog } from './AssetDetailsDialog';
import { AssetsTable } from './AssetsTable';
import { AugmentingProssessDialog } from './AugmentingProssesDialog';
import { clientsSelector, fetchClientsByQuery } from '../../state/clientsSlice';
import { useSearchParams } from 'react-router-dom';
import { AppDispatch } from '../../state/store';

export const AssetsView = (): JSX.Element => {
  const dispatch = useDispatch<AppDispatch>();
  const urlParams = useSearchParams()[0];
  const [client, setClient] = React.useState(''); //clientId ? clientId :
  const { clients } = useSelector(clientsSelector);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [assetId, setAssetId] = useState<string>('new');
  const [scroll, setScroll] = React.useState('paper');

  const [augmentAssetDialogOpen, setAugmentAssetOpen] = useState<boolean>(false);
  const [augmentingProcessDialogOpen, setAugmentingProcessDialogOpen] = useState<boolean>(false);

  const [detailsOpen, setDetailsOpen] = useState<boolean>(false);
  const [open, setOpen] = React.useState(false);

  const { assets, isLoading } = useSelector(assetsSelector);

  const openDetails = (a: Asset) => {
    setAssetId(a.id!!);
    setDetailsOpen(true);
    setScroll('paper');
  };

  const createAsset = () => {
    setAssetId('new');
    setDetailsOpen(true);
  };

  const refreshAssets = (clientId: string | number | null = null) => {
    dispatch(fetchAssetsByQuery(clientId));
  };

  const handleChange = (event: SelectChangeEvent) => {
    const clientId = event.target.value as string;
    setClient(clientId);
    refreshAssets(clientId);
  };

  const unArchive = async (a: Asset) => {
    await dispatch(unArchiveAsset(a.id!!));
    refreshAssets(client);
  };

  const archive = async (a: Asset) => {
    await dispatch(archiveAsset(a.id!!));
    refreshAssets(client);
  };

  const closeDetailsDialog = (refresh: boolean) => {
    setDetailsOpen(false);
    if (refresh) {
      refreshAssets(client);
    }
  };

  const closeAugmentAssetDialog = () => {
    setAugmentAssetOpen(false);
  };

  const closeAugmentingProcessDialog = () => {
    setAugmentingProcessDialogOpen(false);
  };

  useEffect(() => {
    const load = async () => {
      dispatch(fetchClientsByQuery());
      const clientId = urlParams.has('clientId') ? urlParams.get('clientId')!! : '';
      setClient(clientId);
      refreshAssets(clientId);
    };
    load();
  }, []);

  const showStatus = (asset: Asset) => {
    setSelectedAsset(asset);
    setAugmentAssetOpen(true);
  };

  const showViewStatus = (asset: Asset) => {
    setSelectedAsset(asset);
    setAugmentingProcessDialogOpen(true);
  };

  return (
    <>
      <Stack direction='row' alignItems='center' justifyContent={'space-between'} pb={2}>
        <Stack direction='row' alignItems='center'>
          <Typography variant='h5' sx={{ lineHeight: 1.5 }}>
            Assets
            <Chip label={assets.filter((it: Asset) => !it.archived).length} sx={{ ml: 1, cursor: 'pointer' }} />
          </Typography>

          <FormControl sx={{ ml: 3, minWidth: 120, py: 0 }} size='small'>
            <Select value={client} onChange={handleChange} displayEmpty inputProps={{ 'aria-label': 'Without label' }}>
              <MenuItem value=''>All advertisers</MenuItem>
              {clients.map((c: Client) => (
                <MenuItem key={c.id!!} value={c.id!!}>
                  {c.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>

        <Button variant='outlined' onClick={createAsset} disabled={clients.length === 0}>
          New asset
        </Button>
      </Stack>
      {!isLoading ? (
        <div style={{ width: '100%' }}>
          <AssetsTable
            assets={assets.filter((it: Asset) => !it.archived)}
            onAugmentAsset={showStatus}
            onViewAsset={showViewStatus}
            onEdit={openDetails}
            onArchive={archive}
          />
        </div>
      ) : (
        <LinearProgress />
      )}

      <Stack mt={2} direction='row' alignItems='center' onClick={() => setOpen(!open)} sx={{ cursor: 'pointer', mb: 1 }}>
        {assets.filter((it: Asset) => it.archived).length > 1 || assets.filter((it: Asset) => it.archived).length === 0 ? (
          <Typography>{assets.filter((it: Asset) => it.archived).length} ARCHIVED ASSETS</Typography>
        ) : (
          <Typography>{assets.filter((it: Asset) => it.archived).length} ARCHIVED ASSET</Typography>
        )}
        <IconButton aria-label='expand row' size='small'>
          {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
        </IconButton>
      </Stack>

      <Collapse in={open} timeout='auto' unmountOnExit>
        <div style={{ width: '100%' }}>
          <AssetsTable
            assets={assets.filter((it: Asset) => it.archived)}
            onAugmentAsset={showStatus}
            onViewAsset={showViewStatus}
            onEdit={openDetails}
            onUnArchive={unArchive}
          />
        </div>
      </Collapse>

      <AugmentAssetDialog asset={selectedAsset} onClose={closeAugmentAssetDialog} open={augmentAssetDialogOpen} />
      <AugmentingProssessDialog asset={selectedAsset} onClose={closeAugmentingProcessDialog} open={augmentingProcessDialogOpen} />
      <AssetDetailsDialog onClose={refresh => closeDetailsDialog(refresh)} open={detailsOpen} assetId={assetId} scroll={scroll} clientId={client} />
    </>
  );
};
