import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import { Login, Main } from '../pages';

class App extends Component {

    render() {
        return (
            <div id="app">
              <Route exact path="/" component={Login}/>
              <Route exact path="/home/" component={Main}/>
              <Switch>
                <Route exact path="/lecture/:id" component={Main}/>
                <Route exact path="/lecture/:id/problem" component={Main}/>
                <Route exact path="/lecture/:id/problem/:pb_id" component={Main}/>
              </Switch>
            </div>
        );
    }
}
export default App;