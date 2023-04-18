import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Main } from './components/Main';
import { MsalAuthenticationTemplate } from '@azure/msal-react';
import { InteractionType } from '@azure/msal-browser';
import { loginRequest } from './msalConfig';

// export const PrivateRoute = (props: any) => (authService.isAuthenticated() ? props.children : <Navigate to='/login' />);
// export const RootRoute = (props: any) => (authService.isAuthenticated() ? <Navigate to='/app' /> : <Navigate to='/login' />);
// type Props = {
//   children: JSX.Element;
// };
//
const App = () => {
  return (
    <>
      <Router>
        <Routes>
          {/*<Route element={<RootRoute />} path='/' />*/}
          {/*<Route element={<Login />} path='/login' />*/}
          {/*<Route element={<ForgotPassword />} path='/forgot-password' />*/}
          <Route
            path='/*'
            element={
              <MsalAuthenticationTemplate interactionType={InteractionType.Redirect} authenticationRequest={loginRequest}>
                <Main />
              </MsalAuthenticationTemplate>
            }
          />
        </Routes>
      </Router>
    </>
  );
};

export default App;
