import React, { Component } from 'react';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import { PageInfo } from '.';

class AccountInfo extends Component {
    getSubTitle() {
        if (this.props.type === 0)
            return `교수 / ${this.props.number}`;
        else
            return `학생 / ${this.props.number} / ${this.props.major}`;
    }

    render() {
        return (
            <PageInfo className="account_info"
                icon={AccountCircleIcon}
                mainTitle={this.props.name}
                subTitle={this.getSubTitle()}/>
        );
    }
}

export default AccountInfo;