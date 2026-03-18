import { useState } from "react";
import { motion } from "framer-motion";
import { Phone, Mail, MapPin, Send } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import axios from "axios";
import { toast } from "sonner";
import useAnalytics from "../hooks/useAnalytics";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function ContactSection({ services }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [serviceType, setServiceType] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { trackContactFormSubmit, trackPhoneClick } = useAnalytics();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !serviceType) {
      toast.error("Пожалуйста, заполните все поля");
      return;
    }
    
    // Аналитика: отправка контактной формы
    trackContactFormSubmit(serviceType);
    
    setIsSubmitting(true);
    try {
      await axios.post(`${API}/contact`, {
        name,
        phone,
        service_type: serviceType,
      });
      toast.success("Заявка отправлена! Мы свяжемся с вами в ближайшее время.");
      setName("");
      setPhone("");
      setServiceType("");
    } catch (e) {
      toast.error("Ошибка при отправке. Попробуйте ещё раз.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-20 lg:py-28 bg-[#0F172A]" data-testid="contact-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Left: Contact info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-orange-500 text-sm uppercase tracking-widest font-semibold">Контакты</span>
            <h2
              className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mt-3 mb-8"
              style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
              data-testid="contact-heading"
            >
              СВЯЖИТЕСЬ С НАМИ
            </h2>
            <p className="text-neutral-400 leading-relaxed mb-10 max-w-md">
              Оставьте заявку и наш специалист свяжется с вами для бесплатной консультации и расчёта стоимости проекта.
            </p>

            <div className="space-y-6">
              <a
                href="tel:+78001234567"
                onClick={() => trackPhoneClick('contact_section')}
                className="flex items-center gap-4 group"
                data-testid="contact-phone"
              >
                <div className="w-12 h-12 bg-orange-500/10 border border-orange-500/20 flex items-center justify-center group-hover:bg-orange-500/20 transition-colors">
                  <Phone className="w-5 h-5 text-orange-500" />
                </div>
                <div>
                  <div className="text-xs text-neutral-500 uppercase tracking-wider">Телефон</div>
                  <div className="text-lg text-white font-mono-tech">8 (800) 123-45-67</div>
                </div>
              </a>

              <a
                href="mailto:info@m-stroy.ru"
                className="flex items-center gap-4 group"
                data-testid="contact-email"
              >
                <div className="w-12 h-12 bg-orange-500/10 border border-orange-500/20 flex items-center justify-center group-hover:bg-orange-500/20 transition-colors">
                  <Mail className="w-5 h-5 text-orange-500" />
                </div>
                <div>
                  <div className="text-xs text-neutral-500 uppercase tracking-wider">Email</div>
                  <div className="text-lg text-white">info@m-stroy.ru</div>
                </div>
              </a>

              <div className="flex items-center gap-4" data-testid="contact-address">
                <div className="w-12 h-12 bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-orange-500" />
                </div>
                <div>
                  <div className="text-xs text-neutral-500 uppercase tracking-wider">Адрес</div>
                  <div className="text-lg text-white">г. Москва, ул. Строителей, д. 15</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right: Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <form
              onSubmit={handleSubmit}
              className="p-6 lg:p-8 bg-white/5 border border-white/10"
              data-testid="contact-form"
            >
              <h3
                className="text-xl font-bold text-white mb-6"
                style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
              >
                ОСТАВИТЬ ЗАЯВКУ
              </h3>

              <div className="space-y-5">
                <div>
                  <Label className="text-neutral-400 text-sm">Ваше имя *</Label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Иван Иванов"
                    className="mt-1.5 bg-white/5 border-white/10 text-white placeholder:text-neutral-600 focus:border-orange-500"
                    data-testid="contact-form-name"
                  />
                </div>

                <div>
                  <Label className="text-neutral-400 text-sm">Телефон *</Label>
                  <Input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+7 (___) ___-__-__"
                    className="mt-1.5 bg-white/5 border-white/10 text-white placeholder:text-neutral-600 focus:border-orange-500"
                    data-testid="contact-form-phone"
                  />
                </div>

                <div>
                  <Label className="text-neutral-400 text-sm">Тип услуги *</Label>
                  <Select value={serviceType} onValueChange={setServiceType}>
                    <SelectTrigger
                      className="mt-1.5 bg-white/5 border-white/10 text-white"
                      data-testid="contact-form-service-select"
                    >
                      <SelectValue placeholder="Выберите услугу" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#171717] border-neutral-700">
                      {services.map((svc) => (
                        <SelectItem key={svc.id} value={svc.name} className="text-white hover:bg-neutral-800">
                          {svc.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-6 text-base mt-2"
                  data-testid="contact-form-submit"
                >
                  <Send className="w-4 h-4 mr-2" />
                  {isSubmitting ? "Отправка..." : "Отправить заявку"}
                </Button>

                <p className="text-xs text-neutral-600 text-center">
                  Нажимая кнопку, вы соглашаетесь с обработкой персональных данных
                </p>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}