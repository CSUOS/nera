import React, { Component } from 'react';
import FormatListNumberedIcon from '@material-ui/icons/FormatListNumbered';
import { PageInfo } from '.';
import PropTypes from 'prop-types';

class PartInfo extends Component {
    getSubTitle = () => {
        return this.props.totalCount + 
                "문제 중 " + 
                this.props.solvedCount + 
                "문제 완료 (" + 
                (this.props.solvedCount / this.props.totalCount * 100) + 
                "%)"
    }

    render() {
        return (
            <PageInfo className="part_info"
                icon={FormatListNumberedIcon}
                mainTitle={this.props.title}
                subTitle={this.getSubTitle()} />
        );
    }
}

PartInfo.propTypes = {
    totalCount: PropTypes.number.isRequired,
    solvedCount: PropTypes.number.isRequired
}

export default PartInfo;