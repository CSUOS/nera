import React from 'react';
import { Grid, Paper } from '@material-ui/core';
import {PageInfo} from '../components';

import {Link} from 'react-router-dom';
import SettingsIcon from '@material-ui/icons/Settings';
import { Typography } from '@material-ui/core';
import AddCircleIcon from '@material-ui/icons/AddCircle';

// css 수정해야함

function Setting(props){
    const {as_info} = props;

    function getAssignmentBox(as){
        const id = as.assignment_id;
        const title = as.assignment_name;
        const state = as.assignment_state;
        let state_word="error";
        
        switch(state){
            case 0: state_word="마감 전"; break;
            case 1: state_word="채점 전"; break;
            case 2: state_word="채점 완료"; break;
            default: return;
        }

        return(
            <Link to={"/home/setting/"+id} className="s_assignment_box">
                <Paper>
                    <Typography>
                        {title} ({state_word})
                    </Typography>
                </Paper>
            </Link>
        );
    }

    return(
        <Grid container direction="column">
            <PageInfo className="assignment_info"
                icon={SettingsIcon}
                mainTitle="과제관리"
                subTitle="" />
            <Grid>
                <Grid className="s_assignment_rootbox">
                    {
                        as_info.map((as)=> getAssignmentBox(as))
                    }
                    <Grid>
                        <Link to="/home/setting/add">
                            <AddCircleIcon fontSize="large"/>
                        </Link>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
}

export default Setting;