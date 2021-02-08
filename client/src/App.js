import React from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';

import { Canvas, Toolbar, SettingsBar } from './components/'

import './styles/app.scss'

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Switch>
          <Route path="/:id">
            <Toolbar />
            <SettingsBar />
            <Canvas />
          </Route>
          <Redirect to={`f${(+ new Date).toString(16)}`} />
        </Switch>
      </div>
    </BrowserRouter>
  );
}

export default App;
