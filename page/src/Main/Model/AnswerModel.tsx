import React, {
	createContext, useContext, useState, Dispatch, useEffect
} from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

import { AnswerObj, childrenObj, QuestionAnswerObj } from '../Type';

import { useUserState } from './UserModel';
import { useSelectedAssignState } from './AssignmentModel';

/* answer */

const AnswerState = createContext<QuestionAnswerObj[]>([]);
const AnswerDispatch = createContext<Dispatch<QuestionAnswerObj[]>>(() => { });
const SaveAnswer = createContext<(answer : Array<AnswerObj>) => void>(() => { });

export const AnswerContextProvider = ({ children }: childrenObj) => {
	const [answer, setAnswer] = useState<QuestionAnswerObj[]>([]);
	const user = useUserState();
	const selectedAssign = useSelectedAssignState();
	const history = useHistory();

	useEffect(() => {
		// select된 과제가 바뀌면 answer 바꾸기
		selectedAssign &&
		fetchAnswer();
	}, [user, selectedAssign]);

	const fetchAnswer = async () => {
		console.log("fetchAnswer");

		if(!(selectedAssign && user)){
			setAnswer([]);
			return;	
		}

		axios.get(`/v1/answer/${selectedAssign.assignmentId}`, { withCredentials: true })
			.then(res => {
				console.log(res.data);
				setAnswer(res.data);
			})
			.catch(err => {
				const status = err?.response?.status;
				if (status === undefined) {
					alert("답안 정보를 얻는 중 예기치 못한 오류가 발생하였습니다." );
				}
				else if (status === 400) {
					alert(`답안 정보를 얻는데 실패하였습니다. 잘못된 요청입니다. (${status})`);
				}
				else if (status === 401) {
					alert(`토큰이 유효하지 않습니다. (${status})`);
					document.cookie = "access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
					history.push("/");
				}
				else if (status === 404) {
					alert("답안을 찾을 수 없습니다.");
				}
				else if (status === 500) {
					alert("내부 서버 오류입니다. 잠시 후에 다시 시도해주세요...");
				}
				setAnswer([]);
			});
	}

	const saveAnswer = (ans : Array<AnswerObj>) => {
		console.log("saveAnswer");

		if(!(selectedAssign && user)){
			console.log("set answer undefined in model");
			setAnswer([]);
			return;
		}
		if(user.type === 'student') {
			axios.post(`/v1/answer/${selectedAssign.assignmentId}`, {
				answers : ans
			}, { withCredentials: true })
				.then(res => {
					console.log(res);
					setAnswer([res.data]);
				})
				.catch(err => {
					const status = err?.response?.status;
					if (status === undefined) { 
						alert("과제 정보를 얻는 중 예기치 못한 예외가 발생하였습니다. (Main.js)\n" + JSON.stringify(err));
					}
					else if (status === 400) {
						alert(`과제 정보를 얻는데 실패하였습니다. 잘못된 요청입니다. (${status})`);
					}
					else if (status === 401) {
						alert(`토큰이 유효하지 않습니다. (${status})`);
						document.cookie="";
						history.push("/");
					}
					else if (status === 404) {
						// 단순히 입력한 답안이 없는 경우이므로 오류는 아님.
						// api 수정 필요
					}
					else if (status === 500) {
						alert("내부 서버 오류입니다. 잠시 후에 다시 시도해주세요...");
					}
					setAnswer([]);
				});
		}
		else { // 채점
			console.log(ans);
			axios.post(`/v1/answer/${selectedAssign.assignmentId}`, {
				answers : ans
			}, { withCredentials: true })
				.then((res) => {
					console.log(res.data);
					setAnswer(res.data);
				})
				.catch(err => {
					const status = err?.response?.status;
					if (status === undefined) { 
						alert("과제 정보를 얻는 중 예기치 못한 예외가 발생하였습니다. (Main.js)\n" + JSON.stringify(err));
					}
					else if (status === 400) {
						alert(`과제 정보를 얻는데 실패하였습니다. 잘못된 요청입니다. (${status})`);
					}
					else if (status === 401) {
						alert(`토큰이 유효하지 않습니다. (${status})`);
						document.cookie="";
						history.push("/");
					}
					else if (status === 404) {
					// 단순히 입력한 답안이 없는 경우이므로 오류는 아님.
					// api 수정 필요
					}
					else if (status === 500) {
						alert("내부 서버 오류입니다. 잠시 후에 다시 시도해주세요...");
					}
				});
		
		}
	}

	return (
		<AnswerState.Provider value={answer}>
			<AnswerDispatch.Provider value={setAnswer}>
				<SaveAnswer.Provider value={saveAnswer}>
					{children}
				</SaveAnswer.Provider>
			</AnswerDispatch.Provider>
		</AnswerState.Provider>
	);
}

export function useAnswerState() {
	const context = useContext(AnswerState);
	return context;
}

export function useAnswerDispatch() {
	const context = useContext(AnswerDispatch);
	return context;
}

export function saveAnswer() {
	const context = useContext(SaveAnswer);
	return context;
}

