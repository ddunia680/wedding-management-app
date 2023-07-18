import React, { useRef } from 'react';
import Header from '../Header/header';
import { useTranslation } from 'react-i18next';
import { Html5QrcodeScanner } from 'html5-qrcode';
import Spinner2 from '../../utility/spinner2/spinner2';

function ScanQRCode(props) {
    const { t } = useTranslation();
    const readerRef = useRef();

    new Html5QrcodeScanner(readerRef.current);
    return (
        <div className='relative w-[100vw] h-[100vh] flex flex-col justify-center items-center'>
            <Header/>
            <div className='w-[80%] md:w-[40rem] h-[60%] bg-gradient-to-br from-darkLighterBlue via-whitish to-whitish dark:bg-gradient-to-br 
            dark:from-darkLighterBlue dark:via-darkLighterBlue dark:to-specialPink flex flex-col justify-center items-center space-y-[2rem] rounded-2xl'>
                <h2 ref={readerRef} className='font-bold text-[16px] md:text-[20px] text-whitish '>{t('QRCode_Message')}</h2>
                <div className='w-[15rem] h-[15rem] md:w-[20rem] md:h-[20rem] bg-white opacity-30 rounded-2xl flex flex-col justify-center items-center'>
                    <Spinner2/>
                </div>
            </div>
            
        </div>
    );
}

export default ScanQRCode;