import React, { useEffect } from 'react';
import {Link} from 'react-router-dom';
import { Grid } from '@material-ui/core';

function Login(){
    let name = ""; let major = ""; let user_number = -1; let meta = {"create_at":Date(),"modified_at":Date()};

    // before rendering
    
    // 로그인 api 
    name = "우희은";
    user_number = 2017920038;
    meta["create_at"]="2020-08-03T01:09:49.742Z";
    meta["modified_at"]="2020-08-03T01:09:49.742Z";
    
    // major 계산
    let major_number = user_number.toString().substring(4,7);
    switch(major_number){
        case "920":
            major = "컴퓨터과학부";
            break;
        default:
            major = "~~~~부";
            break;
    }

    useEffect(()=>{

    });

    const path_name = "/home";
    return (
        <Grid className="Login">
            <Link to={{
                pathname:path_name,
                state:{
                    // 로그인 시 회원인증 서버에서 넘어오는 정보 넘기기
                    name: name,
                    major: major,
                    user_number: user_number,
                    meta: meta,
                }
            }}>
                <button>click</button>
            </Link>
        </Grid>
    );
}
export default Login