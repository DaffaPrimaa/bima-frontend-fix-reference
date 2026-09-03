import { useLanguage } from "../../contexts/LanguageContext";
import { motion } from "framer-motion";
import AnimatedContent from "../ui/AnimatedContent";
import bookImg from "../../assets/images/book.webp";
import isoImg from "../../assets/images/iso.webp";
import shapesImg from "../../assets/images/shapes.webp";
import globeImg from "../../assets/images/globe.webp";

export const SystemStandard = () => {
  const { language } = useLanguage();

  const standards = [
    {
      img: bookImg,
      title: language === 'id' ? 'Legalitas Lengkap' : 'Complete Legality',
      desc: language === 'id' ? 'Beroperasi dengan Izin Penyedia Tenaga Keamanan resmi, Izin OSS, dan terdaftar di APKLINDO & KADIN.' : 'Operating with official Security Provider License, OSS License, and registered with APKLINDO & KADIN.'
    },
    {
      img: shapesImg,
      title: language === 'id' ? '30+ Mitra Nasional' : '30+ National Partners',
      desc: language === 'id' ? 'Dipercaya oleh berbagai perusahaan nasional berskala besar di seluruh Indonesia.' : 'Trusted by various large-scale national companies throughout Indonesia.'
    },
    {
      img: isoImg,
      title: language === 'id' ? 'Standar ISO Internasional' : 'International ISO Standards',
      desc: language === 'id' ? 'Tersertifikasi ISO 9001:2015 (Mutu), ISO 27001:2022 (Keamanan Informasi), dan ISO 45001:2018 (K3).' : 'Certified ISO 9001:2015 (Quality), ISO 27001:2022 (Information Security), and ISO 45001:2018 (HSE).'
    },
    {
      img: globeImg,
      title: language === 'id' ? 'Operasional Nasional' : 'National Operations',
      desc: language === 'id' ? 'Kantor pusat di Semarang dengan cabang di Jakarta, Banten, siap melayani kebutuhan keamanan di seluruh Indonesia.' : 'Headquartered in Semarang with branches in Jakarta and Banten, ready to serve security needs across Indonesia.'
    }
  ];

  return (
    <section id="standard" className="py-24 bg-[#F9FAFB] dark:bg-slate-900/50 overflow-hidden relative z-10">
      
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-[#122C93]/[0.05] dark:bg-[#4b6bff]/[0.03] blur-[150px] rounded-full pointer-events-none -z-10"></div>
      
      <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <AnimatedContent distance={30} direction="vertical">
          <div className="text-center mb-16 max-w-4xl mx-auto">
             <span className="font-mono text-sm font-semibold tracking-widest text-[#122C93] dark:text-[#4b6bff] mb-4 uppercase inline-block">
               {language === 'id' ? 'Standar Kelas Dunia' : 'World Class Standards'}
             </span>
            <h2 className="text-3xl md:text-4xl lg:text-[42px] font-bold text-[#0F172A] dark:text-white leading-[1.3] tracking-tight mt-2">
              {language === 'id' ? 'Dipercaya dengan Standar Kelas Dunia' : 'Trusted with World Class Standards'}
            </h2>
          </div>
        </AnimatedContent>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {standards.map((item, index) => (
            <AnimatedContent key={index} delay={0.1 * (index + 1)} distance={30} direction="vertical" className="flex h-full">
              <motion.div 
                whileHover={{ y: -10 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="bg-white dark:bg-[#131E3D] border border-gray-100 dark:border-white/5 rounded-3xl p-8 shadow-xl shadow-black/[0.04] dark:shadow-none flex flex-col items-start w-full"
              >
                <div className="w-full h-40 mb-10 flex items-center justify-center">
                  <motion.img 
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    src={item.img} 
                    alt={item.title} 
                    className="w-auto h-full object-contain" 
                  />
                </div>
                
                <h3 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-4">
                  {item.title}
                </h3>
                
                <p className="text-gray-500 dark:text-slate-400 text-sm md:text-base leading-relaxed">
                  {item.desc}
                </p>
              </motion.div>
            </AnimatedContent>
          ))}
        </div>

      </div>
    </section>
  );
};
