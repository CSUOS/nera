import React, { Component } from 'react';
import { AssignmentInfo } from "../components";

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
    },
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
                         + (props.time.getMonth()+1) + "-"
                         + props.time.getDate() + " "
                         + props.time.getHours() + ":"
                         + props.time.getMinutes()

        return timeString;
    }

    return (
        <TableRow>
            <TableCell>{props.id}</TableCell>
            <TableCell>{props.name}</TableCell>
            <TableCell>{getLastSaveDate()}</TableCell>
            <TableCell>{props.score}</TableCell>
            <TableCell>
                <IconButton aria-label="채점 페이지로" size="small">
                    <CreateIcon></CreateIcon>
                </IconButton>
            </TableCell>
        </TableRow>
    );
}

const SubmittedTable = (props) => {
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

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
                            <TableCell>제출한 시간</TableCell>
                            <TableCell>부여된 점수</TableCell>
                            <TableCell></TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {props.rowData.map((row) => (
                            <SubmittedRow id={row.id} name={row.name} time={row.time} score={row.score}></SubmittedRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[10, 25, 50, 100]}
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
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

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
                rowsPerPageOptions={[10, 25, 50, 100]}
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
                <AssignmentInfo title={this.props.title} deadline={this.props.deadline} />

                <Grid container direction="column" className="contents_con">
                    <div className="contents_title"><h6>제출한 수강생</h6></div>
                    <SubmittedTable rowData={submittedData}></SubmittedTable>
                </Grid>
                <Grid container direction="column" className="contents_con">
                    <div className="contents_title"><h6>제출하지 않은 수강생</h6></div>
                    <NotSubmittedTable rowData={notSubmittedData}></NotSubmittedTable>
                </Grid>
            </Grid>
        );
    }
}

SubmissionStatus.defaultProps = {
    title: "기본 제목",
    deadline: new Date('1970-01-01T11:59:00')
}

export default SubmissionStatus;