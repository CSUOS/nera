import React, { Component } from 'react';
import { PageInfo } from ".";
import PropTypes from 'prop-types';
import AssignmentIcon from '@material-ui/icons/Assignment';

const AssignmentInfo = (props) => {
    let { deadline, score, title } = props;
    deadline = new Date(deadline);

    const getSubTitle = () => {
        let deadlineString = deadline.getFullYear() + "-" 
                         + (deadline.getMonth()+1 <= 9 ? "0" : "") + (deadline.getMonth()+1) + "-"
                         + (deadline.getDate() <= 9 ? "0" : "") + deadline.getDate() + " "
                         + (deadline.getHours() <= 9 ? "0" : "") + deadline.getHours() + ":"
                         + (deadline.getMinutes() <= 9 ? "0" : "") + deadline.getMinutes()

        if (isNaN(score))
            return deadlineString + " 마감"
    }


    return (
        <PageInfo className="assignment_info"
            icon={AssignmentIcon}
            mainTitle={title}
            subTitle={getSubTitle()} />
    );
}

AssignmentInfo.propTypes = {
    title: PropTypes.string.isRequired,
    deadline: PropTypes.instanceOf(Date),
}

export default AssignmentInfo;