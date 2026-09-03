import { motion } from "framer-motion";
import { useLanguage } from "../../contexts/LanguageContext";

export const Hero = () => {
  const { t } = useLanguage();

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col justify-center items-center text-center py-20 hero-grid-bg text-gray-900 dark:text-white overflow-hidden"
    >
      {/* Static Blur Backgrounds */}
      <div className="absolute top-[10%] left-[10%] w-[500px] h-[500px] bg-[#5000AB] rounded-full blur-[200px] opacity-5 dark:opacity-15 z-0 pointer-events-none" />
      <div className="absolute bottom-[10%] right-[10%] w-[400px] h-[400px] bg-[#122C93] rounded-full blur-[200px] opacity-[0.03] dark:opacity-10 z-0 pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto px-4">
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-5xl md:text-8xl font-black tracking-tighter mb-6 leading-tight"
        >
          {t('hero.title').split(' To ')[0]} To <br /> {t('hero.title').split(' To ')[1]}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="text-xl md:text-2xl text-gray-600 dark:text-[#94A3B8] mb-10 leading-relaxed max-w-4xl mx-auto"
        >
          {t('hero.desc')}
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <motion.a
            href="#operasi-kami"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-[#122C93] text-white px-10 py-4 rounded-full font-bold shadow-xl hover:bg-[#0c1f6b] hover:shadow-2xl transition-all text-lg w-full sm:w-auto inline-block"
          >
            {t('hero.cta_explore')}
          </motion.a>
          
          <motion.a
            href="#layanan"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-transparent border-2 border-[#122C93] text-[#122C93] dark:border-white dark:text-white px-10 py-4 rounded-full font-bold shadow-md hover:bg-[#122C93]/10 dark:hover:bg-white/10 transition-all text-lg w-full sm:w-auto inline-block"
          >
            {t('hero.cta_services')}
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
};
