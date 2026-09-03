import { useLanguage } from "../../contexts/LanguageContext";
import { motion } from "framer-motion";
import { FiMapPin, FiFileText } from "react-icons/fi";
import AnimatedContent from "../ui/AnimatedContent";
import { PiGraphLight } from "react-icons/pi";

export const SystemGPS = () => {
  const { language } = useLanguage();

  return (
    <section id="gps" className="py-16 bg-white dark:bg-transparent relative overflow-hidden">
      <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Heading */}
        <AnimatedContent distance={30} direction="vertical">
          <div className="mb-10 max-w-5xl">
            <h2 className="text-3xl md:text-5xl lg:text-[48px] font-bold text-[#0F172A] dark:text-white leading-[1.2] tracking-tight">
              {language === 'id' ? (
                <>Semua kebutuhan <span className="text-[#122C93] dark:text-[#4b6bff]">operasional keamanan</span> dalam satu platform.</>
              ) : (
                <>All <span className="text-[#122C93] dark:text-[#4b6bff]">security operational</span> needs in one platform.</>
              )}
            </h2>
          </div>
        </AnimatedContent>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Left Card: Kendali Terpusat */}
          <div className="lg:col-span-7">
            <AnimatedContent delay={0.2} className="h-full">
              <div className="bg-[#F8FAFC] dark:bg-[#131F43] border border-gray-100 dark:border-white/5 rounded-3xl p-6 lg:p-7 h-full flex flex-col relative overflow-hidden group hover:border-[#3B82F6]/30 dark:hover:bg-[#16254F] transition-all duration-500 shadow-xl shadow-slate-200/50 dark:shadow-2xl dark:shadow-black/40">
                <div className="mb-4 relative z-10">
                  <div className="w-12 h-12 bg-[#122C93]/10 dark:bg-[#1E2E5C] rounded-2xl flex items-center justify-center text-[#122C93] dark:text-[#4b6bff] mb-4 shadow-sm dark:shadow-lg dark:shadow-blue-900/20">
                    <PiGraphLight className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                    {language === 'id' ? 'Kendali Terpusat' : 'Centralized Control'}
                  </h3>
                  <p className="text-gray-500 dark:text-slate-400 text-[15px] leading-relaxed max-w-2xl">
                    {language === 'id'
                      ? 'Pemantauan dan instruksi secara real-time dari satu pusat kontrol terpadu. Didukung sistem manajemen mutu ISO 9001 yang menjamin konsistensi standar operasional di setiap lokasi.'
                      : 'Real-time monitoring and instruction from a single integrated control center. Supported by ISO 9001 quality management system ensuring consistency of operational standards at every location.'}
                  </p>
                </div>

                <div className="w-full h-[1px] bg-gray-200 dark:bg-white/10 my-3 relative z-10"></div>

                {/* Network Animation Mock */}
                <div className="relative h-40 w-full mt-auto flex items-center justify-center opacity-80 group-hover:opacity-100 transition-opacity duration-500">
                  <svg className="w-full h-full scale-110 md:scale-125" viewBox="20 10 360 180" preserveAspectRatio="xMidYMid meet">
                    <defs>
                      <filter id="glowGps" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="3" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                      </filter>
                    </defs>

                    {/* Static Dashed lines (Background) */}
                    {[
                      "M 50,150 Q 150,150 200,100",
                      "M 350,50 Q 250,50 200,100",
                      "M 380,180 Q 280,180 200,100",
                      "M 120,30 Q 180,60 200,100",
                      "M 70,60 Q 130,80 200,100",
                      "M 300,160 Q 250,160 200,100",
                      "M 150,180 Q 180,150 200,100",
                      "M 260,30 Q 230,60 200,100"
                    ].map((d, i) => (
                      <path
                        key={`static-${i}`}
                        d={d}
                        fill="transparent"
                        strokeWidth="1"
                        strokeDasharray="4 4"
                        className="stroke-[#122C93] dark:stroke-[#4b6bff] opacity-15 dark:opacity-20"
                      />
                    ))}

                    {/* Animating Dashed Lines */}
                    {[
                      { d: "M 50,150 Q 150,150 200,100", delay: 0, duration: 2 },
                      { d: "M 350,50 Q 250,50 200,100", delay: 0.2, duration: 2.2 },
                      { d: "M 380,180 Q 280,180 200,100", delay: 0.4, duration: 2.5 },
                      { d: "M 120,30 Q 180,60 200,100", delay: 0.1, duration: 1.8 },
                      { d: "M 70,60 Q 130,80 200,100", delay: 0.5, duration: 2.1 },
                      { d: "M 300,160 Q 250,160 200,100", delay: 0.3, duration: 1.9 },
                      { d: "M 150,180 Q 180,150 200,100", delay: 0.6, duration: 2.3 },
                      { d: "M 260,30 Q 230,60 200,100", delay: 0.2, duration: 2.0 }
                    ].map((path, i) => (
                      <motion.path
                        key={`anim-${i}`}
                        d={path.d}
                        fill="transparent"
                        strokeWidth="1.5"
                        strokeDasharray="4 4"
                        className="stroke-[#122C93] dark:stroke-[#4b6bff]"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 0.6 }}
                        transition={{ duration: path.duration, delay: path.delay, repeat: Infinity, repeatType: 'reverse', ease: "easeInOut" }}
                      />
                    ))}

                    {/* Small Nodes */}
                    {[
                      { cx: 50, cy: 150 },
                      { cx: 350, cy: 50 },
                      { cx: 380, cy: 180 },
                      { cx: 120, cy: 30 },
                      { cx: 70, cy: 60 },
                      { cx: 300, cy: 160 },
                      { cx: 150, cy: 180 },
                      { cx: 260, cy: 30 }
                    ].map((node, i) => (
                      <circle key={`node-${i}`} cx={node.cx} cy={node.cy} r="4" className="fill-[#122C93] dark:fill-[#4b6bff]" filter="url(#glowGps)" />
                    ))}

                    {/* Central Node */}
                    <motion.circle
                      cx="200" cy="100" r="16"
                      className="fill-[#122C93]/10 dark:fill-[#4b6bff]/15 stroke-[#122C93] dark:stroke-[#4b6bff]"
                      strokeWidth="1"
                      animate={{ r: [16, 24, 16], opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                    <circle cx="200" cy="100" r="6" className="fill-[#122C93] dark:fill-[#4b6bff]" filter="url(#glowGps)" />
                  </svg>
                </div>
              </div>
            </AnimatedContent>
          </div>

          {/* Right Cards */}
          <div className="lg:col-span-5 flex flex-col gap-4">

            {/* Top Right Card: Patroli Real-time */}
            <AnimatedContent delay={0.4} className="flex-1">
              <div className="bg-[#F8FAFC] dark:bg-[#131F43] border border-gray-100 dark:border-white/5 rounded-3xl p-6 lg:p-7 flex flex-col justify-center h-full group hover:border-[#10B981]/30 dark:hover:bg-[#16254F] transition-all duration-300 shadow-xl shadow-slate-200/50 dark:shadow-2xl dark:shadow-black/40">
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-10 h-10 bg-emerald-100 dark:bg-[#112F40] rounded-xl flex items-center justify-center text-emerald-600 dark:text-[#10B981] shrink-0 shadow-sm dark:shadow-lg dark:shadow-emerald-900/20">
                    <FiMapPin className="w-4 h-4" />
                  </div>
                  <h3 className="text-[19px] font-bold text-gray-900 dark:text-white">
                    {language === 'id' ? 'Pemantauan Patroli Real-Time' : 'Real-Time Patrol Monitoring'}
                  </h3>
                </div>
                <p className="text-gray-500 dark:text-slate-400 text-[15px] leading-relaxed">
                  {language === 'id'
                    ? 'Pemetaan rute patroli dan validasi titik pos secara akurat via GPS.'
                    : 'Patrol route mapping and accurate post point validation via GPS.'}
                </p>
              </div>
            </AnimatedContent>

            {/* Bottom Right Card: Pelaporan Digital */}
            <AnimatedContent delay={0.6} className="flex-1">
              <div className="bg-[#F8FAFC] dark:bg-[#131F43] border border-gray-100 dark:border-white/5 rounded-3xl p-6 lg:p-7 flex flex-col justify-center h-full relative overflow-hidden group hover:border-[#10B981]/30 dark:hover:bg-[#16254F] transition-all duration-300 shadow-xl shadow-slate-200/50 dark:shadow-2xl dark:shadow-black/40">
                <div className="flex items-center gap-4 mb-3 relative z-10">
                  <div className="w-10 h-10 bg-emerald-100 dark:bg-[#112F40] rounded-xl flex items-center justify-center text-emerald-600 dark:text-[#10B981] shrink-0 shadow-sm dark:shadow-lg dark:shadow-emerald-900/20">
                    <FiFileText className="w-4 h-4" />
                  </div>
                  <h3 className="text-[19px] font-bold text-gray-900 dark:text-white">
                    {language === 'id' ? 'Pelaporan Digital' : 'Digital Reporting'}
                  </h3>
                </div>
                <p className="text-gray-500 dark:text-slate-400 text-[15px] leading-relaxed relative z-10 max-w-[300px]">
                  {language === 'id'
                    ? 'Format laporan yang mendukung bukti foto.'
                    : 'Report formats that support photographic evidence.'}
                </p>

                {/* Visual Document Mock in bottom right corner */}
                <motion.div
                  className="absolute -bottom-8 -right-4 opacity-10 dark:opacity-30 group-hover:opacity-100 group-hover:-translate-y-2 group-hover:-translate-x-2 transition-all duration-500 rotate-[-15deg] group-hover:rotate-[-5deg]"
                >
                  <div className="w-24 h-32 bg-white dark:bg-[#1E293B] border border-gray-200 dark:border-white/10 rounded-xl p-3 flex flex-col gap-2.5 shadow-2xl">
                    <div className="w-full h-2 bg-gray-200 dark:bg-slate-600 rounded-sm"></div>
                    <div className="w-3/4 h-2 bg-gray-200 dark:bg-slate-600 rounded-sm"></div>
                    <div className="w-1/2 h-2 bg-gray-200 dark:bg-slate-600 rounded-sm mb-auto"></div>
                    <div className="w-full h-8 bg-yellow-400/80 dark:bg-[#C9A227]/80 rounded-md mt-2"></div>
                  </div>
                </motion.div>
              </div>
            </AnimatedContent>

          </div>

        </div>
      </div>
    </section>
  );
};
