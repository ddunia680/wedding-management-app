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
import { FaceFrownIcon, FaceSmileIcon } from '@heroicons/react/24/outline';

import wedding from './images/wedding.jpg';
import NotifComponent from './UI/notifComponent/notifComponent';
import { HIDENOTIFVIEW } from './store/notifHandler';
import io from './utility/socket';
import sendNotif from './utility/sendNotif';
import QRCodeDisplay from './Components/QRCodeDisplay/QRCodeDisplay';
import ScanQRCode from './Components/scanQRCode/scanQRCode';
import SendInviteControl from './Components/sendInviteControl/sendInviteControl';
import { SHOWINVITEPOPUP } from './store/adminUI';
import axios from 'axios';

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
  const showInviteSendPopup = useSelector(state => state.adminUI.showInviteSendPopup);
//  console.log(new Date().getMonth());
  useEffect(() => {
    if(!('Notification' in window)) {
        console.log("browser doesn't support notifications");
    } else {
        Notification.requestPermission()
    }
  }, []);

  useEffect(() => {
    if(token && new Date().getDate() === 29 && new Date().getMonth() === 7) {
      axios.get(`${process.env.REACT_APP_BACKEND_URL}/checkQRStatus`, { headers: { Authorization: 'Bearer '+ token }})
      .then(res => {
        // console.log(res.data.sent);
        !res.data.sent && dispatch(SHOWINVITEPOPUP());
      })
      .catch(err => { console.warn(err.response.data.message); })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  useEffect(() => {
    if(io.getIO()) {
      io.getIO().on('gotConfirmation', guest => {
        const data = {
          title: 'Invitation accepted',
          body: `${guest.name} has confirmed their presence ${<FaceSmileIcon className='w-[5px] text-yellow-600' />}`,
          icon: guest.profileUrl ? guest.profileUrl : null
        }
        sendNotif(data);
      });

      io.getIO().on('gotRejection', guest => {
        const data = {
          title: 'Invitation rejected',
          body: `${guest.name} won't be attending ${<FaceFrownIcon className='w-[5px] text-yellow-600' />}`,
          icon: guest.profileUrl ? guest.profileUrl : null
        }
        sendNotif(data);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      if(location.pathname.length === 25) {
        navigate('/');
      } else if(location.pathname.includes('myQRCode')) {
        navigate(`${location.pathname}`);
      } else if(location.pathname !== '/' && location.pathname !== '/adminLog') {
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
      const socket = io.init(process.env.REACT_APP_BACKEND_URL);
      socket.emit('adminJoin', localStorage.getItem('id'));
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
          <Route path='/:id' element={<WelcomePage/>} />
          <Route path='/adminLog'>
            <Route index element={<AdminLogin/>}/>
            { token ? <Route path='manage' element={ <InvitationsManagement/>} /> : null}
          </Route>
          <Route path='/myQRCode/:id' element={<QRCodeDisplay/>}/>
          <Route path='/scanQRCode' element={<ScanQRCode/>}/>
          <Route path='*' element={<p>Page not found</p>} />
        </Routes>
        <CSSTransition in={aNotification} timeout={300} mountOnEnter unmountOnExit>
          <NotifComponent/>
        </CSSTransition>
        { showInviteSendPopup ? 
        <CSSTransition in={showInviteSendPopup} timeout={300} mountOnEnter unmountOnExit>
          <SendInviteControl/>
        </CSSTransition>
         
        : null}
      </div>
    </Suspense>
  );
}

export default App;
