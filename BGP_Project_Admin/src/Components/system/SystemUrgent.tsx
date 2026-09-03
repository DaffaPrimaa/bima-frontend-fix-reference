import { useLanguage } from "../../contexts/LanguageContext";
import { motion } from "framer-motion";
import { FiAlertTriangle, FiRadio, FiUsers } from "react-icons/fi";
import AnimatedContent from "../ui/AnimatedContent";
import { AiOutlineNotification } from "react-icons/ai";

export const SystemUrgent = () => {
  const { language } = useLanguage();

  return (
    <section id="urgent" className="py-20 bg-white dark:bg-[#0B1330] overflow-hidden relative">
      <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 xl:gap-20 items-center">

          {/* Left: SOS Animation Illustration */}
          <div className="lg:col-span-6 flex justify-center">
            <AnimatedContent direction="horizontal" distance={40}>
              <div className="relative w-[320px] h-[320px] md:w-[450px] md:h-[450px] lg:w-[550px] lg:h-[550px] flex items-center justify-center">

                {/* Outer Ring 1 (Solid Pulse) */}
                <motion.div
                  initial={{ opacity: 0.5, scale: 0.8 }}
                  animate={{ opacity: [0.2, 0.6, 0.2], scale: [0.9, 1.05, 0.9] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute w-full h-full rounded-full border border-red-400 dark:border-red-500/50"
                ></motion.div>

                {/* Outer Ring 2 (Dashed) */}
                <motion.div
                  initial={{ opacity: 0.4 }}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                  className="absolute w-[85%] h-[85%] rounded-full border border-dashed border-red-400/70 dark:border-red-500/40"
                ></motion.div>

                {/* Middle Dashed Ring */}
                <motion.div
                  initial={{ opacity: 0.5 }}
                  animate={{ rotate: -360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="absolute w-[65%] h-[65%] rounded-full border border-dashed border-red-500/60 dark:border-red-400/60"
                ></motion.div>

                {/* Inner Dashed Ring */}
                <motion.div
                  initial={{ opacity: 0.6 }}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                  className="absolute w-[45%] h-[45%] rounded-full border border-dashed border-red-500/80 dark:border-red-400/80"
                ></motion.div>

                {/* Floating Badge 1: Location Locked */}
                <motion.div
                  initial={{ y: 0 }}
                  animate={{ y: [-5, 5, -5] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute top-[25%] right-[-5%] md:right-[5%] bg-white dark:bg-[#131E3D] px-3 py-1.5 rounded shadow-lg border border-gray-100 dark:border-white/5 flex items-center gap-2 z-20"
                >
                  <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)] animate-pulse"></div>
                  <span className="text-[10px] md:text-xs font-mono font-bold text-gray-800 dark:text-gray-200">Location Locked</span>
                </motion.div>

                {/* Floating Badge 2: Dispatch Alerted */}
                <motion.div
                  initial={{ y: 0 }}
                  animate={{ y: [5, -5, 5] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                  className="absolute bottom-[20%] left-[-5%] md:left-[5%] bg-white dark:bg-[#131E3D] px-3 py-1.5 rounded shadow-lg border border-gray-100 dark:border-white/5 flex items-center gap-1.5 z-20"
                >
                  <AiOutlineNotification className="w-3.5 h-3.5 text-red-600 dark:text-red-500 animate-pulse drop-shadow-[0_0_5px_rgba(220,38,38,0.6)]" />
                  <span className="text-[10px] md:text-xs font-mono font-bold text-gray-800 dark:text-gray-200">Dispatch Alerted</span>
                </motion.div>

                {/* Center SOS Button */}
                <div className="relative w-32 h-32 md:w-40 md:h-40 bg-white dark:bg-[#131E3D] rounded-full shadow-[0_10px_40px_rgba(220,38,38,0.2)] dark:shadow-[0_10px_50px_rgba(220,38,38,0.25)] flex flex-col items-center justify-center z-10 border border-red-50 dark:border-white/5">
                  <div className="w-14 h-14 md:w-16 md:h-16 bg-red-100 dark:bg-red-500/20 rounded-full flex items-center justify-center mb-1 text-red-600 dark:text-red-500">
                    <FiAlertTriangle className="w-7 h-7 md:w-8 md:h-8" />
                  </div>
                  <span className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white tracking-widest">SOS</span>
                </div>

              </div>
            </AnimatedContent>
          </div>

          {/* Right: Text Content */}
          <div className="lg:col-span-6">
            <AnimatedContent direction="horizontal" distance={-40} delay={0.2}>
              <div className="flex flex-col">
                <span className="font-mono text-sm font-semibold tracking-wider text-[#122C93] dark:text-[#4b6bff] mb-4 uppercase">
                  {language === 'id' ? 'Protokol Darurat' : 'Emergency Protocol'}
                </span>

                <h2 className="text-3xl md:text-4xl lg:text-[42px] font-bold text-[#0F172A] dark:text-white leading-[1.2] mb-6 tracking-tight">
                  {language === 'id'
                    ? 'Respon Cepat, dimanapun Anda Berada'
                    : 'Fast Response, Wherever You Are'}
                </h2>

                <p className="text-gray-500 dark:text-slate-400 text-base md:text-lg leading-relaxed mb-10">
                  {language === 'id'
                    ? 'Fitur Panic Alert berbasis GPS yang dirancang untuk situasi genting. Lokasi presisi dan sinyal darurat langsung terkirim secara real-time ke admin dan rekan kerja.'
                    : 'GPS-based Panic Alert feature designed for critical situations. Precise location and emergency signals are sent instantly in real-time to admins and colleagues.'}
                </p>

                {/* Feature List */}
                <div className="flex flex-col gap-6">

                  {/* Feature 1 */}
                  <motion.div
                    className="flex items-center gap-4 group"
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="w-12 h-12 rounded-xl bg-red-50 dark:bg-red-500/10 flex items-center justify-center text-red-500 shrink-0 group-hover:bg-red-500 group-hover:text-white transition-colors duration-300">
                      <FiRadio className="w-5 h-5" />
                    </div>
                    <span className="text-gray-700 dark:text-gray-300 font-medium text-[15px] group-hover:text-red-500 transition-colors duration-300">
                      {language === 'id' ? 'Sekali tekan, sinyal darurat langsung diterima seluruh tim' : 'One tap, emergency signal is instantly received by the whole team'}
                    </span>
                  </motion.div>

                  {/* Feature 2 */}
                  <motion.div
                    className="flex items-center gap-4 group"
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="w-12 h-12 rounded-xl bg-red-50 dark:bg-red-500/10 flex items-center justify-center text-red-500 shrink-0 group-hover:bg-red-500 group-hover:text-white transition-colors duration-300">
                      <FiUsers className="w-5 h-5" />
                    </div>
                    <span className="text-gray-700 dark:text-gray-300 font-medium text-[15px] group-hover:text-red-500 transition-colors duration-300">
                      {language === 'id' ? 'Terintegrasi dengan jadwal rekan satu shift' : 'Integrated with the schedule of shift colleagues'}
                    </span>
                  </motion.div>

                </div>
              </div>
            </AnimatedContent>
          </div>

        </div>
      </div>
    </section>
  );
};
