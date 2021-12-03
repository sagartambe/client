import * as React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { Auth } from "./pages/auth";
import Private from "./pages/private";
import 'semantic-ui-css/semantic.min.css';

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/auth" component={Auth} />
        <Route path="/app/*" component={Private} />
        <Route path="/" component={Auth} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
