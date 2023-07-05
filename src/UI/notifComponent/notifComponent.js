import React from 'react';
import { ShieldExclamationIcon, BellAlertIcon } from '@heroicons/react/24/solid';
import { useDispatch, useSelector } from 'react-redux';
import { HIDENOTIFVIEW } from '../../store/notifHandler';
 
import './notifComponent.css';

function NotifComponent(props) {
    const dispatch = useDispatch();
    const aNotification = useSelector(state => state.notifHandler.aNotification);
    const notifMessage = useSelector(state => state.notifHandler.notifMessage);
    const isError = useSelector(state => state.notifHandler.isError);
    
    const wrapperClasses = [`absolute bottom-5 right-1 py-3 md:py-5 shadow-lg shadow-black 
    rounded-md flex justify-between items-center space-x-2 px-2 text-[13px]`, isError ? 'bg-darkLighterBlue dark:bg-red-200' : 
    'bg-darkLighterBlue dark:bg-blue-200', aNotification ? 'showNotif' : 'hideNotif'];

    const textClasses = [ isError ? 'text-red-100 dark:text-red-700' : 'text-blue-100 dark:text-darkLighterBlue'];

    return (
        <div className={wrapperClasses.join(' ')} title='click to dismiss' onClick={() => dispatch(HIDENOTIFVIEW())}>
            { isError ? <ShieldExclamationIcon className='w-[1.5rem] text-red-700'/> : <BellAlertIcon className='w-[1.5rem] text-blue-700'/>}
            <p className={textClasses.join(' ')}>{notifMessage}</p>
        </div>
    );
}

export default NotifComponent;