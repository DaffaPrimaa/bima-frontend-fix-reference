import AnimatedContent from "../ui/AnimatedContent";
import { useLanguage } from "../../contexts/LanguageContext";
import { motion } from "framer-motion";
import { RiShieldUserLine } from "react-icons/ri";

export const SystemCTA = () => {
  const { language } = useLanguage();

  return (
    <section id="kontak" className="py-24 bg-white dark:bg-[#0B1330] relative overflow-hidden">
      
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-[#122C93]/5 dark:bg-[#4b6bff]/15 blur-[120px] rounded-full pointer-events-none -z-10"></div>
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <AnimatedContent distance={30} direction="vertical">
          
          {/* Icon */}
          <div className="flex justify-center mb-8">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="relative w-16 h-16 rounded-2xl bg-blue-50 dark:bg-[#0F172A] border border-blue-100 dark:border-[#4b6bff]/40 flex items-center justify-center shadow-[0_0_35px_rgba(18,44,147,0.15)] dark:shadow-[0_0_35px_rgba(75,107,255,0.4)]"
            >
              <RiShieldUserLine className="w-8 h-8 text-[#122C93] dark:text-white" />
            </motion.div>
          </div>

          {/* Heading */}
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-[1.3] tracking-tight">
            {language === 'id' ? (
              <>
                Siap untuk Mengamankan <br className="hidden md:block" />
                <span className="relative inline-block text-[#122C93] dark:text-[#4b6bff] mx-2">
                  Operasional
                  <svg
                    className="absolute -bottom-2 left-0 w-full h-3 text-[#122C93]/30 dark:text-[#4b6bff]/50"
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
                </span> Anda?
              </>
            ) : (
              <>
                Ready to Secure Your <br className="hidden md:block" />
                <span className="relative inline-block text-[#122C93] dark:text-[#4b6bff] mx-2">
                  Operations
                  <svg
                    className="absolute -bottom-2 left-0 w-full h-3 text-[#122C93]/30 dark:text-[#4b6bff]/50"
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
                </span>?
              </>
            )}
          </h2>
          
          {/* Subtext */}
          <p className="text-lg md:text-xl text-gray-500 dark:text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed">
            {language === 'id' 
              ? 'Bangun infrastruktur keamanan yang modern, presisi, dan dapat diandalkan untuk bisnis Anda hari ini.'
              : 'Build a modern, precise, and reliable security infrastructure for your business today.'}
          </p>
          
          {/* Button */}
          <motion.a
            href="https://wa.me/6285797219631"
            target="_blank"
            rel="noreferrer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center justify-center bg-[#122C93] text-white dark:bg-white dark:text-gray-900 px-8 py-3.5 rounded-xl font-bold shadow-xl hover:bg-[#0c1f6b] dark:hover:bg-gray-100 hover:shadow-2xl transition-all text-base md:text-lg"
          >
            {language === 'id' ? 'Hubungi Kami' : 'Contact Us'}
          </motion.a>

        </AnimatedContent>
      </div>
    </section>
  );
};
