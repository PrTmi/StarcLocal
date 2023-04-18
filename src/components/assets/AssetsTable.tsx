import React, { useState } from 'react';
import { Button, Chip, Menu, MenuItem } from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { Asset, AssetStatus } from '../../models/models';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import IconButton from '@mui/material/IconButton';
import { blue, green, grey, orange } from '@mui/material/colors';
import BrokenImageIcon from '@mui/icons-material/BrokenImage';
import { formatDateTime } from '../../services/formatting';

// @ts-ignore
import { Image } from 'mui-image';

type AssetsStatusesMapping = {
  [key in AssetStatus]: { label: string; color: string };
};

//change colors
const assetStatusesMapping: AssetsStatusesMapping = {
  // [AssetStatus.pending_validation]: { label: 'Pending validation', color: grey[800] },
  // [AssetStatus.asset_created]: { label: 'Asset created', color: grey[800] },
  [AssetStatus.ready_for_augmentation]: { label: 'Ready for augmentation', color: orange[500] },
  [AssetStatus.augment_started]: { label: 'Augmenting', color: blue[500] },
  // [AssetStatus.augment_complete]: { label: 'Augmentation complete', color: orange[500] },
  // [AssetStatus.initial_training_started]: { label: 'Initial training started', color: orange[500] },
  [AssetStatus.initial_model_ready]: { label: 'Ready for ad-insertion', color: green[500] },
  [AssetStatus.model_ready]: { label: 'Ready for ad-insertion', color: green[500] },
  [AssetStatus.archived]: { label: 'Archived', color: grey[500] },
  [AssetStatus.training_started]: { label: 'Training started', color: grey[500] }
};

type AssetsTableProps = {
  assets: Asset[];
  onAugmentAsset: (a: Asset) => void;
  onViewAsset: (a: Asset) => void;
  onEdit?: (a: Asset) => void;
  onArchive?: (a: Asset) => void;
  onUnArchive?: (a: Asset) => void;
  onView?: (a: Asset) => void;
  onAugment?: (a: Asset) => void;
};

export const AssetsTable = ({ assets, onAugmentAsset, onViewAsset, onEdit, onArchive, onUnArchive, onView, onAugment }: AssetsTableProps): JSX.Element => {
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = useState<Element | null>(null);
  const [pageSize, setPageSize] = React.useState(5);

  const handleMenuClick = (e: React.MouseEvent<HTMLElement>, a: Asset) => {
    setSelectedAsset(a);
    setAnchorEl(e.currentTarget);
    setMenuOpen(true);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuOpen(false);
  };

  const buildMenu = () => {
    const functions = [];

    if (selectedAsset) {
      if (onEdit) {
        functions.push({ label: 'Edit', func: onEdit });
      }

      if (selectedAsset!!.archived && onUnArchive) {
        functions.push({ label: 'Unarchive', func: onUnArchive });
      }

      if (!selectedAsset!!.archived && onArchive) {
        functions.push({ label: 'Archive', func: onArchive });
      }
    }

    return functions.map(it => {
      return (
        <MenuItem
          key={it.label}
          onClick={() => {
            handleMenuClose();
            it.func(selectedAsset!!);
          }}
        >
          {it.label}
        </MenuItem>
      );
    });
  };

  const columns: GridColDef[] = [
    { field: 'name', headerName: 'Asset name', resizable: false, flex: 0.1 },
    {
      field: 'preview',
      headerName: 'Preview',
      resizable: false,
      sortable: false,
      flex: 0.1,
      renderCell: (params: GridRenderCellParams) => {
        return params.row.imageUrl ? (
          <div style={{ height: '60px', width: 'auto' }}>
            <Image fit='contain' src={params.row.imageUrl} showLoading />
          </div>
        ) : (
          <BrokenImageIcon sx={{ color: grey[400], fontSize: 60 }} />
        );
      }
    },
    {
      field: 'dateCreated',
      headerName: 'Created',
      resizable: false,
      flex: 0.1,
      renderCell: (params: GridRenderCellParams) => {
        return formatDateTime(params.row.dateCreated);
      }
    },
    { field: 'fileFullName', headerName: 'File name', resizable: false, flex: 0.1 },
    {
      field: 'status',
      headerName: 'Asset status',
      resizable: false,
      flex: 0.2,
      renderCell: (params: GridRenderCellParams) => {
        const st = params.formattedValue as AssetStatus;
        let opts = assetStatusesMapping[st] as any;
        if (opts == null) {
          opts = { label: st, color: 'black' };
        }

        return (
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
            <Chip label={opts.label} variant='outlined' sx={{ color: opts.color, borderColor: opts.color }} />
            {st === AssetStatus.ready_for_augmentation && (
              <Button variant='contained' onClick={() => onAugmentAsset(params.row as Asset)}>
                Augment
              </Button>
            )}
            {st === AssetStatus.augment_started && <Button onClick={() => onViewAsset(params.row as Asset)}>View</Button>}
          </div>
        );
      }
    },
    {
      field: '',
      headerName: '',
      resizable: false,
      sortable: false,
      width: 60,
      renderCell: (params: GridRenderCellParams) => {
        return (
          <IconButton color='inherit' onClick={e => handleMenuClick(e, params.row as Asset)}>
            <MoreVertIcon />
          </IconButton>
        );
      }
    }
  ];

  return (
    <>
      <DataGrid
        sx={{
          '& .MuiDataGrid-renderingZone': {
            maxHeight: 'none !important'
          },
          '& .MuiDataGrid-cell': {
            // lineHeight: 'unset !important',
            // maxHeight: 'none !important',
            whiteSpace: 'normal'
          },
          '& .MuiDataGrid-row': {
            maxHeight: 'none !important'
          },
          '.MuiDataGrid-columnSeparator': {
            visibility: 'hidden'
          },
          '&.MuiDataGrid-root .MuiDataGrid-columnHeader:focus, &.MuiDataGrid-root .MuiDataGrid-cell:focus': {
            outline: 'none'
          },
          background: '#ffffff'
        }}
        disableColumnMenu
        disableColumnFilter
        disableColumnSelector
        disableSelectionOnClick
        pageSize={pageSize}
        onPageSizeChange={newPageSize => setPageSize(newPageSize)}
        rowsPerPageOptions={[5, 10, 15]}
        rows={assets}
        columns={columns}
        autoHeight
        rowHeight={80}
        initialState={{
          sorting: {
            sortModel: [{ field: 'dateCreated', sort: 'desc' }]
          }
        }}
      />
      <Menu id='asset-menu' anchorEl={anchorEl} open={menuOpen} onClose={handleMenuClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}>
        {buildMenu()}
      </Menu>
    </>
  );
};
