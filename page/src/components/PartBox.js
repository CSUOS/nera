import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Grid, Paper, Typography, Checkbox } from "@material-ui/core";
import { ButtonBase } from '@material-ui/core';
import LinearProgress from '@material-ui/core/LinearProgress';

const BorderLinearProgress = withStyles((theme) => ({
    root: {
      height: 10,
      borderRadius: 5,
    },
    colorPrimary: {
      backgroundColor: theme.palette.grey[theme.palette.type === 'light' ? 200 : 700],
    },
    bar: {
      borderRadius: 5,
      backgroundColor: '#1a90ff',
    },
  }))(LinearProgress);

class PartBox extends Component {
    

    render() {
        return (
            <div style={{width:"100%"}}>
                <ButtonBase className="mainButton" style={{width:"100%"}} href={this.props.link}>
                    <Paper style={{width:"100%"}} className="part_box">
                        <Grid container spacing={24}>
                            <Grid container xs="11" className="part_component">
                                <Typography className="lecture_title">{this.props.title}</Typography>
                            </Grid>
                            <Grid item xs="1" className="part_component">
                                <Checkbox></Checkbox>
                            </Grid>
                        </Grid>
                        <BorderLinearProgress variant="determinate" value={50} />
                    </Paper>
                </ButtonBase>
            </div>
        );
    }
}

export default PartBox;