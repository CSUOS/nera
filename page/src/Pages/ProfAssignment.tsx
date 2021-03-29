import axios from "axios";
import React, { useEffect, useState } from 'react';
import { Grid, Divider, Typography } from '@material-ui/core';
import AssignmentIcon from '@material-ui/icons/Assignment';
import InfoIcon from '@material-ui/icons/Info';

import { PageInfo, ScoreStats, QuestionSelector, StudentSelector, MarkdownViewer, UserAnswer } from '../Components';
import { useAssignmentDispatch, useAssignmentState, useSelectedAssignState, useSelectedDispatch } from "../Main/Model/AssignmentModel";
import { RouteComponentProps } from "react-router-dom";
import { modifiedDateToString } from '../utils';
import { AssignmentObj } from "../Main/Type";
import { useAnswerState, saveAnswer } from "../Main/Model/AnswerModel";

/*
필요한 action
- FETCH Assignment
- FETCH Answers

*/
type MatchParams = {
	asId?: string;
}

type Question = number;

type Student = number;

type DictElement = {
	userNumber: number;
	answers: any[];
	meta: any;
}

type AnswersDict = {
	[key: number]: DictElement;
}

const PropAssignment: React.FC<RouteComponentProps<MatchParams>> = ({match}) => {
	const selectedAssign = useSelectedAssignState();
	const answers = useAnswerState();
	const setSelected = useSelectedDispatch();
	const [answersDict, setAnswersDict] = useState<AnswersDict|null>(null);
	const [selectedQues, setSelectedQues] = useState<Question[]>([]);
	const [selectedStus, setSelectedStus] = useState<Student[]>([]);
	const saveAnswerFun = saveAnswer();

	useEffect(() => {
		if(match.params.asId) {
			setSelected(Number(match.params.asId));
		}
		else {
			setSelected(undefined);
		}
	}, [match.params.asId]);

	useEffect(() => {
		if(!selectedAssign || answers.length === 0) return;
		const dict: {[key: number]: DictElement;} = {};
		answers.forEach(({userNumber, answers, meta}, idx) => {
			dict[userNumber] = {
				userNumber,
				answers,
				meta,
			}
		})
		setAnswersDict(dict);
	}, [selectedAssign, answers]);
	
	function getSubTitle(as: AssignmentObj) {
		// modifiedDateToString 이용하도록 수정함
		const deadlineString = modifiedDateToString(new Date(as.deadline));
		return deadlineString + " 마감";
	}
	

	const handleScoreChange = (answer: any, userNumber: number) => {
		return (score: number) => {
			if(!score) return;
			console.log(selectedAssign);
			saveAnswerFun([{
				...answer,
				score,
			}])
		}
	};
	const getQueryResult = (ques: Question[], stus: Student[]) => {
		const NotExistComponent = <Typography variant="h6" className="query_caption">답안을 조회할 문제 목록과 학생 목록을 선택해주세요!</Typography>;
		const ErrorComponent = <Typography variant="h6" className="query_caption">문제를 조회하는 동안 오류가 발생하였습니다.</Typography>;
		if(!ques.length || !stus.length || !selectedAssign) {
			return NotExistComponent;
		}
		try {
			const questions = ques.sort();
			const students = stus.sort();
			const questionsSet = new Set(questions);
			const Result = selectedAssign.questions.map((question, idx) => {
				if(questionsSet.has(question.questionId)) { // if question selected
					const _ = students.map((studentId, stuidx) => {
						const answer = answersDict && answersDict[studentId]?.answers?.find((item: any) => item.questionId === question.questionId);
						return (
							<UserAnswer 
								key={stuidx}
								assignmentState={selectedAssign.assignmentState}
								score={answer ? answer.score : -1}
								fullScore={question.fullScore}
								answerContent={answer && answer.answerContent}
								userNumber={studentId}
								questionNumber={idx+1}
								questionId={question.questionId}
								handleScoreChange={handleScoreChange(answer, studentId)}
							/>
						)
					})
					return (
						<Grid key={idx} container className="problem_container" direction="column">
							<Grid container className="problem_description" direction="row" alignItems="flex-start" justify="flex-start">
								<h6 className="problem_number">{idx+1 + "."}</h6>
								<MarkdownViewer source={question.questionContent}></MarkdownViewer>
							</Grid>
							{_}
						</Grid>
					)
				}
			})
			return Result;
		} catch(err) {
			return ErrorComponent;
		}
	};

	if(!selectedAssign) {
		return <div>수정 필요</div>
	}
	return (
		<Grid container direction="column">
			<PageInfo 
				icon="📚"
				mainTitle={selectedAssign.assignmentName as string}
				subTitle={getSubTitle(selectedAssign)}
				information={<p>학생들의 답안 제출 현황을 확인하고 과제가 마감되었다면 학생들의 답안들을 채점할 수 있습니다.</p>}
			/>
			<Grid container direction="column" className="contents-container">
				<Grid className="contents-title">
					<h6>점수 통계</h6>
				</Grid>
				<Grid container item direction="row" className="page_additional_info" alignItems="center">
					<InfoIcon color="primary" />
					<p>{"'채점 완료 여부'는 그 학생이 제출한 답안들을 모두 채점하였느냐를 의미합니다."}</p>
				</Grid>
				<Grid item xs>
					{<ScoreStats assign={selectedAssign} answersDict={answersDict}></ScoreStats>}
				</Grid>
			</Grid>
			<Grid container direction="column" className="contents-container">
				<Grid className="contents-title">
					<h6>답안 확인 및 채점</h6>
				</Grid>
				<Grid container item direction="row" className="page_additional_info" alignItems="center">
					<InfoIcon color="primary" />
					<p>아래 두 표에서 확인하려는 문제의 목록과, 확인하려는 학생의 목록을 각각 선택하면 이에 해당하는 모든 답안이 쿼리되어 아래에 나열됩니다.<br/>그리고 각각에 대한 점수를 부여할 수 있으며 변경사항은 자동 저장됩니다.</p>
				</Grid>
				<Grid className="selector-container" container spacing={3} direction="row" wrap="wrap" alignItems="center">
					<Grid item xs>
						<QuestionSelector key={selectedAssign.assignmentId} assign={selectedAssign} onChange={(selected: any) => {setSelectedQues(selected);}} />
					</Grid>
					<Grid item xs>
						<StudentSelector key={selectedAssign.assignmentId} assign={selectedAssign} answersDict={answersDict} selectedQues={selectedQues} onChange={(selected: any) => {setSelectedStus(selected);}} />
					</Grid>
				</Grid>
				<Divider />
				{getQueryResult(selectedQues, selectedStus)}
			</Grid>
		</Grid>

	)
}

export default PropAssignment;