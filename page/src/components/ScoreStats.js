import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import TablePagination from '@material-ui/core/TablePagination';
import Paper from '@material-ui/core/Paper';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import { green, red } from '@material-ui/core/colors';
import { Loading } from '.';

const compareElements = (a, b, orderBy) => {
    if (a[orderBy] < b[orderBy])
        return -1;
    else if (a[orderBy] > b[orderBy])
        return 1;
    else
        return 0;
}

const sortRows = (rows, order, orderBy) => {
    const mappedList = rows.map((element, index) => [element, index]);
    mappedList.sort((a, b) => {
        let compared = compareElements(a[0], b[0], orderBy);
        return order === "asc" ? compared : -compared;
    });
    return mappedList.map((el) => el[0]);
}

const SortableTableHead = (props) => {
    const getSortHandler = (property) => (event) => {
        props.onRequestSort(event, property);
    };

    return (
        <TableHead>
            <TableRow>
                <TableCell />
                {props.headCells?.map((headCell) => (
                    <TableCell 
                        key={headCell.id}
                        sortDirection={props.orderBy === headCell.id ? props.order : false}>
                        
                        {headCell.allowSorting ? (
                            <TableSortLabel
                                active={props.orderBy === headCell.id}
                                direction={props.orderBy === headCell.id ? props.order : "asc"}
                                onClick={getSortHandler(headCell.id)}>
                                
                                {headCell.label}
                                {props.orderBy === headCell.id ? (
                                    <span>
                                        {props.order === "desc" ? "(내림차순)" : "(오름차순)"}
                                    </span>
                                ) : null}
                            </TableSortLabel>
                        ) : headCell.label}

                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    )
}

function ScoreStatsRow(props) {
    const { row } = props;
    const [open, setOpen] = React.useState(false);

    return (
        <React.Fragment>
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
                                    {row.scores.map((scoreRow) => (
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
        </React.Fragment>
    );
}

const headCells = [
    {
        id: "userNumber",
        label: "학번",
        allowSorting: true
    },
    {
        id: "submittedCount",
        label: "제출한 문제 수",
        allowSorting: true
    },
    {
        id: "markedCount",
        label: "채점한 문제 수",
        allowSorting: true
    },
    {
        id: "allMarked",
        label: "채점 완료 여부",
        allowSorting: true
    },
    {
        id: "scoreSum",
        label: "총 점수",
        allowSorting: true
    }
];

function ScoreStats(props) {
    const [rows, setRows] = useState(undefined);
    const [error, setError] = useState(false);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [orderBy, setOrderBy] = React.useState('userNumber');
    const [order, setOrder] = React.useState("asc");

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === "asc";
        setOrder(isAsc ? "desc" : "asc");
        setOrderBy(property);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    useEffect(() => {
        setRows(undefined);
        setError(false);
        setPage(0);
        setRowsPerPage(5);
        setOrderBy("userNumber");
        setOrder("asc");
        
        try {
            let rowArray = [];
            for (const userNumber of props.assign.students) {
                let singleRow = {};
                singleRow.userNumber = userNumber;
                let submitted = 0, marked = 0, scoreSum = 0;
                let answerOfQuesId = {};

                for (const answer of props.answersDict[userNumber].answers){
                    ++submitted;
                    if (answer.score !== -1) {
                        ++marked;
                        scoreSum += answer.score;
                    }
                    answerOfQuesId[answer.questionId] = answer;
                }
                singleRow.submittedCount = submitted;
                singleRow.markedCount = marked;
                singleRow.scoreSum = scoreSum;
                singleRow.allMarked = submitted === marked;

                let scores = [];
                let questionNumber = 1;
                for (const ques of props.assign.questions) {
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
                rowArray.push(singleRow);
            }
            setRows(rowArray);
        } catch (err) {
            setError(true);
        }
    }, [props.answersDict, props.assign]);

    if (error)
        return <Typography variant="h6">데이터를 가져올 수 없었습니다.</Typography>
    else if (rows === undefined)
        return <Loading status="데이터를 준비하는 중..."></Loading>
    return (
        <Paper>
            <TableContainer component={Paper}>
                <Table aria-label="score stats table" size="small">
                    <SortableTableHead
                        headCells={headCells}
                        onRequestSort={handleRequestSort}
                        order={order}
                        orderBy={orderBy}></SortableTableHead>
                    <TableBody>
                        {sortRows(rows, order, orderBy)
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((row) => (
                                <ScoreStatsRow key={row.userNumber} row={row} />
                            ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[5, 10, 25, 50, 100]}
                component="div"
                count={rows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onChangePage={handleChangePage}
                onChangeRowsPerPage={handleChangeRowsPerPage}
            />
        </Paper>
    );
}

export default ScoreStats;