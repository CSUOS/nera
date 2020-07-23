import { Grid, TextField } from '@material-ui/core';
import React, { Component } from 'react';

class Problem extends Component {
    render() {
        return (
            <Grid container className="problem_container" direction="column">
                <Grid container className="problem_description" direction="row" alignItems="flex-start" justify="flex-start">
                    <h6 className="problem_number">{this.props.number + "."}</h6>
                    <p className="problem_text" align="left">{this.props.description}</p>
                </Grid>
                {this.props.image ? <img className="problem_image" src={this.props.image} alt="Problem Image"/> : null}

                <TextField label="답안" margin="normal" required multiline rows={3} rowsMax={10000}></TextField>
            </Grid>
        );
    }
}

export default Problem;