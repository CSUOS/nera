import React, {
	createContext, useContext, useReducer, Dispatch, useState, useEffect
} from 'react';
import axios from 'axios';
import { childrenObj, AssignmentObj, AddAssignmentObj, UpdateAssignmentObj } from '../Type';
import { useUserState } from './UserModel';
import { useHistory } from 'react-router-dom';

/* assignment */
/*
const initialAssignment: Array<AssignmentObj> = [{
	assignmentId: 1,
	professor: 1999999999,
	students: [2999999999, 2017920038, 2017920001],
	assignmentName: "[이산수학]이산과제1",
	assignmentInfo: "",
	assignmentState: 1,
	publishingTime: new Date("2021/02/14"),
	deadline: new Date("2021/02/14"),
	questions: [{
		questionId: 1,
		questionContent: "문제 1입니당.",
		fullScore: 50
	}, {
		questionId: 2,
		questionContent: "문제 2 입니다.",
		fullScore: 50
	}],
	meta: {
		createAt: new Date("2021/02/14"),
		modifiedAt: new Date("2021/02/14"),
	}
}, {
	assignmentId: 10,
	professor: 1999999999,
	students: [2999999999, 2017920038, 2017920001],
	assignmentName: "[이산수학]이산과제1",
	assignmentInfo: "이산수학 과제입니다.",
	assignmentState: 1,
	publishingTime: new Date("2021/02/14"),
	deadline: new Date("2021/02/14"),
	questions: [{
		questionId: 1,
		questionContent: "문제 1입니당.",
		fullScore: 50
	}, {
		questionId: 2,
		questionContent: "문제 2 입니다.",
		fullScore: 50
	}],
	meta: {
		createAt: new Date("2021/02/14"),
		modifiedAt: new Date("2021/02/14"),
	}
}, {
	assignmentId: 2,
	professor: 1999999999,
	students: [2999999999, 2017920038, 2017920001],
	assignmentName: "[이산수학]이산과제2",
	assignmentInfo: "이산수학 과제입니다.",
	assignmentState: 0,
	publishingTime: new Date("2021/02/14"),
	deadline: new Date("2021/02/14"),
	questions: [{
		questionId: 1,
		questionContent: "문제 1입니당.",
		fullScore: 50
	}, {
		questionId: 2,
		questionContent: "문제 2 입니다.",
		fullScore: 50
	}],
	meta: {
		createAt: new Date("2021/02/14"),
		modifiedAt: new Date("2021/02/14"),
	}
}, {
	assignmentId: 3,
	professor: 1999999999,
	students: [2999999999, 2017920038, 2017920001],
	assignmentName: "[이산수학]이산과제3",
	assignmentInfo: "이산수학 과제입니다.",
	assignmentState: 2,
	publishingTime: new Date("2021/02/14"),
	deadline: new Date("2021/02/14"),
	questions: [{
		questionId: 1,
		questionContent: "문제 1입니당.",
		fullScore: 50
	}, {
		questionId: 2,
		questionContent: "문제 2 입니다.",
		fullScore: 50
	}],
	meta: {
		createAt: new Date("2021/02/14"),
		modifiedAt: new Date("2021/02/14"),
	}
}, {
	assignmentId: 3,
	professor: 1999999999,
	students: [2999999999, 2017920038, 2017920001],
	assignmentName: "[이산수학]이산과제3",
	assignmentInfo: "이산수학 과제입니다.",
	assignmentState: 3,
	publishingTime: new Date("2021/02/14"),
	deadline: new Date("2021/02/14"),
	questions: [{
		questionId: 1,
		questionContent: "문제 1입니당.",
		fullScore: 50
	}, {
		questionId: 2,
		questionContent: "문제 2 입니다.",
		fullScore: 50
	}],
	meta: {
		createAt: new Date("2021/02/14"),
		modifiedAt: new Date("2021/02/14"),
	}
}];
*/

const SelectedState = createContext<number | undefined>(undefined);
const SelectedDispatch = createContext<Dispatch<number | undefined>>(() => { });
const SelectedAssignState = createContext<AssignmentObj | undefined>(undefined);
const AssignmentState = createContext<Array<AssignmentObj>>([]);
const AssignmentDispatch = createContext<Dispatch<Array<AssignmentObj>>>(() => { });
const FetchAssignment = createContext<() => void>(() => { });
const AddAssignment = createContext<(assign: AddAssignmentObj) => void>(() => { });
const UpdateAssignment = createContext<(assign: UpdateAssignmentObj) => void>(() => { });
const DeleteAssignment = createContext<(id: number) => void>(() => { });


export const AssignmentContextProvider = ({ children }: childrenObj) => {
	const [selected, setSelected] = useState<number | undefined>(0);
	// 선택한 과제의 id 저장
	// 곳곳에서 && 줄이기 위해서 선택된 assignment를 context로 정의하는 것이 나음
	const [selectedAssign, setSelectedAssign] = useState<AssignmentObj | undefined>(undefined);
	const [assignment, setAssignment] = useState<Array<AssignmentObj>>([]);

	const user = useUserState();
	const history = useHistory();

	useEffect(() => {
		// 처음에 user가 setting되면 assignment 목록 받아오기
		user && fetchAssignment();
	}, [user]);

	useEffect(() => {
		if(selected && assignment){
			assignment.forEach((as) => {
				if(as.assignmentId === selected){
					setSelectedAssign(as);
					return;
				}
			})
		}
		else
			setSelectedAssign(undefined);
	}, [assignment, selected]);


	const fetchAssignment = () => {
		axios.get('/v1/assignment', { withCredentials: true })
			.then(res => {
				setAssignment(res.data);
			})
			.catch(err => {
				const status = err?.response?.status;
				if (status === undefined) {
					alert("과제 정보를 얻는 중 예기치 못한 오류가 발생하였습니다." );
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
					alert("과제를 찾을 수 없습니다.");
				}
				else if (status === 500) {
					alert("내부 서버 오류입니다. 잠시 후에 다시 시도해주세요...");
				}
				setAssignment([]);
			});
	}

	const addAssignment = (assign: AddAssignmentObj) => {
		axios.post('/v1/assignment', { ...assign }, { withCredentials: true })
			.then(() => {
				fetchAssignment();
			})
			.catch(err => {
				const status = err?.response?.status;
				if (status === undefined) {
					alert("과제를 생성하는 중 예기치 못한 오류가 발생하였습니다.");
				} else if (status === 400) {
					alert(`과제 정보를 저장하는데 실패하였습니다. 잘못된 요청입니다. (${status})`);
				} else if (status === 401) {
					alert(`토큰이 유효하지 않습니다. (${status})`);
					document.cookie="";
					history.push("/");
				} else if (status === 403) {
					alert(`과제 정보를 저장하는데 실패하였습니다. 권한이 없습니다. (${status})`);
				} else if (status === 404) {
					alert(`과제 정보를 저장하는데 실패하였습니다. 과제를 찾을 수 없습니다. (${status})`);
				} else if (status === 500) {
					alert("내부 서버 오류입니다. 잠시 후에 다시 시도해주세요...");
				}
				history.push("/home/setting");
			})
	}

	const updateAssignment = (assign: UpdateAssignmentObj) => {
		axios.put('/v1/assignment', { ...assign }, { withCredentials: true })
			.then(() => {
				fetchAssignment();
			})
			.catch(err => {
				const status = err?.response?.status;
				if (status === undefined) {
					alert("과제를 생성하는 중 예기치 못한 오류가 발생하였습니다.");
				} else if (status === 400) {
					alert(`과제 정보를 저장하는데 실패하였습니다. 잘못된 요청입니다. (${status})`);
				} else if (status === 401) {
					alert(`토큰이 유효하지 않습니다. (${status})`);
					document.cookie="";
					history.push("/");
				} else if (status === 403) {
					alert(`과제 정보를 저장하는데 실패하였습니다. 권한이 없습니다. (${status})`);
				} else if (status === 500) {
					alert("내부 서버 오류입니다. 잠시 후에 다시 시도해주세요...");
				}
				history.push("/home/setting");
			})
	}

	const deleteAssignment = (id: number) => {
		axios.delete(`/v1/assignment/${id}`, { withCredentials: true })
			.then(() => {
				fetchAssignment();
			})
			.catch(err => {
				const status = err?.response?.status;
				if (status === undefined) {
					alert("과제를 삭제하는 중 예기치 못한 오류가 발생하였습니다.");
				} else if (status === 401) {
					alert(`토큰이 유효하지 않습니다. (${status})`);
					document.cookie="";
					history.push("/");
				}
				else if (status === 403) {
					alert(`과제를 삭제하는데 실패하였습니다. 권한이 없습니다. (${status})`);
				}
				else if (status === 500) {
					alert("내부 서버 오류입니다. 잠시 후에 다시 시도해주세요...");
				}
				history.push("/home");
			})
	}

	// todo : 필요한 함수 추가

	return (
		<AssignmentState.Provider value={assignment}>
			<AssignmentDispatch.Provider value={setAssignment}>
				<FetchAssignment.Provider value={fetchAssignment}>
					<AddAssignment.Provider value={addAssignment}>
						<UpdateAssignment.Provider value={updateAssignment}>
							<DeleteAssignment.Provider value={deleteAssignment}>
								<SelectedDispatch.Provider value={setSelected}>
									<SelectedState.Provider value={selected}>
										<SelectedAssignState.Provider value={selectedAssign}>
											{children}
										</SelectedAssignState.Provider>
									</SelectedState.Provider>
								</SelectedDispatch.Provider>
							</DeleteAssignment.Provider>
						</UpdateAssignment.Provider>
					</AddAssignment.Provider>
				</FetchAssignment.Provider>
			</AssignmentDispatch.Provider>
		</AssignmentState.Provider>
	);
}

export function useAssignmentState() {
	const context = useContext(AssignmentState);
	return context;
}

export function useAssignmentDispatch() {
	const context = useContext(AssignmentDispatch);
	return context;
}

export function useSelectedState() {
	const context = useContext(SelectedState);
	return context;
}

export function useSelectedDispatch() {
	const context = useContext(SelectedDispatch);
	return context;
}

export function useSelectedAssignState() {
	const context = useContext(SelectedAssignState);
	return context;
}

export function useFetchAssignment() {
	const context = useContext(FetchAssignment);
	return context;
}

export function useAddAssignment() {
	const context = useContext(AddAssignment);
	return context;
}

export function useUpdateAssignment() {
	const context = useContext(UpdateAssignment);
	return context;
}

export function useDeleteAssignment() {
	const context = useContext(DeleteAssignment);
	return context;
}