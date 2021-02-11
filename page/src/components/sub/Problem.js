import React, { useEffect } from 'react';

import { MarkdownViewer, MarkdownEditor } from '../';
import { Grid, Divider, Paper, Typography } from '@material-ui/core';

const Problem = (props) => {
	const [initialText, setInitialText] = React.useState("");
	const [scoreText, setScoreText] = React.useState("");

	useEffect(()=>{
		setInitialText(props.info.answerContent);
		if (props.info.assignmentState === 3)
			setScoreText(`${props.info.score === -1 ? 0 : props.info.score}/${props.info.fullScore}점`);
		else
			setScoreText(`${props.info.fullScore}점`);
	}, [JSON.stringify(props.info)]);
    
	const handleTextChange = (value) => {
		props.onEdit(value, props.info.questionId);
	}

	return (
		<Grid container className="problem_container" direction="column">
			<Grid container className="problem_description" direction="row" alignItems="flex-start" justify="flex-start">
				<h6 className="problem_number">{props.info.questionNumber + "."}</h6>
				<MarkdownViewer className="problem_description_viewer" source={props.info.questionContent}></MarkdownViewer>
			</Grid>

			<h6 className="problem_score" align="right">{scoreText}</h6>

			{props.info.assignmentState === 1 ? 
				<MarkdownEditor onChange={handleTextChange} contents={initialText}></MarkdownEditor> 
				: 
				<Paper className="answer_content">
					<Grid direction="column">
						<Typography gutterBottom variant="subtitle1">제출하였던 답안</Typography>
						<Divider orientation="horizontal"></Divider>
						<MarkdownViewer source={initialText ? initialText : "*제출한 답안 없음*"}></MarkdownViewer>
					</Grid>
				</Paper>
			}
		</Grid>
	);
}

export default Problem;