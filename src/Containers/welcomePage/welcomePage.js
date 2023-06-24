import React from 'react';
import Header from '../../Components/Header/header';
import Presentation from '../../Components/Presentation/presentation';

function WelcomePage(props) {
    return (
        <div className='w-[100%] h-[100%]'>
            <Header/>
            <Presentation/>
        </div>
    );
}

export default WelcomePage;