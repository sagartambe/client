import { Dimmer, Loader } from 'semantic-ui-react';
import { useLocation } from "react-router-dom";
import { useHistory } from "react-router-dom";
import queryString from 'query-string';
import { getItem, setItem, removeItem } from "../../utils/localStorage";

const Auth = () => {
  const location = useLocation();
  const queries = queryString.parse(location.hash)
  const history = useHistory();

  if (!queries.access_token && !getItem('access_token')) {
    window.location.assign('https://myoauthpune.auth.us-east-1.amazoncognito.com/login?client_id=5f8htobi0sf0aaggpf54223i0i&response_type=token&scope=aws.cognito.signin.user.admin+email+openid+phone+profile&redirect_uri=http://localhost:3001/auth');
  }
  else if (getItem('access_token')){
    history.push('/app/organizations');
  }
  else {
    setItem('access_token', queries.access_token);
    history.push('/app/organizations');
  }

  return (
    <Dimmer active>
      <Loader>Authenticating...</Loader>
    </Dimmer>
  );
}

const Logout = () => {
  const history = useHistory();
  removeItem('access_token');
  history.push('/auth');

  return (
    <Dimmer active>
      <Loader>Logging out...</Loader>
    </Dimmer>
  );
}

export { Auth, Logout };
