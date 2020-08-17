import React from 'react';
import { Link } from 'react-router-dom';

export default function Test2(props){

    return(
        <div>
            test2
            {props.data}
            {props.dataTwo}
            <Link to="/home/test1">test1</Link>
            <Link to="/home/test2">test2</Link>
        </div>
    );
}