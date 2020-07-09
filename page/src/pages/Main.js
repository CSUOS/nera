import React from 'react';

const Main = ({match})=>{
    return (
        <div>
            Main ({match.params.admin})
        </div>
    )
}

export default Main