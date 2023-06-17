import React, { useState } from 'react';
import './presentation.css';
import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/24/outline';

function Presentation(props) {
    const [langOpen, setLangOpen] = useState(false);
    return (
        <div className='relative h-[100vh] w-[100%] pt-[5rem] flex flex-col justify-center items-center'>
            <p className='text-gray-300 dark:text-black text-[25px] md:text-[30px] DancingScript font-bold'>We welcome you to the celebration of </p>
            <h1 className='Pacifico text-[40px] md:text-[60px] text-fromBack  text-transparent bg-clip-text bg-gradient-to-r
                 from-marOrange via-white to-marOrange'>Julian <span className='text-marOrange'>&</span> Julianna</h1>
            <h4 className='text-gray-300 dark:text-black text-[25px] md:text-[30px] DancingScript font-bold'>July 4th, 2023</h4>

            <button className='confirmB relative bg-marOrange w-[80%] md:w-auto text-white dark:text-darkLighterBlue p-[1rem] 
            rounded-lg'>Confirm Presence</button>
            { !langOpen ? 
                <p className='absolute right-2 bottom-2 w-[5rem] px-[0.5rem] text-gray-200 text-[13px] flex justify-between items-center duration-75
                hover:backdrop-blur-md hover:cursor-pointer hover:backdrop-brightness-150' onClick={() => setLangOpen(!langOpen)}>
                    <ChevronDownIcon className='text-gray-200 w-[1.5rem]' /> English
                </p> 
            : 
            <p className='absolute right-2 bottom-2 w-[5rem] px-[0.5rem] text-gray-200 text-[13px] flex justify-between items-center duration-75 
            hover:backdrop-blur-md hover:cursor-pointer hover:backdrop-brightness-150' onClick={() => setLangOpen(!langOpen)}>
                <ChevronUpIcon className='text-gray-200 w-[1.5rem]' /> English
            </p>
            }
        </div>
    );
}

export default Presentation;