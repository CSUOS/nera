import React, { Component } from 'react';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import { PageInfo } from '.';

class AccountInfo extends Component {
    render() {
        return (
            <PageInfo className="account_info"
                icon={AccountCircleIcon}
                mainTitle={this.props.name}
                subTitle={this.props.kind + " / " + this.props.number + " / " + this.props.major} />
        );
    }
}

export default AccountInfo;