import * as React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
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
// @ts-ignore
import { Image } from 'mui-image';
import { clientsSelector } from '../../state/clientsSlice';
import { Client } from '../../models/models';
import { AppDispatch } from '../../state/store';

type AssetDetailsProps = {
  onClose: () => void;
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

  const [clientsExpanded, setClientsExpanded] = React.useState<boolean>(true);
  const [nameExpanded, setNameExpanded] = React.useState<boolean>(true);
  const [imageExpanded, setImageExpanded] = React.useState<boolean>(false);

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
      onClose();
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

  const { getRootProps, getInputProps, open } = useDropzone({ onDrop, accept: 'image/png' });

  const handleSave = async () => {
    await dispatch(saveAsset({ id: assetDetails.id, name: assetName, image: image, clientId: client }));
    // closeDialog();
  };

  const toggleClients = () => {
    setClientsExpanded(!clientsExpanded);
  };

  const toggleName = () => {
    setNameExpanded(!nameExpanded);
  };

  const toggleImage = () => {
    setImageExpanded(!imageExpanded);
  };

  const closeDialog = () => {
    setPreview(null);
    setChanged(false);
    onClose();
  };

  return (
    <Container component='main' maxWidth='md' sx={{ pt: 12 }}>
      {!isLoading ? (
        <>
          <Accordion sx={{ pt: 2, pb: 2 }} expanded={clientsExpanded} onChange={() => toggleClients()}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls='clients-content' id='clients-header'>
              <Typography sx={{ width: '33%', flexShrink: 0 }}>Client</Typography>
              <Typography sx={{ color: 'text.secondary' }}>Select the client that has ownership of this asset</Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <FormControl sx={{ width: 300 }}>
                <InputLabel id='demo-simple-select-label'>Client</InputLabel>

                <Select value={client} onChange={handleChange} label='Client'>
                  {clients.map((c: Client) => (
                    <MenuItem key={c.id!!} value={c.id!!}>
                      {c.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </AccordionDetails>
          </Accordion>

          <Accordion sx={{ pt: 2, pb: 2 }} expanded={nameExpanded} onChange={() => toggleName()}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls='name-content' id='name-header'>
              <Typography sx={{ width: '33%', flexShrink: 0 }}>Asset name</Typography>
              <Typography sx={{ color: 'text.secondary' }}>Descriptive name for your asset</Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <FormControl sx={{ width: 300 }}>
                <TextField
                  focused
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
            expanded={assetDetails?.status !== 'ready_for_augmentation' ? imageExpanded : !imageExpanded}
            onChange={() => toggleImage()}
            disabled={assetDetails?.status !== 'ready_for_augmentation'}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls='image-content' id='image-header'>
              <Typography sx={{ width: '33%', flexShrink: 0 }}>Asset file</Typography>
              <Typography sx={{ color: 'text.secondary' }}>
                {assetDetails?.status !== 'ready_for_augmentation' ? selectedFileName : 'Upload a supported asset file (.png)'}
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
