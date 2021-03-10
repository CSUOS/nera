import React from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';
import { Main, Assignment, Setting, SetAssign, SetAssignment, SetMember, ProfAssignment } from '../Pages';
import { useUserState } from './Model/UserModel';
import { Layout } from '../Components';


const LayoutRouter: React.FC = () => {
	const user = useUserState();
	// layout을 써야하는 frame만 모아둠

	return (
		<Layout>
			<Switch>
				<Route path="/main" component={Main} />
				{<Route path="/as/:asId" component={user && (user.type === 'professor' ? ProfAssignment : Assignment)} />}
				<Route exact path="/setting" component={Setting} />
				<Route path="/setting/:asId" component={SetAssign} />
				<Route path="/member" component={SetMember} />
				<Redirect path="*" to="/error"/>
			</Switch>
		</Layout>
	)
}

export default LayoutRouter;