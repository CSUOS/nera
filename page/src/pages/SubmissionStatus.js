import React, { Component } from 'react';
import { AssignmentInfo } from "../components";
import PropTypes from 'prop-types';

import { Grid, Paper } from '@material-ui/core';
import { TableRow, TableBody, IconButton, Table, TableHead, TableContainer, TablePagination, TableCell } from '@material-ui/core';
import CreateIcon from '@material-ui/icons/Create';

const submittedData = [
    {
        id: "2019920017",
        name: "김정현",
        time: new Date('2020-08-01T10:23:00'),
        score: "100",
    },
    {
        id: "2019920018",
        name: "박정현",
        time: new Date('2020-08-01T10:23:00'),
        score: "100",
    },
    {
        id: "2019920019",
        name: "이정현",
        time: new Date('2020-08-01T10:23:00'),
        score: "100",
    },
    {
        id: "2019920020",
        name: "최정현",
        time: new Date('2020-08-01T10:23:00'),
        score: "100",
    }
];

const notSubmittedData = [
    {
        id: "2019920017",
        name: "김정현",
    },
    {
        id: "2019920018",
        name: "박정현",
    },
    {
        id: "2019920019",
        name: "이정현",
    },
    {
        id: "2019920020",
        name: "최정현",
    },
];

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
            <TableCell>{props.id}</TableCell>
            <TableCell>{props.name}</TableCell>
            <TableCell>{getLastSaveDate()}</TableCell>
            <TableCell>{props.score}</TableCell>
            <TableCell>
                <IconButton aria-label="채점 페이지로" size="small" href={"/home/scoring/" + props.asId}>
                    <CreateIcon></CreateIcon>
                </IconButton>
            </TableCell>
        </TableRow>
    );
}

const SubmittedTable = (props) => {
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [orderBy, setOrderBy] = React.useState('id');

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
                        {sortRows(props.rowData).map((row) => (
                            <SubmittedRow asId={props.asId} id={row.id} name={row.name} time={row.time} score={row.score}></SubmittedRow>
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
            <TableCell>{props.id}</TableCell>
            <TableCell>{props.name}</TableCell>
        </TableRow>
    );
}

const NotSubmittedTable = (props) => {
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

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
                        {props.rowData.map((row) => (
                            <NotSubmittedRow id={row.id} name={row.name}></NotSubmittedRow>
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

class SubmissionStatus extends Component {
    render() {
        return (
            <Grid container direction="column" spacing={24}>
                <AssignmentInfo title={this.props.info["assignment_name"]} deadline={this.props.info["deadline"]} />

                <Grid container direction="column" className="contents_con">
                    <div className="contents_title"><h6>제출한 수강생</h6></div>
                    <SubmittedTable asId={this.props.info["assignment_id"]} rowData={submittedData}></SubmittedTable>
                </Grid>
                <Grid container direction="column" className="contents_con">
                    <div className="contents_title"><h6>제출하지 않은 수강생</h6></div>
                    <NotSubmittedTable asId={this.props.info["assignment_id"]} rowData={notSubmittedData}></NotSubmittedTable>
                </Grid>
            </Grid>
        );
    }
}

SubmissionStatus.defaultProps = {
    info: PropTypes.shape({
        "assignment_id": PropTypes.number,
        "assignment_name": PropTypes.string,
        "deadline": PropTypes.instanceOf(Date),
        "assignment_state": PropTypes.number,
        "full_score": PropTypes.number,
        "score": PropTypes.number,
        "question": PropTypes.arrayOf(PropTypes.shape({
            "question_contents": PropTypes.string,
            "question_points": PropTypes.number,
            "question_answer": PropTypes.arrayOf(PropTypes.shape({
                "answer": PropTypes.string,
                "submitted": PropTypes.bool,
                "score": PropTypes.number
            }))
        }))
    })
}

export default SubmissionStatus;