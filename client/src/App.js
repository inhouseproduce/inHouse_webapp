import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import SiteCreate from "./components/site-create";
import SiteEdit from "./components/site-edit";
import SitesList from "./components/sites-list";
import SitesystemsList from "./components/sitesystems-list";
import SitesystemCreate from "./components/sitesystem-create";
import SitesystemEdit from "./components/sitesystem-edit";
import StacksList from "./components/stacks-list";
import ModulesList from "./components/modules-list";
import ModuleCreate from "./components/module-create";
import ModuleEdit from "./components/module-edit";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  return (
    <Router>
      <div className="container">
        <Route path="/" exact component={SitesList} />
        <Route path="/edit/:id" exact component={SiteEdit} />
        <Route path="/create" component={SiteCreate} />
        <Route path="/:siteid/sitesystems" exact component={SitesystemsList} />
        <Route
          path="/:siteid/sitesystems/create"
          exact
          component={SitesystemCreate}
        />
        <Route
          path="/:siteid/sitesystems/edit/:id"
          component={SitesystemEdit}
        />
        <Route
          path="/:siteid/sitesystems/:sitesystemid/stacks"
          exact
          component={StacksList}
        />
        <Route
          path="/:siteid/sitesystems/:sitesystemid/stacks/:stackid/modules"
          exact
          component={ModulesList}
        />
        <Route
          path="/:siteid/sitesystems/:sitesystemid/stacks/:stackid/modules/create"
          exact
          component={ModuleCreate}
        />
        <Route
          path="/:siteid/sitesystems/:sitesystemid/stacks/:stackid/modules/edit/:id"
          component={ModuleEdit}
        />
      </div>
    </Router>
  );
}

export default App;
