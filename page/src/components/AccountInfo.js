import React, { Component } from 'react';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import { Grid, Typography } from '@material-ui/core';

class AccountInfo extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="account_info">
                <Grid container spacing={24} direction="row" alignItems="center">
                    <AccountCircleIcon style={{width:80, height:80}} xs={6}></AccountCircleIcon>
                    <Grid xs={6} container direction="column">
                        <Typography variant="h3">{this.props.name}</Typography>
                        <Typography variant="h6">{this.props.status}</Typography>
                    </Grid>
                </Grid>
            </div>
        );
    }
}

export default AccountInfo;