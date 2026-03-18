import { useState, useEffect } from "react";
import axios from "axios";
import Header from "../components/Header";
import HeroSection from "../components/HeroSection";
import ServicesSection from "../components/ServicesSection";
import CalculatorSection from "../components/CalculatorSection";
import AdvantagesSection from "../components/AdvantagesSection";
import PortfolioSection from "../components/PortfolioSection";
import TestimonialsSection from "../components/TestimonialsSection";
import ContactSection from "../components/ContactSection";
import Footer from "../components/Footer";

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

  return (
    <div className="min-h-screen bg-[#0A0A0A]" data-testid="landing-page">
      <Header />
      <HeroSection />
      <ServicesSection services={services} />
      <CalculatorSection services={services} prices={prices} />
      <AdvantagesSection />
      <PortfolioSection portfolio={portfolio} />
      <TestimonialsSection testimonials={testimonials} />
      <ContactSection services={services} />
      <Footer />
    </div>
  );
}