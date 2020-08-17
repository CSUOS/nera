import React from 'react';
import { Route, Link } from 'react-router-dom';
import { Test2 } from '../pages';

const Test1=(props)=>{
    return(
        <div>
            test1
            {props.data}
            {props.dataTwo}
            <Link to="/home/test1">test1</Link>
            <Link to="/home/test2">test2</Link>
        </div>
    );
}

export default Test1;