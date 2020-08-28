import React from 'react';
import { Grid } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';

function Loading(props) {
    return (
        <Grid container className="loading_contents" direction="column" alignItems="center" >
            <CircularProgress className="loading" size="6rem"></CircularProgress>
            <caption>{props.status}</caption>
        </Grid>
    );
}

export default Loading;