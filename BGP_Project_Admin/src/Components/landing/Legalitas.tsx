import { motion } from "framer-motion";
import { FiStar } from "react-icons/fi";
import AnimatedContent from "../ui/AnimatedContent";

import { useLanguage } from "../../contexts/LanguageContext";

const getLegalitasData = (t: any) => [
  {
    title: "ISO 9001",
    desc: t('legalitas.iso9001'),
  },
  {
    title: "ISO 14001",
    desc: t('legalitas.iso14001'),
  },
  {
    title: "ISO 45001",
    desc: t('legalitas.iso45001'),
  },
  {
    title: "ISO 37001",
    desc: t('legalitas.iso37001'),
  },
  {
    title: "ISO 27001",
    desc: t('legalitas.iso27001'),
  },
  {
    title: "ABUJAPI",
    desc: t('legalitas.abujapi'),
  },
  {
    title: "KADIN",
    desc: t('legalitas.kadin'),
  },
  {
    title: "APKLINDO",
    desc: t('legalitas.apklindo'),
  },
];

export const Legalitas = () => {
  const { t } = useLanguage();
  const legalitasData = getLegalitasData(t);

  return (
    <section
      id="legalitas"
      className="py-32 md:py-40 bg-white/50 dark:bg-slate-900/50 overflow-hidden relative"
    >
      <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center mb-16 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <h2 className="text-lg font-bold text-[#122C93] dark:text-[#4b6bff] mb-2 tracking-widest uppercase font-geist-mono">
              {t('legalitas.section_title')}
            </h2>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          >
            <h3 className="text-4xl md:text-5xl font-black leading-tight text-gray-900 dark:text-white max-w-4xl uppercase tracking-tight">
              {t('legalitas.main_title').split(', ')[0]}, <br className="hidden sm:block" /> {t('legalitas.main_title').split(', ')[1]}
            </h3>
          </motion.div>
        </div>

        <div className="flex flex-wrap justify-center gap-6 max-w-6xl mx-auto">
          {legalitasData.map((item, index) => (
            <AnimatedContent
              key={index}
              distance={40}
              direction="vertical"
              reverse={false}
              duration={0.6}
              ease="power2.out"
              initialOpacity={0}
              animateOpacity={true}
              scale={0.9}
              threshold={0.1}
              delay={index * 0.1}
              className="w-full sm:w-[calc(50%-1.5rem)] lg:w-[calc(33.333%-1.5rem)] bg-white dark:bg-slate-800/80 rounded-2xl p-6 border border-gray-100 dark:border-slate-700 shadow-sm hover:shadow-xl transition-all duration-300 flex items-center gap-5 group"
            >
              <div className="w-14 h-14 bg-[#E8EEFF] dark:bg-[#4b6bff]/20 rounded-xl flex-shrink-0 flex items-center justify-center text-[#122C93] dark:text-[#4b6bff] group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300">
                <FiStar className="w-6 h-6" />
              </div>
              <div className="flex flex-col text-left">
                <h4 className="font-bold text-gray-900 dark:text-white text-lg leading-tight mb-1">
                  {item.title}
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium tracking-wide">
                  {item.desc}
                </p>
              </div>
            </AnimatedContent>
          ))}
        </div>
      </div>
    </section>
  );
};
