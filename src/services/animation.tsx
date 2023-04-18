import * as React from 'react';

import Slide from '@material-ui/core/Slide';
import { SlideProps } from '@material-ui/core/Slide/Slide';

export const Transition = React.forwardRef(function Transition(props: SlideProps, ref) {
  return <Slide direction='up' ref={ref} {...props} />;
});
