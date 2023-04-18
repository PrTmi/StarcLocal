const configTemplate = {
  auth: {
    clientId: 'aa7ebc40-9027-4918-9e77-95ea7007ce4b',
    authority: 'https://starclogin.b2clogin.com/starclogin.onmicrosoft.com/B2C_1_starcweb_signin2/',
    redirectUri: 'http://localhost:3000',
    knownAuthorities: ['https://starclogin.b2clogin.com/starclogin.onmicrosoft.com/']
  },
  cache: {
    cacheLocation: 'sessionStorage',
    storeAuthStateInCookie: false
  }
};
const redirectsMap = {
  'localhost:3000': 'http://localhost:3000',
  'starc-frontend.azurewebsites.net': 'https://starc-frontend.azurewebsites.net'
} as any;

export const loginRequest = {
  scopes: ['https://starclogin.onmicrosoft.com/starcapi2/read', 'https://starclogin.onmicrosoft.com/starcapi2/write', 'offline_access', 'profile', 'openid']
};

export const msalConfig = () => {
  const host: string = window.location.host.toLowerCase();
  let baseUrl = redirectsMap[host];

  if (baseUrl == null) {
    console.log('Cannot determine backend url, falling back to localhost...');
    baseUrl = redirectsMap['localhost:3000'];
  }

  configTemplate.auth.redirectUri = baseUrl;
  return configTemplate;
};
