import { Suspense } from 'react';
import './App.css';
import Header from './Containers/Header/header';
import Presentation from './Containers/Presentation/presentation';
import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';

import enTranslation from './utility/enTranslation';
import frTranslation from './utility/frTranslation';

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
  // const { t } = useTranslation();
  return (
    <Suspense>
      <div className="App">
        <Header/>
        <Presentation/>
      </div>
    </Suspense>
  );
}

export default App;
