import { useState, useEffect } from "react";
import axios from "axios";
import Header from "../components/Header";
import HeroSection from "../components/HeroSection";
import ServicesSection from "../components/ServicesSection";
import CalculatorSection from "../components/CalculatorSection";
import AdvantagesSection from "../components/AdvantagesSection";
import PortfolioSection from "../components/PortfolioSection";
import TestimonialsSection from "../components/TestimonialsSection";
import FAQSection from "../components/FAQSection";
import ContactSection from "../components/ContactSection";
import Footer from "../components/Footer";
import SEO from "../components/SEO";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function LandingPage() {
  const [services, setServices] = useState([]);
  const [prices, setPrices] = useState({});
  const [portfolio, setPortfolio] = useState([]);
  const [testimonials, setTestimonials] = useState([]);

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
      } catch (e) {
        console.error("Failed to load data:", e);
      }
    };
    fetchData();
  }, []);

  // JSON-LD структурированные данные
  const schemaData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "name": "М-СТРОЙ",
        "description": "Строительство ангаров, зернохранилищ, промышленных гаражей и демонтаж сооружений в Москве и Московской области",
        "url": process.env.REACT_APP_BACKEND_URL?.replace('/api', '') || 'https://m-stroy.ru',
        "logo": "https://customer-assets.emergentagent.com/job_construct-pro-162/artifacts/ksv4c33l_photo_2026-03-17_22-03-07.jpg",
        "telephone": "+7-800-123-45-67",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Москва",
          "addressRegion": "Московская область",
          "addressCountry": "RU"
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
        ]
      },
      {
        "@type": "LocalBusiness",
        "name": "М-СТРОЙ",
        "image": "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1920&q=80",
        "telephone": "+7-800-123-45-67",
        "priceRange": "₽₽₽",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Москва",
          "addressRegion": "Московская область",
          "addressCountry": "RU"
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": "55.7558",
          "longitude": "37.6173"
        },
        "openingHoursSpecification": [
          {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
            "opens": "09:00",
            "closes": "18:00"
          }
        ]
      },
      {
        "@type": "AggregateRating",
        "ratingValue": "4.8",
        "reviewCount": testimonials.length,
        "bestRating": "5",
        "worstRating": "1"
      }
    ]
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A]" data-testid="landing-page">
      <SEO 
        title="Строительство ангаров, зернохранилищ и гаражей в Москве и МО | М-СТРОЙ"
        description="М-СТРОЙ — строительство металлических ангаров, зернохранилищ, промышленных гаражей под ключ в Москве и Московской области. Демонтаж сооружений. 15 лет опыта. Гарантия 5 лет. ☎ 8 (800) 123-45-67"
        keywords="строительство ангаров москва, зернохранилища москва, промышленные гаражи, демонтаж зданий, металлоконструкции москва, строительство под ключ московская область"
        ogImage="https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1920&q=80"
        schemaData={schemaData}
      />
      <Header />
      <HeroSection />
      <ServicesSection services={services} />
      <CalculatorSection services={services} prices={prices} />
      <AdvantagesSection />
      <PortfolioSection portfolio={portfolio} />
      <TestimonialsSection testimonials={testimonials} />
      <FAQSection />
      <ContactSection services={services} />
      <Footer />
    </div>
  );
}