import { motion } from "framer-motion";
import CountUp from "../ui/CountUp";
import AnimatedContent from "../ui/AnimatedContent";

import { useLanguage } from "../../contexts/LanguageContext";

const getKompetensiData = (t: any) => [
  {
    jam: 160,
    title: t('kompetensi.gada_pratama_title'),
    desc: t('kompetensi.gada_pratama_desc'),
  },
  {
    jam: 100,
    title: t('kompetensi.gada_madya_title'),
    desc: t('kompetensi.gada_madya_desc'),
  },
  {
    jam: 60,
    title: t('kompetensi.gada_utama_title'),
    desc: t('kompetensi.gada_utama_desc'),
  },
];



export const KompetensiSecurity = () => {
  const { t } = useLanguage();
  const kompetensiData = getKompetensiData(t);

  return (
    <section
      id="kompetensi"
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
              {t('kompetensi.section_title')}
            </h2>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          >
            <h3 className="text-4xl md:text-5xl font-black leading-tight text-gray-900 dark:text-white max-w-6xl uppercase mb-6 tracking-tight">
              {t('kompetensi.main_title')}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto text-lg leading-relaxed font-medium">
              {t('kompetensi.desc')}
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
          {kompetensiData.map((item, index) => (
            <AnimatedContent
              key={index}
              distance={150}
              direction="vertical"
              reverse={false}
              duration={1.2}
              ease="bounce.out"
              initialOpacity={0.2}
              animateOpacity
              scale={0.9}
              threshold={0.2}
              delay={index * 0.2}
            >
              <div className="bg-white dark:bg-slate-800/90 rounded-[2rem] p-10 border border-gray-100 dark:border-slate-700 shadow-sm hover:shadow-2xl transition-all duration-300 group flex flex-col items-center text-center h-full">
                <div className="mb-8">
                  <h4 className="text-[5rem] leading-none font-black text-[#122C93] dark:text-[#4b6bff] tracking-tighter group-hover:scale-110 transition-transform duration-300 font-geist-mono">
                    <CountUp to={item.jam} duration={2} />
                  </h4>
                  <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mt-2 uppercase tracking-wide">
                    {t('kompetensi.hours')}
                  </p>
                </div>

                <div className="w-full h-px bg-gray-100 dark:bg-slate-700 mb-8" />

                <div className="flex-1">
                  <h5 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                    {item.title}
                  </h5>
                  <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            </AnimatedContent>
          ))}
        </div>
      </div>
    </section>
  );
};
