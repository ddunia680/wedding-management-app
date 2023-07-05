import React, { useState } from 'react';
import { UserCircleIcon, StarIcon, CheckBadgeIcon, ClockIcon } from '@heroicons/react/24/solid';
import { EllipsisHorizontalIcon} from '@heroicons/react/24/outline';
// import pic from  '../../images/wedPic.png';

import './inviteItem.css';
import { useTranslation } from 'react-i18next';
import { CSSTransition } from 'react-transition-group';

function InviteItem(props) {
    const { t } = useTranslation();
    const [hoveredOn, setHoveredOn] = useState(false);
    const [showControl, setShowControl] = useState(false);

    const profPicClasses = ['w-[2rem] md:w-[3rem] text-pink-900 hover:scale-110 dark:text-blue-500 rounded-full shadow-xl shadow-black', hoveredOn ? 'picVisible' : 'picInvisible'];
    const profActualClasses = ['w-[2rem] h-[2rem] md:w-[3rem] md:h-[3rem] bg-yellow-400 hover:scale-110  shadow-xl shadow-black rounded-full overflow-hidden', hoveredOn ? 'picVisible' : 'picInvisible'];
    const divOnEllipsisShow = `absolute w-[10rem] -top-[2.5rem] right-0 backdrop-blur-xl backdrop-brightness-75 text-darkLighterBlue dark:text-whitish flex flex-col 
    justify-start items-start rounded-lg overflow-hidden shadow-md shadow-black text-[13px] ${showControl ? 'controlVisible' : 'controlHidden'}`;
    
    return (
        <div className='invBuilt relative w-[100%] py-[0.5rem] md:py-[1rem] dark:text-whitish text-darkLighterBlue flex justify-evenly items-center px-[2rem] 
        shadow-2xl bg-pink-300 dark:bg-gradient-to-br dark:from-lightestDBlue dark:to-lightestDBlue rounded-xl'
        onMouseEnter={() => setHoveredOn(true)} onMouseLeave={() => setHoveredOn(false)} onClick={() => { showControl && setShowControl(false) }}>
            { !props.guest.profileUrl ? <UserCircleIcon className={profPicClasses.join(' ')}/> :
            <div className={profActualClasses.join(' ')}>
                <img src={props.guest.profileUrl} alt='' className='w-[100%] h-[100%] object-contain'/>
            </div>}
            <p className='text-[13px] md:text-[15px] w-[35%] truncate text-ellipsis text-center' title={props.guest.name}>{props.guest.name}</p>
            <div className='flex justify-center items-center space-x-0 md:space-x-2 w-[20%]' title={props.guest.level}>
                <StarIcon className='w-[1rem] md:w-[2rem] text-yellow-500 shadow-lg shadow-black'/>
                { props.guest.level !== 'ordinary' ? <StarIcon className='w-[1rem] md:w-[2rem] text-yellow-500 shadow-lg shadow-black'/> : null}
                {props.guest.level !== 'ordinary' && props.guest.level !== 'vip' ? <StarIcon className='w-[1rem] md:w-[2rem] text-yellow-500 shadow-lg shadow-black'/> : null }
            </div>
            <p className='text-[13px] md:text-[15px] flex justify-start items-center space-x-2'>
                { props.guest.status === 'pending' ? t('stillPending') : t('confirmedInvite')} 
                { !props.guest.status === 'pending' ? <CheckBadgeIcon className='w-[1.2rem] md:w-[1.5rem] text-yellow-400'/> : <ClockIcon className='w-[1.2rem] md:w-[1.5rem] text-purple-500'/>}
                </p>
            { hoveredOn ? <EllipsisHorizontalIcon className='absolute top-1 right-1 w-[1.3rem] md:w-[2rem] dark:text-whitish 
            text-darkLighterBlue rounded-full hover:bg-pink-400 dark:hover:bg-blue-900 cursor-pointer' title='action?' onClick={() => setShowControl(!showControl)}/> : null}
            <CSSTransition  in={showControl} timeout={500}  mountOnEnter unmountOnExit>
                <div className={divOnEllipsisShow}>
                    <p className='text-center w-[100%] py-[0.2rem] hover:text-whitish dark:hover:text-whitish hover:bg-black cursor-pointer' onClick={() => setShowControl(false)}>
                        {t('confirmFromEllipsis')}</p>
                    <p className='text-center w-[100%] py-[0.2rem] hover:text-whitish dark:hover:text-whitish hover:bg-black cursor-pointer' onClick={() => setShowControl(false)}>
                        {t('excludeFromEllispsis')}</p>
                </div>
            </CSSTransition>
            
        </div>
    );
}

export default InviteItem;