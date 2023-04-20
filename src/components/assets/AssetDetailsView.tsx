import * as React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { AppDispatch } from '../../state/store';
import {
  Alert,
  Box,
  Button,
  Container,
  FormControl,
  FormHelperText,
  InputLabel,
  LinearProgress,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField
} from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { grey } from '@mui/material/colors';
import { useDropzone } from 'react-dropzone';
import { useDispatch, useSelector } from 'react-redux';
import { assetsSelector, fetchAssetDetails, saveAsset } from '../../state/assetsSlice';
import { LoadingButton } from '@mui/lab';
import { clientsSelector } from '../../state/clientsSlice';
import { Client } from '../../models/models';
// @ts-ignore
import { Image } from 'mui-image';

type AssetDetailsProps = {
  onClose: (refresh: boolean) => void;
  assetId: string;
  clientId: string;
};

export const AssetDetailsView = ({ onClose, assetId, clientId }: AssetDetailsProps): JSX.Element => {
  const dispatch = useDispatch<AppDispatch>();
  const { clients } = useSelector(clientsSelector);
  const [client, setClient] = React.useState(clientId);

  const handleChange = (event: SelectChangeEvent) => {
    setClient(event.target.value as string);
  };

  const [selectedFileName, setSelectedFileName] = useState<String>('');
  const [image, setImage] = useState<File | null>(null);
  const { assetDetails, savingAsset, savingAssetDone, isLoading } = useSelector(assetsSelector);
  const [expandedPanel, setExpandedPanel] = useState<boolean | string>('client' ? assetId === 'new' : '');
  const [assetName, setAssetName] = useState<string>('');
  const [assetNameTouched, setAssetNameTouched] = useState<boolean>(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [changed, setChanged] = useState<boolean>(false);

  useEffect(() => {
    setPreview(null);
    dispatch(fetchAssetDetails({ assetId, clientId }));
  }, [assetId]);

  useEffect(() => {
    if (savingAssetDone) {
      onClose(true);
    }
  }, [savingAssetDone]);

  useEffect(() => {
    setPreview(null);
    if (assetDetails) {
      setClient(assetDetails.clientId);
      setAssetName(assetDetails.name);
      setSelectedFileName(assetDetails.fileFullName);

      if (assetDetails!.imageUrl) {
        loadPreview(assetDetails!.imageUrl!!);
      }
    }
  }, [assetDetails]);

  const loadPreview = (image: File | string) => {
    if (image === undefined) return;

    if (typeof image === 'string') {
      setPreview(image as string);
    } else {
      const reader = new FileReader();
      reader.onload = evt => {
        setPreview(evt.target?.result as string);
      };
      reader.readAsDataURL(image as Blob);
    }
  };

  const onDrop = useCallback(acceptedFiles => {
    console.log('file dropped: ' + acceptedFiles[0].name);
    setChanged(true);
    setSelectedFileName(acceptedFiles[0].name);
    setImage(acceptedFiles[0]);
    loadPreview(acceptedFiles[0]);
  }, []);

  const { getRootProps, getInputProps, open } = useDropzone({
    onDrop,
    accept: 'image/png',
    noClick: true,
    noKeyboard: true
  });

  const handleSave = async () => {
    await dispatch(saveAsset({ id: assetDetails.id, name: assetName, image: image, clientId: client }));
    //closeDialog();
  };
  const handlePanelChange = (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
    setExpandedPanel(newExpanded ? panel : false);
  };

  const selectedClientName = () => {
    return clients.find((it: Client) => {
      return it.id === client;
    }).name;
  };

  const closeDialog = () => {
    setPreview(null);
    setChanged(false);
    onClose(false);
  };

  return (
    <Container component='main' maxWidth='md' sx={{ pt: 12 }}>
      {!isLoading ? (
        <>
          <Accordion
            sx={{ pt: 2, pb: 2 }}
            expanded={expandedPanel === 'client' || expandedPanel === true}
            onChange={handlePanelChange('client')}
            disabled={!!client && !!assetDetails?.name}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls='clients-content' id='clients-header'>
              <Typography sx={{ width: '33%', flexShrink: 0 }}>Advertiser</Typography>
              <Typography sx={{ color: 'text.secondary' }}>
                {client && clients != null && (!expandedPanel || expandedPanel === 'assetName' || expandedPanel === 'image')
                  ? selectedClientName()
                  : 'Select the advertiser that has ownership of this asset'}
              </Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <FormControl sx={{ width: 300 }}>
                <InputLabel id='demo-simple-select-label'>Advertiser</InputLabel>

                <Select value={client} onChange={handleChange} label='Advertiser'>
                  {clients &&
                    clients.map((c: Client) => (
                      <MenuItem key={c.id!!} value={c.id!!}>
                        {c.name}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </AccordionDetails>
          </Accordion>

          <Accordion sx={{ pt: 2, pb: 2 }} expanded={expandedPanel === 'assetName'} onChange={handlePanelChange('assetName')}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls='name-content' id='name-header'>
              <Typography sx={{ width: '33%', flexShrink: 0 }}>Asset name</Typography>

              <Typography sx={{ color: 'text.secondary' }}>
                {(expandedPanel && expandedPanel !== 'client' && expandedPanel !== 'image') || assetName.length === 0
                  ? 'Add a descriptive name for the asset'
                  : assetName}
              </Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <FormControl sx={{ width: 300 }}>
                <TextField
                  autoFocus
                  variant='standard'
                  required
                  id='assetName'
                  label='Asset name'
                  name='assetName'
                  value={assetName}
                  onBlur={() => setAssetNameTouched(true)}
                  error={assetNameTouched && !assetName}
                  onChange={e => {
                    setAssetName(e.target.value);
                    setChanged(true);
                  }}
                  disabled={assetDetails?.status === 'augment_started'}
                  inputProps={{
                    maxLength: 32
                  }}
                />
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <FormHelperText sx={{ justifyContent: 'left', marginLeft: 0 }} id='assetNameLength'>
                    Max characters: 32
                  </FormHelperText>
                  <FormHelperText sx={{ justifyContent: 'left', marginRight: 0 }} id='assetName'>
                    {assetName ? assetName.length + '' : 0}/32
                  </FormHelperText>
                </Box>
                {assetNameTouched && !assetName ? (
                  <Typography sx={{ color: 'error.main' }} align='left' gutterBottom>
                    Please enter a asset name
                  </Typography>
                ) : (
                  <div style={{ minHeight: 32 }}>&nbsp;</div>
                )}
              </FormControl>
            </AccordionDetails>
          </Accordion>

          <Accordion
            sx={{ pt: 2, pb: 2 }}
            expanded={expandedPanel === 'image'}
            onChange={handlePanelChange('image')}
            disabled={assetDetails?.status !== 'ready_for_augmentation'}
          >
            {/*            expanded={assetDetails?.status !== 'ready_for_augmentation' ? imageExpanded : !imageExpanded}
             */}
            <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls='image-content' id='image-header'>
              <Typography sx={{ width: '33%', flexShrink: 0 }}>Asset file</Typography>

              <Typography sx={{ color: 'text.secondary' }}>
                {(expandedPanel && expandedPanel !== 'client' && expandedPanel !== 'assetName') || !selectedFileName
                  ? 'Upload a supported asset file (.png)'
                  : selectedFileName}
              </Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ display: 'flex', justifyContent: 'center', pb: 4, flexDirection: 'column' }}>
              <Alert severity='info'>Supported files include 32-bit .png</Alert>
              <Box
                sx={{
                  display: 'flex',
                  backgroundColor: grey[100],
                  flexDirection: 'column',
                  border: '1px dashed',
                  borderColor: grey[300],
                  padding: 4,
                  mt: 2,
                  textAlign: 'center'
                }}
              >
                <div {...getRootProps()}>
                  <input {...getInputProps()} />

                  <Typography variant='body2' mb={2} color={grey[700]}>
                    {selectedFileName ? 'Selected image' : 'Drag and drop a file here'}
                  </Typography>

                  {preview ? (
                    <div style={{ height: '100px', width: 'auto' }}>
                      <Image fit='contain' src={preview} showLoading />
                    </div>
                  ) : null}

                  <Typography variant='h6' mb={2}>
                    {selectedFileName}
                  </Typography>

                  <Button variant='contained' onClick={open}>
                    Select file
                  </Button>
                </div>
              </Box>
            </AccordionDetails>
          </Accordion>
          <LoadingButton onClick={handleSave} loading={savingAsset} variant='contained' disabled={!selectedFileName || !assetName || !changed}>
            Save asset
          </LoadingButton>
          <Button variant='text' sx={{ mt: 3, mb: 2, ml: 3 }} onClick={closeDialog}>
            Cancel
          </Button>
        </>
      ) : (
        <LinearProgress />
      )}
    </Container>
  );
};
