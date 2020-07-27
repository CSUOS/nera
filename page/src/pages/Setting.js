import React from 'react';
import { Grid, Paper } from '@material-ui/core';
import {PageInfo} from '../components';

import SettingsIcon from '@material-ui/icons/Settings';

function Setting(props){
    return(
        <Grid container direction="column">
            <PageInfo className="assignment_info"
                icon={SettingsIcon}
                mainTitle="과제관리"
                subTitle="" />
            <Grid>
                <div className="assignment_rootbox">
                    <Paper className="assignment_box">
                        hi
                    </Paper>
                </div>
            </Grid>
        </Grid>
    );
}

export default Setting;