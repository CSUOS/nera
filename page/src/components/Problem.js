import { Grid, TextField } from '@material-ui/core';
import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Problem extends Component {
    render() {
        return (
            <Grid container className="problem_container" direction="column">
                <Grid container className="problem_description" direction="row" alignItems="flex-start" justify="flex-start">
                    <h6 className="problem_number">{this.props.number + "."}</h6>
                    <h6 align="left">{this.props.info["question_content"]}</h6>
                </Grid>

                <div>
                    <h6 className="problem_score" align="right">{this.props.info["full_score"]+"점"}</h6>
                </div>
                
                {this.props.image ? <img className="problem_image" src={this.props.image} alt="Problem Image"/> : null}

                <TextField label="답안" margin="normal" required multiline rows={1} rowsMax={10000}>sdfadfs</TextField>
            </Grid>
        );
    }
}

Problem.propTypes = {
    info: PropTypes.shape({
        "question_content": PropTypes.string,
        "full_score": PropTypes.number,
        "question_answer": PropTypes.arrayOf(PropTypes.shape({
            "answer": PropTypes.string,
            "submitted": PropTypes.bool,
            "score": PropTypes.number
        }))
    })
}

export default Problem;