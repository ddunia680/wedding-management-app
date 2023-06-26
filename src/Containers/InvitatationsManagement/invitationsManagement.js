import React, { useRef, useState } from 'react';
import Header from '../../Components/Header/header';
import { UserCircleIcon, XMarkIcon } from '@heroicons/react/24/solid';
import InviteItem from '../../Components/inviteItem/inviteItem';
import { useTranslation } from 'react-i18next';

function InvitationsManagement() {
    const { t } = useTranslation();
    const [profImage, setProfImage] = useState(null);
    console.log(profImage);
    const thePic = useRef();
    return (
        <div className='w-[100vw] h-[100vh] overflow-hidden'>
            <Header/>
            {/* main container */}
            <div className='w-[95%] md:w-[90%] h-[89%] md:h-[84%] bg-specialGray dark:bg-darkLighterBlue mx-auto rounded-xl mt-[3.5rem] md:mt-[6rem] relative 
            duration-75 dark:duration-75'>
                <div className='w-[100%] py-[1rem] flex flex-col justify-start items-center'>
                    <h2 className='font-extrabold text-[20px] md:text-[30px] text-darkLighterBlue dark:text-whitish mb-4 md:mb-0'>
                        {t('inviteManageTitle')}
                    </h2>
                    {/* The input container */}
                    <div className='w-[90%] bg-pink-200 dark:bg-darkClose mx-auto rounded-xl md:rounded-2xl flex flex-col justify-start items-center'>
                        <div className='w-[100%] px-[0.5rem] flex justify-center items-center space-x-2'>
                            { !profImage ? <UserCircleIcon title='Click to choose photo' className='w-[4rem] md:w-[7rem] text-darkLighterBlue dark:text-whitish 
                            hover:dark:text-pink-400 hover:text-pink-900' onClick={() => thePic.current.click()}/> :
                            <div className='rounded-full w-[4rem] md:w-[7rem] h-[3.5rem] md:h-[7rem] relative'>
                                <img src={URL.createObjectURL(profImage)} alt='prof' className='w-[100%] h-[100%] object-contain'/>
                                <XMarkIcon className='absolute w-[1.5rem] text-white  rounded-full bg-black bg-opacity-50 bottom-1 
                                left-[50%]' onClick={() => setProfImage(null)}/>
                            </div>}
                            <input type='file' className='hidden' ref={thePic} onChange={e => setProfImage(e.target.files[0])}/>

                                <div className='w-[60%] flex flex-col md:flex-row items-center space-x-0 md:space-x-4 space-y-2 md:space-y-0'>
                                    <div className="relative  md:w-1/2">
                                        <input id="name" name="name" type="text" className="peer h-10 w-[100%] border-b-2 border-pink-300 
                                        bg-transparent text-darkLighterBlue dark:text-specialGray placeholder-transparent focus:outline-none focus:border-pink-500 text-[13px] md:text-[15px]" 
                                        placeholder="john@doe.com" />
                                        <label htmlFor="name" className="absolute left-0 -top-3 text-gray-900 dark:text-gray-600 text-[11px] md:text-[13px] transition-all 
                                        peer-placeholder-shown:text-[12px] peer-placeholder-shown:text-gray-700 dark:peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 
                                        peer-focus:-top-2 peer-focus:text-gray-900 dark:peer-focus:text-gray-600 peer-focus:text-[12px]">
                                            {t('guestsNameLabel')}
                                        </label>
                                    </div>
                                    <div className="relative md:w-1/2">
                                        <input id="phone number" name="phoneNo" type="text" className="peer h-10 w-[100%] border-b-2 border-pink-300 
                                        bg-transparent text-darkLighterBlue dark:text-specialGray placeholder-transparent focus:outline-none focus:border-pink-500 text-[13px] md:text-[15px]" 
                                        placeholder="john@doe.com" />
                                        <label htmlFor="phone Number" className="absolute left-0 -top-3 -md:top-3.5 text-gray-900 dark:text-gray-600 text-[11px] md:text-[13px] transition-all 
                                        peer-placeholder-shown:text-[12px] peer-placeholder-shown:text-gray-700 dark:peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 
                                        peer-focus:-top-2 md:peer-focus:-top-3.5 peer-focus:text-gray-900 dark:peer-focus:text-gray-600 peer-focus:text-[12px]">
                                            {t('guestsNumLabel')}
                                        </label>
                                    </div>
                            </div>
                            <select className='bg-black bg-opacity-30 rounded-lg text-[12px] md:text-[15px] dark:text-whitish focus:outline-none'>
                                <option>{t('ordinaryOpt')}</option>
                                <option>VIP</option>
                                <option>V VIP</option>
                            </select>
                        </div>
                        <button className='bg-gradient-to-br from-extraPink via-extraPink to-specialPink w-[80%] md:w-[20rem] py-[0.5rem] md:py-[1rem] 
                        rounded-xl text-darkLighterBlue dark:text-whitish mb-5 hover:scale-110 mt-5 md:mt-0'>{t('inviteBText')}</button>
                    </div>
                </div>
                <div className='w-[90%] md:w-[70%] h-[45%] mx-auto flex flex-col space-y-1 justify-start items-start'>
                    <InviteItem/>
                    <InviteItem/>
                </div>
            </div>
            <p className='absolute bottom-1 left-[30%] md:left-[40%] text-[12px] md:text-[13px] text-whitish dark:text-slate-400'>wedding planning app &copy; 2023</p>
        </div>
    );
}

export default InvitationsManagement;