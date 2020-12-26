import React from 'react';
import { Grid, CircularProgress } from '@material-ui/core';

function Loading(props) {
    return (
        <Grid container className="loading_contents" direction="column" alignItems="center" >
            <CircularProgress className="loading" size="6rem"></CircularProgress>
            <caption>{props.status}</caption>
        </Grid>
    );
}

export default Loading;