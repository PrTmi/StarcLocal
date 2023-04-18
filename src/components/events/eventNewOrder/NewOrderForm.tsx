import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import { ListOfAssets } from './ListOfAssets';
import { SelectPlacement } from './SelectPlacement';
import { ConfirmOrder } from './ConfirmOrder';
import { Event } from '../../../models/models';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { ordersSelector } from '../../../state/ordersSlice';
import { Fade } from '@mui/material';

type NewOrderProps = {
  onClose: () => void;
  onVisibilityChange: (visible: boolean) => void;
  event: Event;
};

const steps = ['Select asset', 'Select placement', 'Confirm order'];

export const NewOrderForm = ({ onClose, event, onVisibilityChange }: NewOrderProps): JSX.Element => {
  const [activeStep, setActiveStep] = useState(0);
  const { selectedAsset } = useSelector(ordersSelector);
  const { selectedPlacement } = useSelector(ordersSelector);
  const [stepperHidden, setStepperHidden] = useState(false);

  const handleNext = () => {
    setActiveStep(prevActiveStep => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1);
  };

  useEffect(() => {
    onVisibilityChange(activeStep < 2);
  }, [activeStep]);

  const closeDialog = () => {
    onClose();
  };
  const { savingOrder } = useSelector(ordersSelector);

  useEffect(() => {
    if (savingOrder) {
      setStepperHidden(true);
    }
  }, [savingOrder]);

  return (
    <Box sx={{ flex: '1' }}>
      <Fade timeout={1300} in={!stepperHidden}>
        <Stepper activeStep={activeStep}>
          {steps.map((label, index) => {
            const stepProps = {};
            const labelProps = {};

            return (
              <Step key={label} {...stepProps}>
                <StepLabel {...labelProps}>{label}</StepLabel>
              </Step>
            );
          })}
        </Stepper>
      </Fade>
      <Box sx={{ flex: 1 }}>
        <Box>
          {activeStep === 0 && <ListOfAssets />}
          {activeStep === 1 && <SelectPlacement />}
          {activeStep === 2 && <ConfirmOrder event={event} goBack={handleBack} onClose={closeDialog} />}
          {activeStep < 2 ? (
            <Box sx={{ display: 'flex', pt: 2 }}>
              <Button onClick={closeDialog} sx={{ mr: 1 }}>
                Cancel
              </Button>
              <Box sx={{ flex: '1 1 auto' }} />
              <Button disabled={activeStep === 0} onClick={handleBack} sx={{ mr: 1 }} style={activeStep === 0 ? { display: 'none' } : {}}>
                Back
              </Button>
              <Button
                variant='contained'
                onClick={handleNext}
                disabled={(!selectedAsset && activeStep === 0) || (!selectedPlacement && !selectedPlacement && activeStep === 1)}
              >
                {activeStep === steps.length - 1 ? 'Complete order' : 'Continue'}
              </Button>
            </Box>
          ) : null}
        </Box>
      </Box>
    </Box>
  );
};
