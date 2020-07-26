import React, { Component } from 'react';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import { PageInfo } from '.';

class AccountInfo extends Component {
    render() {
        const {name, number, type, major} = this.props;
        return (
            <PageInfo className="account_info"
                icon={AccountCircleIcon}
                mainTitle={name}
                subTitle={(type === 0 ? "교수" : "학생") + " / " + (type === 0? "" : this.props.number+" / ") + this.props.major} />
        );
    }
}

export default AccountInfo;