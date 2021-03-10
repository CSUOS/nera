import React, { useState, useEffect } from 'react';
import { PageInfo, TimePicker, MarkdownEditor, MarkdownViewer, StudentPopup } from '../Components';
import { useAddAssignment, useUpdateAssignment, useSelectedAssignState, useSelectedDispatch } from '../Main/Model/AssignmentModel';
import { AddAssignmentObj, UpdateAssignmentObj, QuestionObj } from '../Main/Type';
import dateToString from "../utils/dateToString"

import { useHistory } from "react-router-dom";

import { Grid, Paper, Modal, TextField, Typography, Button } from '@material-ui/core';
import ClearIcon from '@material-ui/icons/Clear';
import InfoIcon from '@material-ui/icons/Info';

interface Match<ParamType> {
	params: ParamType;
}

interface RouteComponentProps<P> {
	match: Match<P>;
}

interface SetAssignmentParams {
	asId: string;
}

// SetAssignment 페이지
const SetAssignment: React.FC<RouteComponentProps<SetAssignmentParams>> = ({match}) => {
	const [update, forceUpdate] = useState<boolean>(false); // rendering update용
	const [qOpen, setQOpen] = useState<boolean>(false); // question modal 관리
	const [sOpen, setSOpen] = useState<boolean>(false); // student list modal 관리

	// 강의 정보
	const [lectureName, setLecture] = useState<string>();
	// 과제 정보
	const [assignId, setAssignId] = useState<number>(-1);
	const [assignName, setAssignName] = useState<string>();
	const [assignInfo, setAssignInfo] = useState<string>();
	const [initAssignInfo, setInitAssignInfo] = useState<string>();
	const [modifiedDate, setModifiedDate] = useState<Date>(); // 저장 시간
	const [publishingTime, setPublishingTime] = useState<Date>(); // 발행 시간
	const [deadline, setDeadline] = useState<Date>(); // 마감 시간
	const [questions, setQuestions] = useState<Array<QuestionObj>>([]);
	const [students, setStudents] = useState<Array<number>>([]);
	// modal state 관리
	const [renderQuestionIndex, setRenderQuestionIndex] = useState<number>(-1); 
	const [renderQuestionContents, setRenderQuestionContents] = useState<string>(); 
	const [initRenderQuestionContents, setInitRenderQuestionContents] = useState<string>();
	const [renderQuestionScore, setRenderQuestionScore] = useState<number>();
	// preProcessingAssignmentData에서 모든 열이 정상임이 확인되면 아래 데이터가 할당됨.
	const [addAssignObj, setAddAssignObj] = useState<AddAssignmentObj>();
	const [updateAssignObj, setUpdateAssignObj] = useState<UpdateAssignmentObj>();

	const history = useHistory();
	const addAssignment = useAddAssignment();
	const updateAssignment = useUpdateAssignment();
	const oldAssignment = useSelectedAssignState();
	const setOldAssignmentId = useSelectedDispatch();

	useEffect(() => {
		const asId = match.params.asId; // url의 과제id에 해당하는 정보 불러오기

		if (asId !== undefined && asId !== "add") { // 이미 존재하는 과제 설정을 수정하는 페이지일 때
			setAssignId(Number(asId));
			setOldAssignmentId(Number(asId));
		} else { // 새로운 과제를 추가하는 페이지일 때
			const date = new Date();
			setPublishingTime(date);
			setDeadline(date);
		}
	}, [match.params.asId]);

	useEffect(() => {
		if (oldAssignment && assignId !== -1) {
			setAssignId(oldAssignment.assignmentId);
			setAssignInfo(oldAssignment.assignmentInfo);
			setInitAssignInfo(oldAssignment.assignmentInfo);
			let tmp = oldAssignment.assignmentName.split('[');
			tmp = tmp[1].split(']');
			setLecture(tmp[0]);
			setAssignName(tmp[1]);
			setPublishingTime(oldAssignment.publishingTime); 
			setDeadline(oldAssignment.deadline);
			setQuestions(oldAssignment.questions);
			setStudents(oldAssignment.students);
		}
	}, [oldAssignment])

	// if you click question button => questionsHandleOpen();
	// if you click question +(add) button => addQuestion();
	// if you click question x(delete) button => deleteQuestion();
	// if you modify quetion modal textfield => changeRenderQuestion();
	// if you click quetions modal save button => saveRenderQuestion();

	function questionHandleOpen(index: number): void {
		setQOpen(true);
		setRenderQuestionIndex(index);
		setRenderQuestionContents(questions[index].questionContent);
		setInitRenderQuestionContents(questions[index].questionContent);
		setRenderQuestionScore(questions[index].fullScore);
	}

	function questionHandleClose(): void {
		setQOpen(false);
	}

	function listHandleOpen(): void {
		setSOpen(true);
	}

	function listHandleClose(): void {
		setSOpen(false);
	}

	function changeLectureField(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void {
		// textfield가 바뀔 때마다 lectureName 갱신

		setLecture(e.target.value);
		// forceUpdate(!update);
	}

	function changeAssignNameField(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void {
		// textfield가 바뀔 때마다 assignmentName 갱신

		setAssignName(e.target.value);
		// forceUpdate(!update);
	}

	function changeAssignInfoField(value: string): void {
		// MarkdownEditor가 바뀔 때마다 Description 갱신

		setAssignInfo(value);
		// forceUpdate(!update);
	}

	function addQuestion(): void {
		let maxQuesId = 0;
		for (const ques of questions)
			maxQuesId = Math.max(maxQuesId, ques.questionId);

		// 새로운 문제 추가
		const index = questions.length;
		const newQuestion: QuestionObj = {
			questionId : maxQuesId+1,
			questionContent : "",
			fullScore : 0,
		};

		const tmp = questions;
		tmp.push(newQuestion);
		setQuestions(tmp);
		questionHandleOpen(index);
	}

	function changeRenderQuestion(value: string, type: number): void {
		// textfield가 바뀔 때마다 render state들 갱신

		if(type===0){ // 문제 설명 갱신
			setRenderQuestionContents(value);
		}else{ // 배점 갱신
			const converted = Number(value);
			setRenderQuestionScore(converted);
		}
		// forceUpdate(!update);
	}

	function deleteQuestion(index: number): void {
		// 문제 삭제
		const tmp = questions;
		tmp.splice(index, 1);
		setQuestions(tmp);
		// forceUpdate(!update);
	}

	function preProcessingQuestionData(): string {
		if(renderQuestionContents===undefined || renderQuestionContents === "")
			return "문제 내용이 없습니다.";

		if(renderQuestionScore == undefined || isNaN(renderQuestionScore))
			return "배점이 숫자가 아닙니다.";

		if(renderQuestionScore<0 || renderQuestionScore>100)
			return "배점이 0 ~ 100 범위를 벗어납니다.";

		return "";
	}

	function saveRenderQuestion(): void {
		const errorMessage = preProcessingQuestionData();
		if(errorMessage!==""){
			alert(errorMessage);
			return;
		}

		const tmp = questions;
		tmp[renderQuestionIndex].questionContent = (renderQuestionContents == undefined ? "" : renderQuestionContents);
		tmp[renderQuestionIndex].fullScore = (renderQuestionScore == undefined ? 0 : renderQuestionScore);

		setQuestions(questions);
		questionHandleClose();
	}

	function saveStudentModalGroup(getStudents: number[]): void {
		// renderStudent => students 저장
		setStudents(getStudents);
		listHandleClose();
	}

	function preProcessingAssignmentData(): string {
		if (lectureName === undefined)
			return "강의명이 없습니다. 강의명을 작성해주세요.";

		if (assignName === undefined)
			return "과제명이 없습니다. 과제명을 작성해주세요.";

		if (publishingTime === undefined)
			return "과제 시작 시간이 유효하지 않습니다.";
		
		if (deadline === undefined)
			return "과제 마감 시간이 유효하지 않습니다.";

		if (publishingTime.getTime() - deadline.getTime() === 0)
			return "과제 시작 시각과 마감 시각이 같습니다.";

		if (deadline.getTime() - Date.now() < 0)
			return "과제 마감 시각이 현재보다 이전입니다.";

		if (questions.length === 0)
			return "문제가 없습니다. 문제를 생성해주세요.";
        
		if (students.length === 0)
			return "수강생이 없습니다. 수강생을 추가해주세요.";
        
		if (assignId === -1) { // 새로운 과제를 생성하는 경우
			setAddAssignObj({
				students : students,
				assignmentName : "[" + lectureName + "] " + assignName,
				assignmentInfo : (assignInfo ? assignInfo : ""),
				publishingTime : publishingTime,
				deadline : deadline,
				questions : questions
			})
		} else { // 기존의 과제를 수정하는 경우
			setUpdateAssignObj({
				assignmentId : assignId,
				students : students,
				assignmentName : "[" + lectureName + "] " + assignName,
				assignmentInfo : (assignInfo ? assignInfo : ""),
				publishingTime : publishingTime,
				deadline : deadline,
				questions : questions
			})
		}

		return "";
	}

	function saveAssignmentToDB(): void {
		// 과제 수정/생성 API와의 연동

		const errMessage = preProcessingAssignmentData();
		if(errMessage !== "") {
			alert(errMessage);
			return;
		}

		// preProcessingAssignmentData에서 각 데이터가 undefined인지 확인하므로,
		// 모든 열이 undefined가 아님이 보장됨.
		if (assignId === -1 && addAssignObj) { // 새로운 과제를 생성하는 경우
			addAssignment(addAssignObj);
		} else if (updateAssignObj) { // 기존의 과제를 수정하는 경우
			updateAssignment(updateAssignObj);
		}

		setModifiedDate(new Date());
		history.push("/home/setting");
	}

	return (
		<Grid container className="set-assign-con" direction="column">
			<PageInfo className="assignment-info"
				icon="📚"
				mainTitle="과제별 설정"
				subTitle="각 과제의 세부정보를 설정하는 페이지입니다." 
				information={<p>우측 하단의 저장버튼을 누르시면 DB에 저장됩니다.</p>}/>
			<div className="contents-container set-assign-column">
				<div className="contents-title">
					<h6>강의 정보</h6>
				</div>

				<Grid className="setting-as-row" container item direction="row">
					<div>
						<TextField 
							fullWidth 
							onChange={(e)=>changeLectureField(e)} 
							helperText="강의명을 기재해주세요. ex_ 이산수학" 
							InputLabelProps={{shrink:true}} 
							label="강의명" 
							required 
							multiline 
							rowsMax={2} 
							value={lectureName}
						/>
					</div>
					<div>
						<TextField 
							fullWidth 
							onChange={(e)=>changeAssignNameField(e)} 
							helperText="과제명을 기재해주세요. 강의명과 함께 발행날짜 이전에 학생들에게 보여집니다*" 
							InputLabelProps={{shrink:true}} 
							label="과제명" 
							required 
							multiline 
							rowsMax={2} 
							value={assignName}
						/>
					</div>
				</Grid>

				<div className="contents-title">
					<h6>과제 설명</h6>
				</div>

				<Grid container item direction="row">
					<Grid xs={12}>
						<MarkdownEditor
							onChange={changeAssignInfoField}
							contents={(initAssignInfo ? initAssignInfo : "")}
							lines={20}
						></MarkdownEditor>
					</Grid>
				</Grid>

				<Grid container direction="row" alignItems="center">
					<InfoIcon color="primary"/>
					위의 과제 설명란에 자세한 과제 내용과 주의사항을 기재해주세요. 개별 문제는 아래의 문제란에 기재해주세요.
				</Grid>

				<Grid item>
					{(publishingTime!==undefined && deadline!==undefined)?
						<TimePicker
							publishingTime = {publishingTime}
							deadline = {deadline}
							setPublishingTime = {setPublishingTime}
							setDeadline = {setDeadline}
							startHelperText="이 시각 이후로 학생들은 과제를 보고 수정할 수 있습니다."
							endHelperText="이 시각 이후로 학생들은 과제를 수정할 수 없습니다."
						/>
						:"Please wait..."
					}
				</Grid>

				<Grid container item direction="column" className="contents_con">
					<div className="contents-title">
						<h6>문제</h6>
					</div>
					<Grid container wrap="wrap" alignItems="center" className="contents box_layout" >
						{
							questions.map((question, index)=>
								<Grid key={question.questionId} container className="box_container" item>
									<Grid item className="box_content">
										<Button className="box_button" onClick={()=>questionHandleOpen(index)}>
											<Paper className="box_name">
												<Grid container className="problem_container" direction="column">
													<Grid container className="problem_description" direction="row" alignItems="flex-start" justify="flex-start">
														<h6 className="problem_number">{(index + 1) + "."}</h6>
														<MarkdownViewer className="problem_description_viewer" source={question.questionContent}></MarkdownViewer>
													</Grid>
													<h6 className="problem_score">{question.fullScore + "점"}</h6>
												</Grid>
											</Paper>
										</Button>
									</Grid>
									<Grid item className="box_xbtn">
										<Button onClick={()=>deleteQuestion(index)}><ClearIcon/></Button>
									</Grid>
								</Grid>
							)
						}
						<Paper className="add_button">
							<Button onClick={addQuestion}>
								<Typography>문제 추가</Typography>
							</Button>
						</Paper>
						<Modal
							open={qOpen}
							onClose={questionHandleClose}
							aria-labelledby="add question to assignment"
							aria-describedby="add question to assignment"
							className="modal">
							<Paper className="modal_con">
								<Grid container direction="column" className="modal_form">
									<MarkdownEditor
										onChange={(value) => changeRenderQuestion(value,0)}
										contents={(initRenderQuestionContents ? initRenderQuestionContents : "")}
										lines={20}
									></MarkdownEditor>
									<TextField 
										onChange={(e)=>changeRenderQuestion(e.target.value,1)} 
										InputLabelProps={{shrink:true}} 
										label="배점" required multiline 
										rows={1} rowsMax={10} 
										value={renderQuestionScore}
										error={typeof(renderQuestionScore)==="string"?true:false}
										helperText="숫자를 입력해주세요."
									></TextField>
								</Grid>
								<Button className="save_button" onClick={()=>saveRenderQuestion()}>저장</Button>
							</Paper>
						</Modal>
					</Grid>
				</Grid>
                
				<Grid container item direction="column" className="contents_con set-assign-column">
					<div className="contents-title">
						<h6>수강생 목록</h6>
					</div>
					<Paper className="add_button">
						<Button onClick={listHandleOpen}>
							<Typography>수강생 목록 수정</Typography>
						</Button>
					</Paper>
					<Grid container direction="row" alignItems="center">
						<InfoIcon color="primary"/>
						현재 아래에 표시된 학생들이 과제에 배정되어있습니다.
					</Grid>
					{students.map((student)=>student+" ")}
					<Grid>
						<StudentPopup
							open = {sOpen}
							typeProps = 'use'
							handleClose = {() => setSOpen(false)}
							setStudents = {setStudents}
						/>
					</Grid>
				</Grid>
                
				<Grid className="assignment_saveinfo_con">
					<Grid className="assignment_saveinfo">
						<Typography>{dateToString(modifiedDate)}</Typography>
						<Button className="save_button" onClick={saveAssignmentToDB}>저장</Button>
					</Grid>
				</Grid>
			</div>
		</Grid>
	);
}

export default SetAssignment;
