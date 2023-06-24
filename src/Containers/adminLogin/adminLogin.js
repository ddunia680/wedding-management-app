import React from 'react';
import Lottie from 'lottie-react';
import Header from '../../Components/Header/header';
import wedImage from '../../images/wedPic.png';
import { useTranslation } from 'react-i18next';

import rings from '../../Gifs/weddingRing.json';
import { useNavigate } from 'react-router-dom';
function AdminLogin(props) {
    const { t } = useTranslation();
    const navigate = useNavigate();
    return (
        <div className='w-[100vw] h-[100vh] relative flex justify-center items-center'>
            <Header/>
            {/* Container */}
            <div className='w-[95%] h-[90%] md:w-[70%] md:h-[80%] mt-[5%] flex flex-col justify-start items-center rounded-xl backdrop-blur-md backdrop-brightness-150 
            dark:backdrop-brightness-75 border-[2px] border-gray-500 dark:border-gray-800 px-[2rem] duration-75 dark:duration-75 overflow-hidden'>
                { window.innerWidth > 500 ? <Lottie animationData={rings} className='w-[5rem]'/> : null}
                {/* log container */}
                <div className='w-[100%] h-[100%] md:h-[90%] mt-0 flex justify-center md:justify-between items-center px-[2rem] duration-75 dark:duration-75 
                overflow-hidden box-border'>    
                    {/* Sign in View */}
                    <div className="p-[2rem] bg-white dark:bg-gradient-to-br dark:from-darkLighterBlue dark:via-darkLighterBlue 
                        dark:to-extraPink rounded-tr-[2rem] rounded-bl-[2rem]">
                        <h1 className="text-2xl font-semibold text-darkLighterBlue dark:text-specialGray mb-5 flex justify-start items-center">
                            {t('adminWelcome')}{ window.innerWidth <= 500 ? <Lottie animationData={rings} className='w-[3rem]'/> : null}
                        </h1>
                        <div className="relative">
                            <input id="email" name="email" type="text" className="peer h-10 w-[18rem] md:w-[20rem] border-b-2 border-gray-300 
                            bg-transparent text-gray-900 dark:text-specialGray placeholder-transparent focus:outline-none focus:border-sky-500" 
                            placeholder="john@doe.com" />
                            <label htmlFor="email" className="absolute left-0 -top-3.5 text-gray-600 text-sm transition-all 
                            peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 
                            peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm">
                                Email
                            </label>
                        </div>
                        <div className="mt-10 relative">
                            <input id="password" type="password" name="password" className="peer h-10 w-[18rem] md:w-[20rem] border-b-2 border-gray-300 
                            bg-transparent text-gray-900 dark:text-specialGray placeholder-transparent focus:outline-none focus:border-sky-600" 
                            placeholder="Password" />
                            <label htmlFor='password' className="absolute left-0 -top-3.5 text-gray-600 text-sm transition-all 
                            peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 
                            peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm">{t('passw')}</label>
                        </div>

                        <button type="sumbit" className="mt-12 px-4 py-2 rounded bg-sky-500 hover:bg-sky-400 
                        text-white font-semibold text-center block w-full focus:outline-none focus:ring focus:ring-offset-2 
                        focus:ring-sky-500 focus:ring-opacity-80 cursor-pointer" onClick={() => navigate('manage')}>{t('signinB')}</button>
                        <p className="mt-4 block text-sm text-center font-medium text-sky-600 hover:underline focus:outline-none 
                        focus:ring-2 focus:ring-sky-500 cursor-pointer">{t('forgotPassB')}</p>
                    </div>
                    {/* Image */}
                    <div className='hidden md:block w-[30rem] h-[30rem]'>
                        <img src={wedImage} alt='' className='w-[100%] h-[100%] object-contain hover:scale-125 duration-100 hover:duration-100'/>
                    </div>
                </div>
            </div>
            <p className='absolute bottom-1 left-[30%] md:left-[40%] text-[12px] md:text-[13px] text-whitish dark:text-slate-400'>wedding planning app &copy; 2023</p>
        </div>
    );
}

export default AdminLogin;