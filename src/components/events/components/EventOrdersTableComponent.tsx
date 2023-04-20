import React from 'react';
import { Chip, chipClasses, Stack, Typography } from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams, GridRowModel } from '@mui/x-data-grid';
import { EventOrder, OrderStatus } from '../../../models/models';
import { grey } from '@mui/material/colors';
import { formatDate, formatTime } from '../../../services/formatting';
import { canGenerateReport } from '../OrderDetailsView';
import TimelineIcon from '@mui/icons-material/Timeline';
import Tooltip from '@mui/material/Tooltip';
import BrokenImageIcon from '@mui/icons-material/BrokenImage';
import { orderTypesMapping } from '../../../services/orderTypesMapping';

// @ts-ignore
import { Image } from 'mui-image';

type EventOrdersTableProps = {
  orders: EventOrder[];
  onClick: (a: EventOrder) => void;
  rowsPerPageOptions: number[];
  includeEvent: boolean;
  includeAdPlace: boolean;
  includeBroadcastTime: boolean;
};

export const EventOrdersTableComponent = ({
  orders,
  onClick,
  rowsPerPageOptions,
  includeEvent,
  includeAdPlace,
  includeBroadcastTime
}: EventOrdersTableProps): JSX.Element => {
  const [pageSize, setPageSize] = React.useState(rowsPerPageOptions[0]);

  const handleClick = (row: GridRowModel) => {
    onClick(row as EventOrder);
  };

  const columns: GridColDef[] = [
    {
      field: 'clientName',
      headerName: 'Asset',
      resizable: false,
      flex: 0.2,
      renderCell: (params: GridRenderCellParams) => {
        return (
          <Stack>
            <Typography variant='body2'>{params.row.asset.name}</Typography>
            <Typography variant='caption' color={grey[700]}>
              {params.row.client.name}
            </Typography>
          </Stack>
        );
      }
    },
    {
      field: 'assetImage',
      headerName: 'Preview',
      resizable: false,
      flex: 0.2,
      renderCell: (params: GridRenderCellParams) => {
        return params.row.asset.imageUrl ? (
          <div style={{ height: '72px', width: 'auto', paddingTop: '8px', paddingBottom: '8px' }}>
            <Image fit='contain' src={params.row.asset.imageUrl} showLoading />
          </div>
        ) : (
          <BrokenImageIcon sx={{ color: grey[400], fontSize: 70 }} />
        );
      }
    },
    {
      field: 'createdAt',
      headerName: 'Created',
      resizable: false,
      valueGetter: params => params.row.event.createdAt,

      flex: 0.1,
      renderCell: (params: GridRenderCellParams) => {
        return (
          <Stack>
            <Typography variant='body2'>{formatDate(params.row.event.createdAt)}</Typography>
            <Typography variant='caption' color={grey[800]}>
              {formatTime(params.row.event.createdAt)}
            </Typography>
          </Stack>
        );
      }
    },
    {
      field: 'eventName',
      headerName: 'Event',
      resizable: false,
      flex: 0.2,
      hide: includeEvent,
      valueGetter: params => params.row.event.name
    },
    {
      field: 'startAt',
      headerName: 'Broadcast time',
      resizable: false,
      valueGetter: params => params.row.event.startAt,
      flex: 0.1,
      hide: includeBroadcastTime,
      renderCell: (params: GridRenderCellParams) => {
        return (
          <Stack>
            <Typography variant='body2'>{formatDate(params.row.event.startAt)}</Typography>
            <Typography variant='caption' color={grey[800]}>
              {formatTime(params.row.event.startAt)}
            </Typography>
          </Stack>
        );
      }
    },
    {
      field: 'adPlacementId',
      headerName: 'Ad placements',
      resizable: false,
      flex: 0.2,
      hide: includeAdPlace,
      renderCell: (params: GridRenderCellParams) => {
        return params.row.locationPlacements
          .map((it: any) => {
            return it.name;
          })
          .join(', ');
      }
    },
    {
      field: 'status',
      headerName: 'Order status',
      resizable: false,
      flex: 0.2,
      renderCell: (params: GridRenderCellParams) => {
        const st = params.formattedValue as OrderStatus;
        const opts = orderTypesMapping.find(it => it.status === st)!!;

        return (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Chip
              color='secondary'
              sx={{
                [`& .${chipClasses.icon}`]: {
                  color: opts.color
                },
                color: opts.color,
                borderColor: opts.color,
                mr: 2
              }}
              label={opts.label}
              variant='outlined'
              icon={opts.icon}
            />
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
        rowHeight={72}
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
            sortModel: [{ field: 'createdAt', sort: 'desc' }]
          }
        }}
        columns={columns}
        autoHeight
      />
    </>
  );
};
