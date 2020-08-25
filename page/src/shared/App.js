import React, { Component } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { Login, Main } from '../pages';

class App extends Component {
    render() {
        return (
            <div id="app">
                <Switch>
                    <Route exact path="/" component={Login}/>
                    <Route path="/home" component={Main}/>
                    <Redirect path="*" to="/"/>
                </Switch>
            </div>
        );
    }
}
export default App;