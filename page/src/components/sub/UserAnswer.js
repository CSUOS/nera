import React, { useEffect } from 'react';
import { MarkdownViewer } from '../';

import { Grid, Typography, Paper, Divider, FormControl, MenuItem, InputLabel, Select, FormControlLabel, Box } from '@material-ui/core';

const UserAnswer = (props) => {
	const [open, setOpen] = React.useState(false);
	const [score, setScore] = React.useState(undefined);
	const [scoreItems, setScoreItems] = React.useState(undefined);

	function isFinished() {
		if (!props.assignmentState)
			return false;

		return props.assignmentState !== 0 && props.assignmentState !== 1;
	}

	useEffect(() => {
		setScore(props.score);
		let items = [<MenuItem key={-1} value={-1}>{"채점 안 됨"}</MenuItem>];

		if (props.answerContent !== undefined && isFinished()) {
			for (let s = 0; s <= props.fullScore; ++s) {
				items.push(<MenuItem key={props.questionId} value={s}>{`${s}점`}</MenuItem>);
			}
		}
		setScoreItems(items);
	}, [props]);

	function handleClose() {
		setOpen(false);
	}

	function handleOpen() {
		setOpen(true);
	}

	function handleChange(event) {
		if (!isFinished())
			return;

		setScore(event.target.value);
		if (props.onChange)
			props.onChange(props.questionId, props.userNumber, event.target.value);
	}

	if (scoreItems === undefined)
		return <div></div>;
	else
		return (
			<Paper className="answer_content" elevation={4}>
				<Grid direction="column">
					<Typography gutterBottom variant="subtitle1">{`${props.userNumber}의 ${props.questionNumber}번 문제 답안`}</Typography>
					<Divider orientation="horizontal"></Divider>
					<MarkdownViewer source={props.answerContent ? props.answerContent : "*제출한 답안 없음*"}></MarkdownViewer>
					<Divider orientation="horizontal"></Divider>
					<Grid container direction="row" justify="center" alignItems="center" className="score_control">
						{isFinished() ?
							<React.Fragment>
								<Typography className="answer_score">점수</Typography>
								<Select
									className="answer_select"
									value={score}
									open={open}
									onClose={handleClose}
									onOpen={handleOpen}
									onChange={handleChange}
								>
									{scoreItems}
								</Select>
							</React.Fragment>
							:
							<React.Fragment>
								<Typography className="answer_score">과제가 아직 마감되지 않았으므로 채점할 수 없습니다.</Typography>
							</React.Fragment>}
					</Grid>
				</Grid>
			</Paper>
		);
}

export default UserAnswer;