import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import { Login, Main, Problem } from '../pages';

class App extends Component {

    render() {
        return (
            <div>
              <Route exact path="/" component={Login}/>
              <Route exact path="/main/:admin" component={Main}/>
              <Route path="/problem/:index" component={Problem}/>
            </div>
        );
    }
}
export default App;