import { FiArrowRight } from "react-icons/fi";
import { Link } from "react-router-dom";
import { useLanguage } from "../../contexts/LanguageContext";
import { motion } from "framer-motion";
import mobileIlus from "../../assets/images/mobile-ilus.webp";
import webIlus from "../../assets/images/web-ilus.webp";

export const OperasiKami = () => {
  const { t } = useLanguage();
  return (
    <section id="operasi-kami" className="py-32 pb-40 standar-grid-bg overflow-hidden">
      <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-8 items-center">

          {/* Illustrations Column */}
          <div className="relative w-full h-[400px] sm:h-[500px] lg:h-[650px] flex items-center justify-center order-2 lg:order-1">
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="absolute right-0 lg:-right-4 w-[95%] md:w-[85%] lg:w-[95%] max-w-[750px] z-10"
            >
              <img
                src={webIlus}
                alt="Web Dashboard Illustration"
                className="w-full h-auto drop-shadow-2xl rounded-2xl"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: 0.3, type: "spring", stiffness: 100 }}
              className="absolute -left-8 md:-left-4 lg:-left-12 xl:-left-6 mt-20 md:mt-28 lg:mt-36 w-[55%] md:w-[50%] lg:w-[55%] max-w-[420px] z-20"
            >
              <img
                src={mobileIlus}
                alt="Mobile App Illustration"
                className="w-full h-auto drop-shadow-[0_20px_50px_rgba(0,0,0,0.25)] rounded-[2rem]"
              />
            </motion.div>
          </div>

          {/* Text Content Column */}
          <div className="flex flex-col items-start order-1 lg:order-2 lg:pl-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white leading-[1.15] mb-6">
                {t('operasi.title').split(t('operasi.title_highlight'))[0]} <span className="text-[#122C93] dark:text-[#4b6bff]">{t('operasi.title_highlight')}</span> <br className="hidden lg:block" />
                {t('operasi.title').split(t('operasi.title_highlight'))[1]}
              </h2>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <p className="text-gray-600 dark:text-gray-300 text-lg md:text-xl leading-relaxed mb-10 max-w-xl">
                {t('operasi.desc')}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Link to="/sistem" className="inline-flex items-center justify-center bg-[#122C93] text-white px-8 py-4 rounded-full font-bold shadow-lg shadow-[#122C93]/30 hover:bg-[#0c1f6b] transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group">
                <span className="mr-3">{t('operasi.cta')}</span>
                <FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
};
