import React, { useEffect, useState } from 'react';
import './presentation.css';
import i18next from 'i18next';
import { useTranslation } from 'react-i18next';
import ConfPresence from '../confirmPresenceUI/confPresence';
import { CSSTransition } from 'react-transition-group';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { ADDANOTIFICATION } from '../../store/notifHandler';
import io from '../../utility/socket';

function Presentation(props) {
    const location = useLocation();
    const dispatch = useDispatch();
    const [IconfPresence, setConfPresence] = useState(false);
    const theParam = location.pathname.slice(1, 50);
    const [theUser, setTheUser] = useState('');
    const { t } = useTranslation();

    const changeLanguage = (e) => {
        i18next.changeLanguage(e.target.value);
    }

    useEffect(() => {
        if(theParam) {
            axios.get(`${process.env.REACT_APP_BACKEND_URL}/guestInfo/${theParam}`)
            .then(res => {
                dispatch(ADDANOTIFICATION({notif: true, isError: false, notifMessage: res.data.message}));
                setTheUser(res.data.guest);
                io.init(process.env.REACT_APP_BACKEND_URL);
            })
            .catch(err => {
                dispatch(ADDANOTIFICATION({notif: true, isError: true, notifMessage: "Couldn't find guest"}));
                console.log(err.response.data.message);
            })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className='h-[100vh] w-[100%] pt-[5rem] flex flex-col justify-center items-center'>
            <p className='mytext text-white dark:text-black text-[25px] md:text-[30px] DancingScript font-bold backdrop-blur-md 
            dark:backdrop-brightness-150 backdrop-brightness-75 px-[1rem] rounded-tl-xl rounded-tr-xl rounded-bl-xl rounded-br-xl 
            md:rounded-bl-none md:rounded-br-none'>{t('presentation1stLine')}</p>
            <h1 className='Pacifico text-[40px] md:text-[60px] text-fromBack  text-transparent bg-clip-text bg-gradient-to-r
                 from-marOrange via-gray-700 to-marOrange backdrop-blur-md dark:backdrop-brightness-150 backdrop-brightness-75 
                 px-[1rem] rounded-tl-none rounded-tr-none rounded-br-xl rounded-bl-xl md:rounded-xl'>Julian <span className='text-marOrange'>&</span> Julianna</h1>
            <h4 className='mytext text-white dark:text-black text-[25px] md:text-[30px] DancingScript font-bold backdrop-blur-md 
            dark:backdrop-brightness-150 backdrop-brightness-75 px-[1rem] rounded-bl-xl rounded-br-xl'>{t('wedDate')}</h4>

            <button className='confirmB relative bg-marOrange w-[80%] md:w-auto text-white dark:text-darkLighterBlue mt-[1rem] p-[1rem] 
            rounded-lg shadow-lg shadow-black' onKeyDown={() => console.log('touch button')} onClick={() => { 
                theUser ? 
                setConfPresence(true) 
                : 
                dispatch(ADDANOTIFICATION({notif: true, isError: true, notifMessage: "Your are not a guest!"}));
                }}>
                {t('confirmPresence')}
            </button>

            <select className='absolute bg-transparent right-2 bottom-2 w-[6rem] px-[0.5rem] text-gray-700 text-[13px] 
            duration-75 hover:backdrop-blur-md hover:cursor-pointer hover:backdrop-brightness-150 outline-none' 
            onChange={(e) => changeLanguage(e)}>
                    <option value='en'>English</option>
                    <option value='fr'>French</option>
            </select>
            <CSSTransition in={IconfPresence} classNames='alert' timeout={1000} mountOnEnter unmountOnExit >
                <ConfPresence IconfPresence={IconfPresence} setConfPresence={setConfPresence} guest={theUser}/>
            </CSSTransition>            
        </div>
    );
}

export default Presentation;