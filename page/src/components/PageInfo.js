import React, { Component } from 'react';
import { Grid, SvgIcon, Typography } from '@material-ui/core';

class PageInfo extends Component {
    render() {
        return (
            <Grid className="page_info">
                <Grid container spacing={24} direction="row" wrap="nowrap" alignItems="center">
                    <Grid item><SvgIcon component={this.props.icon} style={{width:80, height:80}}></SvgIcon></Grid>
                    <Grid container item direction="column">
                        <Typography variant="h3">{this.props.mainTitle}</Typography>
                        <Typography variant="h6">{this.props.subTitle}</Typography>
                    </Grid>
                </Grid>
                {this.props.information?<Grid item className="page_information"><p>{this.props.information}</p></Grid>:undefined}
            </Grid>
        );
    }
}

export default PageInfo;