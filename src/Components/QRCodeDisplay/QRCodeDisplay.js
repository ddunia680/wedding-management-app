import React, { useEffect, useState } from 'react';
import Header from '../Header/header';
import Lottie from 'lottie-react';
import rings from '../../Gifs/weddingRing.json';
import Spinner2 from '../../utility/spinner2/spinner2';
import { Trans, useTranslation } from 'react-i18next';
import i18next from 'i18next';
import QRCode from 'react-qr-code';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { ADDANOTIFICATION } from '../../store/notifHandler';

function QRCodeDisplay(props) {
    const { t } = useTranslation();
    const location = useLocation();
    const dispatch = useDispatch();
    const name = 'Dunia Dunia';
    const theParam = location.pathname.slice(10, 40);
    const [loadingState, setLoadingState] = useState(false);
    const [QRString, setQRString] = useState('');
    // console.log(theParam);

    const changeLanguage = (e) => {
        i18next.changeLanguage(e.target.value);
    }

    useEffect(() => {
        setLoadingState(true);
        axios.get(`${process.env.REACT_APP_BACKEND_URL}/getQREncryptionString/${theParam.trim()}`)
        .then(res => {
            setLoadingState(false);
            setQRString(res.data.string);
        })
        .catch(err => {
            console.log(err);
            setLoadingState(false);
            dispatch(ADDANOTIFICATION({notif: true, isError: true, notifMessage: err.response.data.message}))
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className='flex flex-col justify-center items-center w-[100vw] h-[100vh] space-y-[1rem]'>
            <Header/>
            <h1 className='Pacifico font-bolder text-2xl md:text-4xl text-fromBack  text-transparent bg-clip-text bg-gradient-to-r from-marOrange
             via-gray-700 to-marOrange backdrop-blur-md dark:backdrop-brightness-150 backdrop-brightness-75 px-[1rem] py-[0.5rem] 
             md:py-[1rem] rounded-2xl'> Welcome to this Wedding!!!</h1>
             {/* invite container */}
             <div className='w-[90%] xl:w-[70%] backdrop-blur-md dark:backdrop-brightness-75 backdrop-brightness-150 h-[70%] md:h-[67%] rounded-2xl 
             flex flex-col md:flex-row space-y-[2rem] justify-between items-center p-[1rem] overflow-y-scroll'>
                {/* Invitation text */}
                <div className='w-[100%] md:w-[50%] bg-gradient-to-br from-marOrange to-red-600 shadow-2xl shadow-black rounded-2xl flex 
                flex-col justify-center items-center text-white dark:text-darkLighterBlue p-[1rem] text-[15px] md:text-[20px]'>
                    <h3 className='DancingScript text-[35px] font-bold flex justify-start items-center'>
                    <Lottie animationData={rings} className='w-[2rem]'/>Invitation<Lottie animationData={rings} className='w-[2rem]'/></h3>
                    <p className='DancingScript'><Trans components={{ b: <strong/> }} >{t('inviteP1', { name: name }) }</Trans></p>
                    <p className='DancingScript'><Trans components={{ b: <strong/> }}>inviteP2</Trans></p>
                    <p className='DancingScript'>{t('inviteP3')}</p>
                    <p className='DancingScript self-end'>{t('inviteP4')}</p>
                </div>

                {/* the QR code */}
                <div className='w-[80%] md:w-[40%] flex flex-col justify-center items-center bg-white p-[1rem] space-y-[1rem] rounded-2xl'>
                    { loadingState ? 
                    <div className='bg-slate-400 dark:bg-slate-500 p-[0.5rem] rounded-2xl'><Spinner2/></div> : 
                    QRString ?
                    <p className='text-[11px] md:text-[13px] text-center'>{t('QRMessage')}</p> : 
                    <p className='text-[11px] md:text-[13px] text-center text-red-700'>{t('QRErrorM')}</p>}
                    { QRString ? <QRCode value={QRString}/> : null}
                </div>
             </div>
             <select className='absolute bg-transparent right-2 bottom-5 w-[6rem] px-[0.5rem] text-gray-700 text-[13px] 
            duration-75 hover:backdrop-blur-md hover:cursor-pointer hover:backdrop-brightness-150 outline-none'
            onChange={(e) => changeLanguage(e)}>
                    <option value='en'>English</option>
                    <option value='fr'>French</option>
            </select>
            <p className='absolute bottom-[1px] left-[30%] md:left-[40%] text-[12px] md:text-[13px] text-slate-700'>
                wedding planning app &copy; 2023</p>
        </div>
    );
}

export default QRCodeDisplay;