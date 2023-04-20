import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, Breadcrumbs, Button, Card, Chip, LinearProgress, Link, ListItem, Stack, Typography } from '@mui/material';
import { eventsSelector, fetchEventDetails } from '../../state/eventsSlice';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { fetchOrderDetails, fetchReport, generateReport, ordersSelector } from '../../state/ordersSlice';
import { orderStatusesMapping } from './EventOrdersTable';
import { AssetStatus, EventOrder, OrderStatus } from '../../models/models';
import { grey } from '@mui/material/colors';
import { OrderDetailsHeader } from './OrderDetailsHeader';
import { AssetDetailsComponent } from '../shared/AssetDetailsComponent';
import { PlacementDetailsComponent } from '../shared/PlacementDetailsComponent';
import { LoadingButton } from '@mui/lab';
import TimelineIcon from '@mui/icons-material/Timeline';
import List from '@mui/material/List';
import { Graph } from './Graph';
import Tooltip from '@mui/material/Tooltip';
import { AppDispatch } from '../../state/store';

export const formatSeconds = (seconds: number) => {
  return new Date(seconds * 1000).toISOString().substr(14, 5);
};

export const canGenerateReport = (order: EventOrder) => {
  return (
    order.status === OrderStatus.approved &&
    order.event?.status === 'ready' &&
    (order.asset?.status === AssetStatus.initial_model_ready || order.asset?.status === AssetStatus.model_ready)
  );
};

export const OrderDetailsView = (): JSX.Element => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const params = useParams();
  const id = params['id'];
  const orderId = params['orderId'];
  const video = useRef<HTMLVideoElement | null>(null);
  const canvas = useRef<HTMLCanvasElement | null>(null);
  const [currentVideoPosition, setCurrentVideoPosition] = useState<number>(0);

  const back = () => {
    navigate(`/events/${id}`);
  };

  useEffect(() => {
    dispatch(fetchEventDetails(id!!));
    dispatch(fetchOrderDetails(orderId!!));
  }, []);

  const { eventDetails } = useSelector(eventsSelector);
  const { orderDetails, report, boxes } = useSelector(ordersSelector);

  useEffect(() => {
    if (orderDetails != null && orderId === orderDetails.id && orderDetails.status === OrderStatus.delivered) {
      dispatch(fetchReport(orderId!!));
    }
  }, [orderDetails]);

  const handleGenerateReport = () => {
    dispatch(generateReport(orderId!!));
  };

  /*const playVideo = () => {
      video.current?.play();
    };
     */

  const setSeekPosition = (pos: number) => {
    // console.log('setSeekPosition ' + pos);
    if (video.current != null) {
      video.current.currentTime = pos;
    }
  };

  const drawBoxes = (time: number) => {
    if (boxes == null || boxes.length === 0 || time > boxes.length || canvas.current == null) {
      return;
    }
    const currentBoxes = boxes[Math.trunc(time)];
    const width = canvas.current?.clientWidth;
    const height = canvas.current?.clientHeight;

    const ctx = canvas.current?.getContext('2d')!!;
    const scale = window.devicePixelRatio;
    canvas.current.width = Math.floor(width * scale);
    canvas.current.height = Math.floor(height * scale);

    ctx.clearRect(0, 0, width!!, height!!);

    if (currentBoxes.length === 0) {
      return;
    }

    ctx.lineWidth = 2;
    ctx.strokeStyle = '#9CFFDF';

    for (const box of currentBoxes) {
      console.log(time, Math.trunc(time), box.left, box.top);
      ctx.strokeRect(
        box.left * width * window.devicePixelRatio,
        box.top * height * window.devicePixelRatio,
        box.width * width * window.devicePixelRatio,
        box.height * height * window.devicePixelRatio
      );
    }
  };

  const updateProgress = () => {
    // console.log('updateProgress ' + video.current?.currentTime!!);
    setCurrentVideoPosition(video.current?.currentTime!!);
    drawBoxes(video.current?.currentTime!!);
  };

  const countADSeconds = (): number => {
    return report?.adSeconds.filter((it: boolean) => it).length;
  };

  const generateButtonVisible = (): boolean => {
    return orderDetails != null && (canGenerateReport(orderDetails) || orderDetails.status === OrderStatus.in_production);
  };

  const buildVideo = useMemo(() => {
    return (
      <div style={{ position: 'relative', width: '100%' }}>
        <canvas ref={canvas} style={{ position: 'absolute', width: '100%', height: '100%' }} />
        <video muted ref={video} width='100%' controls={true} onTimeUpdate={updateProgress} preload='auto'>
          <source src={report?.videoResultUrl} />
        </video>
      </div>
    );
  }, [report]);

  return eventDetails && orderDetails ? (
    <Box>
      <Breadcrumbs separator={<NavigateNextIcon fontSize='small' />}>
        <Link underline='hover' color='inherit' href='/events'>
          Events
        </Link>
        <Link underline='hover' color='inherit' href={'/events/' + id}>
          {eventDetails.name}
        </Link>
      </Breadcrumbs>
      <Box pb={2} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'top' }}>
        <Typography variant='h5'>Order</Typography>
        <Button variant='text' onClick={back} sx={{ height: '32px' }}>
          Back to event
        </Button>
      </Box>
      <Card
        sx={{
          backgroundColor: '#ffffff',
          p: 3,
          boxShadow: '0px 2px 1px -1px rgb(0 0 0 / 20%)'
        }}
      >
        <Stack direction='row' justifyContent='space-between' alignItems='center'>
          <Typography color='text.secondary'>ORDER DETAILS</Typography>

          <Chip
            label={orderStatusesMapping[orderDetails.status as OrderStatus].label}
            variant='outlined'
            sx={{
              color: orderStatusesMapping[orderDetails.status as OrderStatus].color,
              borderColor: orderStatusesMapping[orderDetails.status as OrderStatus].color
            }}
          />
        </Stack>

        <OrderDetailsHeader order={orderDetails} />
      </Card>
      <Stack direction='row' spacing={4} justifyContent='space-between' mt={3}>
        <Card sx={{ background: '#ffffff', width: '50%', p: 3, boxShadow: '0px 2px 1px -1px rgb(0 0 0 / 20%)' }}>
          <Typography sx={{ mb: 1.5 }} color='text.secondary'>
            ASSET
          </Typography>
          <AssetDetailsComponent asset={orderDetails.asset} fontSize={20} spacing={4} sizeStyles={{ height: '120px', width: 'auto', maxHeight: '120px' }} />
        </Card>
        <Card sx={{ background: '#ffffff', width: '50%', p: 3, boxShadow: '0px 2px 1px -1px rgb(0 0 0 / 20%)' }}>
          <Typography sx={{ mb: 1.5 }} color='text.secondary'>
            PLACEMENT
          </Typography>
          <PlacementDetailsComponent placement={orderDetails.adPlacementId} />
        </Card>
      </Stack>
      <Box mt={2} mb={2}>
        {report ? null : generateButtonVisible() ? (
          <LoadingButton
            onClick={handleGenerateReport}
            startIcon={<TimelineIcon />}
            loading={orderDetails.status === OrderStatus.in_production}
            variant='contained'
            loadingPosition='start'
          >
            Generate Report
          </LoadingButton>
        ) : (
          <Tooltip title='Cannot generate video if... ' placement='top-start'>
            <div>
              <LoadingButton
                onClick={handleGenerateReport}
                startIcon={<TimelineIcon />}
                loading={orderDetails.status === OrderStatus.in_production}
                variant='contained'
                loadingPosition='start'
                disabled
              >
                Generate Report
              </LoadingButton>
            </div>
          </Tooltip>
        )}
        {!report ? null : (
          <Box sx={{ backgroundColor: '#ffffff', p: 3 }}>
            <Typography variant='body1' color={grey[700]} mb={2}>
              ORDER REPORT
            </Typography>

            <Stack direction='row' spacing={4}>
              <Stack sx={{ width: '60%' }}>
                <Box>
                  {buildVideo}
                  <Stack direction='row' justifyContent='space-between' pt={1} pb={2}>
                    {/*  <Button onClick={playVideo}>Play</Button>*/}
                    <Typography>
                      {formatSeconds(currentVideoPosition)} / {formatSeconds(report.videoDuration)}
                    </Typography>
                    <Typography>{formatSeconds(countADSeconds())} AD seconds</Typography>
                  </Stack>
                </Box>

                <Box>
                  <Graph report={report} currentPosition={currentVideoPosition} onSeek={pos => setSeekPosition(pos)} />
                </Box>
              </Stack>
              <Box sx={{ width: '40%' }}>
                <List sx={{ border: '1px solid', borderColor: grey[300], borderRadius: '4px' }}>
                  <Typography color='text.secondary' px={2} pt={2}>
                    SUMMARY
                  </Typography>
                  <ListItem
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                      width: 'auto',
                      p: 2
                    }}
                  >
                    <ListItem sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', paddingLeft: 0 }}>
                      <Typography variant='caption'>Total ad seconds</Typography>
                      <Typography variant='body1'>{formatSeconds(countADSeconds())}</Typography>
                    </ListItem>
                    <ListItem sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', paddingLeft: 0 }}>
                      <Typography variant='caption'>Order cost</Typography>
                      <Typography variant='body1'>{report.totalAdCost} nok</Typography>
                    </ListItem>
                  </ListItem>
                </List>
              </Box>
            </Stack>
          </Box>
        )}
      </Box>
    </Box>
  ) : (
    <>
      <LinearProgress />
    </>
  );
};
