import React, { useEffect, useState } from 'react';
import clsx from 'clsx';

import { Table, TableHead, TableBody, TableCell, TableContainer, TablePagination, TableRow, TableSortLabel, Toolbar, Typography, Paper, Checkbox}  from '@material-ui/core';
import { lighten, makeStyles } from '@material-ui/core/styles';
import { green, red } from '@material-ui/core/colors';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';

import EnhancedTableToolbar from './EnhancedTableToolbar';
import EnhancedTableHead from './EnhancedTableHead';
import { compareElements } from '../utils/sortRows';
import { AssignmentObj } from '../Main/Type';
import { TABLE__STUDENTS } from '../utils/constants';

function getComparator(order: 'asc'|'desc', orderBy: string) {
	return order === 'desc'
		? (a: any, b: any) => compareElements(a, b, orderBy)
		: (a: any, b: any) => -compareElements(a, b, orderBy);
}

function stableSort(array: any[], comparator: any) {
	const stabilizedThis = array.map((el, index) => [el, index]);
	stabilizedThis.sort((a, b) => {
		const order = comparator(a[0], b[0]);
		if (order !== 0) return order;
		return a[1] - b[1];
	});
	return stabilizedThis.map((el) => el[0]);
}

const useStyles = makeStyles((theme) => ({
	paper: {
		width: '100%',
		marginBottom: theme.spacing(2),
	},
	table: {
		minWidth: "500px",
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



const getIcon = (value: any) => {
	if (value === undefined)
		return "-";
	else if (value)
		return <CheckCircleOutlineIcon style={{ color: green[500] }} fontSize="small"/>;

	return <HighlightOffIcon style={{ color: red[500] }} fontSize="small"/>;
}

type Row = {
	userNumber: number;
	submitted?: boolean;
	marked?: boolean;
}


type Props = {
	onChange: any;
	answersDict: any;
	selectedQues: any[];
	assign: AssignmentObj;
}

const StudentSelector: React.FunctionComponent<Props> = ({onChange, assign, selectedQues, answersDict}) => {
	const classes = useStyles();
	const [selected, setSelected] = useState<number[]>([]); // state for all selected students
	const [rows, setRows] = useState<Row[]>([]);
	const [emptyRows, setEmptyRows] = useState<number>(0);
	const [order, setOrder] = useState<'asc'|'desc'>('asc');
	const [orderBy, setOrderBy] = useState<string>('questionNumber');
	const [page, setPage] = useState<number>(0);
	const [rowsPerPage, setRowsPerPage] = useState<number>(10);

	const handleRequestSort = (e: React.MouseEvent, property: string) => {
		const isAsc = orderBy === property && order === 'asc';
		setOrder(isAsc ? 'desc' : 'asc');
		setOrderBy(property);
	};

	const handleSelectAllClick = (e: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
		if(e.target.checked) {
			const newSelecteds = rows.map((n) => n.userNumber);
			setSelected(newSelecteds);
			onChange && onChange(newSelecteds);
		}
		else {
			setSelected([]);
			onChange && onChange([]);
		}

	};

	const isSelected = (userNumber: number) => selected.indexOf(userNumber) !== -1;
	const handleClick = (e: React.MouseEvent, userNumber: number) => {
		const selectedIndex = selected.indexOf(userNumber);
		let newSelected: any[] = [];

		if (selectedIndex === -1) {
			newSelected = newSelected.concat(selected, userNumber);
		} else if (selectedIndex === 0) {
			newSelected = newSelected.concat(selected.slice(1));
		} else if (selectedIndex === selected.length - 1) {
			newSelected = newSelected.concat(selected.slice(0, -1));
		} else if (selectedIndex > 0) {
			newSelected = newSelected.concat(
				selected.slice(0, selectedIndex),
				selected.slice(selectedIndex + 1),
			);
		}

		setSelected(newSelected);
		onChange && onChange(newSelected);	
	}

	useEffect(() => {
		setEmptyRows(rowsPerPage - Math.min(rowsPerPage, assign.students.length - page * rowsPerPage));
	}, [page]);

	useEffect(() => {
		const _: Row[] = assign.students.map((userNumber) => {
			if(!selectedQues || selectedQues.length ===0) {
				return {
					userNumber,
				}
			}
			else {
				const answers = answersDict[userNumber].answers;
				let submittedCount = 0;
				let markedCount = 0;
				for (const questionId of selectedQues) {
					const ansOfQues = answers.find((ans: any) => ans.questionId === questionId);
					if (ansOfQues.answerContent) {
						++submittedCount;
						markedCount += (ansOfQues.score === -1 ? 0 : 1);
					}
				}
				return {
					userNumber,
					submitted: submittedCount >0,
					marked: submittedCount > 0 ? submittedCount === markedCount : false,
				}
			}
		});

		setRows(_);
		return () => setRows([]);
	}, [assign, answersDict, selectedQues]);

	return (
		<Paper className={classes.paper} elevation={3}>
			<EnhancedTableToolbar numSelected={selected.length} type="student"/>
			<TableContainer>
				<Table
					className={classes.table}
					aria-labelledby="tableTitle"
					size="small"
					aria-label="students table"
				>
					<EnhancedTableHead
						classes={classes}
						numSelected={selected.length}
						order={order}
						orderBy={orderBy}
						onSelectAllClick={handleSelectAllClick}
						onRequestSort={handleRequestSort}
						rowCount={rows.length}
						headCells={TABLE__STUDENTS}
					/>
					<TableBody>
						{stableSort(rows, getComparator(order, orderBy))
							.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
							.map((row: any, index: any) => {
								const isItemSelected = isSelected(row.userNumber);
								const labelId = `student-table-checkbox-${index}`;

								return (
									<TableRow
										hover
										onClick={(event) => handleClick(event, row.userNumber)}
										role="checkbox"
										aria-checked={isItemSelected}
										tabIndex={-1}
										key={row.userNumber}
										selected={isItemSelected}
									>
										<TableCell padding="checkbox">
											<Checkbox
												checked={isItemSelected}
												inputProps={{ 'aria-labelledby': labelId }}
											/>
										</TableCell>
										<TableCell component="th" id={labelId} scope="row" padding="none">
											{row.userNumber}
										</TableCell>
										<TableCell>{getIcon(row.submitted)}</TableCell>
										<TableCell>{getIcon(row.marked)}</TableCell>
									</TableRow>
								);
							})}
						{emptyRows > 0 && (
							<TableRow style={{ height: 33 * emptyRows }}>
								<TableCell colSpan={6} />
							</TableRow>
						)}
					</TableBody>
				</Table>
			</TableContainer>
			<TablePagination
				rowsPerPageOptions={[5, 10, 25, 50, 100]}
				component="div"
				count={rows.length}
				rowsPerPage={rowsPerPage}
				page={page}
				onChangePage={(e, newpage) => {setPage(newpage);}}
				onChangeRowsPerPage={(e) => {
					setRowsPerPage(parseInt(e.target.value, 10));
					setPage(0);
				}}
			/>
		</Paper>
	);

}

export default StudentSelector;