import React from 'react';
import { UserCircleIcon } from '@heroicons/react/24/solid';

function InviteItem(props) {
    return (
        <div className='w-[100%] py-2 flex justify-evenly items-center'>
            <UserCircleIcon className='w-[2rem]'/>
        </div>
    );
}

export default InviteItem;