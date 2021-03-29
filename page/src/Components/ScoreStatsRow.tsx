import React, { useState } from 'react';

import { Box, Collapse, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, TablePagination, Paper, TableSortLabel } from '@material-ui/core';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import { green, red } from '@material-ui/core/colors';

type Props = {
	row: any;
}

const ScoreStatsRow = ({row} : Props) => {
	const [open, setOpen] = useState<boolean>(false);
	return (
		<>
			<TableRow>
				<TableCell>
					<IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
						{open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
					</IconButton>
				</TableCell>
				<TableCell component="th" scope="row">
					{row.userNumber}
				</TableCell>
				<TableCell>{row.submittedCount}</TableCell>
				<TableCell>{row.markedCount}</TableCell>
				<TableCell>
					{row.allMarked ? 
						<CheckCircleOutlineIcon style={{ color: green[500] }}/> :
						<HighlightOffIcon style={{ color: red[500] }}/>}
				</TableCell>
				<TableCell>{row.scoreSum}</TableCell>
			</TableRow>
			<TableRow>
				<TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
					<Collapse in={open} timeout="auto" unmountOnExit>
						<Box margin={1}>
							<Typography variant="h6" gutterBottom component="div">
								문제별 점수
							</Typography>
							<Table size="small" aria-label="score">
								<caption>학생이 답안을 제출하지 않은 문제는 표시되지 않습니다.</caption>
								<TableHead>
									<TableRow>
										<TableCell>문제 번호</TableCell>
										<TableCell>문제 ID</TableCell>
										<TableCell>채점 여부</TableCell>
										<TableCell>점수</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{row.scores.map((scoreRow: any) => (
										<TableRow key={scoreRow.questionNumber}>
											<TableCell component="th" scope="row">
												{scoreRow.questionNumber}
											</TableCell>
											<TableCell>{scoreRow.questionId}</TableCell>
											<TableCell>
												{scoreRow.marked ?
													<CheckCircleOutlineIcon style={{ color: green[500] }} fontSize="small"/> :
													<HighlightOffIcon style={{ color: red[500] }} fontSize="small"/>}
											</TableCell>
											<TableCell>{scoreRow.score}</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</Box>
					</Collapse>
				</TableCell>
			</TableRow>
		</>
	)
}

export default ScoreStatsRow;