import { motion } from "framer-motion";
import { useLanguage } from "../../contexts/LanguageContext";
import { FiArrowDown } from "react-icons/fi";
import mobileIlus from "../../assets/images/mobile-ilus.webp";
import webIlus from "../../assets/images/web-ilus.webp";

export const SystemHero = () => {
  const { language } = useLanguage();

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center pt-32 pb-20 overflow-hidden bg-[#f8fafc] dark:bg-[#0B1330]"
    >
      {/* Background gradients for aesthetics - hidden on mobile to match Operasi section */}
      <div className="hidden md:block absolute top-[15%] right-[25%] w-[500px] h-[500px] bg-[#122C93] rounded-full blur-[180px] opacity-15 dark:opacity-20 z-0 pointer-events-none" />

      <div className="relative z-10 max-w-[100rem] mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-8 items-center">

          {/* Text Content Column */}
          <div className="flex flex-col items-start pt-10 lg:pt-0">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-5xl md:text-6xl lg:text-[4.2rem] font-black text-[#0B1330] dark:text-white leading-[1.15] mb-6 tracking-tight"
            >
              {language === 'id' ? 'Solusi Keamanan' : 'Integrated Security'} <br className="hidden lg:block" />
              <span className="relative inline-block text-[#122C93] dark:text-[#4b6bff]">
                {language === 'id' ? 'Terpadu' : 'Solutions'}
                {/* Underline svg */}
                <svg
                  className="absolute -bottom-2 left-0 w-full h-3 text-[#122C93]/30 dark:text-[#4b6bff]/30"
                  viewBox="0 0 100 20"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M0 10 Q 50 20 100 10"
                    fill="transparent"
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                </svg>
              </span>{' '}
              {language === 'id' ? 'Didukung' : 'Powered by'} <br className="hidden lg:block" />
              {language === 'id' ? 'Teknologi Digital' : 'Digital Technology'}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-10 leading-relaxed max-w-xl"
            >
              {language === 'id'
                ? 'Berdiri sejak 2016, PT Bima Global Security merupakan perusahaan jasa keamanan nasional yang mengintegrasikan tenaga profesional bersertifikasi dengan sistem manajemen operasional berbasis teknologi digital, guna menghadirkan pengawasan yang akurat dan real-time di setiap titik pengamanan.'
                : 'Established in 2016, PT Bima Global Security is a national security service company that integrates certified professionals with a digital technology-based operational management system, providing accurate and real-time monitoring at every security point.'}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
            >
              <motion.a
                href="#kontak"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-[#122C93] text-white px-8 py-4 rounded-lg font-semibold shadow-xl shadow-[#122C93]/20 hover:bg-[#0c1f6b] transition-all text-base md:text-lg text-center"
              >
                {language === 'id' ? 'Hubungi Kami' : 'Contact Us'}
              </motion.a>

              <motion.a
                href="#fitur"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center justify-center bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-8 py-4 rounded-lg font-semibold shadow-md border border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all text-base md:text-lg group"
              >
                <span className="mr-3">{language === 'id' ? 'Lihat Fitur' : 'Explore Features'}</span>
                <FiArrowDown className="w-5 h-5 group-hover:translate-y-1 transition-transform duration-300" />
              </motion.a>
            </motion.div>
          </div>

          {/* Illustrations Column */}
          <div className="relative w-full h-[400px] sm:h-[500px] lg:h-[600px] flex items-center justify-center mt-10 lg:mt-0 lg:-translate-y-30">
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
              className="absolute right-0 lg:-right-4 w-[95%] md:w-[90%] lg:w-[105%] max-w-[750px] z-10"
            >
              <img
                src={webIlus}
                alt="Web Dashboard Illustration"
                className="w-full h-auto drop-shadow-2xl"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.5, type: "spring", stiffness: 100 }}
              className="absolute -left-10 md:-left-16 lg:-left-29 mt-64 md:mt-80 lg:mt-[28rem] w-[60%] md:w-[55%] lg:w-[60%] max-w-[420px] z-20"
            >
              <img
                src={mobileIlus}
                alt="Mobile App Illustration"
                className="w-full h-auto drop-shadow-[0_20px_50px_rgba(0,0,0,0.25)]"
              />
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
};
