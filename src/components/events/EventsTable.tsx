import React from 'react';
import { Button, Link, Stack, Typography } from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { Event } from '../../models/models';
import { formatDate, formatTime } from '../../services/formatting';
import { grey } from '@mui/material/colors';

type EventsTableProps = {
  events: Event[];
  onOpen: (e: Event) => void;
  onCreateOrder: (e: Event) => void;
};

export const EventsTable = ({ events, onOpen, onCreateOrder }: EventsTableProps): JSX.Element => {
  const [pageSize, setPageSize] = React.useState(10);
  const columns: GridColDef[] = [
    {
      field: 'name',
      headerName: 'Event name',
      resizable: false,
      flex: 0.1,
      renderCell: (params: GridRenderCellParams) => {
        const st = params.formattedValue as Event;
        return (
          <Link component='button' variant='body2' onClick={() => onOpen(params.row as Event)}>
            {st}
          </Link>
        );
      }
    },
    {
      field: 'dateStart',
      headerName: 'Broadcast time',
      flex: 0.1,
      renderCell: (params: GridRenderCellParams) => {
        const date = params.formattedValue as string;
        return (
          <Stack>
            <Typography variant='body2'>{formatDate(date)}</Typography>
            <Typography variant='caption' color={grey[800]}>
              {formatTime(date)}
            </Typography>
          </Stack>
        );
      }
    },
    {
      field: 'broadcaster',
      headerName: 'Broadcaster',
      flex: 0.1,
      renderCell: (params: GridRenderCellParams) => {
        return params.row.broadcaster ? params.row.broadcaster : '-';
      }
    },
    {
      field: 'location',
      headerName: 'Placements available',
      flex: 0.1,
      renderCell: (params: GridRenderCellParams) => {
        return params.row.ad_Placements ? params.row.ad_Placements : '-';
      }
    },
    { field: 'orderCount', headerName: 'Orders', flex: 0.1 },
    {
      field: 'actions',
      headerName: '',
      resizable: false,
      sortable: false,
      align: 'right',
      flex: 0.2,
      renderCell: (params: GridRenderCellParams) => {
        return <Button onClick={() => onCreateOrder(params.row as Event)}>Create order</Button>;
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
            whiteSpace: 'normal'
          },
          '& .MuiDataGrid-row': {
            maxHeight: 'none !important'
          },
          '.MuiDataGrid-columnSeparator': {
            visibility: 'hidden'
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
        rows={events}
        columns={columns}
        autoHeight
      />
    </>
  );
};
