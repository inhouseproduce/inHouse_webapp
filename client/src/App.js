import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import SiteCreate from "./components/site-create";
import SiteEdit from "./components/site-edit";
import SitesList from "./components/sites-list";
import SitesystemsList from "./components/sitesystems-list";
import SitesystemCreate from "./components/sitesystem-create";
import SitesystemEdit from "./components/sitesystem-edit";
import StackList from "./components/stack-list.component";
import CreateStack from "./components/create-stack.component";
import ModuleList from "./components/module-list.component";
import CreateModule from "./components/create-module.component";
import EditModule from "./components/edit-module.component";
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
          component={StackList}
        />
        <Route
          path="/:siteid/sitesystems/:sitesystemid/stacks/create"
          exact
          component={CreateStack}
        />
        <Route
          path="/:siteid/sitesystems/:sitesystemid/stacks/:stackid/modules"
          exact
          component={ModuleList}
        />
        <Route
          path="/:siteid/sitesystems/:sitesystemid/stacks/:stackid/modules/create"
          exact
          component={CreateModule}
        />
        <Route
          path="/:siteid/sitesystems/:sitesystemid/stacks/:stackid/modules/edit/:id"
          component={EditModule}
        />
      </div>
    </Router>
  );
}

export default App;
