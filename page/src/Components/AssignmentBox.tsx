import React from 'react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';

import { Grid, Paper } from '@material-ui/core';

type Props = {
	type: string;
	asInfo: any; // asInfo: Assignment;
	state: {
		studentState: string,
		professorState: string,
		color: string
	}
}
const AssignmentBox = ({type, asInfo, state} : Props) => {
	const date = new Date(asInfo.deadline);
	const deadline = date.getFullYear() + "-"  + (date.getMonth()+1 <= 9 ? "0" : "") + (date.getMonth()+1) + "-" + (date.getDate() <= 9 ? "0" : "") + date.getDate() + " " + (date.getHours() <= 9 ? "0" : "") + date.getHours() + ":" + (date.getMinutes() <= 9 ? "0" : "") + date.getMinutes()

	return (
		<Link to ={`/as/${asInfo.assignmentId}`}>
			<Paper className="assignment-box" elevation={3}>
				<Grid className="a-box-header">
					<Grid className="a-box-title">{asInfo.assignmentName}</Grid>
					<Grid className={clsx(state.color, "color")}>{type === 'professor' ? state.professorState : state.studentState}</Grid>
				</Grid>	
				<Grid className="a-box-deadline">{deadline} 까지</Grid>
			</Paper>
		</Link>
	)
}

export default AssignmentBox;
