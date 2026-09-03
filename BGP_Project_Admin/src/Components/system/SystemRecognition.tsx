import { useLanguage } from "../../contexts/LanguageContext";
import { motion } from "framer-motion";
import { FiUserCheck, FiMapPin, FiCheckCircle } from "react-icons/fi";
import AnimatedContent from "../ui/AnimatedContent";
import recognitionImg from "../../assets/images/recognition.webp";

export const SystemRecognition = () => {
  const { language } = useLanguage();

  return (
    <section id="recognition" className="py-20 bg-white dark:bg-transparent overflow-hidden relative">
      <div className="max-w-[100rem] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* We reverse the layout here compared to SystemShift: Text on left, Image on right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 xl:gap-20 items-center">
          
          {/* Left: Text Content */}
          <div className="lg:col-span-6 order-2 lg:order-1 lg:pr-8 xl:pr-12">
            <AnimatedContent direction="horizontal" distance={-40} delay={0.2}>
              <div className="flex flex-col">
                <span className="font-mono text-sm font-semibold tracking-wider text-[#122C93] dark:text-[#4b6bff] mb-4 uppercase">
                  {language === 'id' ? 'Mobile App Untuk Satpam' : 'Mobile App For Security'}
                </span>
                
                <h2 className="text-3xl md:text-4xl lg:text-[42px] font-bold text-[#0F172A] dark:text-white leading-[1.2] mb-6 tracking-tight">
                  {language === 'id' 
                    ? 'Absensi Biometrik & Validasi Lokasi Presisi' 
                    : 'Biometric Attendance & Precise Location Validation'}
                </h2>
                
                <p className="text-gray-500 dark:text-slate-400 text-base md:text-lg leading-relaxed mb-10">
                  {language === 'id'
                    ? 'Absensi dengan face recognition (AI) dan validasi radius GPS, untuk memastikan setiap kehadiran tercatat dan tidak bisa diwakilkan.'
                    : 'Attendance with face recognition (AI) and GPS radius validation, to ensure every attendance is recorded and cannot be delegated.'}
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
                      <FiUserCheck className="w-5 h-5" />
                    </div>
                    <span className="text-gray-700 dark:text-gray-300 font-medium text-[15px] group-hover:text-[#122C93] dark:group-hover:text-[#4b6bff] transition-colors duration-300">
                      {language === 'id' ? 'Pemindaian wajah real-time memastikan identitas satpam saat absensi' : 'Real-time face scanning ensures security guard identity during attendance'}
                    </span>
                  </motion.div>

                  {/* Feature 2 */}
                  <motion.div 
                    className="flex items-center gap-4 group"
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="w-12 h-12 rounded-xl bg-[#122C93]/10 dark:bg-[#1E2E5C] flex items-center justify-center text-[#122C93] dark:text-[#4b6bff] shrink-0 group-hover:bg-[#122C93] group-hover:text-white dark:group-hover:bg-[#4b6bff] dark:group-hover:text-white transition-colors duration-300">
                      <FiMapPin className="w-5 h-5" />
                    </div>
                    <span className="text-gray-700 dark:text-gray-300 font-medium text-[15px] group-hover:text-[#122C93] dark:group-hover:text-[#4b6bff] transition-colors duration-300">
                      {language === 'id' ? 'Proses absensi wajib dilakukan di dalam radius yang sudah ditentukan' : 'Attendance process must be done within the predetermined radius'}
                    </span>
                  </motion.div>

                  {/* Feature 3 */}
                  <motion.div 
                    className="flex items-center gap-4 group"
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="w-12 h-12 rounded-xl bg-[#122C93]/10 dark:bg-[#1E2E5C] flex items-center justify-center text-[#122C93] dark:text-[#4b6bff] shrink-0 group-hover:bg-[#122C93] group-hover:text-white dark:group-hover:bg-[#4b6bff] dark:group-hover:text-white transition-colors duration-300">
                      <FiCheckCircle className="w-5 h-5" />
                    </div>
                    <span className="text-gray-700 dark:text-gray-300 font-medium text-[15px] group-hover:text-[#122C93] dark:group-hover:text-[#4b6bff] transition-colors duration-300">
                      {language === 'id' ? 'Status kehadiran ditentukan otomatis oleh sistem' : 'Attendance status is determined automatically by the system'}
                    </span>
                  </motion.div>

                </div>
              </div>
            </AnimatedContent>
          </div>

          {/* Right: Image Mockup */}
          <div className="lg:col-span-6 order-1 lg:order-2 flex justify-center">
            <AnimatedContent direction="horizontal" distance={40}>
              <div className="relative w-full group flex justify-center">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="relative w-[90%] md:w-[80%] lg:w-[75%]"
                >
                  <img 
                    src={recognitionImg} 
                    alt="Absensi Biometrik" 
                    className="w-full h-auto object-cover drop-shadow-[0_25px_35px_rgba(0,0,0,0.15)] dark:drop-shadow-[0_25px_35px_rgba(0,0,0,0.4)] relative z-10"
                  />
                </motion.div>
              </div>
            </AnimatedContent>
          </div>

        </div>
      </div>
    </section>
  );
};
