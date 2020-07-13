import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { ButtonBase } from '@material-ui/core';
import BookIcon from '@material-ui/icons/Book';

class LectureBox extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const classes = {
            root: {
                width: "100%"
            },
            paper: {
                width: "100%"
            },
            buttonBase: {
                width: "100%"
            }
        };

        return (
            <div style={classes.root} className="lecture_box">
                <ButtonBase className="mainButton" style={classes.buttonBase} href={this.props.link}>
                    <Paper style={classes.paper}>
                        <Grid container spacing={24}>
                            <Grid container xs="10" className="lecture_component">
                                <Grid container direction="row" spacing={0}>
                                    <BookIcon className="lecture_icon"/>
                                    <Typography className="lecture_title">{this.props.title}</Typography>
                                </Grid>
                            </Grid>
                            <Grid item xs="2" className="lecture_component">
                                <Typography className="profName" align="right">{this.props.prof}</Typography>
                            </Grid>
                        </Grid>
                    </Paper>
                </ButtonBase>
            </div>
        );
    }
}

export default LectureBox;