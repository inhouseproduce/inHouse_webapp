import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import CreateTodo from "./components/create-todo.component";
import EditTodo from "./components/edit-todo.component";
import TodosList from "./components/todos-list.component";
import SitesystemList from "./components/sitesystem-list.component";
import CreateSitesystem from "./components/create-sitesystem.component";
import EditSitesystem from "./components/edit-sitesystem.component";
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
        <Route path="/" exact component={TodosList} />
        <Route path="/edit/:id" exact component={EditTodo} />
        <Route path="/create" component={CreateTodo} />
        <Route path="/:siteid/sitesystems" exact component={SitesystemList} />
        <Route
          path="/:siteid/sitesystems/create"
          exact
          component={CreateSitesystem}
        />
        <Route
          path="/:siteid/sitesystems/edit/:id"
          component={EditSitesystem}
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
