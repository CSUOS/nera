import React from 'react';
import {AccountInfo, AssignmentBox} from "../components";
import {Link} from 'react-router-dom';

import { Grid } from '@material-ui/core';

const Home = (props)=>{
    const {type, main_info, as_info} = props;
    let progress_assignment = [];
    let finish_assignment = [];

    as_info.map((as)=>{
        if(type===0){ // 교수 => 0만 마감 전
            switch(as[3]){
                case 0:
                    progress_assignment.push(as);
                    break;
                case 1:
                    finish_assignment.push(as);
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
    })
    

    return (
        <Grid container direction="column" spacing={24}>
            <AccountInfo 
                name={main_info.name} 
                number={main_info.student_number} 
                type={main_info.type} 
                major = {main_info.major}
            />
            <Grid container direction="column" className="contents_con">   
                <div className="contents_title"><h6>{type===0?"마감 전 과제":"제출 가능한 과제" // 제목 수정 필요
                }</h6></div>
                <div className="assignment_rootbox">
                    {
                        progress_assignment.map((as)=>
                            <AssignmentBox
                                type={main_info.type}
                                as_info={as}
                            />
                        )
                    }
                </div>
            </Grid>
            <Grid container direction="column" className="contents_con">   
                <div className="contents_title"><h6>마감된 과제</h6></div>
                <div className="assignment_rootbox">
                    {
                        finish_assignment.map((as)=>
                            <AssignmentBox
                                type={main_info.type}
                                as_info={as}
                            />
                        )
                    }
                </div>
            </Grid>
        </Grid>
    )
}

export default Home