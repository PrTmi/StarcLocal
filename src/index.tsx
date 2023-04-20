import React from 'react';
//import ReactDOM from 'react-dom/client';
import ReactDOM from 'react-dom';

import './index.css';
import App from './App';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { Provider } from 'react-redux';
import { store } from './state/store';
import { createTheme } from '@mui/material';
import { MsalProvider } from '@azure/msal-react';
import { PublicClientApplication } from '@azure/msal-browser';
import { msalConfig } from './msalConfig';

const theme = createTheme();
const msalInstance = new PublicClientApplication(msalConfig());

//const root = ReactDOM.createRoot(document.getElementById('root')!);

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <MsalProvider instance={msalInstance}>
        <CssBaseline />
        <ThemeProvider theme={theme}>
          <App />
        </ThemeProvider>
      </MsalProvider>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);
/*root.render(
  <React.StrictMode>
    <Provider store={store}>
      <MsalProvider instance={msalInstance}>
        <CssBaseline />
        <ThemeProvider theme={theme}>
          <App />
        </ThemeProvider>
      </MsalProvider>
    </Provider>
  </React.StrictMode>
);*/
