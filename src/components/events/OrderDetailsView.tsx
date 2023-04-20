import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, Breadcrumbs, Button, Card, CardContent, Chip, chipClasses, Grid, LinearProgress, Link, Stack, Typography } from '@mui/material';
import { eventsSelector, fetchEventDetails } from '../../state/eventsSlice';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { fetchOrderDetails, fetchReport, generateReport, ordersSelector } from '../../state/ordersSlice';
import { AssetStatus, EventOrder, OrderStatus } from '../../models/models';
import { blue, grey } from '@mui/material/colors';
import { OrderDetailsHeaderComponent } from './components/OrderDetailsHeaderComponent';
import { AssetDetailsComponent } from '../shared/AssetDetailsComponent';
import { LoadingButton } from '@mui/lab';
import TimelineIcon from '@mui/icons-material/Timeline';
import { GraphComponent } from './components/GraphComponent';
import Tooltip from '@mui/material/Tooltip';
import BrokenImageIcon from '@mui/icons-material/BrokenImage';
import ShareIcon from '@mui/icons-material/Share';
import { Archive, AttachMoney, AvTimer, Download, Tv } from '@mui/icons-material';
import { orderTypesMapping } from '../../services/orderTypesMapping';
import { AppDispatch } from '../../state/store';

// @ts-ignore
import { Image } from 'mui-image';

export const formatSeconds = (seconds: number) => {
  return new Date(seconds * 1000).toISOString().substr(14, 5);
};

export const canGenerateReport = (order: EventOrder) => {
  return (
    order.status === OrderStatus.ReadyForAnalysis &&
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
  const [disabledReport, setDisabledReport] = useState<boolean>(false);

  const back = () => {
    navigate(`/events/${id}`);
  };

  useEffect(() => {
    dispatch(fetchEventDetails(id!!));
    dispatch(fetchOrderDetails(orderId!!));
  }, []);

  const { eventDetails } = useSelector(eventsSelector);
  const { orderDetails, report, isLoading, boxes } = useSelector(ordersSelector);

  useEffect(() => {
    if (orderDetails != null && orderId === orderDetails.id && orderDetails.status === OrderStatus.Delivered) {
      dispatch(fetchReport(orderId!!));
    }
  }, [orderDetails]);

  const handleGenerateReport = () => {
    setDisabledReport(true);
    dispatch(generateReport(orderId!!));
  };

  /*const playVideo = () => {
      video.current?.play();
    };
     */

  const setSeekPosition = (pos: number) => {
    console.log('setSeekPosition ' + pos);
    if (video.current != null) {
      video.current.currentTime = pos;
    }
  };

  const drawBoxes = (time: number) => {
    // if (boxes == null || boxes.length === 0 || time > boxes.length || canvas.current == null) {
    //   return;
    // }
    //
    // //const currentBoxes = boxes[Math.trunc(time)];
    //
    // let currentBoxes = boxes[Math.floor(time)];
    //
    // if (currentBoxes.length === 0) {
    //   currentBoxes = boxes[Math.ceil(time)];
    // }
    //
    // const width = canvas.current?.clientWidth;
    // const height = canvas.current?.clientHeight;
    //
    // const ctx = canvas.current?.getContext('2d')!!;
    // const scale = window.devicePixelRatio;
    // canvas.current.width = Math.floor(width * scale);
    // canvas.current.height = Math.floor(height * scale);
    //
    // ctx.clearRect(0, 0, width!!, height!!);
    //
    // if (currentBoxes && currentBoxes.length === 0) {
    //   return;
    // }
    //
    // ctx.lineWidth = 2;
    // ctx.strokeStyle = '#9CFFDF';
    //
    // const offset = 1.8;
    // for (const box of currentBoxes) {
    //   console.log(box);
    //   ctx.strokeRect(
    //     box.left * width * window.devicePixelRatio - offset,
    //     box.top * height * window.devicePixelRatio - offset,
    //     box.width * width * window.devicePixelRatio + offset,
    //     box.height * height * window.devicePixelRatio - offset
    //   );
    // }
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
    return orderDetails != null && canGenerateReport(orderDetails); //  || orderDetails.status === OrderStatus.in_production
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

        <Box>
          <Button variant='text' onClick={back} sx={{ height: '32px' }}>
            Back to event
          </Button>
          {orderDetails.status === 'Delivered' ? (
            <Button variant='outlined' startIcon={<Archive />} sx={{ marginLeft: '12px' }}>
              Archive
            </Button>
          ) : null}
        </Box>
      </Box>

      <Card
        sx={{
          backgroundColor: '#ffffff',
          p: 3,
          boxShadow: '0px 2px 1px -1px rgb(0 0 0 / 20%)'
        }}
      >
        {isLoading ? (
          <LinearProgress />
        ) : (
          <>
            <Stack direction='row' justifyContent='space-between' alignItems='center'>
              <Typography color='text.secondary'>ORDER DETAILS</Typography>
              <Chip
                label={orderTypesMapping.find(it => it.status === orderDetails.status)!!.label}
                icon={orderTypesMapping.find(it => it.status === orderDetails.status)!!.icon}
                variant='outlined'
                sx={{
                  [`& .${chipClasses.icon}`]: {
                    color: orderTypesMapping.find(it => it.status === orderDetails.status)!!.color
                  },
                  color: orderTypesMapping.find(it => it.status === orderDetails.status)!!.color,
                  borderColor: orderTypesMapping.find(it => it.status === orderDetails.status)!!.color
                }}
              />
            </Stack>

            <OrderDetailsHeaderComponent order={orderDetails} />
          </>
        )}
      </Card>

      <Grid container spacing={3} mt={0}>
        <Grid item md={7} container justifyContent='center' alignItems='stretch'>
          <Card sx={{ background: '#ffffff', width: '100%', p: 3, boxShadow: '0px 2px 1px -1px rgb(0 0 0 / 20%)' }}>
            <Typography color='text.secondary'>ADVERTISER</Typography>
            <Typography variant='h5' fontSize={20} sx={{ borderBottom: '1px solid', borderColor: grey[300], pb: 2, pt: 0.5 }}>
              {orderDetails.client.name}
            </Typography>

            <Typography sx={{ mt: 2, mb: 1.5 }} color='text.secondary'>
              ASSET
            </Typography>
            <AssetDetailsComponent
              asset={orderDetails.asset}
              fontSize={20}
              spacing={4}
              sizeStyles={{ height: '100px', width: 'auto', maxHeight: '100px' }}
              clientName={false}
            />

            <Typography color='text.secondary' sx={{ borderTop: '1px solid', borderColor: grey[300], pb: 1, pt: 2, mt: 2 }}>
              PLACEMENTS
            </Typography>
            <Stack direction='row'>
              {orderDetails?.locationPlacements.map((item: any, index: number) => (
                <Chip key={index} label={item.name} variant='outlined' sx={{ color: blue[500], borderColor: blue[500], mr: 1 }} />
              ))}
            </Stack>
          </Card>
        </Grid>
        <Grid item md={5} container justifyContent='center' alignItems='stretch'>
          <Card sx={{ background: '#ffffff', width: '100%', p: 3, boxShadow: '0px 2px 1px -1px rgb(0 0 0 / 20%)' }}>
            <Typography sx={{ mb: 0.5 }} color='text.secondary'>
              VENUE
            </Typography>
            <Typography variant='h5' fontSize={20}>
              {eventDetails.location.name}
            </Typography>
            <Box sx={{ pt: 2 }}>
              {eventDetails ? (
                <Image fit='contain' src={eventDetails.location.imageUrl} showLoading />
              ) : (
                <BrokenImageIcon sx={{ color: grey[300], fontSize: 100 }} />
              )}
            </Box>
          </Card>
        </Grid>
      </Grid>

      <Box mt={2} mb={2}>
        {report ? null : generateButtonVisible() ? (
          <LoadingButton
            onClick={handleGenerateReport}
            startIcon={<TimelineIcon />}
            loading={orderDetails.status === OrderStatus.Analyzing}
            variant='contained'
            loadingPosition='start'
            disabled={disabledReport}
          >
            Generate Report
          </LoadingButton>
        ) : (
          <Tooltip title='Cannot generate video if... ' placement='top-start'>
            <div>
              <LoadingButton
                onClick={handleGenerateReport}
                startIcon={<TimelineIcon />}
                loading={orderDetails.status === OrderStatus.Analyzing}
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
          <Grid container mt={0} ml={0} width={'100%'} sx={{ backgroundColor: grey[200] }} pr={3} spacing={3} pb={3}>
            <Grid item md={12}>
              <Stack direction='row' justifyContent='space-between'>
                <Typography variant='h6' color={grey[700]}>
                  Report
                </Typography>
                <Stack direction='row' justifyContent='end'>
                  <Button startIcon={<Download />} sx={{ marginRight: '16px' }}>
                    Download summary
                  </Button>
                  <Button variant='contained' startIcon={<ShareIcon />}>
                    Share report
                  </Button>
                </Stack>
              </Stack>
            </Grid>
            <Grid item md={7} container justifyContent='left' alignItems='stretch'>
              <Card sx={{ backgroundColor: '#ffffff', width: '100%', padding: '18px' }}>
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

                <GraphComponent report={report} currentPosition={currentVideoPosition} onSeek={pos => setSeekPosition(pos)} />
              </Card>
            </Grid>
            <Grid item md={5} container justifyContent='left' alignItems='stretch'>
              <Stack direction='column' width={'100%'}>
                <Stack spacing={2}>
                  <Card>
                    <CardContent sx={{ display: 'flex', direction: 'row', alignItems: 'center', padding: '24px' }}>
                      <AvTimer sx={{ color: grey[700], mr: '18px' }} />
                      <Stack>
                        <Typography variant='caption'>Total ad seconds</Typography>
                        <Typography variant='body1'>{formatSeconds(countADSeconds())}</Typography>
                        {/* <Typography variant='body1'>{formatSeconds(countADSeconds())}</Typography>*/}
                      </Stack>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent sx={{ display: 'flex', direction: 'row', alignItems: 'center', padding: '24px' }}>
                      <Tv sx={{ color: grey[700], mr: '18px' }} />
                      <Stack>
                        <Typography variant='caption'>Total screen rating</Typography>
                        <Typography variant='body1'>150 000</Typography>
                      </Stack>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent sx={{ display: 'flex', direction: 'row', alignItems: 'center', padding: '24px' }}>
                      <AttachMoney sx={{ color: grey[700], mr: '18px' }} />
                      <Stack>
                        <Typography variant='caption'>Order cost</Typography>
                        <Typography variant='body1'>NOK {report.totalAdCost.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1 ')}</Typography>
                      </Stack>
                    </CardContent>
                  </Card>
                </Stack>
              </Stack>
            </Grid>
          </Grid>
        )}
      </Box>
    </Box>
  ) : (
    <>
      <LinearProgress />
    </>
  );
};
