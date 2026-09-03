import { useLanguage } from "../../contexts/LanguageContext";
import { motion } from "framer-motion";
import { FiGrid, FiSend, FiCalendar } from "react-icons/fi";
import AnimatedContent from "../ui/AnimatedContent";
import tableImg from "../../assets/images/table.webp";

export const SystemShift = () => {
  const { language } = useLanguage();

  return (
    <section id="shift" className="py-20 bg-[#F9FAFB] dark:bg-slate-900/50 overflow-hidden relative">
      <div className="max-w-[100rem] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 xl:gap-20 items-center">
          
          {/* Left: Image Mockup */}
          <div className="lg:col-span-6 flex justify-center">
            <AnimatedContent direction="horizontal" distance={40}>
              <div className="relative w-full group flex justify-center">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="relative w-full"
                >
                  <img 
                    src={tableImg} 
                    alt="Jadwal Shift Tim" 
                    className="w-full h-auto object-cover scale-90 lg:scale-95 drop-shadow-[0_25px_35px_rgba(0,0,0,0.15)] dark:drop-shadow-[0_25px_35px_rgba(0,0,0,0.4)]"
                  />
                </motion.div>
              </div>
            </AnimatedContent>
          </div>

          {/* Right: Text Content */}
          <div className="lg:col-span-6 lg:pl-8 xl:pl-12">
            <AnimatedContent direction="horizontal" distance={-40} delay={0.2}>
              <div className="flex flex-col">
                <span className="font-mono text-sm font-semibold tracking-wider text-[#122C93] dark:text-[#4b6bff] mb-4 uppercase">
                  {language === 'id' ? 'Web Dashboard Admin' : 'Web Dashboard Admin'}
                </span>
                
                <h2 className="text-3xl md:text-4xl lg:text-[42px] font-bold text-[#0F172A] dark:text-white leading-[1.2] mb-6 tracking-tight">
                  {language === 'id' 
                    ? 'Susun Jadwal Shift Tim dalam Hitungan Detik' 
                    : 'Create Team Shift Schedules in Seconds'}
                </h2>
                
                <p className="text-gray-500 dark:text-slate-400 text-base md:text-lg leading-relaxed mb-10">
                  {language === 'id'
                    ? 'Kelola jadwal tim secara efisien lewat fitur penjadwalan intuitif. Cukup pilih shift yang tersedia, dan memastikan seluruh lokasi operasional selalu ter cover dengan baik.'
                    : 'Manage team schedules efficiently through intuitive scheduling features. Simply select available shifts and ensure all operational locations are well-covered.'}
                </p>

                {/* Feature List */}
                <div className="flex flex-col gap-6">
                  
                  {/* Feature 1 */}
                  <motion.div 
                    className="flex items-center gap-4 group"
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="w-12 h-12 rounded-xl bg-[#122C93]/10 dark:bg-[#1E2E5C] flex items-center justify-center text-[#122C93] dark:text-[#4b6bff] shrink-0 group-hover:bg-[#122C93] group-hover:text-white dark:group-hover:bg-[#4b6bff] dark:group-hover:text-white transition-colors duration-300">
                      <FiGrid className="w-5 h-5" />
                    </div>
                    <span className="text-gray-700 dark:text-gray-300 font-medium text-[15px] group-hover:text-[#122C93] dark:group-hover:text-[#4b6bff] transition-colors duration-300">
                      {language === 'id' ? 'Kelola Jadwal Shift dengan Cepat dan Mudah' : 'Manage Shift Schedules Quickly and Easily'}
                    </span>
                  </motion.div>

                  {/* Feature 2 */}
                  <motion.div 
                    className="flex items-center gap-4 group"
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="w-12 h-12 rounded-xl bg-[#122C93]/10 dark:bg-[#1E2E5C] flex items-center justify-center text-[#122C93] dark:text-[#4b6bff] shrink-0 group-hover:bg-[#122C93] group-hover:text-white dark:group-hover:bg-[#4b6bff] dark:group-hover:text-white transition-colors duration-300">
                      <FiSend className="w-5 h-5" />
                    </div>
                    <span className="text-gray-700 dark:text-gray-300 font-medium text-[15px] group-hover:text-[#122C93] dark:group-hover:text-[#4b6bff] transition-colors duration-300">
                      {language === 'id' ? 'Sinkronisasi Instan ke Aplikasi Mobile Satpam' : 'Instant Synchronization to Security Mobile App'}
                    </span>
                  </motion.div>

                  {/* Feature 3 */}
                  <motion.div 
                    className="flex items-center gap-4 group"
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="w-12 h-12 rounded-xl bg-[#122C93]/10 dark:bg-[#1E2E5C] flex items-center justify-center text-[#122C93] dark:text-[#4b6bff] shrink-0 group-hover:bg-[#122C93] group-hover:text-white dark:group-hover:bg-[#4b6bff] dark:group-hover:text-white transition-colors duration-300">
                      <FiCalendar className="w-5 h-5" />
                    </div>
                    <span className="text-gray-700 dark:text-gray-300 font-medium text-[15px] group-hover:text-[#122C93] dark:group-hover:text-[#4b6bff] transition-colors duration-300">
                      {language === 'id' ? 'Flesibilitas Penuh dalam Membuat Shift' : 'Full Flexibility in Creating Shifts'}
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
