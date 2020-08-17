import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Test1, Test2 } from '../pages';

const TestHome=({match})=>{
    const [data, setData] = useState();
    const [dataTwo, setDataTwo] = useState(2);

    useEffect(()=>{
        setData('hi');
    })

    let contents;
    let tmp = match.params.assignment;
    if(tmp=="test1"){
        contents = <Test1
            data = {data}
            dataTwo = {dataTwo}
        />
    }else if(tmp=="test2"){
        contents = <Test2
        data = {data}
        dataTwo = {dataTwo}
        />
    }
    function setOne(){
        setDataTwo(1);
    }
    return(
        <div>
            {contents}
            <button onClick={setOne}>setOne</button>
        </div>
    );
}

export default TestHome;