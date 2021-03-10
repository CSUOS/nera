import React, {
	createContext, useContext, useState, Dispatch, useEffect
} from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

import { childrenObj, GroupObj, RequestGroupObj } from '../Type';
import { useUserState } from './UserModel';

/* group */

const GroupState = createContext<Array<GroupObj>>([]);
const GroupDispatch = createContext<Dispatch<Array<GroupObj>>>(() => { });
const FetchGroup = createContext<() => void>(()=>{});
const SaveGroup = createContext<(group : RequestGroupObj) => void>(()=>{});
const DeleteGroup = createContext<(groupId : number) => void>(()=>{});


export const GroupContextProvider = ({ children }: childrenObj) => {
	const [group, setGroup] = useState<Array<GroupObj>>([]);
	const user = useUserState();
	const history = useHistory();

	useEffect(()=>{
		// professor만 group setting
		if(user && user.type === 'professor')
			fetchGroup();
		else
			setGroup([]);
	}, [user]);

	const fetchGroup = () => {
		axios.get('/v1/student', { withCredentials: true })
			.then(res => {
				setGroup(res.data);
			})
			.catch(err => {
				const status = err?.response?.status;
				if (status === undefined) {
					alert("그룹 정보를 얻는 중 예기치 못한 오류가 발생하였습니다." );
				}
				else if (status === 400) {
					alert(`그룹 정보를 얻는데 실패하였습니다. 잘못된 요청입니다. (${status})`);
				}
				else if (status === 401) {
					alert(`토큰이 유효하지 않습니다. (${status})`);
					document.cookie="";
					history.push("/");
				}
				else if (status === 404) {
					alert("그룹을 찾을 수 없습니다.");
				}
				else if (status === 500) {
					alert("내부 서버 오류입니다. 잠시 후에 다시 시도해주세요...");
				}
				setGroup([]);
			});
	}

	const saveGroup = (group : RequestGroupObj) => {
		axios.post('/v1/student', {
			...group
		}, { withCredentials: true })
			.then(res => {
				fetchGroup();
			})
			.catch(err => {
				const status = err?.response?.status;
				if (status === undefined) {
					alert("그룹 정보를 저장하던 중 예기치 못한 오류가 발생하였습니다." );
				}
				else if (status === 400) {
					alert(`그룹 정보를 저장하는데에 실패하였습니다. 잘못된 요청입니다. (${status})`);
				}
				else if (status === 401) {
					alert(`토큰이 유효하지 않습니다. (${status})`);
					document.cookie="";
					history.push("/");
				}
				else if (status === 404) {
					alert("그룹을 저장할 수 없습니다.");
				}
				else if (status === 500) {
					alert("내부 서버 오류입니다. 잠시 후에 다시 시도해주세요...");
				}
			});
	}

	const deleteGroup = (groupId : number) => {
		axios.delete(`/v1/student/${groupId}`, { withCredentials: true })
			.then(() => {
				fetchGroup();
			})
			.catch(err => {
				const status = err?.response?.status;
				if (status === undefined) {
					alert("그룹 정보를 삭제하던 중 예기치 못한 오류가 발생하였습니다." );
				}
				else if (status === 400) {
					alert(`그룹 정보를 삭제하는 데에 실패하였습니다. 잘못된 요청입니다. (${status})`);
				}
				else if (status === 401) {
					alert(`토큰이 유효하지 않습니다. (${status})`);
					document.cookie="";
					history.push("/");
				}
				else if (status === 404) {
					alert("그룹을 삭제할 수 없습니다.");
				}
				else if (status === 500) {
					alert("내부 서버 오류입니다. 잠시 후에 다시 시도해주세요...");
				}
			});
	}

	return (
		<GroupState.Provider value={group}>
			<GroupDispatch.Provider value={setGroup}>
				<FetchGroup.Provider value={fetchGroup}>
					<SaveGroup.Provider value={saveGroup}>
						<DeleteGroup.Provider value={deleteGroup}>
							{children}
						</DeleteGroup.Provider>
					</SaveGroup.Provider>
				</FetchGroup.Provider>
			</GroupDispatch.Provider>
		</GroupState.Provider>
	);
}

export function useGroupState() {
	const context = useContext(GroupState);
	return context;
}

export function useGroupDispatch() {
	const context = useContext(GroupDispatch);
	return context;
}

export function fetchGroup() {
	const context = useContext(FetchGroup);
	return context;
}

export function useSaveGroup() {
	const context = useContext(SaveGroup);
	return context;
}

export function useDeleteGroup() {
	const context = useContext(DeleteGroup);
	return context;
}