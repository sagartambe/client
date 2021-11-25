import * as React from "react";
import { BrowserRouter, Switch, Route, useHistory } from "react-router-dom";
import { SecureRoute, Security, LoginCallback } from '@okta/okta-react';
import { OktaAuth, toRelativeUrl } from '@okta/okta-auth-js';
import Auth from "./pages/auth";
import Private from "./pages/private";
import { OKTA_CONFIG } from './constants';
import 'semantic-ui-css/semantic.min.css';

// const oktaAuth = new OktaAuth({
//   issuer: `https://${OKTA_CONFIG.DOMAIN}.com/oauth2/default`,
//   clientId: OKTA_CONFIG.CLIENT_ID,
//   redirectUri: window.location.origin + '/login/callback'
// });

function App() {
  const history = useHistory();
  const restoreOriginalUri = async (_oktaAuth, originalUri) => {
    history.replace(toRelativeUrl(originalUri || '/', window.location.origin));
  };

  return (
    <BrowserRouter>
      {/* <Security oktaAuth={oktaAuth} restoreOriginalUri={restoreOriginalUri}> */}
        <Switch>
          <Route exact path="/" component={Auth} />
          <Route path="/app/*" component={Private} />
          {/* enable SecureRoute while enabling okta  */}
          {/* <SecureRoute path="/app/*" component={Private} />  */}
          <Route path='/login/callback' component={LoginCallback} />
        </Switch>
      {/* </Security> */}
    </BrowserRouter>
  );
}

export default App;
