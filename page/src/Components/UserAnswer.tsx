import React, { useEffect, useState } from 'react';
import MarkdownViewer from './MarkdownViewer';

import { Grid, Typography, Paper, Divider, FormControl, MenuItem, InputLabel, Select, FormControlLabel, Box } from '@material-ui/core';
import { TextField } from '@material-ui/core';

type Props = {
	assignmentState: number;
	score: number;
	fullScore: number;
	answerContent?: string;
	userNumber: number;
	questionNumber: number;
	questionId: number;
	handleScoreChange: any;
}

const UserAnswer: React.FunctionComponent<Props> = props => {
	const [open, setOpen] = useState<boolean>(false);
	const [score, setScore] = useState<string>(props.score === -1 ? '' : props.score.toString());
	const [scoreItems, setScoreItems] = useState<any>(undefined);
	const isFinished = () => (props.assignmentState ? (props.assignmentState !== 0 && props.assignmentState !== 1) : false);

	const handleChange = (e: React.ChangeEvent<{value: string}>) => {
		if(!isFinished()) return;
		const value = parseInt(e.target.value);
		if(value > props.fullScore) {
			setScore("");
			alert(`최대 점수는 ${props.fullScore} 입니다.`);
		}
		else if(value < 0) {
			setScore("");
			alert(`0점 미만은 입력할 수 없습니다.`);
		}
		else {
			setScore(e.target.value);
			//props.onChange && props.onChange(props.questionId, props.userNumber, e.target.value); // 수정필요, input 이라 이벤트 계속 발생 
		}
	};

	return (
		<Paper className="answer_content" elevation={4}>
			<Grid container direction="column">
				<Typography gutterBottom variant="subtitle1">{`${props.userNumber}의 ${props.questionNumber}번 문제 답안`}</Typography>
				<Divider orientation="horizontal"></Divider>
				<MarkdownViewer source={props.answerContent ? props.answerContent : "*제출한 답안 없음*"}></MarkdownViewer>
				<Divider orientation="horizontal"></Divider>
				<Grid container direction="row" justify="center" alignItems="center" className="score_control">
					{isFinished() ?
						<React.Fragment>
							<Typography className="answer_score">점수(최대 {props.fullScore}점)</Typography>
							<TextField 
								className="answer_select"
								value={score}
								onChange={handleChange}
								onBlur={(e) => props.handleScoreChange(e.target.value)}
								placeholder="채점 안 됨"
							/>
						</React.Fragment>
						:
						<React.Fragment>
							<Typography className="answer_score">과제가 아직 마감되지 않았으므로 채점할 수 없습니다.</Typography>
						</React.Fragment>}
				</Grid>
			</Grid>
		</Paper>

	)
}

export default UserAnswer;