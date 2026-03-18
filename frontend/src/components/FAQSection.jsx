import { motion } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import { useState } from "react";

const FAQ_DATA = [
  {
    question: "Сколько времени занимает строительство ангара?",
    answer: "Срок строительства зависит от размера и сложности проекта. В среднем строительство ангара площадью 500-1000 м² занимает от 30 до 60 дней. Более крупные объекты могут требовать до 90 дней. Точные сроки определяются после анализа проекта."
  },
  {
    question: "Какая гарантия на ваши конструкции?",
    answer: "Мы предоставляем гарантию 5 лет на все металлоконструкции и монтажные работы. Гарантия распространяется на конструктивную целостность, защиту от коррозии и качество сварных соединений."
  },
  {
    question: "Работаете ли вы по всей Московской области?",
    answer: "Да, мы работаем во всех районах Москвы и Московской области. Также выполняем проекты в близлежащих регионах. Для удаленных объектов проводим предварительную оценку и предоставляем индивидуальные условия."
  },
  {
    question: "Какие документы нужны для начала строительства?",
    answer: "Для начала работ требуется: план участка, разрешение на строительство (при необходимости), техническое задание. Мы поможем с оформлением всех необходимых документов и согласований."
  },
  {
    question: "Можно ли построить ангар зимой?",
    answer: "Да, строительство металлоконструкций возможно круглый год, включая зимний период. Используем специальные технологии монтажа для низких температур. Некоторые этапы (например, бетонирование) требуют соблюдения температурного режима."
  },
  {
    question: "Какие способы оплаты вы принимаете?",
    answer: "Работаем по гибкой системе оплаты: предоплата 30%, промежуточные платежи по этапам работ, окончательный расчёт после сдачи объекта. Принимаем оплату безналичным расчётом по счёту и наличными."
  },
  {
    question: "Включает ли цена проектирование?",
    answer: "Базовая стоимость включает типовое проектирование. Индивидуальное проектирование с учётом специфических требований рассчитывается отдельно. Предоставляем бесплатную предварительную консультацию и расчёт."
  },
  {
    question: "Какие дополнительные услуги вы предоставляете?",
    answer: "Дополнительно предоставляем: утепление, установку ворот и окон, системы вентиляции и отопления, освещение, пожарную сигнализацию, благоустройство территории, подключение коммуникаций."
  }
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  // JSON-LD для FAQ
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": FAQ_DATA.map((item) => ({
      "@type": "Question",
      "name": item.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.answer
      }
    }))
  };

  return (
    <section className="py-20 lg:py-28 bg-[#0A0A0A]" data-testid="faq-section">
      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <span className="text-orange-500 text-sm uppercase tracking-widest font-semibold">FAQ</span>
          <h2
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mt-3"
            style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
            data-testid="faq-heading"
          >
            ЧАСТО ЗАДАВАЕМЫЕ ВОПРОСЫ
          </h2>
        </motion.div>

        <div className="space-y-3" data-testid="faq-list">
          {FAQ_DATA.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="border border-neutral-800 bg-[#171717] overflow-hidden"
              data-testid={`faq-item-${index}`}
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-neutral-800/50 transition-colors"
                aria-expanded={openIndex === index}
              >
                <h3 className="text-base lg:text-lg font-semibold text-white pr-4">
                  {item.question}
                </h3>
                <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full border border-orange-500/30 text-orange-500">
                  {openIndex === index ? (
                    <Minus className="w-4 h-4" />
                  ) : (
                    <Plus className="w-4 h-4" />
                  )}
                </div>
              </button>
              
              {openIndex === index && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="px-6 pb-5"
                >
                  <p className="text-neutral-400 leading-relaxed">
                    {item.answer}
                  </p>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <p className="text-neutral-400 mb-4">
            Не нашли ответ на свой вопрос?
          </p>
          <a href="#contact">
            <button className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold transition-colors">
              Задать вопрос
            </button>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
