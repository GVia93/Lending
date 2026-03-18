import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { ArrowRight, Check, Calculator, Phone } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import SEO from "../components/SEO";
import Breadcrumbs from "../components/Breadcrumbs";
import CalculatorSection from "../components/CalculatorSection";
import PortfolioSection from "../components/PortfolioSection";
import TestimonialsSection from "../components/TestimonialsSection";
import FAQSection from "../components/FAQSection";
import ContactSection from "../components/ContactSection";
import { Button } from "../components/ui/button";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

// SEO данные для каждой услуги
const SERVICE_SEO = {
  "hangars": {
    title: "Строительство ангаров в Москве и Московской области | М-СТРОЙ",
    description: "Строительство металлических ангаров под ключ в Москве и МО. Арочные, прямостенные, каркасные конструкции. Гарантия 5 лет. Точно в срок. От 8500 руб/м². ☎ 8 (800) 123-45-67",
    keywords: "строительство ангаров москва, ангары под ключ, металлические ангары, арочные ангары, строительство ангаров московская область",
    h1: "Строительство ангаров в Москве и Московской области",
    subtitle: "Проектирование и строительство металлических ангаров любой сложности под ключ",
    features: [
      "Арочные, прямостенные и каркасные конструкции",
      "Проектирование с учетом ваших требований",
      "Монтаж в срок от 30 дней",
      "Гарантия качества 5 лет",
      "Собственное производство металлоконструкций",
      "Любые размеры от 100 до 10000 м²"
    ],
    useCases: [
      "Складские помещения для хранения товаров и материалов",
      "Производственные цеха и промышленные объекты",
      "Сельскохозяйственные ангары для техники",
      "Логистические комплексы и распределительные центры"
    ]
  },
  "grain-storage": {
    title: "Строительство зернохранилищ в Москве и МО | Современные технологии | М-СТРОЙ",
    description: "Строительство современных зернохранилищ в Москве и Московской области. Системы вентиляции и климат-контроля. Под ключ. От 11000 руб/м². Гарантия 5 лет. ☎ 8 (800) 123-45-67",
    keywords: "строительство зернохранилищ москва, зернохранилища под ключ, элеваторы, зернохранилища московская область",
    h1: "Строительство зернохранилищ в Москве и МО",
    subtitle: "Современные зернохранилища с системами вентиляции и контроля температуры",
    features: [
      "Системы вентиляции и климат-контроля",
      "Контроль температуры и влажности",
      "Модульная и капитальная конструкция",
      "Автоматизированные системы загрузки",
      "Соответствие ГОСТ и санитарным нормам",
      "Вместимость от 500 до 10000 тонн"
    ],
    useCases: [
      "Хранение зерновых культур (пшеница, ячмень, рожь)",
      "Элеваторы для агрохолдингов",
      "Зернохранилища для фермерских хозяйств",
      "Перевалочные комплексы"
    ]
  },
  "garages": {
    title: "Строительство промышленных гаражей в Москве | Гаражные боксы | М-СТРОЙ",
    description: "Строительство промышленных гаражей и боксов в Москве и МО. Для грузовой техники и спецтранспорта. Утепление, отопление, смотровые ямы. От 7000 руб/м². ☎ 8 (800) 123-45-67",
    keywords: "строительство промышленных гаражей москва, гаражные боксы, гаражи для грузовой техники, промышленные гаражи московская область",
    h1: "Строительство промышленных гаражей в Москве",
    subtitle: "Возведение промышленных гаражей и боксов для хранения техники и транспорта",
    features: [
      "Гаражи для грузовой и спецтехники",
      "Боксы с утеплением и отоплением",
      "Смотровые ямы и подъемники",
      "Секционные ворота с автоматикой",
      "Электроснабжение и освещение",
      "Модульная система расширения"
    ],
    useCases: [
      "Гаражи для логистических компаний",
      "Боксы для автопарков и автобаз",
      "Хранение строительной техники",
      "Сервисные центры и СТО"
    ]
  },
  "demolition": {
    title: "Демонтаж зданий и сооружений в Москве и МО | Профессионально | М-СТРОЙ",
    description: "Профессиональный демонтаж зданий и сооружений в Москве и Московской области. Вывоз мусора, расчистка территории. Все документы. От 3500 руб/м². ☎ 8 (800) 123-45-67",
    keywords: "демонтаж зданий москва, демонтаж сооружений, снос зданий, демонтаж московская область, вывоз строительного мусора",
    h1: "Демонтаж зданий и сооружений в Москве и МО",
    subtitle: "Профессиональный демонтаж с вывозом строительного мусора и оформлением документов",
    features: [
      "Демонтаж любой сложности",
      "Вывоз и утилизация строительного мусора",
      "Переработка и рециклинг материалов",
      "Расчистка и планировка территории",
      "Оформление всех документов",
      "Соблюдение норм безопасности"
    ],
    useCases: [
      "Демонтаж промышленных объектов и цехов",
      "Снос ветхих зданий и сооружений",
      "Демонтаж металлоконструкций",
      "Подготовка площадок под новое строительство"
    ]
  }
};

export default function ServicePage() {
  const { slug } = useParams();
  const [service, setService] = useState(null);
  const [services, setServices] = useState([]);
  const [prices, setPrices] = useState({});
  const [portfolio, setPortfolio] = useState([]);
  const [testimonials, setTestimonials] = useState([]);

  const seoData = SERVICE_SEO[slug];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [svcRes, priceRes, portRes, testRes] = await Promise.all([
          axios.get(`${API}/services`),
          axios.get(`${API}/prices`),
          axios.get(`${API}/portfolio`),
          axios.get(`${API}/testimonials`),
        ]);
        
        setServices(svcRes.data);
        setPrices(priceRes.data);
        setPortfolio(portRes.data);
        setTestimonials(testRes.data);
        
        // Найти текущую услугу
        const currentService = svcRes.data.find(s => s.slug === slug);
        setService(currentService);
      } catch (e) {
        console.error("Failed to load data:", e);
      }
    };
    fetchData();
  }, [slug]);

  const scrollTo = (id) => {
    const el = document.querySelector(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  if (!service || !seoData) {
    return <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
      <div className="text-white">Загрузка...</div>
    </div>;
  }

  // JSON-LD для услуги
  const schemaData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "name": service.name,
        "description": service.description,
        "provider": {
          "@type": "Organization",
          "name": "М-СТРОЙ",
          "telephone": "+7-800-123-45-67",
          "address": {
            "@type": "PostalAddress",
            "addressLocality": "Москва",
            "addressRegion": "Московская область",
            "addressCountry": "RU"
          }
        },
        "areaServed": [
          {
            "@type": "City",
            "name": "Москва"
          },
          {
            "@type": "State",
            "name": "Московская область"
          }
        ],
        "offers": {
          "@type": "Offer",
          "price": service.price_per_sqm,
          "priceCurrency": "RUB",
          "priceSpecification": {
            "@type": "UnitPriceSpecification",
            "price": service.price_per_sqm,
            "priceCurrency": "RUB",
            "unitText": "м²"
          }
        }
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Главная",
            "item": process.env.REACT_APP_BACKEND_URL?.replace('/api', '') || 'https://m-stroy.ru'
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Услуги",
            "item": `${process.env.REACT_APP_BACKEND_URL?.replace('/api', '')}/services`
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": service.name,
            "item": `${process.env.REACT_APP_BACKEND_URL?.replace('/api', '')}/services/${slug}`
          }
        ]
      }
    ]
  };

  const filteredPortfolio = portfolio.filter(p => p.category === slug);

  return (
    <div className="min-h-screen bg-[#0A0A0A]" data-testid="service-page">
      <SEO 
        title={seoData.title}
        description={seoData.description}
        keywords={seoData.keywords}
        ogImage={service.image_url}
        schemaData={schemaData}
      />
      
      <Header />
      
      {/* Hero Section */}
      <section className="relative pt-24 lg:pt-32 pb-16 lg:pb-24 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={service.image_url}
            alt={service.name}
            className="w-full h-full object-cover"
            loading="eager"
          />
          <div className="hero-overlay absolute inset-0" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs items={[
            { label: "Услуги", href: "/#services" },
            { label: service.name }
          ]} />

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mt-8"
          >
            <h1 
              className="text-3xl sm:text-4xl lg:text-6xl font-extrabold text-white leading-tight mb-6"
              style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
            >
              {seoData.h1}
            </h1>
            
            <p className="text-lg lg:text-xl text-neutral-300 mb-8 max-w-3xl leading-relaxed">
              {seoData.subtitle}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Button
                onClick={() => scrollTo("#calculator")}
                className="bg-orange-500 hover:bg-orange-600 text-white font-bold text-base px-8 py-6"
                data-testid="service-hero-calc-btn"
              >
                <Calculator className="w-5 h-5 mr-2" />
                Рассчитать стоимость
              </Button>
              <a href="tel:+78001234567">
                <Button
                  variant="outline"
                  className="border-neutral-600 text-white hover:bg-white/5 font-semibold text-base px-8 py-6 w-full sm:w-auto"
                >
                  <Phone className="w-5 h-5 mr-2" />
                  8 (800) 123-45-67
                </Button>
              </a>
            </div>

            {/* Price badge */}
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-orange-500/10 border border-orange-500/30 backdrop-blur-sm">
              <span className="text-neutral-400 text-sm">Стоимость от</span>
              <span className="text-2xl font-bold text-orange-500 font-mono-tech">
                {service.price_per_sqm.toLocaleString("ru-RU")} ₽/м²
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 lg:py-24 bg-[#0A0A0A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Features list */}
            <div>
              <h2 
                className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-8"
                style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
              >
                Что входит в услугу
              </h2>
              <div className="space-y-4">
                {seoData.features.map((feature, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex items-start gap-3"
                  >
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-orange-500/10 border border-orange-500/30 flex items-center justify-center mt-0.5">
                      <Check className="w-4 h-4 text-orange-500" />
                    </div>
                    <span className="text-neutral-300 leading-relaxed">{feature}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Use cases */}
            <div>
              <h2 
                className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-8"
                style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
              >
                Области применения
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {seoData.useCases.map((useCase, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="p-5 bg-[#171717] border border-neutral-800 hover:border-orange-500/30 transition-colors"
                  >
                    <ArrowRight className="w-5 h-5 text-orange-500 mb-3" />
                    <p className="text-sm text-neutral-300 leading-relaxed">{useCase}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Calculator */}
      <CalculatorSection services={[service]} prices={prices} />

      {/* Portfolio (filtered) */}
      {filteredPortfolio.length > 0 && (
        <section className="py-16 lg:py-24 bg-[#0F172A]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 
              className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-12"
              style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
            >
              Наши проекты: {service.name}
            </h2>
            <PortfolioSection portfolio={filteredPortfolio} hideFilters={true} />
          </div>
        </section>
      )}

      {/* Testimonials */}
      <TestimonialsSection testimonials={testimonials} />

      {/* FAQ */}
      <FAQSection />

      {/* Contact */}
      <ContactSection services={services} />

      {/* CTA Section */}
      <section className="py-16 lg:py-20 bg-gradient-to-b from-[#0A0A0A] to-[#0F172A]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 
            className="text-3xl sm:text-4xl font-bold text-white mb-6"
            style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
          >
            Готовы начать проект?
          </h2>
          <p className="text-lg text-neutral-400 mb-8">
            Свяжитесь с нами для бесплатной консультации и расчёта стоимости
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => scrollTo("#contact")}
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold text-base px-8 py-6"
            >
              Оставить заявку
            </Button>
            <a href="tel:+78001234567">
              <Button
                variant="outline"
                className="border-neutral-600 text-white hover:bg-white/5 font-semibold text-base px-8 py-6 w-full sm:w-auto"
              >
                <Phone className="w-5 h-5 mr-2" />
                Позвонить сейчас
              </Button>
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
