import React, { useEffect, useState, Dispatch } from 'react';

import { Grid, Divider, Paper, Typography } from '@material-ui/core';

import { MarkdownViewer, MarkdownEditor } from '.';
import { useSelectedAssignState } from '../Main/Model/AssignmentModel';
import { answerType, QuestionObj } from '../Main/Type';

type answerObj = {
	answerContent: string;
	score: number;
}

type questionProps = {
	answer : answerType;
	setAnswer : Dispatch<answerType>;
	setStatus : Dispatch<string>;
	question : QuestionObj;
	index : number;
}

const StudentQuestion = ({ answer, setAnswer, setStatus, question, index } : questionProps) => {
	const [scoreText, setScoreText] = useState<string[]>(["",""]); // 배점, 실제 점수
	const [eachAnswer, setEachAnswer] = useState<answerObj | undefined>();
	const selectedAssign = useSelectedAssignState();

	useEffect(()=>{
		// 선택된 과제가 있고, question에 해당하는 answer가 있으면
		if(!selectedAssign || !answer[question.questionId]){
			setEachAnswer(undefined);
			return;
		}
		
		// answer 세팅
		setEachAnswer(answer[question.questionId]);

		// scoretext 세팅
		if (selectedAssign.assignmentState === 3)
			setScoreText(["", `${answer[question.questionId].score === -1 ? 0 : answer[question.questionId].score}점/${question.fullScore}점`]);
		else
			setScoreText([`${question.fullScore}점`, ""]);
	}, [answer[question.questionId], selectedAssign]);


	const saveEachAnswer = async (str : string) => {
		const tmp = answer;
		answer[question.questionId].answerContent = str;
		await setAnswer(tmp);
		setStatus("답안 저장 필요");
	}

	return (
		<Grid className="problem-container">
			<Grid className="problem-question">
				<h4 className="p-title">문제 {index+1}<p>{scoreText[0] && `(${scoreText[0]})`}</p></h4>
				<Grid className="viewer">
					<MarkdownViewer source={question.questionContent}/>
				</Grid>
			</Grid>
			{
				// 0 : 공개 전 / 1 : 제출 중 / 2: 채점 중 / 3 : 채점 완료
				selectedAssign && eachAnswer && 
					<Grid className="problem-answer">
						<h4 className="p-title">답안<p>{scoreText[1] && `(${scoreText[1]})`}</p></h4>
						{
							selectedAssign.assignmentState === 1?
								<MarkdownEditor onChange={saveEachAnswer} contents={eachAnswer.answerContent} />
								:
								<Grid className="viewer answer">
									<MarkdownViewer source={ eachAnswer.answerContent ? eachAnswer.answerContent : "*제출한 답안 없음*"}/>
								</Grid>
						}
					</Grid>
			}
		</Grid>
	);
}

export default StudentQuestion;