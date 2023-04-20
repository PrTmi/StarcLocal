import * as React from 'react';
import { OrderStatus } from '../models/models';
import { blue, green, grey, red } from '@mui/material/colors';
import { Error, AutoGraph, DoneAll, ErrorOutline, FolderOpen, HourglassTop, PendingActions, QueryStats, SettingsInputAntenna } from '@mui/icons-material';

export const orderTypesMapping = [
  {
    status: OrderStatus.PendingBroadcast,
    label: 'Pending broadcast',
    menuPosition: 1,
    showInMenu: true,
    showInTable: true,
    color: grey[500],
    icon: <PendingActions />,
    tooltipLabel: 'Orders pending broadcast'
  },

  {
    status: OrderStatus.OnAir,
    label: 'On Air',
    menuPosition: 2,
    showInMenu: true,
    showInTable: true,
    color: blue[500],
    icon: <SettingsInputAntenna />,
    tooltipLabel: 'Orders on air'
  },
  {
    status: OrderStatus.PendingContent,
    label: 'Pending content',
    menuPosition: 3,
    showInMenu: true,
    showInTable: true,
    color: grey[500],
    icon: <HourglassTop />,
    tooltipLabel: 'Orders pending content'
  },
  {
    status: OrderStatus.ReadyForAnalysis,
    label: 'Ready for analysis',
    menuPosition: 4,
    showInMenu: true,
    showInTable: true,
    color: blue[500],
    icon: <AutoGraph />,
    tooltipLabel: 'Orders ready for analysis'
  },
  {
    status: OrderStatus.Analyzing,
    label: 'Analyzing',
    menuPosition: 5,
    showInMenu: true,
    showInTable: true,
    color: green[500],
    icon: <QueryStats />,
    tooltipLabel: 'Orders in analysis'
  },
  {
    status: OrderStatus.Delivered,
    label: 'Delivered',
    menuPosition: 6,
    showInMenu: true,
    showInTable: true,
    color: green[500],
    icon: <DoneAll />,
    tooltipLabel: 'Orders delivered'
  },
  {
    status: OrderStatus.Archived,
    label: 'Archived',
    menuPosition: 7,
    showInMenu: true,
    showInTable: false,
    color: blue[500],
    icon: <FolderOpen />,
    tooltipLabel: 'Archived orders'
  },
  {
    status: OrderStatus.Error,
    label: 'Analysis error',
    menuPosition: 8,
    showInMenu: false,
    showInTable: false,
    color: red[500],
    icon: <Error />,
    tooltipLabel: 'Orders in analysis error'
  },
  {
    status: OrderStatus.Invalid,
    label: 'Invalid',
    menuPosition: 9,
    showInMenu: false,
    showInTable: false,
    color: grey[500],
    icon: <ErrorOutline />,
    tooltipLabel: 'Invalid orders'
  }
];
