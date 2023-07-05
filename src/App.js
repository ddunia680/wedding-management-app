import { Suspense, useEffect } from 'react';
import './App.css';
import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';

import enTranslation from './utility/enTranslation';
import frTranslation from './utility/frTranslation';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import WelcomePage from './Containers/welcomePage/welcomePage';
import AdminLogin from './Containers/adminLogin/adminLogin';
import InvitationsManagement from './Containers/InvitatationsManagement/invitationsManagement';
import { useDispatch, useSelector } from 'react-redux';
import { KEPTAUTHENTICATED, LOGOUT } from './store/authenticate';
import { CSSTransition } from 'react-transition-group';

import wedding from './images/wedding.jpg';
import NotifComponent from './UI/notifComponent/notifComponent';
import { HIDENOTIFVIEW } from './store/notifHandler';

const translationsEn = enTranslation;
const translationsFr = frTranslation;

i18next.use(initReactI18next)
.init({
  resources: {
    en: { translation: translationsEn },
    fr: { translation: translationsFr },
  },
  lng: 'en',
  fallbackLng: 'en',
  interpolation: { escapeValue: false }
});

function App() {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const token = useSelector(state => state.authenticate.token);
  const aNotification = useSelector(state => state.notifHandler.aNotification);
  const expiryDate = localStorage.getItem('expiryDate');
  const storedToken = localStorage.getItem('token');

  useEffect(() => {
    if(aNotification) {
      setTimeout(() => {
        dispatch(HIDENOTIFVIEW());
      }, 5000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [aNotification]);

  useEffect(() => {
    if(new Date(expiryDate).getTime() <= new Date().getTime()) {
      if(location.pathname !== '/' && location.pathname !== '/adminLog') {
        navigate('/adminLog');
      } else {
        navigate('/');
      }
      dispatch(LOGOUT());
    }

    if(!token && storedToken) {
      const newTimeout = new Date(expiryDate).getTime() - new Date().getTime();
      console.log('admin auth expires in '+ newTimeout );
      dispatch(KEPTAUTHENTICATED());
      operateLogout(newTimeout);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const operateLogout = (milliseconds) => {
    setTimeout(() => {
      if(location.pathname !== '/' && location.pathname !== '/adminLog') {
        navigate('/adminLog');
      } else {
        navigate('/');
      }
      dispatch(LOGOUT());
    }, milliseconds); 
  }

  return (
    <Suspense>
      <div className="App relative">
        <div className='absolute top-0 left-0 w-[100vw] h-[100vh] overflow-hidden -z-50'>
          <img src={wedding} alt='theBack' className=' theBack w-[100%] h-[100%] object-cover'/>
        </div>
        <Routes>
          <Route path='/' element={<WelcomePage/>}/>
          <Route path='/adminLog'>
            <Route index element={<AdminLogin/>}/>
            { token ? <Route path='manage' element={ <InvitationsManagement/>} /> : null}
          </Route>
          <Route path='*' element={<p>Page not found</p>} />
        </Routes>
        <CSSTransition in={aNotification} timeout={300} mountOnEnter unmountOnExit>
          <NotifComponent/>
        </CSSTransition>
        
      </div>
    </Suspense>
  );
}

export default App;
