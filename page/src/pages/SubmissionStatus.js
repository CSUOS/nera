import React, { Component, useEffect, useState } from 'react';
import { AssignmentInfo, Loading } from "../components";
import PropTypes from 'prop-types';

import { Grid, Paper, TableSortLabel } from '@material-ui/core';
import { TableRow, TableBody, IconButton, Table, TableHead, TableContainer, TablePagination, TableCell } from '@material-ui/core';
import CreateIcon from '@material-ui/icons/Create';
import axios from "axios";
import { useHistory } from "react-router-dom";
import { rejects } from 'assert';

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
            <TableCell>{getLastSaveDate()}</TableCell>
            <TableCell>{props.filled}</TableCell>
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
        if (props.rowData.length == 0)
            return 0;

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
            "id": "time",
            "label": "제출한 시간",
            "allowSorting" : true
        },
        {
            "id": "filled",
            "label": "작성한 문제 수",
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
                                filled={row.filled}
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
            {Object.keys(props).map(key => <TableCell>{props[key]}</TableCell>)}
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
                            <NotSubmittedRow userNumber={row.userNumber}></NotSubmittedRow>
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
    const [info, setInfo] = useState(undefined);
    const [infoDate, setInfoDate] = useState(undefined);
    const [answersDict, setAnswersDict] = useState(undefined);
    const [answersDictDate, setAnswersDictDate] = useState(undefined);
    const [submitted, setSubmitted] = useState(undefined);
    const [notSubmitted, setNotSubmitted] = useState(undefined);
    const history = useHistory();

    const getSumOfScores = (ansArray) => {
        let result = 0;

        for (let i = 0; i < ansArray.length; ++i) {
            if (ansArray[i].score === -1)
                continue;
            result += ansArray[i].score;
        }
        
        return result;
    }

    const getAssignment = () => {
        let assignId = props.match.params.asId;

        axios.get(`/v1/assignment/${assignId}`, { withCredentials: true })
            .then(res => {
                console.log(res);
                setInfo(res.data);
                setInfoDate(new Date());
            })
            .catch(err => {
                const status = err.response.status;
                if (status === 400 || status === 401) {
                    alert(`과제 정보를 얻는데 실패하였습니다. 잘못된 요청입니다. (${status})`);
                }
                else if (status === 404) {
                    alert("과제를 찾을 수 없습니다.");
                }
                else if (status === 500) {
                    alert("내부 서버 오류입니다. 잠시 후에 다시 시도해주세요...");
                }
                history.push("/home");
            });
    }

    const getAnswers = () => {
        if (info === undefined)
            return;

        let assignId = props.match.params.asId;

        let promises = [];
        console.log(info)
        for (let stuNum of info.students) {
            let prom = axios.get(`/v1/answer/${assignId}/${stuNum}`, { withCredentials: true })
                .catch(err => {
                    if (err.response.status === 404) {
                        // 단순히 입력한 답안이 없는 경우이므로 오류는 아님.
                        return {
                            "data" : {
                                "userNumber": stuNum,
                                "answers": [],
                                "meta": {
                                    "createAt": undefined,
                                    "modifiedAt": undefined
                            
                                }
                            }
                        }
                    }
                    else rejects(err);
                });
                
            promises.push(prom);
        }

        Promise.all(promises)
            .then(arrOfRes => {
                let dict = {}
                for (const res of arrOfRes)
                    dict[res.data.userNumber] = res.data;
                setAnswersDict(dict);
                setAnswersDictDate(new Date());
            })
            .catch(err => {
                const status = err.response.status;
                if (status === 400) {
                    alert(`답안 정보를 얻는데 실패하였습니다. 잘못된 요청입니다. (${status})`);
                }
                else if (status === 401) {
                    alert(`답안 정보를 얻는데 실패하였습니다. 인증이 실패하였습니다. (${status})`);
                }
                else if (status === 403) {
                    alert(`답안 정보를 얻는데 실패하였습니다. 권한이 없습니다. (${status})`);
                }
                else {
                    alert("내부 서버 오류입니다. 잠시 후에 다시 시도해주세요...");
                }

                history.push("/home");
            });
    }

    useEffect(() => {
        setSubmitted(undefined);
        setNotSubmitted(undefined);
        getAssignment();
    }, [props.match.params.asId]);

    useEffect(() => {
        getAnswers();
    }, [infoDate]);

    useEffect(() => {
        let submittedData = [];
        let notSubmittedData = [];

        for (const number in answersDict) {
            let filledCount = 0;
            console.log(answersDict[number])
            for (const answer of answersDict[number].answers)
                if (answer.answerContent)
                    ++filledCount;

            if (filledCount > 0) {
                submittedData.push({
                    userNumber: number,
                    time: new Date(answersDict[number].meta.modifiedAt),
                    filled: filledCount,
                    score: getSumOfScores(answersDict[number].answers)
                });
            } else {
                notSubmittedData.push({
                    userNumber: number,
                });
            }

            setSubmitted(submittedData);
            setNotSubmitted(notSubmittedData);
        }
    }, [answersDictDate]);

    if (submitted === undefined || notSubmitted === undefined)
        return (<Loading status="학생 답안 정보를 불러오는 중..."></Loading>);
    else 
        return (
            <Grid container direction="column">
                <AssignmentInfo title={info.assignmentName} deadline={info.deadline} />

                <Grid container direction="column" className="contents_con">
                    <Grid className="contents_title"><h6>제출한 수강생</h6></Grid>
                    <SubmittedTable asId={info.assignmentId} rowData={submitted}></SubmittedTable>
                </Grid>
                <Grid container direction="column" className="contents_con">
                    <Grid className="contents_title"><h6>제출하지 않은 수강생</h6></Grid>
                    <NotSubmittedTable asId={info.assignmentId} rowData={notSubmitted}></NotSubmittedTable>
                </Grid>
            </Grid>
        );
}

/*SubmissionStatus.defaultProps = {
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
}*/

export default SubmissionStatus;