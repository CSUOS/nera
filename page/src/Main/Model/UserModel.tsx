import React, {
	createContext, useContext, Dispatch, useState, useEffect
} from 'react';
import { getUserInfo } from '../../utils';

import { childrenObj, UserObj } from '../Type';

/* user */
const UserState = createContext<UserObj | undefined>(undefined);
const UserDispatch = createContext<Dispatch<UserObj | undefined>>(() => { });

export const UserContextProvider = ({ children }: childrenObj) => {
	const [user, setUser] = useState<UserObj | undefined>(undefined);

	useEffect(() => {
		const u = getUserInfo();
		if (u) { // cookie에 유저 존재
			setUser(u);
		}
	}, []);

	return (
		<UserState.Provider value={user}>
			<UserDispatch.Provider value={setUser}>
				{children}
			</UserDispatch.Provider>
		</UserState.Provider>
	);
}

export function useUserState() {
	const context = useContext(UserState);
	return context;
}

export function useUserDispatch() {
	const context = useContext(UserDispatch);
	return context;
}
