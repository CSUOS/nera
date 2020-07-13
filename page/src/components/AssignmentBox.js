import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Checkbox from '@material-ui/core/Checkbox';
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

const AssignmentBox = (props)=>{

    return(
        <div className="assignment_box">
            <div className="a_box_title">Assignment #3</div>
            <div className="a_box_contents">
                <ul className="a_box_contents_ul">
                    <li><p>Part 1 (문제 풀이)</p><Checkbox/></li>
                    <li><p>Part 1 (문제 풀이)</p><Checkbox/></li>
                </ul>
            </div>
            <BorderLinearProgress variant="determinate" value={50} />
        </div>
    );
}

export default AssignmentBox