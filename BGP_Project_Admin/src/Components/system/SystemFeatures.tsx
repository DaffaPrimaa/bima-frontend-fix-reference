import AnimatedContent from "../ui/AnimatedContent";
import { useLanguage } from "../../contexts/LanguageContext";
import { FiUser } from "react-icons/fi";

export const SystemFeatures = () => {
  const { language } = useLanguage();

  return (
    <section id="fitur" className="py-24 bg-[#F9FAFB] dark:bg-slate-900/50 overflow-hidden">
      <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8">
        
        <AnimatedContent distance={20} direction="vertical">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-[40px] font-bold text-[#0F172A] dark:text-white tracking-tight">
              {language === 'id' ? 'Satu operasi, dua sistem yang saling terhubung' : 'One operation, two interconnected systems'}
            </h2>
          </div>
        </AnimatedContent>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
          
          {/* Card 1: Web Dashboard */}
          <AnimatedContent delay={0.2}>
            <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 lg:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none flex flex-col h-full border border-gray-100 dark:border-slate-700">
              <div className="mb-10">
                <span className="font-mono text-sm text-[#94A3B8] font-medium tracking-wider">
                  {language === 'id' ? 'Untuk Operasional & Admin' : 'For Operations & Admin'}
                </span>
                <h3 className="text-2xl font-bold text-[#0F172A] dark:text-white mt-3 mb-4">
                  {language === 'id' ? 'Web Dashboard Admin' : 'Admin Web Dashboard'}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 leading-relaxed text-[15px]">
                  {language === 'id' 
                    ? 'Sistem manajemen keamanan terpadu untuk mengelola penjadwalan shift, integrasi data personel, serta pelaporan insiden secara real-time.' 
                    : 'Integrated security management system for managing shift scheduling, personnel data integration, and real-time incident reporting.'}
                </p>
              </div>
              
              {/* Mock Visual: Web Dashboard */}
              <div className="mt-auto bg-[#F8FAFC] dark:bg-slate-700/50 rounded-2xl pt-8 px-8 h-56 flex flex-col justify-between border border-gray-50 dark:border-slate-600/50 overflow-hidden">
                <div className="flex gap-3 mb-6">
                  <div className="w-10 h-2 bg-[#CBD5E1] dark:bg-slate-500 rounded-full opacity-60"></div>
                  <div className="w-16 h-2 bg-[#CBD5E1] dark:bg-slate-500 rounded-full opacity-40"></div>
                  <div className="w-20 h-2 bg-[#CBD5E1] dark:bg-slate-500 rounded-full opacity-40"></div>
                </div>
                
                <div className="flex items-end gap-3 h-full pt-4 w-full px-2">
                  <div className="w-full bg-[#CBD5E1] dark:bg-slate-600 h-[35%] rounded-t-sm"></div>
                  <div className="w-full bg-[#CBD5E1] dark:bg-slate-600 h-[55%] rounded-t-sm"></div>
                  <div className="w-full bg-gradient-to-t from-[#1E3A8A] to-[#3B82F6] h-[90%] rounded-t-sm shadow-[0_0_15px_rgba(59,130,246,0.3)]"></div>
                  <div className="w-full bg-[#CBD5E1] dark:bg-slate-600 h-[45%] rounded-t-sm"></div>
                </div>
              </div>
            </div>
          </AnimatedContent>

          {/* Card 2: Mobile App */}
          <AnimatedContent delay={0.4}>
            <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 lg:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none flex flex-col h-full border border-gray-100 dark:border-slate-700">
              <div className="mb-10">
                <span className="font-mono text-sm text-[#94A3B8] font-medium tracking-wider">
                  {language === 'id' ? 'Untuk Personel' : 'For Personnel'}
                </span>
                <h3 className="text-2xl font-bold text-[#0F172A] dark:text-white mt-3 mb-4">
                  {language === 'id' ? 'Mobile App untuk Satpam' : 'Mobile App for Security'}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 leading-relaxed text-[15px]">
                  {language === 'id' 
                    ? 'Absensi face recognition, rute patroli, laporan kejadian, hingga Panic Alert semua lengkap dalam satu aplikasi di ponsel petugas.' 
                    : 'Face recognition attendance, patrol routes, incident reports, to Panic Alerts all complete in one application on the officer\'s mobile phone.'}
                </p>
              </div>
              
              {/* Mock Visual: Mobile App */}
              <div className="mt-auto bg-[#F8FAFC] dark:bg-slate-700/50 rounded-2xl pt-8 px-6 pb-6 h-56 flex flex-col border border-gray-50 dark:border-slate-600/50 relative overflow-hidden items-center">
                <div className="w-full flex justify-between items-start mb-6 px-2">
                  <div className="flex flex-col gap-2.5 pt-1">
                    <div className="w-20 h-2 bg-[#CBD5E1] dark:bg-slate-500 rounded-full opacity-60"></div>
                    <div className="w-28 h-2.5 bg-[#94A3B8] dark:bg-slate-400 rounded-full"></div>
                    <div className="w-16 h-2 bg-[#CBD5E1] dark:bg-slate-500 rounded-full opacity-60"></div>
                  </div>
                  <div className="w-8 h-8 rounded-full border-[1.5px] border-[#94A3B8] dark:border-slate-400 flex items-center justify-center text-[#94A3B8] dark:text-slate-400">
                    <FiUser className="w-4 h-4" />
                  </div>
                </div>
                
                <div className="w-full bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-600 rounded-lg h-20 shadow-[0_2px_10px_rgba(0,0,0,0.02)] dark:shadow-none mt-2"></div>
                
                <div className="w-16 h-1.5 bg-[#E2E8F0] dark:bg-slate-600 rounded-full absolute bottom-4"></div>
              </div>
            </div>
          </AnimatedContent>

        </div>
      </div>
    </section>
  );
};
