import React, {useEffect, useState} from 'react';
import {AccountInfo, AssignmentBox} from "../components";

import { Grid } from '@material-ui/core';

const Home = (props)=>{
    const {type, userInfo, asInfo} = props;
    const [PAssignment, setPA] = useState([]); // progress
    const [FAssignment, setFA] = useState([]); // finish

    useEffect(()=>{
        const result = asInfo.map((as)=>{
            if(type===0){ // 교수 => 0, 1이 마감 전 0 => 발행전, 1 => 진행 중
                switch(as[3]){
                    case 0:
                        PAssignment.push(as);
                        break;
                    case 1:
                        PAssignment.push(as);
                        break;
                    case 2:
                        FAssignment.push(as);
                        break;
                }
            }else if(type===1){ // 학생 => 0, 1이 마감 전
                switch(as[3]){
                    case 0:
                        PAssignment.push(as);
                        break;
                    case 1:
                        PAssignment.push(as);
                        break;
                    case 2:
                        FAssignment.push(as);
                        break;
                    case 3:
                        FAssignment.push(as);
                        break;
                }
            }
        });
    }, [asInfo]);

    return (
        <Grid container direction="column" spacing={24}>
            <AccountInfo 
                name={userInfo.userName} 
                number={userInfo.userNumber} 
                type={type} 
                major = {userInfo.major}
            />
            <Grid container direction="column" className="contents_con">   
                <Grid className="contents_title"><h6>{type===0?"마감 전 과제":"제출 가능한 과제" // 제목 수정 필요
                }</h6></Grid>
                <Grid className="assignment_rootbox">
                    {
                        PAssignment.map((as)=>
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
                        FAssignment.map((as)=>
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