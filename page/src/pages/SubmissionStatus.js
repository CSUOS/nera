import React, { Component } from 'react';
import { AssignmentInfo } from "../components";
import PropTypes from 'prop-types';

import { Grid, Paper } from '@material-ui/core';
import { TableRow, TableBody, IconButton, Table, TableHead, TableContainer, TablePagination, TableCell } from '@material-ui/core';
import CreateIcon from '@material-ui/icons/Create';

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

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const compareElements = (a, b) => {
        if (a[orderBy] < b[orderBy])
            return -1;
        else if (a[orderBy] > b[orderBy])
            return 1;
        else
            return 0;
    }

    const sortRows = (rows) => {
        const mappedList = rows.map((element, index) => [element, index]);
        mappedList.sort((a, b) => {
            return compareElements(a[0], b[0]);
        });
        return mappedList.map((el) => el[0]);
    }

    return (
        <Paper className="table_root">
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>학번</TableCell>
                            <TableCell>이름</TableCell>
                            <TableCell>제출한 시간</TableCell>
                            <TableCell>부여된 점수</TableCell>
                            <TableCell>채점하기</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {sortRows(props.rowData)
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

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const compareElements = (a, b) => {
        if (a[orderBy] < b[orderBy])
            return -1;
        else if (a[orderBy] > b[orderBy])
            return 1;
        else
            return 0;
    }

    const sortRows = (rows) => {
        const mappedList = rows.map((element, index) => [element, index]);
        mappedList.sort((a, b) => {
            return compareElements(a[0], b[0]);
        });
        return mappedList.map((el) => el[0]);
    }

    return (
        <Paper className="table_root">
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>학번</TableCell>
                            <TableCell>이름</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {sortRows(props.rowData)
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
    
    console.log(props.info.students);
    for (const num of props.info.students)
        answerDict[num] = []

    console.log(props.info.questions);
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