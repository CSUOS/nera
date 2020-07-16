import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import { Login, Main, Problem, Lecture } from '../pages';
import "./App.css";

class App extends Component {

    render() {
        return (
            <div id="app">
              <Route exact path="/" component={Login}/>
              <Switch>
                <Route exact path="/main" component={Main}/>
                <Route exact path="/main/:admin" component={Main}/>
              </Switch>
              <Route path="/problem/:index" component={Problem}/>
              <Route path="/lecture/:id" component={Lecture}/>
            </div>
        );
    }
}
export default App;