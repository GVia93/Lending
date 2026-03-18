import { useCallback } from 'react';
import { trackAnalyticsEvent } from '../components/Analytics';

/**
 * Хук для удобного отслеживания событий аналитики
 */
export default function useAnalytics() {
  
  // Отслеживание кликов на калькулятор
  const trackCalculatorStart = useCallback((serviceSlug) => {
    trackAnalyticsEvent('calculator_start', {
      event_category: 'engagement',
      service: serviceSlug,
    });
  }, []);

  // Отслеживание шагов калькулятора
  const trackCalculatorStep = useCallback((step, serviceSlug, data = {}) => {
    trackAnalyticsEvent('calculator_step', {
      event_category: 'engagement',
      step_number: step,
      service: serviceSlug,
      ...data,
    });
  }, []);

  // Отслеживание завершения расчёта
  const trackCalculatorComplete = useCallback((data) => {
    trackAnalyticsEvent('calculator_complete', {
      event_category: 'engagement',
      service: data.service,
      area: data.area,
      height: data.height,
      total_price: data.totalPrice,
      currency: 'RUB',
    });
  }, []);

  // Отслеживание отправки формы из калькулятора
  const trackCalculatorFormSubmit = useCallback((data) => {
    trackAnalyticsEvent('calculator_lead_submit', {
      event_category: 'conversion',
      service: data.service,
      total_price: data.totalPrice,
      currency: 'RUB',
      value: data.totalPrice,
    });
  }, []);

  // Отслеживание отправки контактной формы
  const trackContactFormSubmit = useCallback((serviceType) => {
    trackAnalyticsEvent('contact_form_submit', {
      event_category: 'conversion',
      service_type: serviceType,
    });
  }, []);

  // Отслеживание клика на телефон
  const trackPhoneClick = useCallback((location = 'header') => {
    trackAnalyticsEvent('phone_click', {
      event_category: 'lead',
      click_location: location,
    });
  }, []);

  // Отслеживание клика на CTA кнопку
  const trackCTAClick = useCallback((ctaName, location) => {
    trackAnalyticsEvent('cta_click', {
      event_category: 'engagement',
      cta_name: ctaName,
      click_location: location,
    });
  }, []);

  // Отслеживание клика на карточку услуги
  const trackServiceClick = useCallback((serviceSlug, serviceName) => {
    trackAnalyticsEvent('service_card_click', {
      event_category: 'engagement',
      service_slug: serviceSlug,
      service_name: serviceName,
    });
  }, []);

  // Отслеживание просмотра портфолио
  const trackPortfolioView = useCallback((projectId, projectTitle) => {
    trackAnalyticsEvent('portfolio_view', {
      event_category: 'engagement',
      project_id: projectId,
      project_title: projectTitle,
    });
  }, []);

  // Отслеживание фильтра портфолио
  const trackPortfolioFilter = useCallback((category) => {
    trackAnalyticsEvent('portfolio_filter', {
      event_category: 'engagement',
      category: category,
    });
  }, []);

  // Отслеживание прокрутки до секции
  const trackSectionScroll = useCallback((sectionName) => {
    trackAnalyticsEvent('section_scroll', {
      event_category: 'engagement',
      section: sectionName,
    });
  }, []);

  // Отслеживание скачивания файла
  const trackFileDownload = useCallback((fileName, fileType) => {
    trackAnalyticsEvent('file_download', {
      event_category: 'engagement',
      file_name: fileName,
      file_type: fileType,
    });
  }, []);

  // Отслеживание открытия FAQ
  const trackFAQOpen = useCallback((question) => {
    trackAnalyticsEvent('faq_open', {
      event_category: 'engagement',
      question: question,
    });
  }, []);

  return {
    trackCalculatorStart,
    trackCalculatorStep,
    trackCalculatorComplete,
    trackCalculatorFormSubmit,
    trackContactFormSubmit,
    trackPhoneClick,
    trackCTAClick,
    trackServiceClick,
    trackPortfolioView,
    trackPortfolioFilter,
    trackSectionScroll,
    trackFileDownload,
    trackFAQOpen,
  };
}
