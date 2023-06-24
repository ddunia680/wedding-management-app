import { Suspense } from 'react';
import './App.css';
import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';

import enTranslation from './utility/enTranslation';
import frTranslation from './utility/frTranslation';
import { Route, Routes } from 'react-router-dom';
import WelcomePage from './Containers/welcomePage/welcomePage';
import AdminLogin from './Containers/adminLogin/adminLogin';
import InvitationsManagement from './Containers/InvitatationsManagement/invitationsManagement';

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
  return (
    <Suspense>
      <div className="App">
        <Routes>
          <Route path='/' element={<WelcomePage/>}/>
          <Route path='/adminLog'>
            <Route index element={<AdminLogin/>}/>
            <Route path='manage' element={<InvitationsManagement/>} />
          </Route>
        </Routes>
      </div>
    </Suspense>
  );
}

export default App;
