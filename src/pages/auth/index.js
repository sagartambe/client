import { Dimmer, Loader } from 'semantic-ui-react';

function Auth() {
  return (
    <Dimmer active>
      <Loader>Authenticating...</Loader>
    </Dimmer>
  );
}

export default Auth;
