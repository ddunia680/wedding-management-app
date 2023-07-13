import React, { useEffect, useState } from 'react';
import Lottie from 'lottie-react';
import Header from '../../Components/Header/header';
import wedImage from '../../images/wedPic.png';
import { useTranslation } from 'react-i18next';
import validate from '../../utility/validation';

import rings from '../../Gifs/weddingRing.json';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { AUTHENTICATE } from '../../store/authenticate';
import { ADDANOTIFICATION } from '../../store/notifHandler';
import io from '../../utility/socket';

function AdminLogin(props) {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [emailIsValid, setEmailIsValid] = useState(false);
    const [passwordIsValid, setPasswordIsValid] = useState(false);

    const [emailTouched, setEmailTouched] = useState(false);
    const [passwordTouched, setPasswordTouched] = useState(false);

    const [formIsValid, setFormIsValid] = useState(false);
    const [loading, setLoading] = useState(false);

    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');

    const emailInptClasses = [`peer h-10 w-[18rem] md:w-[20rem] border-b-2 bg-transparent text-gray-900 dark:text-specialGray 
    placeholder-transparent focus:outline-none`, !emailIsValid && emailTouched ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-sky-500'];

    const passwordInptClasses = [`peer h-10 w-[18rem] md:w-[20rem] border-b-2 bg-transparent text-gray-900 dark:text-specialGray 
    placeholder-transparent focus:outline-none`, !passwordIsValid && passwordTouched ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-sky-500']

    useEffect(() => {
        if(io.getIO()) {
            
        }
    }, []);

    useEffect(() => {
        setFormIsValid(emailTouched && emailIsValid && passwordTouched && passwordIsValid);
    }, [ emailTouched, emailIsValid, passwordTouched, passwordIsValid ]);

    const validateInputs = (input) => {
        let results;
        switch(input.type) {
            case 'email':
                setEmailTouched(true);
                results = validate({type: 'email', value: input.value});
                setEmailIsValid(results.email);
                break;
            case 'password':
                setPasswordTouched(true);
                results = validate({type: 'password', value: input.value});
                setPasswordIsValid(results.password);
                break;
            default: 
                console.log('end of check');
        }
    }

    const sendAuth = async () => {
        setLoading(true);
        const data = {
            email: email,
            password: password
        }
        try{
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/auth/signin`, data);
            setLoading(false);
            
            dispatch(AUTHENTICATE({token: response.data.token, email: response.data.email}));
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('email', response.data.email);
            const remainingMilliseconds = 60 * 60 * 1000;
            const expiryDate = new Date(
                new Date().getTime() + remainingMilliseconds
            );
            localStorage.setItem('expiryDate', expiryDate.toISOString());
            dispatch(ADDANOTIFICATION({notif: true, isError: false, notifMessage: `Welcome dear ${response.data.email}`}));
            const socket = io.init(process.env.REACT_APP_BACKEND_URL);
            socket.emit('adminJoin', response.data.id);
            navigate('manage');
        } catch(err) {
            setLoading(false);
            if(err.response.data.message.includes('email')) {
                setEmailIsValid(false);
                setEmailError(err.response.data.message);
            } else if(err.response.data.message.includes('password')) {
                setPasswordIsValid(false);
                setPasswordError(err.response.data.message);
            } else {
                dispatch(ADDANOTIFICATION({notif: true, isError: true, notifMessage: err.response.data.message}));
            }
        }        
    }
    
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
                    <div className="p-[2rem] bg-whitish dark:bg-gradient-to-br dark:from-darkLighterBlue dark:via-darkLighterBlue 
                        dark:to-extraPink rounded-tr-[2rem] rounded-bl-[2rem] shadow-md shadow-black">
                        <h1 className="text-2xl font-semibold text-darkLighterBlue dark:text-specialGray mb-5 flex justify-start items-center">
                            {t('adminWelcome')}{ window.innerWidth <= 500 ? <Lottie animationData={rings} className='w-[3rem]'/> : null}
                        </h1>
                        {/* Email */}
                        <div className="relative">
                            <input id="email" name="email" type="text" className={emailInptClasses.join(' ')} 
                            placeholder="john@doe.com" value={email} onChange={e => {
                                validateInputs({ type: 'email', value: e.target.value });
                                setEmail(e.target.value);
                            }}/>
                            <label htmlFor="email" className="absolute left-0 -top-3.5 text-gray-600 text-sm transition-all 
                            peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 
                            peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm">
                                Email
                            </label>
                            <p className='absolute text-[12px] top-[2.3rem] text-red-500'>{emailError}</p>
                        </div>
                        {/* Password */}
                        <div className="mt-10 relative">
                            <input id="password" type="password" name="password" className={passwordInptClasses.join(' ')}
                            placeholder="Password" value={password} onChange={e => {
                                validateInputs({ type: 'password', value: e.target.value });
                                setPassword(e.target.value);
                            }}/>
                            <label htmlFor='password' className="absolute left-0 -top-3.5 text-gray-600 text-sm transition-all 
                            peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 
                            peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm">{t('passw')}</label>
                            <p className='absolute text-[12px] top-[2.3rem] text-red-500'>{passwordError}</p>
                        </div>

                        {/* Login button */}
                        <button type="sumbit" className="mt-12 px-4 py-2 rounded bg-sky-500 hover:bg-sky-400 
                        text-darkLighterBlue dark:text-white font-semibold text-center block w-full focus:outline-none focus:ring 
                        focus:ring-offset-2 focus:ring-sky-500 focus:ring-opacity-80 cursor-pointer disabled:bg-gray-400 
                        disabled:text-gray-500 disabled:cursor-not-allowed" disabled={!formIsValid || loading} 
                        onClick={() => sendAuth()}>
                            {t('signinB')}
                            { loading ? <svg aria-hidden="true" className="inline w-4 h-4 mr-2 text-gray-200 animate-spin dark:text-gray-600 ml-2 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                            </svg> : null}
                        </button>
                        {/* Forgot Password */}
                        <p className="mt-4 block text-sm text-center font-medium text-sky-600 hover:underline focus:outline-none 
                        focus:ring-2 focus:ring-sky-500 cursor-pointer">{t('forgotPassB')}</p>
                    </div>
                    {/* Image */}
                    <div className='hidden md:block w-[30rem] h-[30rem]'>
                        <img src={wedImage} alt='' className='w-[100%] h-[100%] object-contain hover:scale-125 duration-100 hover:duration-100'/>
                    </div>
                </div>
            </div>
            <p className='absolute bottom-1 left-[30%] md:left-[40%] text-[12px] md:text-[13px] text-slate-700'>wedding planning app &copy; 2023</p>
        </div>
    );
}

export default AdminLogin;