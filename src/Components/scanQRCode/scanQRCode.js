import React, { useEffect, useState } from 'react';
import Header from '../Header/header';
import { useTranslation } from 'react-i18next';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { UserCircleIcon, StarIcon, CheckBadgeIcon, XCircleIcon } from '@heroicons/react/24/solid';
import Spinner2 from '../../utility/spinner2/spinner2';
import './scanQRCode.css';
import axios from 'axios';
import { useSelector } from 'react-redux';

function ScanQRCode(props) {
    const { t } = useTranslation();
    const token = useSelector(state => state.authenticate.token);
    const [theID, setTheID] = useState('');
    const [loading, setLoading] = useState(false);
    const [ pulledGuest, setPulledGuest ] = useState({});
    const [ pulledMessage, setPulledMessage ] = useState('');

    const readerClasses = [`w-[15rem] h-[15rem] md:w-[20rem] md:h-[20rem] rounded-2xl flex flex-col justify-center items-center`, loading ? 
    'bg-black bg-opacity-40' : 'bg-gray-500'];
    const pulledMessageClasses = [`text-[13px] md:text-[15px] text-center`, pulledMessage === 'Allow guest in' ? 
    'text-darkLighterBlue dark:text-slate-200 ' : pulledMessage === 'guest is already in' || 'guest never confirmed presence!' ? 
    'text-red-600' : ''];

    useEffect(() => {
        if(theID) {
            setLoading(true);
            axios.post(`${process.env.REACT_APP_BACKEND_URL}/scanQRCode`, { theID: theID }, { headers: { Authorization: 'Bearer '+ token }})
            .then(res => {
                setLoading(false);
                setPulledGuest(res.data.guest);
                setPulledMessage(res.data.message);
            })
            .catch(err => {
                setLoading(false);
                console.log(err.response.data.message);
            })
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [theID]);

    useEffect(() => {
        const scanner = new Html5QrcodeScanner('reader', {
            qrbox: {
                width: 250,
                height: 250,
            },
            // number of times per second we will attempt to scan
            fps: 5,

        });
        scanner.render(success, error);

        function success(result) {
            scanner.clear();
            setTheID(result.slice(0, 24));
        }

        function error(err) {
        // console.warn(err);
        }
    }, []);

    return (
        <div className='relative w-[100vw] h-[100vh] flex flex-col justify-center items-center'>
            <Header/>
            <div className='w-[80%] md:w-[40rem] h-[60%] bg-gradient-to-br from-darkLighterBlue via-whitish to-whitish dark:bg-gradient-to-br
             dark:from-darkLighterBlue dark:via-darkLighterBlue dark:to-specialPink flex flex-col justify-center items-center space-y-[2rem] 
             rounded-2xl'>
                { Object.keys(pulledGuest).length === 0 ?
                <div className='w-[100%] h-[100%] flex flex-col justify-center items-center'>
                    <h2 className='font-bold text-[16px] md:text-[20px] text-darkLighterBlue dark:text-whitish '>{t('QRCode_Message')}</h2>
                    <div id='reader'  className={readerClasses.join(' ')}>
                        { loading ? <Spinner2/> : null}
                    </div>
                </div>
                :
                <div className='w-[100%] h-[100%] flex flex-col justify-start items-center'>
                    <div className='w-[90%] flex justify-evenly items-center m-[1rem]'>
                        { !pulledGuest.profileUrl ?
                        <UserCircleIcon className='w-[7rem] md:w-[10rem] text-darkLighterBlue dark:text-slate-500 shadow-md shadow-black 
                        rounded-full'/>
                        :
                        <div className='w-[7rem] h-[7rem] md:h-[10rem] md:w-[10rem] bg-yellow-500 shadow-md shadow-black rounded-full 
                        overflow-hidden'>
                            <img src={pulledGuest.profileUrl} alt='' className='w-[100%] h-[100%] object-contain'/>
                        </div>}
                        <div className='flex flex-col justify-start items-center'>
                            <h3 className='text-darkLighterBlue dark:text-slate-500 Pacifico text-[18px] md:text-[30px] text-center underline'
                            >{t('guestNameLine', { name: pulledGuest.name })}</h3>
                            <p className='text-darkLighterBlue dark:text-slate-500 text-[13px] md:text-[15px]'>{pulledGuest.phoneNo}</p>
                        </div>
                    </div>
                    <div className='flex justify-center items-center space-x-[1rem] md:space-x-[2rem] mb-[2rem]'>
                        <StarIcon className='w-[2rem] md:w-[4rem] text-yellow-500 shadow-lg shadow-black'/>
                        { pulledGuest.level !== 'ordinary' ? <StarIcon className='w-[2rem] md:w-[4rem] text-yellow-500 shadow-lg shadow-black'/> : null}
                        { pulledGuest.level === 'vvip' ? <StarIcon className='w-[2rem] md:w-[4rem] text-yellow-500 shadow-lg shadow-black'/> 
                        : null}
                    </div>
                    <div className='flex flex-col md:flex-row justify-start items-center space-x-[1rem] mx-[1rem] mb-[2rem] md:mb-[1rem]'>
                        { pulledMessage === 'Allow guest in!' ?
                        <CheckBadgeIcon className='w-[3rem] md:w-[4rem] text-yellow-800 shadow-md shadow-black rounded-full'/>
                        :
                        <XCircleIcon className='wrongMessage w-[3rem] md:w-[4rem] text-red-700 shadow-md shadow-black rounded-full'/>}
                        { pulledMessage ? 
                        <p className={pulledMessageClasses.join(' ')}>
                            {t( pulledMessage === 'Allow guest in!' ? 'readyToGetInMessage' : pulledMessage === 'guest is already in' ? 
                            'DuplicateEntryMessage' : pulledMessage === 'guest never confirmed presence!' ? 'NotConfirmedPresence' : '')}
                        </p> : null}
                    </div>
                    { pulledMessage === 'Allow guest in!' ?
                    <button className='sendInButton px-[1rem] md:px-[2rem] py-[0.5rem] md:py-[1rem] bg-red-400 rounded-xl text-[13px] 
                    md:text-[15px] shadow-md shadow-black'>{t('sentInButton')}</button>  
                    :
                    <button className='sendInButton px-[1rem] md:px-[2rem] py-[0.5rem] md:py-[1rem] bg-transparent border-[2px] 
                    border-darkLighterBlue dark:border-slate-200 rounded-xl text-darkLighterBlue dark:text-slate-200 text-[13px] 
                    md:text-[15px] shadow-md shadow-black hover:bg-darkLighterBlue hover:text-slate-200 dark:hover:bg-slate-200 
                    dark:hover:text-darkLighterBlue duration-75 hover:duration-75' onClick={() => {
                        setPulledGuest({});
                        setPulledMessage('');
                        setTheID('');
                    }}>{t('backtoScan')}</button>}
                </div>}
            </div> 
        </div>
    );
}

export default ScanQRCode;