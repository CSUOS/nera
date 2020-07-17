import React, {Component} from 'react';
import {PartInfo, Problem} from "../components";
import PropTypes from 'prop-types';
import SampleImage from '../sample_problem_image.png';

import { Button, Grid, Divider } from '@material-ui/core';

class Part extends Component {
    problemInfo = [
        {
            number: 1,
            description: "다음 급수를 간략하게 표현하여라.",
            image: SampleImage
        },
        {
            number: 2,
            description: "해시함수가 역함수를 가질 수 없음을 증명하여라.해시함수가 역함수를 가질 수 없음을 증명하여라.해시함수가 역함수를 가질 수 없음을 증명하여라.해시함수가 역함수를 가질 수 없음을 증명하여라.해시함수가 역함수를 가질 수 없음을 증명하여라.해시함수가 역함수를 가질 수 없음을 증명하여라.해시함수가 역함수를 가질 수 없음을 증명하여라.해시함수가 역함수를 가질 수 없음을 증명하여라.해시함수가 역함수를 가질 수 없음을 증명하여라.해시함수가 역함수를 가질 수 없음을 증명하여라.해시함수가 역함수를 가질 수 없음을 증명하여라.",
            image: undefined
        },
    ]

    getLastSaveDate = () => {
        let deadlineString = this.props.lastSaveDate.getFullYear() + "-" 
                         + (this.props.lastSaveDate.getMonth()+1) + "-"
                         + this.props.lastSaveDate.getDate() + " "
                         + this.props.lastSaveDate.getHours() + ":"
                         + this.props.lastSaveDate.getMinutes()

        if (isNaN(this.props.score))
            return deadlineString + " 에 저장함"
    }

    render() {
        return (
            <Grid container direction="column" spacing={24}>
                <PartInfo title={this.props.title} totalCount={this.props.totalCount} solvedCount={this.props.solvedCount}></PartInfo>
                <Grid container className="save_container" direction="row" alignItems="flex-start" justify="flex-end">
                    <h6 className="save_component">{this.getLastSaveDate()}</h6>
                    <Button className="save_component" variant="contained">저장</Button>
                </Grid>

                {this.problemInfo.map((prob, index)=>{
                    return (
                        <Problem number={prob.number} description={prob.description} image={prob.image}></Problem>
                    );
                })}
                
            </Grid>
        );
    }
}

Part.propTypes = {
    name: PropTypes.string.isRequired
}

export default Part;