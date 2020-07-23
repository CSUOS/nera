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
                <Route exact path="/assignment/:as_id" component={Main}/>
                <Route exact path="/assignment/:as_id/:pt_id" component={Main}/>
              </Switch>
              <Switch>
                <Route exact path="/admin/assignment/:as_id" component={Main}/>
                <Route exact path="/admin/assignment/:as_id/:pt_id" component={Main}/>
                <Route exact path="/admin/result/:as_id/:pt_id" component={Main}/>
              </Switch>
            </div>
        );
    }
}
export default App;