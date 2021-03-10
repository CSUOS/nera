import React from 'react';
import { AssignmentContextProvider } from './Model/AssignmentModel';
import { UserContextProvider } from './Model/UserModel';
import { AnswerContextProvider } from './Model/AnswerModel';
import { GroupContextProvider } from './Model/GroupModel';
import { MessageContextProvider } from './Model/MessageModel';
import Router from './Router';

// Model과 View Model을 이어주는 역할
const Provider = () => (
	<MessageContextProvider>
		<UserContextProvider>
			<AssignmentContextProvider>
				<GroupContextProvider>
					<AnswerContextProvider>
						<Router />
					</AnswerContextProvider>
				</GroupContextProvider>
			</AssignmentContextProvider>
		</UserContextProvider>
	</MessageContextProvider>
);

export default Provider;
