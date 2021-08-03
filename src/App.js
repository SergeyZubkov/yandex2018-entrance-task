import "./App.css";
import Header from "./header/Header";
import Scedule from "./scedule/Scedule";
import { FormEvent } from "./form-event";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <div className="app scroll-listen-aside">
        <Header />
        <Switch>
          <Route path="/" exact>
            <Scedule />
          </Route>
          <Route path="/event/add">
            <FormEvent />
          </Route>
          <Route path="/event/edit/:id">
            <FormEvent />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
