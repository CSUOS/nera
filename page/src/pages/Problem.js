import React from 'react';

const Problem = ({match})=>{
    return (
        <div>
            Problem #{match.params.index}
        </div>
    )
}

export default Problem