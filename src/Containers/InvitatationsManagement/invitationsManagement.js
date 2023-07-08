import React, { useEffect, useRef, useState } from 'react';
import Header from '../../Components/Header/header';
import { UserCircleIcon, XMarkIcon } from '@heroicons/react/24/solid';
import InviteItem from '../../Components/inviteItem/inviteItem';
import { useTranslation } from 'react-i18next';
import validate from '../../utility/validation';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { ADDAGUEST, PULLEDGUESTSAVE } from '../../store/guests';
import Spinner from '../../utility/spinner/spinner';
import { ADDANOTIFICATION } from '../../store/notifHandler';

import './invitationsManagement.css';

function InvitationsManagement() {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const token = useSelector(state => state.authenticate.token);
    const guests = useSelector(state => state.guests.guests);
    const [guestsPullLoading, setGuestsPullLoading] = useState(false);
    const [profImage, setProfImage] = useState('');
    const [name, setName] = useState('');
    const [phoneNo, setPhoneNo] = useState('');
    const [quality, setQuality] = useState('ordinary');
    // console.log(quality);
    const thePic = useRef();

    const [nameIsValid, setNameIsValid] = useState(false);
    const [phoneNoIsValid, setPhoneNoIsValid] = useState(false);

    const [nameTouched, setNameTouched] = useState(false);
    const [phoneNoTouched, setPhoneNoTouched] = useState(false);

    const [formIsValid, setFormIsValid] = useState(false);
    const [loading, setLoading] = useState(false);

    const [nameError, setNameError] = useState('');
    const [phoneNoError, setPhoneNoError] = useState('');

    const nameInptClasses = [`peer h-10 w-[100%] border-b-2 bg-transparent text-darkLighterBlue dark:text-specialGray 
    placeholder-transparent focus:outline-none focus:border-pink-500 text-[13px] md:text-[15px]`, !nameIsValid && nameTouched ? 
    'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-sky-500'];

    const numberInptClasses = [`peer h-10 w-[100%] border-b-2 bg-transparent text-darkLighterBlue dark:text-specialGray 
    placeholder-transparent focus:outline-none focus:border-pink-500 text-[13px] md:text-[15px]`, !phoneNoIsValid && phoneNoTouched ? 
    'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-sky-500'];

    const inviteButtonClasses = [`w-[80%] md:w-[20rem] py-[0.5rem] md:py-[1rem] rounded-xl text-darkLighterBlue dark:text-whitish mb-5 
    hover:scale-110 mt-5 md:mt-0`, !formIsValid || loading ? `disabled:bg-gray-400 disabled:text-gray-500 disabled:cursor-not-allowed` : 
    `bg-gradient-to-br from-extraPink via-extraPink to-specialPink` ];
    
    useEffect(() => {
        if(nameIsValid && phoneNoIsValid) {
            setFormIsValid(true);
        } else {
            setFormIsValid(false);
        }
    }, [nameIsValid, phoneNoIsValid]);

    useEffect(() => {
        if(token) {
            setGuestsPullLoading(true);
            axios.get(`${process.env.REACT_APP_BACKEND_URL}getAllGuests`, {
                headers: {
                    Authorization: 'Bearer '+ token
                }
            })
            .then(response => {
                setGuestsPullLoading(false);
                dispatch(PULLEDGUESTSAVE(response.data.guests));
            })
            .catch(err => {
                setGuestsPullLoading(false);
                dispatch(ADDANOTIFICATION({notif: true, isError: true, notifMessage: err.response.data.message}));
            })
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    let theGuests;
    if(guestsPullLoading) {
        theGuests = <div className='mx-auto'><Spinner/></div>
    } else if( !guestsPullLoading && guests.length) {
        theGuests = guests.map(guest => {
            return <InviteItem key={guest._id} guest={guest}/>
        })
    } else {
        theGuests = <p className='mx-auto text-darkLighterBlue dark:text-gray-300 text-[13px] md:text-[15px]'>No guests found</p>
    }

    const validateInputs = (input) => {
        let results;
        switch(input.type) {
            case 'name':
                setNameTouched(true);
                results = validate({type: 'name', value: input.value});
                setNameIsValid(results.name);
                break;
            case 'number':
                setPhoneNoTouched(true);
                results = validate({type: 'number', value: input.value});
                setPhoneNoIsValid(results.number);
                break;
            default: 
                console.log('end of check');
        }
    }

    // console.log(process.env.REACT_APP_BACKEND_URL);

    const registerGuest = async () => {
        setLoading(true);
        const data = new FormData();
        data.append('name', name);
        data.append('phoneNo', phoneNo);
        data.append('quality', quality);
        if(profImage) { data.append('photos', profImage) };

        try {
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}addGuest`, data, {
                headers: {
                    Authorization: 'Bearer '+ token
                }
            });
            // console.log(response);
            setLoading(false);
            setProfImage('');
            setName('');
            setPhoneNo('');
            setFormIsValid(false);
            setQuality('ordinary');
            dispatch(ADDAGUEST(response.data.guest));
            dispatch(ADDANOTIFICATION({notif: true, isError: false, notifMessage: response.data.message}));
        } catch(err) {
            console.log(err);
            setLoading(false);
            if(err.response.data.message.includes('name')) { setNameError(err.response.data.message); setNameIsValid(false) };
            if(err.response.data.message.includes('phone number')) { setPhoneNoError(err.response.data.message); setPhoneNoIsValid(false) };
        }
    }

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
                            <div className='rounded-full w-[4rem] md:w-[7rem] h-[3.5rem] md:h-[7rem] relative overflow-hidden bg-black'>
                                <img src={URL.createObjectURL(profImage)} alt='prof' className='w-[100%] h-[100%] object-contain'/>
                                <XMarkIcon className='absolute w-[1.5rem] text-white  rounded-full bg-black bg-opacity-50 bottom-1 
                                left-[50%]' onClick={() => setProfImage(null)}/>
                            </div>}
                            <input type='file' className='hidden' ref={thePic} onChange={e => setProfImage(e.target.files[0])}/>

                                <div className='w-[60%] flex flex-col md:flex-row items-center space-x-0 md:space-x-4 space-y-2 md:space-y-0'>
                                    {/* name */}
                                    <div className="relative  md:w-1/2">
                                        <input id="name" name="name" type="text" className={nameInptClasses.join(" ")} 
                                        placeholder="john@doe.com" value={name} onChange={e => {
                                            validateInputs({ type: 'name', value: e.target.value });
                                            setName(e.target.value);
                                        }}/>
                                        <label htmlFor="name" className="absolute left-0 -top-3 text-gray-900 dark:text-gray-600 text-[11px] md:text-[13px] transition-all 
                                        peer-placeholder-shown:text-[12px] peer-placeholder-shown:text-gray-700 dark:peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 
                                        peer-focus:-top-2 peer-focus:text-gray-900 dark:peer-focus:text-gray-600 peer-focus:text-[12px]">
                                            {t('guestsNameLabel')}
                                        </label>
                                        <p className='absolute text-[12px] top-[2.3rem] text-red-500'>{nameError}</p>
                                    </div>
                                    {/* phone number */}
                                    <div className="relative md:w-1/2">
                                        <input id="phone number" name="phoneNo" type="text" className={numberInptClasses} 
                                        placeholder="john@doe.com" value={phoneNo} onChange={e => {
                                            validateInputs({ type: 'number', value: e.target.value });
                                            setPhoneNo(e.target.value);
                                        }}/>
                                        <label htmlFor="phone Number" className="absolute left-0 -top-3 -md:top-3.5 text-gray-900 dark:text-gray-600 text-[11px] md:text-[13px] transition-all 
                                        peer-placeholder-shown:text-[12px] peer-placeholder-shown:text-gray-700 dark:peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 
                                        peer-focus:-top-2 md:peer-focus:-top-3.5 peer-focus:text-gray-900 dark:peer-focus:text-gray-600 peer-focus:text-[12px]">
                                            {t('guestsNumLabel')}
                                        </label>
                                        <p className='absolute text-[12px] top-[2.3rem] text-red-500'>{phoneNoError}</p>
                                    </div>
                            </div>
                            <select className='bg-black bg-opacity-30 rounded-lg text-[12px] md:text-[15px] dark:text-whitish 
                            focus:outline-none' value={quality} onChange={e => setQuality(e.target.value)}>
                                <option value='ordinary'>{t('ordinaryOpt')}</option>
                                <option value='vip'>VIP</option>
                                <option value='vvip'>V VIP</option>
                            </select>
                        </div>
                        <button className={inviteButtonClasses.join(' ')} disabled={!formIsValid || loading} onClick={() => registerGuest()}>
                            {t('inviteBText')}
                            { loading ? <svg aria-hidden="true" className="inline w-4 h-4 mr-2 text-gray-200 animate-spin dark:text-gray-600 ml-2 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                            </svg> : null}
                        </button>
                    </div>
                </div>
                <div className='theGuests w-[90%] md:w-[70%] h-[45%] mx-auto flex flex-col space-y-1 justify-start items-start overflow-y-scroll z-10'>
                    {theGuests}
                </div>
            </div>
            <p className='absolute bottom-1 left-[30%] md:left-[40%] text-[12px] md:text-[13px] text-slate-700'>wedding planning app &copy; 2023</p>
        </div>
    );
}

export default InvitationsManagement;