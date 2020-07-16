import React, { Component } from 'react';
import { Grid, SvgIcon, Typography } from '@material-ui/core';

class PageInfo extends Component {
    render() {
        return (
            <div className="page_info">
                <Grid container spacing={24} direction="row" alignItems="center">
                    <SvgIcon component={this.props.icon} style={{width:80, height:80}} xs={6}></SvgIcon>
                    <Grid xs={6} container direction="column">
                        <Typography variant="h3">{this.props.mainTitle}</Typography>
                        <Typography variant="h6">{this.props.subTitle}</Typography>
                    </Grid>
                </Grid>
            </div>
        );
    }
}

export default PageInfo;