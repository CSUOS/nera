import React, { useEffect, useState } from 'react';
import { RouteComponentProps } from "react-router";

import { Grid, TextField, Button, Paper } from '@material-ui/core';
import ClearIcon from '@material-ui/icons/Clear';
import InfoIcon from '@material-ui/icons/Info';

import { PageInfo, TimePicker, MarkdownEditor, StudentPopup, QuestionPopUp } from '../Components';
import { useSelectedAssignState, useSelectedDispatch, useUpdateAssignment, useAddAssignment } from '../Main/Model/AssignmentModel';
import { AssignmentObj, QuestionObj } from '../Main/Type';

type MatchParams = {
	asId?: string | undefined;
}

const SetAssign: React.FC<RouteComponentProps<MatchParams>> = ({ match }) => {
	const selectedAssign = useSelectedAssignState();
	const setSelected = useSelectedDispatch();
	const updateAssignment = useUpdateAssignment();
	const addAssignment = useAddAssignment();
	// 강의 정보
	const [lectureName, setLectureName] = useState<string>("");
	const [assignmentName, setAssignmentName] = useState<string>("");
	// 과제 정보
	const [assignmentInfo, setAssignmentInfo] = useState<string>("");
	const [publishingTime, setPublishingTime] = useState<Date>(new Date()); // 발행 시간
	const [deadline, setDeadline] = useState<Date>(new Date()); // 마감 시간
	const [questions, setQuestions] = useState<Array<QuestionObj>>([]); // 문제
	const [students, setStudents] = useState<Array<number>>([]);
	// question modal
	const [questionModalOpen, setQuestionModalOpen] = useState<boolean>(false);
	const [renderQuestionIndex, setRenderQuestionIndex] = useState<number | undefined>(undefined);
	// student modal
	const [studentModalOpen, setStudentModalOpen] = useState<boolean>(false);

	useEffect(() => {
		// 수정일 때 Selected 설정, 생성일 때 undefined
		match.params.asId && Number(match.params.asId) ?
			setSelected(Number(match.params.asId)) :
			setSelected(undefined);
	}, [match.params.asId]);

	useEffect(() => {
		// 수정일 때 기존 state 채워넣기
		if(!selectedAssign)
			return;
		let tmp = selectedAssign.assignmentName.split('[');
		tmp = tmp[1].split(']');
		setLectureName(tmp[0]);
		setAssignmentName(tmp[1]);
		setAssignmentInfo(selectedAssign.assignmentInfo);
		setPublishingTime(selectedAssign.publishingTime);
		setDeadline(selectedAssign.deadline);
		setQuestions(selectedAssign.questions);
		setStudents(selectedAssign.students);
	}, [selectedAssign]);

	const setAssignmentFunc = (str: string) => setAssignmentInfo(str);

	// question function
	const questionHandleOpen = async (index : number) => {
		if(index === -1){
			// question 생성 시
			await setRenderQuestionIndex(undefined);
		}else{
			// question 수정 시
			await setRenderQuestionIndex(index);
		}
		setQuestionModalOpen(true);
	}

	const addQuestion = (obj : QuestionObj) => {
		setQuestions([
			...questions,
			obj
		]);
	}

	const changeQuestion = (index : number, obj : QuestionObj) => {
		// 해당 인덱스의 문제 변경
		const tmp = questions;
		tmp[index] = obj;
		setQuestions(tmp);
	}
	
	const deleteQuestion = async (index: number) => {
		// 문제 삭제
		if(!confirm("정말 문제를 삭제할까요?"))
			return;
		const tmp = questions;
		tmp.splice(index, 1);
		await setQuestions([]);
		await setQuestions(tmp);
	}

	// Model에 저장
	const handleSaveAssignment = () => {
		if(selectedAssign){
			// 수정일 때
			updateAssignment({
				assignmentId: selectedAssign.assignmentId,
				students: students,
				assignmentName: `[${lectureName}]${assignmentName}`,
				assignmentInfo: assignmentInfo,
				publishingTime: publishingTime,
				deadline: deadline,
				questions: questions
			});
		}else{
			// 생성일 때
			addAssignment({
				students: students,
				assignmentName: `[${lectureName}]${assignmentName}`,
				assignmentInfo: assignmentInfo,
				publishingTime: publishingTime,
				deadline: deadline,
				questions: questions
			});
		}
	}

	return (
		<Grid className="set-assign-con">
			<PageInfo className="assignment-info"
				icon="📚"
				mainTitle="과제별 설정"
				subTitle="각 과제의 세부정보를 설정하는 페이지입니다."
				information={<p>우측 하단의 저장버튼을 누르시면 DB에 저장됩니다.</p>}
			/>
			<Grid className="contents-container set-assign-column">
				<Grid className="assign-name">
					<Grid className="contents-title"><h6>강의 정보</h6></Grid>
					<Grid className="info-field">
						<TextField
							fullWidth
							onChange={(e) => setLectureName(e.target.value)}
							helperText="강의명을 기재해주세요. ex) 이산수학"
							InputLabelProps={{ shrink: true }}
							label="강의명"
							required
							multiline
							rowsMax={2}
							value={selectedAssign ? selectedAssign.assignmentName : lectureName}
						/>
						<TextField
							fullWidth
							onChange={(e) => setAssignmentName(e.target.value)}
							helperText="과제명을 기재해주세요. *강의명과 함께 발행날짜 이전에 학생들에게 보여집니다*"
							InputLabelProps={{ shrink: true }}
							label="과제명"
							required
							multiline
							rowsMax={2}
							value={assignmentName}
						/>
					</Grid>
				</Grid>
				<Grid className="assign-info">
					<Grid className="contents-title"><h6>과제 정보</h6></Grid>
					<Grid item>
						<TimePicker
							publishingTime = {publishingTime}
							deadline = {deadline}
							setPublishingTime = {setPublishingTime}
							setDeadline = {setDeadline}
							startHelperText="과제 발행일입니다."
							endHelperText="과제 마감일입니다."
						/>
					</Grid>
					<Grid className="helper-text-con">
						<InfoIcon color="primary" /> 과제의 전반적인 설명과 주의사항을 기재해주세요. 개별 문제는 아래의 문제란에서 추가해주세요.
					</Grid>
					<Grid>
						<MarkdownEditor
							onChange={setAssignmentFunc}
							contents=""
							lines={10}
						/>
					</Grid>
				</Grid>
				<Grid className="question-con">
					<Grid className="contents-title"><h6>문제</h6></Grid>
					<QuestionPopUp
						open = {questionModalOpen}
						handleClose = {() => setQuestionModalOpen(false)}
						// 수정 시에만 아래 두 개 넘기기
						questionIdx = {renderQuestionIndex}
						question = {renderQuestionIndex !== undefined ? questions[renderQuestionIndex] : undefined}
						addQuestion = {addQuestion}
						changeQuestion = {changeQuestion}
					/>
					<Grid className="box-layout">
						{
							questions.map((question : QuestionObj, index : number)=>
								<Grid key={index + question.questionId} className="box-container">
									<Paper elevation={3} className="box-button">
										<div className="box-name" onClick={() => questionHandleOpen(index)}>
											{question.questionContent} ({question.fullScore}점)
										</div>
										<div className="box-xbtn" onClick={() => deleteQuestion(index)}>
											<Button>
												<ClearIcon/>
											</Button>
										</div>
									</Paper>
								</Grid>
							)
						}
					</Grid>
					<Button variant="contained" color="primary" onClick={()=>questionHandleOpen(-1)}>문제 추가</Button>
				</Grid>
				<Grid className="member-con">
					<StudentPopup
						open = {studentModalOpen}
						typeProps = 'use'
						handleClose = {() => setStudentModalOpen(false)}
						setStudents = {setStudents}
					/>
					<Grid className="contents-title"><h6>수강생 목록</h6></Grid>
					<Grid className="helper-text-con">
						<InfoIcon color="primary" /> 현재 아래에 표시된 학생들이 과제에 배정되어있습니다.
					</Grid>
					<Grid className="student-table">
						{
							students.map((student, index) => <Grid key={index}>{student}</Grid>)
						}
					</Grid>
					<Button variant="contained" color="primary" onClick={()=>setStudentModalOpen(true)}>수강생 선택</Button>
				</Grid>
				<Paper elevation={3} className="save-con">
					<Button className="save_button" variant="contained" color="secondary" onClick={handleSaveAssignment}>저장</Button>
				</Paper>
			</Grid>
		</Grid>
	);
}

export default SetAssign;