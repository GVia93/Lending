import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Warehouse, Wheat, Container, Hammer, ChevronRight, ChevronLeft, Check } from "lucide-react";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { Slider } from "./ui/slider";
import { Checkbox } from "./ui/checkbox";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import axios from "axios";
import { toast } from "sonner";
//import { formatPrice } from "../lib/utils";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const ICONS = {
  Warehouse: Warehouse,
  Wheat: Wheat,
  Container: Container,
  Hammer: Hammer,
};

const STEP_LABELS = ["Тип сооружения", "Параметры", "Опции", "Результат"];

export default function CalculatorSection({ services, prices }) {
  const [step, setStep] = useState(0);
  const [selectedService, setSelectedService] = useState(null);
  const [area, setArea] = useState(200);
  const [height, setHeight] = useState(6);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [calculation, setCalculation] = useState(null);
  const [contactName, setContactName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const progressValue = ((step + 1) / STEP_LABELS.length) * 100;

  const currentPriceConfig = selectedService ? prices[selectedService.slug] : null;
  const heightOptions = currentPriceConfig
    ? Object.keys(currentPriceConfig.height_multipliers).map(Number).sort((a, b) => a - b)
    : [6, 8, 10, 12];

  // Real-time calculation
  const calculatePrice = useCallback(async () => {
    if (!selectedService) return;
    try {
      const res = await axios.post(`${API}/calculate`, {
        service_slug: selectedService.slug,
        area,
        height,
        options: selectedOptions,
      });
      setCalculation(res.data);
    } catch (e) {
      console.error("Calculation failed:", e);
    }
  }, [selectedService, area, height, selectedOptions]);

  useEffect(() => {
    if (step >= 1 && selectedService) {
      calculatePrice();
    }
  }, [step, calculatePrice, selectedService]);

  const handleServiceSelect = (service) => {
    setSelectedService(service);
    setSelectedOptions([]);
    const heightOpts = prices[service.slug]
      ? Object.keys(prices[service.slug].height_multipliers).map(Number).sort((a, b) => a - b)
      : [6];
    setHeight(heightOpts[0] || 6);
    setStep(1);
  };

  const toggleOption = (optId) => {
    setSelectedOptions((prev) =>
      prev.includes(optId) ? prev.filter((o) => o !== optId) : [...prev, optId]
    );
  };

  const handleSubmitContact = async () => {
    if (!contactName.trim() || !contactPhone.trim()) {
      toast.error("Пожалуйста, заполните имя и телефон");
      return;
    }
    setIsSubmitting(true);
    try {
      await axios.post(`${API}/contact`, {
        name: contactName,
        phone: contactPhone,
        service_type: selectedService?.name || "",
        message: `Расчёт: ${calculation?.total?.toLocaleString("ru-RU")} руб. Площадь: ${area} м², Высота: ${height} м`,
      });
      toast.success("Заявка отправлена! Мы свяжемся с вами в ближайшее время.");
      setContactName("");
      setContactPhone("");
    } catch (e) {
      toast.error("Ошибка при отправке. Попробуйте ещё раз.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatPrice = (num) => {
    return Math.round(num).toLocaleString("ru-RU");
  };

  return (
    <section id="calculator" className="py-20 lg:py-28 bg-[#0A0A0A]" data-testid="calculator-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <span className="text-orange-500 text-sm uppercase tracking-widest font-semibold">Калькулятор</span>
          <h2
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mt-3"
            style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
            data-testid="calculator-heading"
          >
            РАССЧИТАЙТЕ СТОИМОСТЬ
          </h2>
        </motion.div>

        <div className="calc-panel rounded-none p-6 lg:p-10 corner-marker" data-testid="calculator-panel">
          {/* Progress */}
          <div className="mb-8">
            <div className="flex justify-between mb-3">
              {STEP_LABELS.map((label, i) => (
                <div
                  key={label}
                  className={`flex items-center gap-2 text-xs sm:text-sm ${
                    i <= step ? "text-orange-500" : "text-neutral-600"
                  }`}
                  data-testid={`step-indicator-${i}`}
                >
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      i < step
                        ? "bg-orange-500 text-white"
                        : i === step
                        ? "border-2 border-orange-500 text-orange-500"
                        : "border border-neutral-700 text-neutral-600"
                    }`}
                  >
                    {i < step ? <Check className="w-3 h-3" /> : i + 1}
                  </div>
                  <span className="hidden sm:inline">{label}</span>
                </div>
              ))}
            </div>
            <Progress value={progressValue} className="h-1 bg-neutral-800" data-testid="calculator-progress" />
          </div>

          {/* Steps */}
          <AnimatePresence mode="wait">
            {/* Step 0: Service selection */}
            {step === 0 && (
              <motion.div
                key="step-0"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                data-testid="calculator-step-0"
              >
                <h3 className="text-lg font-bold text-white mb-6" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                  Выберите тип сооружения
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {services.map((service) => {
                    const Icon = ICONS[service.icon] || Warehouse;
                    return (
                      <button
                        key={service.id}
                        onClick={() => handleServiceSelect(service)}
                        data-testid={`calc-service-${service.slug}`}
                        className={`p-5 border text-left transition-all duration-200 group hover:border-orange-500 ${
                          selectedService?.slug === service.slug
                            ? "border-orange-500 bg-orange-500/5"
                            : "border-neutral-800 bg-[#0A0A0A] hover:bg-[#0A0A0A]/80"
                        }`}
                      >
                        <Icon className="w-8 h-8 text-orange-500 mb-3" />
                        <div className="text-base font-bold text-white" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                          {service.name}
                        </div>
                        <div className="text-xs text-neutral-500 mt-1 font-mono-tech">
                          от {service.price_per_sqm.toLocaleString("ru-RU")} ₽/м²
                        </div>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* Step 1: Area & Height */}
            {step === 1 && (
              <motion.div
                key="step-1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                data-testid="calculator-step-1"
              >
                <h3 className="text-lg font-bold text-white mb-6" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                  Укажите параметры: {selectedService?.name}
                </h3>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Area */}
                  <div>
                    <Label className="text-neutral-400 mb-3 block">
                      Площадь (м²)
                    </Label>
                    <div className="flex items-center gap-4 mb-4">
                      <Input
                        type="number"
                        value={area}
                        onChange={(e) => setArea(Math.max(50, Math.min(10000, Number(e.target.value))))}
                        className="w-32 bg-[#0A0A0A] border-neutral-700 text-white font-mono-tech text-lg"
                        data-testid="calc-area-input"
                      />
                      <span className="text-neutral-500 text-sm">м²</span>
                    </div>
                    <Slider
                      value={[area]}
                      onValueChange={(v) => setArea(v[0])}
                      min={50}
                      max={10000}
                      step={50}
                      className="w-full"
                      data-testid="calc-area-slider"
                    />
                    <div className="flex justify-between mt-2 text-xs text-neutral-600 font-mono-tech">
                      <span>50 м²</span>
                      <span>10 000 м²</span>
                    </div>
                  </div>

                  {/* Height */}
                  <div>
                    <Label className="text-neutral-400 mb-3 block">
                      Высота (м)
                    </Label>
                    <div className="grid grid-cols-4 gap-2">
                      {heightOptions.map((h) => (
                        <button
                          key={h}
                          onClick={() => setHeight(h)}
                          data-testid={`calc-height-${h}`}
                          className={`py-3 text-center border transition-all font-mono-tech text-lg ${
                            height === h
                              ? "border-orange-500 bg-orange-500/10 text-orange-500"
                              : "border-neutral-700 text-neutral-400 hover:border-neutral-500"
                          }`}
                        >
                          {h}м
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Live price preview */}
                {calculation && (
                  <div className="mt-8 p-4 bg-[#0A0A0A] border border-neutral-800">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-neutral-400">Предварительная стоимость:</span>
                      <span className="text-2xl font-bold text-orange-500 font-mono-tech price-highlight" data-testid="calc-live-price">
                        {formatPrice(calculation.total)} ₽
                      </span>
                    </div>
                  </div>
                )}

                <div className="flex gap-3 mt-8">
                  <Button
                    onClick={() => setStep(0)}
                    variant="outline"
                    className="border-neutral-700 text-neutral-300 hover:bg-neutral-800"
                    data-testid="calc-back-to-0"
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" /> Назад
                  </Button>
                  <Button
                    onClick={() => setStep(2)}
                    className="bg-orange-500 hover:bg-orange-600 text-white font-semibold"
                    data-testid="calc-next-to-2"
                  >
                    Далее <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Step 2: Options */}
            {step === 2 && (
              <motion.div
                key="step-2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                data-testid="calculator-step-2"
              >
                <h3 className="text-lg font-bold text-white mb-6" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                  Дополнительные опции
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {currentPriceConfig?.options.map((opt) => {
                    const isChecked = selectedOptions.includes(opt.id);
                    const optCost = opt.unit === "за м²" ? opt.price * area : opt.price;
                    return (
                      <div
                        key={opt.id}
                        onClick={() => toggleOption(opt.id)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => e.key === "Enter" && toggleOption(opt.id)}
                        data-testid={`calc-option-${opt.id}`}
                        className={`flex items-center gap-4 p-4 border text-left transition-all cursor-pointer ${
                          isChecked
                            ? "border-orange-500 bg-orange-500/5"
                            : "border-neutral-800 hover:border-neutral-600"
                        }`}
                      >
                        <Checkbox
                          checked={isChecked}
                          className="data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500"
                        />
                        <div className="flex-1">
                          <div className="text-sm font-medium text-white">{opt.name}</div>
                          <div className="text-xs text-neutral-500">{opt.unit}</div>
                        </div>
                        <div className="text-sm font-mono-tech text-orange-500">
                          +{formatPrice(optCost)} ₽
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Live price preview */}
                {calculation && (
                  <div className="mt-8 p-4 bg-[#0A0A0A] border border-neutral-800">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-neutral-400">Предварительная стоимость:</span>
                      <span className="text-2xl font-bold text-orange-500 font-mono-tech price-highlight" data-testid="calc-live-price-step2">
                        {formatPrice(calculation.total)} ₽
                      </span>
                    </div>
                  </div>
                )}

                <div className="flex gap-3 mt-8">
                  <Button
                    onClick={() => setStep(1)}
                    variant="outline"
                    className="border-neutral-700 text-neutral-300 hover:bg-neutral-800"
                    data-testid="calc-back-to-1"
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" /> Назад
                  </Button>
                  <Button
                    onClick={() => setStep(3)}
                    className="bg-orange-500 hover:bg-orange-600 text-white font-semibold"
                    data-testid="calc-next-to-3"
                  >
                    Результат <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Step 3: Result & Contact */}
            {step === 3 && (
              <motion.div
                key="step-3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                data-testid="calculator-step-3"
              >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Breakdown */}
                  <div>
                    <h3 className="text-lg font-bold text-white mb-6" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                      Расчёт стоимости
                    </h3>
                    {calculation && (
                      <div className="space-y-3">
                        {calculation.breakdown.map((item, idx) => (
                          <div
                            key={idx}
                            className="flex justify-between items-center py-2 border-b border-neutral-800/50"
                            data-testid={`calc-breakdown-${idx}`}
                          >
                            <span className="text-sm text-neutral-400">{item.name}</span>
                            <span className="text-sm font-mono-tech text-neutral-300">
                              {formatPrice(item.value)} ₽
                            </span>
                          </div>
                        ))}
                        <div className="flex justify-between items-center pt-4 border-t-2 border-orange-500/30">
                          <span className="text-base font-bold text-white">ИТОГО:</span>
                          <span
                            className="text-3xl font-bold text-orange-500 font-mono-tech price-highlight"
                            data-testid="calc-total-price"
                          >
                            {formatPrice(calculation.total)} ₽
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Contact form */}
                  <div className="p-6 bg-[#0A0A0A] border border-neutral-800">
                    <h3 className="text-lg font-bold text-white mb-2" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                      Оставить заявку
                    </h3>
                    <p className="text-sm text-neutral-500 mb-6">
                      Оставьте контакты и мы подготовим точный расчёт
                    </p>
                    <div className="space-y-4">
                      <div>
                        <Label className="text-neutral-400 text-sm">Ваше имя</Label>
                        <Input
                          value={contactName}
                          onChange={(e) => setContactName(e.target.value)}
                          placeholder="Иван Иванов"
                          className="mt-1 bg-[#171717] border-neutral-700 text-white placeholder:text-neutral-600"
                          data-testid="calc-contact-name"
                        />
                      </div>
                      <div>
                        <Label className="text-neutral-400 text-sm">Телефон</Label>
                        <Input
                          value={contactPhone}
                          onChange={(e) => setContactPhone(e.target.value)}
                          placeholder="+7 (___) ___-__-__"
                          className="mt-1 bg-[#171717] border-neutral-700 text-white placeholder:text-neutral-600"
                          data-testid="calc-contact-phone"
                        />
                      </div>
                      <Button
                        onClick={handleSubmitContact}
                        disabled={isSubmitting}
                        className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-6 text-base"
                        data-testid="calc-submit-btn"
                      >
                        {isSubmitting ? "Отправка..." : "Отправить заявку"}
                      </Button>
                      <p className="text-xs text-neutral-600 text-center">
                        Нажимая кнопку, вы соглашаетесь с обработкой персональных данных
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 mt-8">
                  <Button
                    onClick={() => setStep(2)}
                    variant="outline"
                    className="border-neutral-700 text-neutral-300 hover:bg-neutral-800"
                    data-testid="calc-back-to-2"
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" /> Назад
                  </Button>
                  <Button
                    onClick={() => {
                      setStep(0);
                      setSelectedService(null);
                      setSelectedOptions([]);
                      setCalculation(null);
                      setArea(200);
                    }}
                    variant="outline"
                    className="border-neutral-700 text-neutral-300 hover:bg-neutral-800"
                    data-testid="calc-reset-btn"
                  >
                    Новый расчёт
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}