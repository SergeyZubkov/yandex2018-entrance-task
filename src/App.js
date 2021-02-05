import './App.css'
import Header from './header/Header'
import Scedule from './scedule/Scedule'
import FormEvent from './form-event/FormEvent'

import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";

function App() {
  return (
    <Router>
      <div className="app">
        <Header />

        {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
        <Switch>
          <Route path="/" exact>
            <Scedule />
          </Route>
          <Route path="/formEvent">
            <FormEvent />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
