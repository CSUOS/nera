import React, {Component} from 'react';
import {AssignmentInfo, Problem} from "../components";
import PropTypes from 'prop-types';

import { Button, Grid } from '@material-ui/core';

class Assignment extends Component {

    render() {
        return (
            <Grid container direction="column" spacing={24}>
                <div className="assignment_page_header">
                    <div className="assignment_page_title">
                        <AssignmentInfo title={this.props.info["assignment_name"]} deadline={this.props.info["deadline"]}></AssignmentInfo>
                    </div>
                    <div className="save_container">
                        <Grid container direction="row" alignItems="flex-start" justify="flex-end">
                            <h6 className="save_component">변경사항 저장 안 됨</h6>
                            <Button className="save_component" variant="contained">저장</Button>
                        </Grid>
                    </div>
                </div>

                {this.props.info["question"].map((prob, index)=>{
                    return (
                        <Problem number={index+1} info={prob} marked={this.props.info["assignment_state"]}></Problem>
                    );
                })}

            </Grid>
        );
    }
}

Assignment.propTypes = {
    info: PropTypes.shape({
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

export default Assignment;