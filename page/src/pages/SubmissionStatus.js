import React, { Component } from 'react';
import { AssignmentInfo } from "../components";
import PropTypes from 'prop-types';

import { Grid, Paper, TableSortLabel } from '@material-ui/core';
import { TableRow, TableBody, IconButton, Table, TableHead, TableContainer, TablePagination, TableCell } from '@material-ui/core';
import CreateIcon from '@material-ui/icons/Create';

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

SortableTableHead.propTypes = {
    headCells: PropTypes.arrayOf(PropTypes.shape({
        "id": PropTypes.string,
        "label": PropTypes.string,
        "allowSorting": PropTypes.bool
    })),
    onRequestSort: PropTypes.func.isRequired,
    order: PropTypes.oneOf(['asc', 'desc']).isRequired,
    orderBy: PropTypes.string.isRequired,
};

const SubmittedRow = (props) => {
    const getLastSaveDate = () => {
        let timeString = props.time.getFullYear() + "-" 
                         + (props.time.getMonth()+1 <= 9 ? "0" : "") + (props.time.getMonth()+1) + "-"
                         + (props.time.getDate() <= 9 ? "0" : "") + props.time.getDate() + " "
                         + (props.time.getHours() <= 9 ? "0" : "") + props.time.getHours() + ":"
                         + (props.time.getMinutes() <= 9 ? "0" : "") + props.time.getMinutes()

        return timeString;
    }

    return (
        <TableRow>
            <TableCell>{props.userNumber}</TableCell>
            <TableCell>{props.name}</TableCell>
            <TableCell>{getLastSaveDate()}</TableCell>
            <TableCell>{props.score}</TableCell>
            <TableCell>
                <IconButton aria-label="채점 페이지로" size="small" href={`/home/scoring/${props.asId}/${props.userNumber}`}>
                    <CreateIcon></CreateIcon>
                </IconButton>
            </TableCell>
        </TableRow>
    );
}

const SubmittedTable = (props) => {
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [orderBy, setOrderBy] = React.useState('userNumber');
    const [order, setOrder] = React.useState("asc");

    const calcAverageScore = () => {
        let sum = 0
        for (const row of props.rowData)
            sum += row.score;
        return sum / props.rowData.length;
    }

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

    const headCells = [
        {
            "id": "userNumber",
            "label": "학번",
            "allowSorting" : true
        },
        {
            "id": "name",
            "label": "이름",
            "allowSorting" : true
        },
        {
            "id": "time",
            "label": "제출한 시간",
            "allowSorting" : true
        },
        {
            "id": "score",
            "label": "부여된 점수",
            "allowSorting" : true
        },
        {
            "id": "mark",
            "label": "채점하기",
            "allowSorting" : false
        }
    ];

    return (
        <Paper className="table_root">
            <TableContainer>
                <Table>
                    <caption>{`평균 점수는 ${calcAverageScore()}점 입니다.`}</caption>
                    <SortableTableHead 
                        headCells={headCells} 
                        onRequestSort={handleRequestSort} 
                        order={order} 
                        orderBy={orderBy}></SortableTableHead>

                    <TableBody>
                        {sortRows(props.rowData, order, orderBy)
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((row) => (
                            <SubmittedRow 
                                asId={props.asId} 
                                userNumber={row.userNumber} 
                                name={row.name} 
                                time={row.time} 
                                score={row.score}></SubmittedRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[5, 10, 25, 50, 100]}
                component="div"
                count={props.rowData.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onChangePage={handleChangePage}
                onChangeRowsPerPage={handleChangeRowsPerPage}
            />
        </Paper>
    );
}

const NotSubmittedRow = (props) => {
    return (
        <TableRow>
            <TableCell>{props.userNumber}</TableCell>
            <TableCell>{props.name}</TableCell>
        </TableRow>
    );
}

const NotSubmittedTable = (props) => {
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
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const headCells = [
        {
            "id": "userNumber",
            "label": "학번",
            "allowSorting" : true
        },
        {
            "id": "name",
            "label": "이름",
            "allowSorting" : true
        }
    ];

    return (
        <Paper className="table_root">
            <TableContainer>
                <Table>
                <SortableTableHead 
                        headCells={headCells} 
                        onRequestSort={handleRequestSort} 
                        order={order} 
                        orderBy={orderBy}></SortableTableHead>

                    <TableBody>
                        {sortRows(props.rowData, order, orderBy)
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((row) => (
                            <NotSubmittedRow userNumber={row.userNumber} name={row.name}></NotSubmittedRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[5, 10, 25, 50, 100]}
                component="div"
                count={props.rowData.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onChangePage={handleChangePage}
                onChangeRowsPerPage={handleChangeRowsPerPage}
            />
        </Paper>
    );
}

const SubmissionStatus = (props) => {
    
    const getLatestModified = (ansArray) => {
        let result = ansArray[0].meta.modified_at;

        for (let i = 1; i < ansArray.length; ++i)
            if (result < ansArray[i].meta.modified_at)
                result = ansArray[i].meta.modified_at;
        
        return result;
    }

    const getSumOfScores = (ansArray) => {
        let result = 0;

        for (let i = 0; i < ansArray.length; ++i)
            result += ansArray[i].score;
        
        return result;
    }

    let submittedData = []
    let notSubmittedData = []
    let answerDict = {}
    
    for (const num of props.info.students)
        answerDict[num] = []

    for (const ques of props.info.questions)
        for (const answer of ques.question_answer)
            answerDict[answer.user_number].push(answer);
    
    for (const [num, ansArray] of Object.entries(answerDict))
    {
        let submittedCount = 0;
        for (const answer of ansArray)
            if (answer.submitted)
                ++submittedCount;
        
        if (submittedCount == props.info.questions.length)
        {
            submittedData.push({
                userNumber: num,
                name: ansArray[0].name,
                time: getLatestModified(ansArray),
                score: getSumOfScores(ansArray)
            });
        }
        else
        {
            notSubmittedData.push({
                userNumber: num,
                name: ansArray[0].name
            });
        }
    }

    return (
        <Grid container direction="column" spacing={24}>
            <AssignmentInfo title={props.info["assignment_name"]} deadline={props.info["deadline"]} />

            <Grid container direction="column" className="contents_con">
                <Grid className="contents_title"><h6>제출한 수강생</h6></Grid>
                <SubmittedTable asId={props.info["assignment_id"]} rowData={submittedData}></SubmittedTable>
            </Grid>
            <Grid container direction="column" className="contents_con">
                <Grid className="contents_title"><h6>제출하지 않은 수강생</h6></Grid>
                <NotSubmittedTable asId={props.info["assignment_id"]} rowData={notSubmittedData}></NotSubmittedTable>
            </Grid>
        </Grid>
    );
}

SubmissionStatus.defaultProps = {
    info: PropTypes.shape({
        "assignment_id": PropTypes.number,
        "assignment_name": PropTypes.string,
        "deadline": PropTypes.instanceOf(Date),
        "assignment_state": PropTypes.number,
        "assignment_info": PropTypes.string,
        "full_score": PropTypes.number,
        "score": PropTypes.number,
        "students": PropTypes.arrayOf(PropTypes.number),
        "questions": PropTypes.arrayOf(PropTypes.shape({
            "question_id": PropTypes.number,
            "question_content": PropTypes.string,
            "full_score": PropTypes.number,
            "question_answer": PropTypes.arrayOf(PropTypes.shape({
                "user_number": PropTypes.number,
                "question_id": PropTypes.number,
                "name": PropTypes.string,
                "answer_content": PropTypes.arrayOf(PropTypes.string),
                "submitted": PropTypes.bool,
                "score": PropTypes.number,
                "meta": {
                    "create_at": PropTypes.instanceOf(Date),
                    "modified_at": PropTypes.instanceOf(Date)
                }
            })),
            "meta": {
                "create_at": PropTypes.instanceOf(Date),
                "modified_at": PropTypes.instanceOf(Date)
            }
        })),
        "meta": {
            "create_at": PropTypes.instanceOf(Date),
            "modified_at": PropTypes.instanceOf(Date)
        }
    })
}

export default SubmissionStatus;