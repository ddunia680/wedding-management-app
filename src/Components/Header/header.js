import React, { useEffect, useState } from 'react';
import './header.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faListUl, faX, faSun, faMoon } from '@fortawesome/free-solid-svg-icons';
import { UserIcon, NewspaperIcon, HomeIcon, UserCircleIcon } from '@heroicons/react/24/solid';
import icon from '../../images/icon.png';
import { CSSTransition } from 'react-transition-group';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { LOGOUT } from '../../store/authenticate';

function Header(props) {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();

    const [theme, setTheme] = useState('dark');
    const { t } = useTranslation();
    const [showDropMenu, setShowDropM] = useState(false);
    const [showLogoutB, setShowLogoutB] = useState(false);
    const element = document.documentElement;
    const darkQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const token = useSelector(state => state.authenticate.token);
    const email = useSelector(state => state.authenticate.email);

    const DropClasses = [`absolute right-0 dark:backdrop-brightness-75 top-[3rem] font-semibold rounded-bl-lg rounded-br-lg`, showDropMenu ? 
    'dropDownVisible' : 'dropDownNotVisible', location.pathname !== '/' ? 'bg-darkLighterBlue dark:bg-whitish border-[1px] border-darkLighterBlue dark:border-whitish' :
     'bg-transparent backdrop-blur-xl backdrop-brightness-150'];
     
    const adminButtonClasses= `h-[100%] px-[1rem] font-semibold hover:bg-darkLighterBlue hover:text-white duration-75 dark:duration-75 
    rounded-lg ${ location.pathname.includes('adminLog') ? 'bg-darkLighterBlue text-white' : 'bg-transparent dark:text-white text-darkLighterBlue' }`;

    const logoutBClasses = [`absolute top-[2.5rem] left-3 bg-red-700 text-whitish rounded-lg text-[13px] px-[1rem] py-[0.3rem] flex 
    justify-start shadow-lg shadow-black hover:bg-red-500 cursor-pointer`, showLogoutB ? 'LogoutBVisible' : 'LogoutBInVisible'];

    useEffect(() => {
        if(darkQuery.matches === false) {
            setTheme('light');
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        switch (theme) {
            case 'dark':
                element.classList.add('dark');
                break;
            case 'light':
                element.classList.remove('dark');
                break;
            default:
                break;
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [theme]);

    const issueLogout = () => {
        if(location.pathname !== '/' && location.pathname !== '/adminLog') {
            navigate('/adminLog');
          } else {
            navigate('/');
          }
        dispatch(LOGOUT());
    }

    return (
        <div className='h-[3rem] md:h-[5rem] w-[100%] fixed top-0 left-0 backdrop-blur-md backdrop-brightness-150 dark:backdrop-brightness-75 flex 
        justify-between items-center px-5 duration-75 dark:duration-75 z-10' onClick={() => showLogoutB && setShowLogoutB(false)}>
            <div className='w-[3rem] h-[3rem] flex justify-start items-center space-x-2'>
                <img src={icon} alt=''/> 
                <p className='hidden md:block text-[17px] font-semibold text-transparent bg-clip-text bg-gradient-to-r
                 from-marOrange to-gray-700'>Invitation</p>
            </div>
            <div className='hidden md:flex md:w-[60%] xl:w-[30%] h-[90%] justify-evenly items-center rounded-md'>
                { location.pathname !== '/' ? <p className='font-semibold px-[1rem] text-specialPink cursor-pointer duration-75 
                hover:duration-75 dark:hover:text-whitish hover:text-darkLighterBlue hover:underline' onClick={() => navigate('/')}>{t('homeB')}</p> 
                : null}
                <p className='font-semibold px-[1rem] text-specialPink cursor-pointer duration-75 hover:duration-75 hover:text-darkLighterBlue 
                dark:hover:text-whitish hover:underline'>{t('programB')}</p>
                { token ? <p className='font-semibold px-[1rem] text-specialPink cursor-pointer duration-75 hover:duration-75 hover:text-darkLighterBlue 
                dark:hover:text-whitish hover:underline'>{t('scanQRB')}</p> : null}
                <button className={adminButtonClasses} onClick={() => { token ? navigate('/adminLog/manage') : navigate('/adminLog')}}>
                    {t('adminB')}
                </button>
                { token ? <div className='relative w-[3rem] min-w-[2rem] h-[3rem] min-h-[2rem] hover:bg-gray-700 bg-gray-300 rounded-full'
                 title={email} onClick={() => setShowLogoutB(!showLogoutB)}>
                    <UserCircleIcon className='w-[3rem]'/>
                    <CSSTransition in={showLogoutB} timeout={300} mountOnEnter unmountOnExit>
                        <p className={logoutBClasses.join(' ')} title={t('logoutB')} onClick={() => issueLogout()}>
                            {t('logoutB')} <UserCircleIcon className='text-whitish w-[1rem]'/>
                    </p>
                    </CSSTransition>
                    
                </div> : null}
                <div className='hidden w-[3rem] md:w-[4rem] md:min-w-[4rem] h-[1.7rem] md:h-[2rem] bg-darkLighterBlue dark:bg-white rounded-full 
                mx-[1rem] md:flex items-center duration-75 dark:duration-75 justify-start dark:justify-end' 
                onClick={() => (setTheme(curr => curr === 'dark' ? 'light' : 'dark'))}>
                    <div className='bg-white dark:bg-darkLighterBlue rounded-full h-[1.6rem] md:h-[1.8rem] w-[1.6rem] md:w-[1.8rem] 
                    mx-[0.1rem] md:mx-[0.2rem] flex justify-center items-center duration-75 dark:duration-75'>
                        <FontAwesomeIcon icon={ theme === 'dark' ? faMoon : faSun } className=' w-[0.7rem] md:w-[1rem] text-darkLighterBlue 
                        dark:text-white duration-75 dark:duration-75' onClick={() => (setTheme(curr => curr === 'dark' ? 'light' : 'dark'))} 
                        title={theme === 'dark' ? 'Turn to Light mode' : 'Turn to Dark Mode'} />
                    </div>
                </div>
            </div>
            {/* Small screen */}
            <div className='flex md:hidden w-[30%] h-[90%] justify-evenly items-center rounded-md'>
                <div className='w-[3rem] h-[1.7rem] bg-darkLighterBlue dark:bg-white rounded-full 
                    mx-[1rem] flex md:hidden items-center duration-75 dark:duration-75 justify-start dark:justify-end' 
                    onClick={() => {setTheme(curr => curr === 'dark' ? 'light' : 'dark')} }>
                        <div className='bg-white dark:bg-darkLighterBlue rounded-full h-[1.6rem] md:h-[1.8rem] w-[1.6rem] md:w-[1.8rem] 
                        mx-[0.1rem] md:mx-[0.2rem] flex justify-center items-center duration-75 dark:duration-75'>
                            <FontAwesomeIcon icon={ theme === 'dark' ? faMoon : faSun } className=' w-[0.7rem] md:w-[1rem] text-darkLighterBlue 
                            dark:text-white duration-75 dark:duration-75' onClick={() => (setTheme(curr => curr === 'dark' ? 'light' : 'dark'))} 
                            title={theme === 'dark' ? 'Turn to Light mode' : 'Turn to Dark Mode'} />
                        </div>
                </div>
                {!showDropMenu ? 
                <FontAwesomeIcon icon={faListUl} className='text-darkLighterBlue dark:text-white text-xl duration-75' onClick={() => setShowDropM(!showDropMenu)}/>
                :
                <FontAwesomeIcon icon={faX} className='text-darkLighterBlue dark:text-white text-xl duration-75' onClick={() => setShowDropM(!showDropMenu)}/> }
            </div>
            <CSSTransition in={showDropMenu} timeout={300} mountOnEnter unmountOnExit>
                <div className={DropClasses.join(' ')}>
                { location.pathname !== '/' ? <p className=' px-[1rem] py-[0.3rem] text-[13px] text-whitish dark:text-gray-500 flex 
                justify-start' onClick={() => {
                    navigate('/');
                    setShowDropM(false);
                    }}>
                        {t('homeB')} <HomeIcon className='w-[1rem]'/>
                    </p> : null}
                    <p className=' px-[1rem] py-[0.3rem] text-[13px] text-whitish dark:text-gray-500 flex justify-start'>
                        {t('programB')} <NewspaperIcon className='w-[1rem]'/>
                    </p>
                    { token ? <p className=' px-[1rem] py-[0.3rem] text-[13px] text-whitish dark:text-gray-500 flex justify-start'>
                        {t('scanQRB')} <NewspaperIcon className='w-[1rem]'/>
                    </p> : null}
                    <p className='bg-white dark:bg-darkLighterBlue dark:text-white rounded-lg text-[13px] px-[1rem] py-[0.3rem] flex justify-start'
                    onClick={() => navigate('/adminLog')}>
                        {t('adminB')} <UserIcon className='text-specialPink w-[1rem]'/>
                    </p>
                    { token ? <p className=' px-[1rem] py-[0.3rem] text-[13px] text-red-700 flex justify-start' onClick={() => issueLogout()}>
                        {t('logoutB')} <UserCircleIcon className='w-[1rem]'/>
                    </p> : null}
                </div>
            </CSSTransition>
        </div>
    );
}

export default Header;