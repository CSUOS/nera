import React, { Component } from 'react';
import FormatListNumberedIcon from '@material-ui/icons/FormatListNumbered';
import { PageInfo } from '.';
import PropTypes from 'prop-types';

class ScoringInfo extends Component {
    render() {
        return (
            <PageInfo className="scoring_info"
                icon={FormatListNumberedIcon}
                mainTitle={`${this.props.userNumber}의 답안`}
                subTitle={`${this.props.asName}`}/>
        );
    }
}

export default ScoringInfo;