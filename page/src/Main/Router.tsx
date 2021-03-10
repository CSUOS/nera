import React from 'react';
import { LayoutRouter } from '.';
import { Route, Switch, Redirect } from 'react-router-dom';

import { Login, Error, Admin } from '../Pages';
import { useUserState } from './Model/UserModel';

// View Model은 Model의 Context를 구독하고, 갱신하는 역할
const Router = () => {
	const user = useUserState();
	// layout을 써야하는 frame만 모아둠

	return (
		<Switch>
			<Route exact path="/" component={Login} />
			<Route path="/admin" component={Admin} />
			<Route path="/error" component={Error} />
			{user && <Route path="/" component={LayoutRouter} />}
		</Switch>
	);
}
export default Router;
