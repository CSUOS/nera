import React, { useState, useEffect } from 'react';
import { sortRows } from '../utils'
import { TABLE__SCORE } from '../utils/constants';
import { makeStyles } from '@material-ui/core/styles';
import { Box, Collapse, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, TablePagination, Paper, TableSortLabel } from '@material-ui/core';
import SortedTableHead from './SortedTableHead';
import ScoreStatsRow from './ScoreStatsRow';
import { AssignmentObj } from '../Main/Type';

const useStyles = makeStyles((theme) => ({
	paper: {
		width: '100%',
		marginBottom: theme.spacing(2),
	},
	table: {
		minWidth: "800px",
	},
	visuallyHidden: {
		border: 0,
		clip: 'rect(0 0 0 0)',
		height: 1,
		margin: -1,
		overflow: 'hidden',
		padding: 0,
		position: 'absolute',
		top: 20,
		width: 1,
	},
}));

type Row = {
	userNumber: number;
	submittedCount: number;
	markedCount: number;
	scoreSum: number;
	allMarked: boolean;
	scores: {
		questionNumber: number;
		questionId: number;
		marked: boolean;
		score: number;
	}[];
}
type Props = {
  assign?: AssignmentObj;
  answersDict?: any;
}
const ScoreStats = ({assign, answersDict} : Props) => {
	const [order, setOrder] = useState<string>("asc");
	const [orderBy, setOrderBy] = useState<string>('userNumber');
	const [page, setPage] = useState<number>(0);
	const [rowsPerPage, setRowsPerPage] = useState<number>(5);
	const [rows, setRows] = useState<Row[]>([]);
	const handleRequestSort = (e: React.MouseEvent, id: any) => {
		const isAsc = orderBy === id && order === "asc";
		setOrder(isAsc ? "desc" : "asc");
		setOrderBy(id);
	}

	const getAverageScore = (rows: Row[]) => rows.reduce((acc, cur) => acc + cur.scoreSum,0)

	useEffect(() => {
		if(!assign || !answersDict) return;
		const _ = assign.students.map((userNumber) => {
			const singleRow: Row = {
				userNumber,
				submittedCount: 0,
				markedCount: 0,
				scoreSum: 0,
				allMarked: true,
				scores: [],
			};
			let submitted = 0, marked= 0, scoreSum =0;
			const answerOfQuesId: any = {};
			answersDict[userNumber].answers.filter((answer: any) => answer.answerContent).forEach((answer: any) => {
				submitted++;
				if(answer.score !== -1) { // 채점 ㅇ
					++marked;
					scoreSum += answer.score;
				}
				answerOfQuesId[answer.questionId] = answer;
			})

			singleRow.submittedCount = submitted;
			singleRow.markedCount = marked;
			singleRow.scoreSum = scoreSum;
			singleRow.allMarked = submitted === marked;
			
			const scores = [];
			let questionNumber = 1;
			for (const ques of assign.questions) {
				if (ques.questionId in answerOfQuesId) {
					scores.push({
						questionNumber: questionNumber,
						questionId: ques.questionId,
						marked: answerOfQuesId[ques.questionId].score >= 0,
						score: (answerOfQuesId[ques.questionId].score < 0 ? 0 : answerOfQuesId[ques.questionId].score)
					});
				}
				questionNumber++;
			}
			singleRow.scores = scores;
			return singleRow;
		});
		setRows(_);
	}, [assign, answersDict]);

	
	return (
		<Paper className="score_stats" elevation={3}>
			<TableContainer component={Paper}>
				<Table className="score_stats_table" aria-label="score stats table" size="small">
					<caption>{`평균 점수는 ${getAverageScore(rows)}점 입니다.`}</caption>
					<SortedTableHead 
						headCells={TABLE__SCORE}
						onRequestSort={handleRequestSort}
						order={order}
						orderBy={orderBy}
					/>
					<TableBody>
						{sortRows(rows, order, orderBy)
							.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
							.map((row: any) => (
								<ScoreStatsRow key={row.userNumber} row={row} />
							))}
					</TableBody>
				</Table>
			</TableContainer>
			{
				<TablePagination
					rowsPerPageOptions={[5, 10, 25, 50, 100]}
					component="div"
					count={rows.length}
					rowsPerPage={rowsPerPage}
					page={page}
					onChangePage={(e, newValue) => {setPage(newValue)}}
					onChangeRowsPerPage={(e) => {
						setRowsPerPage(parseInt(e.target.value, 10));
						setPage(0);
					}}
				/>}
		</Paper>
	)
}




export default ScoreStats;