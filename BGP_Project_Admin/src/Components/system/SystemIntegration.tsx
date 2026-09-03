import { useLanguage } from "../../contexts/LanguageContext";
import { motion } from "framer-motion";
import { FiSmartphone, FiRefreshCw, FiMonitor } from "react-icons/fi";
import AnimatedContent from "../ui/AnimatedContent";

export const SystemIntegration = () => {
  const { language } = useLanguage();

  return (
    <section id="integration" className="py-24 bg-[#F9FAFB] dark:bg-slate-900/50 overflow-hidden relative z-10">
      
      {/* Background Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-[800px] h-[400px] bg-[#122C93]/[0.05] dark:bg-[#4b6bff]/[0.02] blur-[200px] rounded-full pointer-events-none -z-10"></div>
      
      <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <AnimatedContent distance={30} direction="vertical">
          <div className="text-center mb-20 max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-bold text-[#0F172A] dark:text-white leading-[1.3] tracking-tight">
              {language === 'id' ? (
                <>
                  <span className="text-[#122C93] dark:text-[#4b6bff]">Terintegrasi</span> dari mobile app ke dashboard admin secara real-time
                </>
              ) : (
                <>
                  <span className="text-[#122C93] dark:text-[#4b6bff]">Integrated</span> from mobile app to admin dashboard in real-time
                </>
              )}
            </h2>
          </div>
        </AnimatedContent>

        {/* Integration Cards Container */}
        <div className="relative">
          
          {/* Connecting Line (Desktop Only) */}
          <div className="hidden lg:block absolute top-1/2 left-[15%] right-[15%] h-[2px] -translate-y-1/2 z-0">
            <motion.div 
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeInOut" }}
              className="w-full h-full bg-gray-200 dark:bg-slate-700/70 origin-left rounded-full"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
            
            {/* Step 1: Mobile App */}
            <AnimatedContent distance={40} direction="vertical" delay={0.2} className="flex h-full">
              <div className="bg-white dark:bg-[#131E3D] border border-gray-100 dark:border-white/5 rounded-3xl p-6 flex flex-col items-center w-full shadow-lg shadow-black/5 dark:shadow-none hover:-translate-y-2 transition-transform duration-300">
                
                {/* Icon Container with Badge */}
                <div className="relative mb-4">
                  <div className="w-16 h-16 rounded-2xl bg-gray-50 dark:bg-[#1A2750] border border-gray-100 dark:border-white/10 flex items-center justify-center text-gray-500 dark:text-gray-300">
                    <FiSmartphone className="w-6 h-6" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-[#122C93] dark:bg-[#4b6bff] text-white flex items-center justify-center text-xs font-bold ring-4 ring-white dark:ring-[#131E3D]">
                    1
                  </div>
                </div>

                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-5 text-center">
                  {language === 'id' ? 'Satpam mengirim insiden' : 'Guard reports incident'}
                </h3>

                {/* Manual UI Skeleton */}
                <div className="w-full bg-gray-50 dark:bg-[#0B1330] rounded-xl p-4 border border-gray-100 dark:border-white/5 mt-auto">
                  <div className="flex flex-col gap-2.5">
                    <div className="h-2.5 w-16 bg-gray-200 dark:bg-slate-700/60 rounded-full"></div>
                    <div className="h-2 w-full bg-gray-200 dark:bg-slate-700/60 rounded-full"></div>
                    <div className="h-2 w-4/5 bg-gray-200 dark:bg-slate-700/60 rounded-full"></div>
                    <div className="h-2 w-3/4 bg-gray-200 dark:bg-slate-700/60 rounded-full"></div>
                    <div className="flex justify-end mt-2">
                      <div className="h-7 w-16 bg-[#122C93]/20 dark:bg-[#4b6bff]/20 rounded-md"></div>
                    </div>
                  </div>
                </div>

              </div>
            </AnimatedContent>

            {/* Step 2: Sync */}
            <AnimatedContent distance={40} direction="vertical" delay={0.4} className="flex h-full">
              <div className="bg-white dark:bg-[#131E3D] border border-gray-100 dark:border-white/5 rounded-3xl p-6 flex flex-col items-center w-full shadow-lg shadow-black/5 dark:shadow-none hover:-translate-y-2 transition-transform duration-300">
                
                {/* Icon Container with Badge */}
                <div className="relative mb-4">
                  <div className="w-16 h-16 rounded-2xl bg-gray-50 dark:bg-[#1A2750] border border-gray-100 dark:border-white/10 flex items-center justify-center text-gray-500 dark:text-gray-300">
                    <FiRefreshCw className="w-6 h-6" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-[#122C93] dark:bg-[#4b6bff] text-white flex items-center justify-center text-xs font-bold ring-4 ring-white dark:ring-[#131E3D]">
                    2
                  </div>
                </div>

                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-5 text-center">
                  {language === 'id' ? 'Sinkronisasi real-time' : 'Real-time synchronization'}
                </h3>

                {/* Spinner Animation */}
                <div className="w-full flex-1 flex items-center justify-center py-4 mt-auto">
                  <div className="relative">
                    <motion.div 
                      animate={{ rotate: 360 }} 
                      transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                      className="w-16 h-16 rounded-full border-[3px] border-gray-100 dark:border-slate-700/50 border-t-[#122C93] dark:border-t-[#4b6bff] relative z-10"
                    />
                  </div>
                </div>

              </div>
            </AnimatedContent>

            {/* Step 3: Admin Dashboard */}
            <AnimatedContent distance={40} direction="vertical" delay={0.6} className="flex h-full">
              <div className="bg-white dark:bg-[#131E3D] border border-gray-100 dark:border-white/5 rounded-3xl p-6 flex flex-col items-center w-full shadow-lg shadow-black/5 dark:shadow-none hover:-translate-y-2 transition-transform duration-300">
                
                {/* Icon Container with Badge */}
                <div className="relative mb-4">
                  <div className="w-16 h-16 rounded-2xl bg-gray-50 dark:bg-[#1A2750] border border-gray-100 dark:border-white/10 flex items-center justify-center text-gray-500 dark:text-gray-300">
                    <FiMonitor className="w-6 h-6" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-[#122C93] dark:bg-[#4b6bff] text-white flex items-center justify-center text-xs font-bold ring-4 ring-white dark:ring-[#131E3D]">
                    3
                  </div>
                </div>

                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-5 text-center">
                  {language === 'id' ? 'Admin meninjau insiden' : 'Admin reviews incident'}
                </h3>

                {/* Manual UI Skeleton */}
                <div className="w-full bg-gray-50 dark:bg-[#0B1330] rounded-xl p-4 border border-gray-100 dark:border-white/5 mt-auto">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)] animate-pulse"></div>
                    <div className="h-2 w-20 bg-gray-200 dark:bg-slate-700/60 rounded-full"></div>
                  </div>
                  <div className="h-12 w-full bg-white dark:bg-[#131E3D] border border-dashed border-gray-300 dark:border-slate-600 rounded-lg flex items-center justify-center">
                    <div className="w-3/4 h-2 bg-gray-100 dark:bg-slate-700/40 rounded-full"></div>
                  </div>
                </div>

              </div>
            </AnimatedContent>

          </div>
        </div>

      </div>
    </section>
  );
};
