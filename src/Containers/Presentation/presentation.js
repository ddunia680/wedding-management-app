import React, { useState } from 'react';
import './presentation.css';
import i18next from 'i18next';
import { useTranslation } from 'react-i18next';
import ConfPresence from '../../Components/confirmPresenceUI/confPresence';
import { CSSTransition } from 'react-transition-group';

function Presentation(props) {
    const [IconfPresence, setConfPresence] = useState(false);
    const { t } = useTranslation();

    const changeLanguage = (e) => {
        i18next.changeLanguage(e.target.value);
    }

    return (
        <div className='h-[100vh] w-[100%] pt-[5rem] flex flex-col justify-center items-center'>
            <p className='text-gray-300 dark:text-black text-[25px] md:text-[30px] DancingScript font-bold'>{t('presentation1stLine')}</p>
            <h1 className='Pacifico text-[40px] md:text-[60px] text-fromBack  text-transparent bg-clip-text bg-gradient-to-r
                 from-marOrange via-white to-marOrange'>Julian <span className='text-marOrange'>&</span> Julianna</h1>
            <h4 className='text-gray-300 dark:text-black text-[25px] md:text-[30px] DancingScript font-bold'>{t('wedDate')}</h4>

            <button className='confirmB relative bg-marOrange w-[80%] md:w-auto text-white dark:text-darkLighterBlue p-[1rem] 
            rounded-lg' onKeyDown={() => console.log('touch button')} onClick={() => setConfPresence(true)}>
                {t('confirmPresence')}
            </button>

            <select className='absolute bg-transparent right-2 bottom-2 w-[6rem] px-[0.5rem] text-gray-100 md:text-gray-500 text-[13px] 
            duration-75 hover:backdrop-blur-md hover:cursor-pointer hover:backdrop-brightness-150 outline-none' 
            onChange={(e) => changeLanguage(e)}>
                    <option value='en'>English</option>
                    <option value='fr'>French</option>
            </select>
            <CSSTransition in={IconfPresence} classNames='alert' timeout={1000} mountOnEnter unmountOnExit >
                <ConfPresence IconfPresence={IconfPresence} setConfPresence={setConfPresence}/>
            </CSSTransition>            
        </div>
    );
}

export default Presentation;