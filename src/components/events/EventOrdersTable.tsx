import React from 'react';
import { Chip, Stack, Typography } from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams, GridRowModel } from '@mui/x-data-grid';
import { EventOrder, OrderStatus } from '../../models/models';
import { blue, grey, orange, green } from '@mui/material/colors';
import { formatDate, formatDateTime, formatTime } from '../../services/formatting';
import { canGenerateReport } from './OrderDetails';
import TimelineIcon from '@mui/icons-material/Timeline';
import Tooltip from '@mui/material/Tooltip';

type OrderStatusesMapping = {
  [key in OrderStatus]: { label: string; color: string };
};

export const orderStatusesMapping: OrderStatusesMapping = {
  [OrderStatus.archived]: { label: 'Archived', color: grey[500] },
  [OrderStatus.requires_approval]: { label: 'Pending review', color: orange[500] },
  //[OrderStatus.requires_augmentation]: { label: 'Requires augmentation', color: orange[500] },
  //[OrderStatus.requires_training]: { label: 'Requires training', color: orange[500] },
  [OrderStatus.in_production]: { label: 'In production', color: grey[500] },
  [OrderStatus.delivered]: { label: 'Delivered', color: green[500] },
  [OrderStatus.approved]: { label: 'In production', color: blue[500] }
  //[OrderStatus.requires_augmentation]: { label: 'Requires augmentation', color: blue[500] }
};

type EventOrdersTableProps = {
  orders: EventOrder[];
  onClick: (a: EventOrder) => void;
  rowsPerPageOptions: number[];
};

export const EventOrdersTable = ({ orders, onClick, rowsPerPageOptions }: EventOrdersTableProps): JSX.Element => {
  const [pageSize, setPageSize] = React.useState(rowsPerPageOptions[0]);

  const handleClick = (row: GridRowModel) => {
    onClick(row as EventOrder);
  };

  const columns: GridColDef[] = [
    {
      field: 'assetName',
      headerName: 'Asset',
      valueGetter: params => params.row.asset.name,
      resizable: false,
      flex: 0.2
    },
    {
      field: 'dateCreated',
      headerName: 'Created',
      resizable: false,
      flex: 0.2,
      renderCell: (params: GridRenderCellParams) => {
        return formatDateTime(params.row.dateCreated);
      }
    },
    {
      field: 'eventName',
      headerName: 'Event',
      resizable: false,
      flex: 0.2,
      valueGetter: params => params.row.event.name
    },
    {
      field: 'dataStart',
      headerName: 'Broadcast time',
      resizable: false,
      valueGetter: params => params.row.event.dateStart,
      flex: 0.2,
      renderCell: (params: GridRenderCellParams) => {
        return (
          <Stack>
            <Typography variant='body2'>{formatDate(params.row.event.dateStart)}</Typography>
            <Typography variant='caption' color={grey[800]}>
              {formatTime(params.row.event.dateStart)}
            </Typography>
          </Stack>
        );
      }
    },
    { field: 'adPlacementId', headerName: 'Ad placements', resizable: false, flex: 0.2 },
    {
      field: 'status',
      headerName: 'Order status',
      resizable: false,
      flex: 0.2,
      renderCell: (params: GridRenderCellParams) => {
        const st = params.formattedValue as OrderStatus;
        let opts = orderStatusesMapping[st] as any;
        if (opts == null) {
          opts = { label: st, color: 'black' };
        }

        return (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Chip label={opts.label} variant='outlined' sx={{ color: opts.color, borderColor: opts.color, mr: 2 }} />
            {canGenerateReport(params.row as EventOrder) ? (
              <Tooltip title='Prediction report ready to be created' placement='top-start'>
                <TimelineIcon color='primary' />
              </Tooltip>
            ) : (
              ''
            )}
          </div>
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
            lineHeight: 'unset !important',
            whiteSpace: 'normal',
            paddingTop: '12px',
            paddingBottom: '12px'
          },
          '& .MuiDataGrid-row': {
            maxHeight: 'none !important'
          },
          '.MuiDataGrid-columnSeparator': {
            visibility: 'hidden'
          },
          background: '#ffffff'
        }}
        onRowClick={rowData => handleClick(rowData.row)}
        rowsPerPageOptions={rowsPerPageOptions}
        disableColumnMenu
        disableColumnFilter
        disableColumnSelector
        disableSelectionOnClick
        pageSize={pageSize}
        onPageSizeChange={newPageSize => setPageSize(newPageSize)}
        rows={orders}
        initialState={{
          sorting: {
            sortModel: [{ field: 'dateCreated', sort: 'desc' }]
          }
        }}
        columns={columns}
        autoHeight
      />
    </>
  );
};
