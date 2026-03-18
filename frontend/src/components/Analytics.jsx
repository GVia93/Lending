import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ReactGA from 'react-ga4';

// Инициализация аналитики
export const initAnalytics = () => {
  // Google Analytics 4
  const GA4_ID = process.env.REACT_APP_GA4_MEASUREMENT_ID;
  if (GA4_ID) {
    ReactGA.initialize(GA4_ID, {
      gaOptions: {
        siteSpeedSampleRate: 100,
      },
    });
    console.log('✅ Google Analytics 4 initialized:', GA4_ID);
  } else {
    console.warn('⚠️ GA4_MEASUREMENT_ID not found in environment variables');
  }

  // Яндекс.Метрика
  const YM_ID = process.env.REACT_APP_YANDEX_METRIKA_ID;
  if (YM_ID && window.ym) {
    console.log('✅ Яндекс.Метрика initialized:', YM_ID);
  } else if (YM_ID) {
    console.warn('⚠️ Яндекс.Метрика script not loaded yet');
  } else {
    console.warn('⚠️ YANDEX_METRIKA_ID not found in environment variables');
  }
};

// Компонент для отслеживания переходов между страницами
export default function Analytics() {
  const location = useLocation();

  useEffect(() => {
    // Отправка pageview в Google Analytics
    ReactGA.send({ 
      hitType: 'pageview', 
      page: location.pathname + location.search,
      title: document.title 
    });

    // Отправка pageview в Яндекс.Метрику
    const YM_ID = process.env.REACT_APP_YANDEX_METRIKA_ID;
    if (window.ym && YM_ID) {
      window.ym(YM_ID, 'hit', location.pathname + location.search, {
        title: document.title
      });
    }

    console.log('📊 Page view tracked:', location.pathname);
  }, [location]);

  return null;
}

// Функция для отправки событий в Google Analytics
export const trackEvent = (eventName, params = {}) => {
  ReactGA.event(eventName, params);
  console.log('📊 GA4 Event:', eventName, params);
};

// Функция для отправки событий в Яндекс.Метрику
export const trackYMEvent = (eventName, params = {}) => {
  const YM_ID = process.env.REACT_APP_YANDEX_METRIKA_ID;
  if (window.ym && YM_ID) {
    window.ym(YM_ID, 'reachGoal', eventName, params);
    console.log('📊 YM Event:', eventName, params);
  }
};

// Универсальная функция для отправки событий в обе системы
export const trackAnalyticsEvent = (eventName, params = {}) => {
  // Google Analytics 4
  trackEvent(eventName, params);
  
  // Яндекс.Метрика
  trackYMEvent(eventName, params);
};
