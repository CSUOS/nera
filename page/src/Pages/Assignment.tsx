import React, { ReactNode, useEffect, useState } from 'react';
import { RouteComponentProps } from "react-router";

import { Grid, Button } from '@material-ui/core';
import InfoIcon from '@material-ui/icons/Info';

import { PageInfo, Loading, SaveSnackbar, StudentQuestion, MarkdownViewer } from "../Components";
import { useSelectedAssignState, useSelectedDispatch } from '../Main/Model/AssignmentModel';
import { useAnswerState, saveAnswer } from '../Main/Model/AnswerModel';
import { AnswerObj, QuestionObj, answerType } from '../Main/Type';
import { modifiedDateToString } from '../utils';

interface MatchParams {
	asId?: string | undefined;
}

// Assignment 페이지
const Assignment: React.FC<RouteComponentProps<MatchParams>> = ({ match }) => {
	const setSelected = useSelectedDispatch();
	const selectedAssign = useSelectedAssignState();
	const answerState = useAnswerState();
	const saveAnswerFunc = saveAnswer();

	const [status, setStatus] = useState<string>("변경사항 없음");
	const [answer, setAnswer] = useState<answerType | undefined>(undefined);

	useEffect(() => {
		match.params.asId ?
			setSelected(Number(match.params.asId)) :
			setSelected(undefined);
	}, [match.params.asId]);

	/*
	let mutex = 0;

	// ctrl + s 버튼 구현
	window.addEventListener("keydown", async (event: KeyboardEvent) => {
		if (!selectedAssign || selectedAssign.assignmentState !== 1)
			return;
		if(mutex)
			return;
		if ((window.navigator.platform.match("Mac") ? event.metaKey : event.ctrlKey) && event.keyCode === 83) {
			mutex = await 1;
			event.preventDefault();
			await saveAnswers();
			mutex = await 0;
		}
	}, false);
	*/

	useEffect(() => {
		// answer를 이용하기 좋은 형태로 변환
		transFormAnswer();
	}, [answerState]);

	const getInfoText = (): string => {
		// 0 : 공개 전 / 1 : 제출 중 / 2: 채점 중 / 3 : 채점 완료
		if (!selectedAssign)
			return "";
		if (selectedAssign.assignmentState === 1) {
			return "Markdown 및 LaTeX(KaTeX) 형식으로 과제를 작성하고 저장할 수 있습니다. Ctrl+S를 누르거나 우측 하단 저장 버튼을 눌러 수동 저장할 수 있습니다.";
		} else if (selectedAssign.assignmentState === 3) {
			return "이전에 제출한 답안들의 채점 결과를 확인할 수 있습니다."
		} else {
			return "과제가 채점 중입니다. 확인할 수 없는 기간입니다."
		}
	}

	const giveHelperSite = (): ReactNode => {
		// 수강생들을 도울 링크
		return (
			<Grid className="info-btn-con" container alignItems="center" justify="space-between" wrap="wrap">
				<Button color="primary" variant="contained">
					<a target="blank" href="https://www.markdownguide.org/basic-syntax/">👉 마크다운 문법</a>
				</Button>
				<Button color="primary" variant="contained">
					<a target="blank" href="https://katex.org/docs/supported.html">👉 LaTex 문법</a>
				</Button>
				<Button color="primary" variant="contained">
					<a target="blank" href="https://powergee.github.io/simple-markdown-editor/">👉 작성 예시</a>
				</Button>
			</Grid>
		)
	}

	const transFormAnswer = () => {
		// array to map (key: questionId)
		const tmp: answerType = {};
		if(answerState[0] && selectedAssign){
			// 학생은 배열에 1개의 답안obj 만이 있음
			answerState[0].answers.forEach((a : AnswerObj) => {
				tmp[a.questionId] = {
					answerContent: a.answerContent,
					// 채점 전이면 score -1
					score: a.score ? a.score : -1
				}
			});
			setAnswer(tmp);
		} else setAnswer(undefined);
	}

	const saveAnswers = async () => {
		console.log("save Answers in Assignment");
		await setStatus("답안 저장 중...");
		if(!answer){
			console.log("answer 없음");
			return;
		}
		// save answer
		// map to array
		const tmp: Array<AnswerObj> = [];
		Object.keys(answer).forEach((qId) => {
			tmp.push({
				questionId: Number(qId),
				answerContent: answer[Number(qId)].answerContent
			});
		});
		await saveAnswerFunc(tmp);
		await setStatus("변경 사항 없음");
	}

	return (
		<>
			{
				// answer와 선택된 과제 모두 준비되면 rendering
				!selectedAssign ?
					<Loading status="과제 정보를 가져오는 중..." /> :
					<>
						<SaveSnackbar 
							onClickFun={saveAnswers} 
							modifiedDateStr={modifiedDateToString(answerState[0]?.meta?.modifiedAt)}
							status={status}
						/>
						<Grid className="assignment-page-header">
							<Grid className="assignment-page-title">
								<PageInfo
									icon="📚"
									mainTitle={selectedAssign.assignmentName}
									subTitle={`${modifiedDateToString(selectedAssign.deadline)}까지`}
									information={<MarkdownViewer source={selectedAssign.assignmentInfo} />}
									rightSide={giveHelperSite()}
								/>
							</Grid>
						</Grid>
						<Grid className="page-additional-info" >
							<InfoIcon color="primary" />
							<p>{getInfoText()}</p>
						</Grid>
						{
							<div className="assignment_info_container">
								{selectedAssign.questions.map(
									(question: QuestionObj, index: number) =>
										answer &&
										<StudentQuestion
											key={question.questionId}
											answer={answer}
											setAnswer={setAnswer}
											setStatus={setStatus}
											question={question}
											index={index}
										/>
								)}
							</div>
						}
					</>
			}
		</>
	);
}

export default Assignment;