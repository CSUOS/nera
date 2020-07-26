import React, { Component } from 'react';
import { PageInfo } from ".";
import PropTypes from 'prop-types';
import AssignmentIcon from '@material-ui/icons/Assignment';

class AssignmentInfo extends Component {

    getSubTitle = () => {
        let deadlineString = this.props.deadline.getFullYear() + "-" 
                         + (this.props.deadline.getMonth()+1 <= 9 ? "0" : "") + (this.props.deadline.getMonth()+1) + "-"
                         + this.props.deadline.getDate() + " "
                         + this.props.deadline.getHours() + ":"
                         + this.props.deadline.getMinutes()

        if (isNaN(this.props.score))
            return deadlineString + " 마감"
    }

    render() {
        return (
            <PageInfo className="assignment_info"
                icon={AssignmentIcon}
                mainTitle={this.props.title}
                subTitle={this.getSubTitle()} />
        );
    }
}

AssignmentInfo.propTypes = {
    title: PropTypes.string.isRequired,
    deadline: PropTypes.instanceOf(Date),
}

export default AssignmentInfo;