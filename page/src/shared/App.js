import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import { Login, Main } from '../pages';

class App extends Component {
    
    render() {
        return (
            <div id="app">
              <Route exact path="/" component={Login}/>
              <Route exact path="/home" component={Main}/>
              <Route exact path="/home/:component" component={Main}/>
              <Route exact path="/home/:component/:sub" component={Main}/>
              <Route exact path="/home/:component/:sub/:last" component={Main}/>
            </div>
        );
    }
}
export default App;