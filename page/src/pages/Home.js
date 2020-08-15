import React from 'react';
import {AccountInfo, AssignmentBox} from "../components";

import { Grid } from '@material-ui/core';

const Home = (props)=>{
    const {type, user_info, as_info} = props;
    let progress_assignment = [];
    let finish_assignment = [];
    const result = as_info.map((as)=>{
        if(type===0){ // 교수 => 0, 1이 마감 전 0 => 발행전, 1 => 진행 중
            switch(as[3]){
                case 0:
                    progress_assignment.push(as);
                    break;
                case 1:
                    progress_assignment.push(as);
                    break;
                case 2:
                    finish_assignment.push(as);
                    break;
            }
        }else if(type===1){ // 학생 => 0, 1이 마감 전
            switch(as[3]){
                case 0:
                    progress_assignment.push(as);
                    break;
                case 1:
                    progress_assignment.push(as);
                    break;
                case 2:
                    finish_assignment.push(as);
                    break;
                case 3:
                    finish_assignment.push(as);
                    break;
            }
        }
    });

    return (
        <Grid container direction="column" spacing={24}>
            <AccountInfo 
                name={user_info.name} 
                number={user_info.user_number} 
                type={type} 
                major = {user_info.major}
            />
            <Grid container direction="column" className="contents_con">   
                <Grid className="contents_title"><h6>{type===0?"마감 전 과제":"제출 가능한 과제" // 제목 수정 필요
                }</h6></Grid>
                <Grid className="assignment_rootbox">
                    {
                        progress_assignment.map((as)=>
                            <AssignmentBox
                                type={type}
                                as_info={as}
                                key={as[2]}
                            />
                        )
                    }
                </Grid>
            </Grid>
            <Grid container direction="column" className="contents_con">   
                <Grid className="contents_title"><h6>마감된 과제</h6></Grid>
                <Grid className="assignment_rootbox">
                    {
                        finish_assignment.map((as)=>
                            <AssignmentBox
                                type={type}
                                as_info={as}
                                key={as[2]}
                            />
                        )
                    }
                </Grid>
            </Grid>
        </Grid>
    )
}

export default Home