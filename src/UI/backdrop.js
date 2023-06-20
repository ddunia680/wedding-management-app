import React from 'react';

function Backdrop(props) {
    return (
        <div className='z-50 absolute top-0 left-0  w-[100%] h-[100%] bg-black bg-opacity-70' onClick={() => props.clicked}>
            
        </div>
    );
}

export default Backdrop;