import React, { useState } from 'react';
import Lottie from 'lottie-react';
import wed from '../../Gifs/weddingRing.json';
import { useTranslation } from 'react-i18next';
import { FaceSmileIcon, FaceFrownIcon } from '@heroicons/react/24/solid';

import './confPresence.css';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { ADDANOTIFICATION } from '../../store/notifHandler';
import io from '../../utility/socket';

function ConfPresence(props) {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [acceptLoading, setAcceptLoading] = useState(false);
    const [declineLoading, setSDeclinetLoading] = useState(false);
    const name = props.guest.name;

    const acceptBIconClasses = [acceptLoading ? 'w-[2rem]' : 'w-[1.4rem]', 'duration-75'];
    const declineBIconClasses = [declineLoading ? 'w-[2rem]' : 'w-[1.4rem]', 'duration-75'];
 
    const ConfirmInvite = () => {
        setAcceptLoading(true);

        axios.post(`${process.env.REACT_APP_BACKEND_URL}/confirmPresence/${props.guest._id}`)
        .then(theResponse => {
            setAcceptLoading(false);
            props.setConfPresence(false);
            dispatch(ADDANOTIFICATION({notif: true, isError: false, notifMessage: theResponse.data.message}));
            if(io.getIO()) {
                io.getIO().emit('confirmedPresence', theResponse.data.guest);
            }
        })
        .catch(err => {
            setAcceptLoading(false);
            props.setConfPresence(false);
            dispatch(ADDANOTIFICATION({notif: true, isError: true, notifMessage: err.response.data.message}));
        })
    }

    
    const declineInvite = () => {
        setSDeclinetLoading(true);

        axios.post(`${process.env.REACT_APP_BACKEND_URL}/declinePresence/${props.guest._id}`)
        .then(theResponse => {
            setSDeclinetLoading(false);
            props.setConfPresence(false);
            dispatch(ADDANOTIFICATION({notif: true, isError: false, notifMessage: theResponse.data.message}));
            if(io.getIO()) {
                io.getIO().emit('declinedInvite', theResponse.data.guest);
            }
        }) 
        .catch(err => {
            props.setConfPresence(false);
            setSDeclinetLoading(false);
            dispatch(ADDANOTIFICATION({notif: true, isError: true, notifMessage: err.response.data.message}));
        })
    }

    return (
        <div className='z-50 absolute top-0 left-0  w-[100%] h-[100%] bg-black bg-opacity-70' onClick={(e) => e.target instanceof HTMLDivElement ? props.setConfPresence(false) : null}>
            {/* //the popup */}
            <div className='absolute z-55 top-[30%] left-[5vw] md:left-[30vw] w-[90vw] md:w-[40vw] bg-gradient-to-br from-darkLighterBlue via-whitish to-whitish 
            dark:bg-gradient-to-br dark:from-darkLighterBlue dark:via-darkLighterBlue dark:to-specialPink text flex flex-col 
            justify-start items-center rounded-lg p-[1rem]'>
                    <Lottie animationData={wed} className='w-[5rem]'/>
                <p className='text-maroon text-center dark:text-whitish duration-75 dark:duration-75 mb-[0.5rem] text-[13px] md:text-[15px]'>
                    {t('confText', {name: name})}
                </p>
                <div className='flex justify-around items-center w-[100%]'>
                    <button className='confirmP relative bg-lightBlue w-[9rem] md:w-auto text-white dark:text-darkLighterBlue  
                    p-[0.5rem] md:p-[1rem] rounded-lg flex justify-center items-center text-[13px] md:text-[15px]' onClick={() => ConfirmInvite()}>
                        { acceptLoading ? <svg aria-hidden="true" className="inline w-4 h-4 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                        </svg> : null}{ !acceptLoading ? t('confButton') : null}<FaceSmileIcon className={acceptBIconClasses.join(' ')}/>
                    </button>
                    <button className='declineP relative bg-red-600 w-[9rem] md:w-auto text-white dark:text-darkLighterBlue p-[0.5rem] 
                    md:p-[1rem] rounded-lg flex justify-center items-center text-[13px] md:text-[15px]' onClick={() => declineInvite()}>
                        { declineLoading ? <svg aria-hidden="true" className="inline w-4 h-4 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                        </svg> : null}{ !declineLoading ? t('declineButton') : null}<FaceFrownIcon className={declineBIconClasses.join(' ')}/>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ConfPresence;