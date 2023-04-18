import React, { useState } from 'react';
import { Menu, MenuItem } from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { Client } from '../../models/models';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import IconButton from '@mui/material/IconButton';
import { ClickableTableCell } from '../shared/ui/ClickableTableCell';

type ClientsTableProps = {
  clients: Client[];
  onEdit?: (c: Client) => void;
  onArchive?: (c: Client) => void;
  onUnArchive?: (c: Client) => void;
  onView?: (c: Client) => void;
  onDetails: (c: Client, routeName: string) => void;
};

export const ClientsTable = ({ clients, onEdit, onArchive, onUnArchive, onView, onDetails }: ClientsTableProps): JSX.Element => {
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = useState<Element | null>(null);
  const [pageSize, setPageSize] = React.useState(5);

  const handleMenuClick = (e: React.MouseEvent<HTMLElement>, c: Client) => {
    setSelectedClient(c);
    setAnchorEl(e.currentTarget);
    setMenuOpen(true);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuOpen(false);
  };

  const buildMenu = () => {
    const functions = [];

    if (selectedClient) {
      if (onEdit) {
        functions.push({ label: 'Edit', func: onEdit });
      }

      if (selectedClient!!.archived && onUnArchive) {
        functions.push({ label: 'Unarchive', func: onUnArchive });
      }

      if (!selectedClient!!.archived && onArchive) {
        functions.push({ label: 'Archive', func: onArchive });
      }
    }

    return functions.map(it => {
      return (
        <MenuItem
          key={it.label}
          onClick={() => {
            handleMenuClose();
            it.func(selectedClient!!);
          }}
        >
          {it.label}
        </MenuItem>
      );
    });
  };

  const columns: GridColDef[] = [
    { field: 'name', headerName: 'Client', resizable: false, flex: 0.1 },
    {
      field: 'assetsCount',
      headerName: 'Assets',
      resizable: false,
      flex: 0.1,
      renderCell: (params: GridRenderCellParams) => {
        return <ClickableTableCell onDetails={() => onDetails(params.row as Client, '/assets')} param={params.row.assetsCount} />;
      }
    },
    {
      field: 'pendingOrdersCount',
      headerName: 'Pending orders',
      resizable: false,
      flex: 0.1,
      renderCell: (params: GridRenderCellParams) => {
        return <ClickableTableCell onDetails={() => onDetails(params.row as Client, '/orders/requires_approval')} param={params.row.pendingOrdersCount} />;
      }
    },

    {
      field: 'ordersInProductionCount',
      headerName: 'Orders in production',
      resizable: false,
      flex: 0.1,
      renderCell: (params: GridRenderCellParams) => {
        return <ClickableTableCell onDetails={() => onDetails(params.row as Client, '/orders/approved')} param={params.row.ordersInProductionCount} />;
      }
    },

    {
      field: 'ordersDeliveredCount',
      headerName: 'Orders delivered',
      resizable: false,
      flex: 0.1,
      renderCell: (params: GridRenderCellParams) => {
        return <ClickableTableCell onDetails={() => onDetails(params.row as Client, '/orders/delivered')} param={params.row.ordersDeliveredCount} />;
      }
    },

    {
      field: 'amountOfArchivedOrders',
      headerName: 'Archived orders',
      resizable: false,
      flex: 0.1,
      renderCell: (params: GridRenderCellParams) => {
        return <ClickableTableCell onDetails={() => onDetails(params.row as Client, '/orders/archived')} param={params.row.archivedOrdersCount} />;
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
          <IconButton color='inherit' onClick={e => handleMenuClick(e, params.row as Client)}>
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
        rows={clients}
        columns={columns}
        autoHeight
        rowHeight={80}
        initialState={{
          sorting: {
            sortModel: [{ field: 'dateCreated', sort: 'desc' }]
          }
        }}
      />
      <Menu id='clients-menu' anchorEl={anchorEl} open={menuOpen} onClose={handleMenuClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}>
        {buildMenu()}
      </Menu>
    </>
  );
};
