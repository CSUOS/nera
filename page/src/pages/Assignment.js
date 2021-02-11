import React, { useEffect, useState, useRef } from 'react';
import { PageInfo, Problem, Loading, MarkdownViewer, MarkdownEditor, SaveSnackbar } from "../components";
import { modifiedDateToString } from '../function/DateToString.js';

import axios from "axios";
import { useHistory } from "react-router-dom";
import { Prompt } from 'react-router';

import MuiAlert from '@material-ui/lab/Alert';
import InfoIcon from '@material-ui/icons/Info';
import AssignmentIcon from '@material-ui/icons/Assignment';
import { Button, Grid, Typography, Divider, Snackbar, Slide } from '@material-ui/core';

function Alert(props) {
	return <MuiAlert elevation={6} variant="filled" {...props} />;
}

function useInterval(callback, delay) {
	const savedCallback = useRef();

	useEffect(() => {
		savedCallback.current = callback;
	}, [callback]);

	useEffect(() => {
		function tick() {
			savedCallback.current();
		}
		if (delay !== null) {
			let id = setInterval(tick, delay);
			return () => clearInterval(id);
		}
	}, [delay]);
}

function useEvent(event, handler, passive=false) {
	useEffect(() => {
		window.addEventListener(event, handler, passive);
  
		return function cleanup() {
			window.removeEventListener(event, handler);
		};
	});
}  

const Assignment = (props) => {
	const dateCaptionStyle = {
		width: "auto",
		display: "block",
		padding: "0 10px"
	};

	const statusCaptionStyle = {
		width: "auto",
		display: "block",
		padding: "0 10px"
	};

	const [info, setInfo] = useState(undefined);
	const [infoDate, setInfoDate] = useState(undefined);
	const [answers, setAnswers] = useState(undefined);
	const [answersDate, setAnswersDate] = useState(undefined);
	const [questions, setQuestions] = useState(undefined);
	const [modifiedDate, setModifiedDate] = useState(undefined);
	const [status, setStatus] = useState(undefined);
	const [statusStyle, setStatusStyle] = useState(statusCaptionStyle);
	const [modifiedAnswers, setModifiedAnswers] = useState(undefined);
	const [openSnack, setOpenSnack] = useState(false);
	const history = useHistory();

	function getAssignment() {
		let assignId = props.match.params.asId;

		axios.get(`/v1/assignment/${assignId}`, { withCredentials: true })
			.then(res => {
				setInfo(res.data);
				setInfoDate(new Date());
			})
			.catch(err => {
				const status = err?.response?.status;
				if (status === undefined) {
					alert("과제 정보를 얻는 중 예기치 못한 예외가 발생하였습니다. (Assignment.js)\n"+JSON.stringify(err));
				}
				else if (status === 400) {
					alert(`과제 정보를 얻는데 실패하였습니다. 잘못된 요청입니다. (${status})`);
				}
				else if (status === 401) {
					alert(`토큰이 유효하지 않습니다. (${status})`);
					document.cookie = "access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
					history.push("/");
				}
				else if (status === 404) {
					alert("과제를 찾을 수 없습니다.");
				}
				else if (status === 500) {
					alert("내부 서버 오류입니다. 잠시 후에 다시 시도해주세요...");
				}
				history.push("/home");
			});
	}

	function getAnswers() {
		let assignId = props.match.params.asId;

		axios.get(`/v1/answer/${assignId}`, { withCredentials: true })
			.then(res => {
				setModifiedDate(new Date(res.data.meta.modifiedAt));
				setStatus("변경 사항 없음");
				setStatusStyle(statusCaptionStyle);
				setModifiedAnswers({});
				setAnswers(res.data.answers);
				setAnswersDate(new Date());
			})
			.catch(err => {
				const status = err?.response?.status;
				if (status === undefined) {
					alert("답안 정보를 얻는 중 예기치 못한 예외가 발생하였습니다. (Assignment.js)\n"+JSON.stringify(err));
				}
				else if (status === 400) {
					alert(`답안 정보를 얻는데 실패하였습니다. 잘못된 요청입니다. (${status})`);
				}
				else if (status === 401) {
					alert(`토큰이 유효하지 않습니다. (${status})`);
					document.cookie = "access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
					history.push("/");
				}
				else if (status === 403) {
					alert(`답안 정보를 얻는데 실패하였습니다. 권한이 없습니다. (${status})`);
				}
				else if (status === 404) {
					// 단순히 입력한 답안이 없는 경우이므로 오류는 아님.
					setModifiedDate(undefined);
					setStatus("변경 사항 없음");
					setStatusStyle(statusCaptionStyle);
					setModifiedAnswers({});
					setAnswers([]);
					setAnswersDate(new Date());
				}
				else if (status === 500) {
					alert("내부 서버 오류입니다. 잠시 후에 다시 시도해주세요...");
				}

				if (status !== 404) {
					history.push("/home");
				}
			});
	}

	function getMarkedScore(qId) {
		let found = answers.filter(answer => answer.questionId === qId);
		if (found.length > 0) {
			if (found[0].score === -1)
				return 0;
			return found[0].score;
		}
		return 0;
	}

	function initQuestions() {
		if (info === undefined)
			return;

		try {
			let quesArr = [];
			let number = 1;

			for (const ques of info.questions) {
				let processed = {};
				processed.questionId = ques.questionId;
				processed.questionNumber = number++;
				processed.questionContent = ques.questionContent;
				processed.fullScore = ques.fullScore;
				processed.score = getMarkedScore(ques.questionId);
				processed.assignmentState = info.assignmentState;

				const found = answers.filter(answer => answer.questionId === ques.questionId);
				if (found.length > 0)
					processed.answerContent = found[0].answerContent;
				else
					processed.answerContent = "";

				quesArr.push(processed);
			}

			setQuestions(quesArr);
		} catch (err) {
			console.log(err);
		}
	}

	function handleAnswerChange(text, qId) {
		let currModified = modifiedAnswers;
		currModified[qId] = text;
		setModifiedAnswers(currModified);
        
		let found = questions.find(ques => ques.questionId === qId);
		if (status !== "답안 저장 필요") {
			setStatusStyle({ ...statusCaptionStyle, color: "red" });
			setStatus("답안 저장 필요");
		}
	}

	function saveAnswers() {
		if (info.assignmentState !== 1)
			return;

		let processed = {};
		for (const ques of questions)
			processed[ques.questionId] = ques.answerContent;
		for (const qId in modifiedAnswers)
			processed[qId] = modifiedAnswers[qId];

		let reqBody = {answers: []};
		for (const qId in processed) {
			reqBody.answers.push({
				questionId: qId,
				answerContent: processed[qId]
			});
		}

		setStatusStyle({...statusCaptionStyle, color: "blue"});
		setStatus("답안 저장 중...");
		let assignId = props.match.params.asId;
		axios.post(`/v1/answer/${assignId}`, reqBody, { withCredentials: true })
			.then(res => {
				setModifiedDate(new Date());
				setStatusStyle({...statusCaptionStyle});
				setStatus("변경 사항 없음");
			})
			.catch(err => {
				const status = err?.response?.status;
				if (status === undefined) {
					alert("답안 정보를 저장하는 중 예기치 못한 예외가 발생하였습니다. (Assignment.js)\n"+JSON.stringify(err));
				}
				else if (status === 400) {
					alert(`답안을 저장하지 못했습니다. 잘못된 요청입니다. (${status})`);
				}
				else if (status === 401) {
					alert(`토큰이 유효하지 않습니다. (${status})`);
					document.cookie = "access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
					history.push("/");
				}
				else if (status === 403) {
					alert(`답안을 저장하지 못했습니다. 권한이 없습니다. (${status})`);
				}
				else if (status === 404) {
					alert(`답안을 저장하지 못했습니다. 과제를 찾을 수 없습니다. (${status})`);
				}
				else if (status === 500) {
					alert("내부 서버 오류입니다. 잠시 후에 다시 시도해주세요...");
				}

				setStatusStyle({...statusCaptionStyle, color: "red"});
				setStatus("답안 저장 필요");
			});
	}

	function getSubTitle(){
		const deadline = new Date(info.deadline);
		let deadlineString = deadline.getFullYear() + "-" 
                         + (deadline.getMonth()+1 <= 9 ? "0" : "") + (deadline.getMonth()+1) + "-"
                         + (deadline.getDate() <= 9 ? "0" : "") + deadline.getDate() + " "
                         + (deadline.getHours() <= 9 ? "0" : "") + deadline.getHours() + ":"
                         + (deadline.getMinutes() <= 9 ? "0" : "") + deadline.getMinutes()
		return deadlineString + " 마감";
	}

	function getInfoText() {
		if (info.assignmentState === 1) {
			return "Markdown 및 LaTeX(KaTeX) 형식으로 과제를 작성하고 저장할 수 있습니다. 작성한 과제는 매 1초마다 자동 저장되며, Ctrl+S를 누르거나 우측 하단 저장 버튼을 눌러 수동 저장할 수 있습니다.";
		} else if (info.assignmentState === 3) {
			return "이전에 제출한 답안들의 채점 결과를 확인할 수 있습니다."
		} else {
			return "과제를 확인할 수 없는 기간입니다. 과제가 진행중이거나, 채점이 완료되어야 과제를 확인할 수 있습니다."
		}
	}

	useInterval(() => {
		if (status === "답안 저장 필요")
			saveAnswers();
	}, 1000);

	function handleKeyPress(event) {
		if (info.assignmentState !== 1)
			return;

		if ((window.navigator.platform.match("Mac") ? event.metaKey : event.ctrlKey)  && event.keyCode === 83) {
			setOpenSnack(true);
			saveAnswers();
			event.preventDefault();
			return false;
		} else {
			return true;
		}
	}

	useEvent("keydown", handleKeyPress);

	useEffect(() => {
		setInfo(undefined);
		setInfoDate(undefined);
		setAnswers(undefined);
		setAnswersDate(undefined);
		setQuestions(undefined);
		setModifiedDate(undefined);
		setStatus(undefined);
		setStatusStyle(undefined);
		setModifiedAnswers(undefined);
		getAssignment();
	}, [props.match.params.asId]);

	useEffect(() => {
		getAnswers();
	}, [infoDate]);

	useEffect(() => {
		initQuestions();
	}, [answersDate]);

	function handleSnackClose(event, reason) {
		if (reason === 'clickaway') {
			return;
		}
		setOpenSnack(false);
	}
    

	if (questions === undefined)
		return (<Loading status="과제 정보를 가져오는 중..."></Loading>);
	else
		return (
			<Grid container direction="column">
				<Prompt when={status === "답안 저장 필요"} message="아직 과제가 저장되지 않았습니다! 정말로 나가시겠습니까?"></Prompt>
				<Grid className="assignment_page_header">
					<Grid className="assignment_page_title">
						<PageInfo className="assignment_info"
							icon={AssignmentIcon}
							mainTitle={info.assignmentName}
							subTitle={getSubTitle()}
							information={getInfoText()} />
					</Grid>

					{info.assignmentState === 1 &&
					<SaveSnackbar 
						onClick={saveAnswers} 
						dateCaptionStyle={dateCaptionStyle} 
						statusStyle={statusStyle}
						modifiedDateStr={modifiedDateToString(modifiedDate)}
						status={status}
					/>}
				</Grid>

				<Grid container item direction="row" spacing={4} className="page_additional_info" alignItems="center">
					<InfoIcon color="primary"/>
					&nbsp;Markdown 문법에 대한 정보는&nbsp; <a href="https://www.markdownguide.org/basic-syntax/">여기에서,</a>
					&nbsp;LaTeX(KaTeX) 문법에 대한 정보는&nbsp;<a href="https://katex.org/docs/supported.html">여기에서</a>&nbsp;확인할 수 있으며,&nbsp;
					<a href="https://powergee.github.io/simple-markdown-editor/">여기에서</a>&nbsp;활용 예시를 확인할 수 있습니다.
				</Grid>

				{(info.assignmentState === 1 || info.assignmentState === 3) && (
					<div className="assignment_info_container">
						<MarkdownViewer source={info.assignmentInfo}/>
						<Divider className="editor_caption_divider" orientation="horizontal"></Divider>
						{questions.map(ques => <Problem key={ques.questionId} info={ques} onEdit={handleAnswerChange} />)}
					</div>
				)}

				<Snackbar
					open={openSnack}
					onClose={handleSnackClose}
					autoHideDuration={1000}>
					<Alert onClose={handleSnackClose} severity="info">수동 저장되었습니다. (1초마다 자동 저장됩니다.)</Alert>
				</Snackbar>
			</Grid>
		);
}

export default Assignment;