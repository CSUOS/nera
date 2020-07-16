import React, { Component } from 'react';
import BookIcon from '@material-ui/icons/Book';
import { PageInfo } from '.';

class LectureInfo extends Component {
    render() {
        return (
            <PageInfo className="lecture_info"
                icon={BookIcon}
                mainTitle={this.props.title}
                subTitle={this.props.prof} />
        );
    }
}

export default LectureInfo;