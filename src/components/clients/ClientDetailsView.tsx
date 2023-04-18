import * as React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Box, Button, Container, FormControl, FormHelperText, LinearProgress, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clientsSelector, fetchClientDetails, saveClient } from '../../state/clientsSlice';
import { LoadingButton } from '@mui/lab';
import { ChangeEvent } from 'react';

type ClientDetailsProps = {
  onClose: () => void;
  clientId: string;
};

export const ClientDetailsView = ({ onClose, clientId }: ClientDetailsProps): JSX.Element => {
  const dispatch = useDispatch();
  const { clientDetails, savingClient, savingClientDone, isLoading } = useSelector(clientsSelector);
  const [nameExpanded, setNameExpanded] = useState<boolean>(true);
  const [emailExpanded, setEmailExpanded] = useState<boolean>(true);

  const [clientName, setClientName] = useState<string>('');
  const [clientNameTouched, setClientNameTouched] = useState<boolean>(false);
  const [clientEmail, setClientEmail] = useState<string>('');
  const [clientEmailTouched, setClientEmailTouched] = useState<boolean>(false);
  const [changed, setChanged] = useState<boolean>(false);

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchClientDetails(clientId));
  }, [clientId]);

  useEffect(() => {
    if (clientDetails) {
      setClientName(clientDetails.name);
      setClientEmail(clientDetails.contactEmail);
    }
  }, [clientDetails]);

  useEffect(() => {
    if (savingClientDone) {
      onClose();
    }
  }, [savingClientDone]);

  function isValidEmail(email: string) {
    return /\S+@\S+\.\S+/.test(email);
  }
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (!isValidEmail(event.target.value)) {
      setError('Email is invalid');
    } else {
      setError(null);
      setChanged(true);
    }
    setClientEmail(event.target.value);
  };

  const handleSave = async () => {
    await dispatch(saveClient({ id: clientDetails.id, name: clientName, contactEmail: clientEmail }));
    onClose();
  };

  const toggleName = () => {
    setNameExpanded(!nameExpanded);
  };

  const toggleImage = () => {
    setEmailExpanded(!emailExpanded);
  };

  const closeDialog = () => {
    //setPreview(null);
    setChanged(false);
    onClose();
  };

  return (
    <Container component='main' maxWidth='md' sx={{ pt: 12 }}>
      {!isLoading ? (
        <>
          <Accordion sx={{ pt: 2, pb: 2 }} expanded={nameExpanded} onChange={() => toggleName()}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls='name-content' id='name-header'>
              <Typography sx={{ width: '33%', flexShrink: 0 }}>Client name</Typography>
              <Typography sx={{ color: 'text.secondary' }}>Add a descriptive name for your client</Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <FormControl sx={{ width: 300 }}>
                <TextField
                  focused
                  autoFocus
                  variant='standard'
                  required
                  id='clientName'
                  label='Client name'
                  name='clientName'
                  value={clientName}
                  onBlur={() => setClientNameTouched(true)}
                  error={clientNameTouched && !clientName}
                  onChange={e => {
                    setClientName(e.target.value);
                    setChanged(true);
                  }}
                  inputProps={{
                    maxLength: 32
                  }}
                />
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <FormHelperText sx={{ justifyContent: 'left', marginLeft: 0 }} id='clientNameLength'>
                    Max characters: 32
                  </FormHelperText>
                  <FormHelperText sx={{ justifyContent: 'left', marginRight: 0 }} id='clientName'>
                    {clientName ? clientName.length + '' : 0}/32
                  </FormHelperText>
                </Box>
                {clientNameTouched && !clientName ? (
                  <Typography sx={{ color: 'error.main' }} align='left' gutterBottom>
                    Please enter a client name
                  </Typography>
                ) : (
                  <div style={{ minHeight: 32 }}>&nbsp;</div>
                )}
              </FormControl>
            </AccordionDetails>
          </Accordion>
          <Accordion sx={{ pt: 2, pb: 2 }} expanded={emailExpanded} onChange={() => toggleImage()}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls='image-content' id='image-header'>
              <Typography sx={{ width: '33%', flexShrink: 0 }}>Client email</Typography>
              <Typography sx={{ color: 'text.secondary' }}>Add an email address for this client</Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <FormControl sx={{ width: 300 }}>
                <TextField
                  variant='standard'
                  required
                  id='clientEmail'
                  label='Client email address'
                  name='clientEmail'
                  value={clientEmail}
                  onBlur={() => setClientEmailTouched(true)}
                  error={clientEmailTouched && !clientEmail}
                  onChange={handleChange}
                />

                {(clientEmailTouched && !clientEmail) || error ? (
                  <Typography sx={{ color: 'error.main' }} align='left' pt={1} gutterBottom>
                    Please enter a valid email address
                  </Typography>
                ) : (
                  <div style={{ minHeight: 32 }}>&nbsp;</div>
                )}
              </FormControl>
            </AccordionDetails>
          </Accordion>
          <LoadingButton
            onClick={handleSave}
            loading={savingClient}
            variant='contained'
            disabled={!clientName || !clientEmail || error === 'Email is invalid' || !changed}
          >
            Save client
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
