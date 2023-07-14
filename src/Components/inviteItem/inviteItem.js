import React, { useRef, useState, useEffect } from 'react';
import { UserCircleIcon, StarIcon, CheckBadgeIcon, ClockIcon, HandRaisedIcon } from '@heroicons/react/24/solid';
import { EllipsisHorizontalIcon} from '@heroicons/react/24/outline';
// import pic from  '../../images/wedPic.png';

import './inviteItem.css';
import { useTranslation } from 'react-i18next';
import { CSSTransition } from 'react-transition-group';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { ADDANOTIFICATION } from '../../store/notifHandler';
import { DELETEGUEST } from '../../store/guests';
import io from '../../utility/socket';

function InviteItem(props) {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const token = useSelector(state => state.authenticate.token);
    const [hoveredOn, setHoveredOn] = useState(false);
    const [showControl, setShowControl] = useState(false);
    const [status, setStatus] = useState(props.guest.status);
    const [confLoading, setConfLoading] = useState(false);
    const [excludeLoading, setExcludeLoading] = useState(false);
    const [controlIsIntersecting, setControlIsIntersecting] = useState(false);
    const [refIsIntersecting, setRefIsIntersecting] = useState(false);
    const [controlDown, setControlDown] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const theControl = useRef();
    const theRefPoint = useRef();
    // console.log(controlIsIntersecting + ' is the controller');
    // console.log(refIsIntersecting + ' is the refDiv');

    useEffect(() => {
        if(io.getIO()) {
          io.getIO().on('gotConfirmation', guest => {
            if(guest._id === props.guest._id) {
                setStatus('confirmed')
            }
          });
    
          io.getIO().on('gotRejection', guest => {
            if(guest._id === props.guest._id) {
                setStatus('')
            }
          });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, []);

    const inviteItemClasses = [`relative w-[100%] py-[0.5rem] md:py-[1rem] dark:text-whitish text-darkLighterBlue flex justify-evenly items-center px-[2rem] 
    shadow-2xl bg-pink-300 dark:bg-gradient-to-br dark:from-lightestDBlue dark:to-lightestDBlue rounded-xl z-0`, deleting? 'unbuilt' : 'invBuilt'];
    const profPicClasses = ['w-[2rem] md:w-[3rem] text-pink-900 hover:scale-110 dark:text-blue-500 rounded-full shadow-xl shadow-black', hoveredOn ? 'picVisible' : 'picInvisible'];
    const profActualClasses = ['w-[2rem] h-[2rem] md:w-[3rem] md:h-[3rem] bg-yellow-400 hover:scale-110  shadow-xl shadow-black rounded-full overflow-hidden', hoveredOn ? 'picVisible' : 'picInvisible'];
    const divOnEllipsisShow = [`absolute w-[7rem] md:w-[10rem] right-0 backdrop-blur-xl backdrop-brightness-75 text-darkLighterBlue dark:text-whitish flex flex-col 
    justify-start items-start rounded-lg overflow-hidden shadow-md shadow-black text-[11px] md:text-[13px] z-100`, showControl ? controlDown ? 'controlVisibleFDown -top-[0.2rem] md:top-[2rem]' : 'controlVisible -top-[0.2rem] md:-top-[2rem]' : controlDown ? 'controlInVisibleFDown' : 'controlHidden'];
    
    useEffect(() => {
        if(showControl) {
            const observer = new IntersectionObserver(
                (entries) => {
                    const entry = entries[0];
                    setControlIsIntersecting(entry.isIntersecting);
                }, { rootMargin: '-100px' });
                observer.observe(theControl.current);
                return () => observer.disconnect();
        }
        const observer = new IntersectionObserver(
            (entries) => {
                const entry = entries[0];
                setRefIsIntersecting(entry.isIntersecting);
            }, { rootMargin: '-100px' });
            observer.observe(theRefPoint.current);
            return () => observer.disconnect();
    }, [showControl]);

    useEffect(() => {
        if(!refIsIntersecting && controlIsIntersecting) {
            setControlDown(true);
        } else {
            setControlDown(false);
        }
    }, [controlIsIntersecting, refIsIntersecting]);

    useEffect(() => {
        if(deleting) {
            setTimeout(() => {
                dispatch(DELETEGUEST(props.guest._id));
            }, 500);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [deleting]);

    const confirmPresence = async () => {
        setConfLoading(true);
        try {
            const theResponse = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/adminConfirmGuestPresence`, { id: props.guest._id}, {
                headers: {
                    Authorization: 'Bearer '+ token
                }
            });
            setConfLoading(false);
            setShowControl(false);
            setStatus(theResponse.data.guest.status);
            dispatch(ADDANOTIFICATION({notif: true, isError: false, notifMessage: theResponse.data.message}));
        } catch(err) {
            setConfLoading(false);
            setShowControl(false);
            dispatch(ADDANOTIFICATION({notif: true, isError: true, notifMessage: err.response.data.message}));
        }
    }

    const excludeGuest = async () => {
        setExcludeLoading(true);
        try {
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/excludeGuest`, {id: props.guest._id}, {
                headers: {
                    Authorization: 'Bearer '+ token
                }
            });
            setExcludeLoading(false);
            setShowControl(false);
            setDeleting(true);
            dispatch(ADDANOTIFICATION({notif: true, isError: false, notifMessage: response.data.message}));
        } catch(err) {
            setExcludeLoading(false);
            setShowControl(false);
            dispatch(ADDANOTIFICATION({notif: true, isError: true, notifMessage: err.response.data.message}));
        }
    }


    return (
        <div className={inviteItemClasses.join(' ')} onMouseEnter={() => setHoveredOn(true)} onMouseLeave={() => setHoveredOn(false)} 
        onClick={() => { showControl && setShowControl(false) }}>
            <div className='absolute -top-[1rem] md:-top-[2rem] left-0' ref={theRefPoint}></div>
            {/* profile */}
            { !props.guest.profileUrl ? <UserCircleIcon className={profPicClasses.join(' ')}/> :
            <div className={profActualClasses.join(' ')}>
                <img src={props.guest.profileUrl} alt='' className='w-[100%] h-[100%] object-contain'/>
            </div>}
            {/* Name */}
            <p className='text-[13px] md:text-[15px] w-[35%] truncate text-ellipsis text-center' title={props.guest.name}>{props.guest.name}</p>
            {/* level */}
            <div className='flex justify-center items-center space-x-0 md:space-x-2 w-[20%]' title={props.guest.level}>
                <StarIcon className='w-[1rem] md:w-[2rem] text-yellow-500 shadow-lg shadow-black'/>
                { props.guest.level !== 'ordinary' ? <StarIcon className='w-[1rem] md:w-[2rem] text-yellow-500 shadow-lg shadow-black'/> : null}
                {props.guest.level !== 'ordinary' && props.guest.level !== 'vip' ? <StarIcon className='w-[1rem] md:w-[2rem] text-yellow-500 shadow-lg shadow-black'/> : null }
            </div>
            {/* status */}
            <p className='text-[13px] md:text-[15px] flex justify-start items-center space-x-2'>
                { status === 'pending' ? t('stillPending'): status === 'confirmed' ? t('confirmedInvite') : t('declined')} 
                { status === 'confirmed' ? <CheckBadgeIcon className='w-[1.2rem] md:w-[1.5rem] text-yellow-600'/>: status === 'pending' ? 
                <ClockIcon className='w-[1.2rem] md:w-[1.5rem] text-purple-500'/> : 
                <HandRaisedIcon className='w-[1.2rem] md:w-[1.5rem] text-red-500 dark:text-red-300'/>}
                </p>
                {/* ellipsis */}
            { hoveredOn ? <EllipsisHorizontalIcon className='absolute top-1 right-1 w-[1.3rem] md:w-[2rem] dark:text-whitish 
            text-darkLighterBlue rounded-full hover:bg-pink-400 dark:hover:bg-blue-900 cursor-pointer' title='action?' onClick={() => setShowControl(!showControl)}/> : null}
            {/* the control */}
            <CSSTransition  in={showControl} timeout={500}  mountOnEnter unmountOnExit>
                <div className={divOnEllipsisShow.join(' ')} ref={theControl}>
                    { status === 'pending' ? <p className='w-[100%] py-[0.2rem] hover:text-whitish dark:hover:text-whitish hover:bg-black 
                    cursor-pointer flex justify-center items-center' onClick={() => confirmPresence()}>
                        {t('confirmFromEllipsis')}</p> : null}
                        { confLoading ? 
                            <svg aria-hidden="true" className="inline w-4 h-4 mr-2 text-gray-200 animate-spin dark:text-gray-600 ml-2 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                            </svg>
                        : null}
                    <p className='text-center w-[100%] py-[0.2rem] hover:text-whitish dark:hover:text-whitish hover:bg-black 
                    cursor-pointer flex justify-center items-center' onClick={() => excludeGuest()}>
                        {t('excludeFromEllispsis')}
                        { excludeLoading ? 
                            <svg aria-hidden="true" className="inline w-4 h-4 mr-2 text-gray-200 animate-spin dark:text-gray-600 ml-2 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                            </svg>
                        : null}
                        </p>
                </div>
            </CSSTransition>
        </div>
    );
}

export default InviteItem;