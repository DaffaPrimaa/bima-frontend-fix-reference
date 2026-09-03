import { FaFacebookF, FaInstagram, FaYoutube, FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from "react-icons/fa";
import logoImage from "../../assets/images/logo.webp";
import AnimatedContent from "../ui/AnimatedContent";
import { useLanguage } from "../../contexts/LanguageContext";

interface FooterProps {
  description?: string;
  copyright?: string;
}

export const Footer = ({
  copyright = `© 2026 Bima Global Security. Hak cipta dilindungi undang-undang.`,
}: FooterProps) => {
  const { t } = useLanguage();

  return (
    <footer className="bg-white dark:bg-[#0a0f1d] text-gray-900 dark:text-white border-t border-gray-200 dark:border-gray-800 py-16 font-geist">
      <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedContent distance={20} direction="vertical" duration={0.6} ease="easeOut">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-8">

            {/* Left Column - Logo and Description (Takes 5 columns) */}
            <div className="md:col-span-5 flex flex-col gap-6">
              <div className="flex items-center gap-4">
                <div className="bg-white p-2 rounded-full h-14 w-14 flex items-center justify-center shrink-0 shadow-md border border-gray-100 dark:border-none">
                  <img
                    src={logoImage}
                    alt="Bima Global Security Logo"
                    className="h-10 w-auto object-contain"
                  />
                </div>
                <div className="flex flex-col">
                  <h2 className="text-xl font-bold tracking-wide text-gray-900 dark:text-white">Bima Global Security</h2>
                  <span className="text-[#122C93] dark:text-[#4b6bff] text-xs font-bold tracking-widest uppercase mt-0.5">INDONESIA</span>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-base leading-relaxed max-w-sm mt-2">
                {t('footer.desc')}
              </p>
              <div className="flex items-center gap-4 mt-4">
                <a href="https://www.facebook.com/bimaglobal" target="_blank" rel="noreferrer" className="h-9 w-9 rounded-full bg-gray-100 dark:bg-[#121828] flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-[#122C93] dark:hover:bg-[#4b6bff] hover:text-white transition-all duration-300">
                  <FaFacebookF className="text-sm" />
                </a>
                <a href="https://instagram.com/ptbimaglobal" target="_blank" rel="noreferrer" className="h-9 w-9 rounded-full bg-gray-100 dark:bg-[#121828] flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-[#122C93] dark:hover:bg-[#4b6bff] hover:text-white transition-all duration-300">
                  <FaInstagram className="text-sm" />
                </a>
                <a href="#" className="h-9 w-9 rounded-full bg-gray-100 dark:bg-[#121828] flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-[#122C93] dark:hover:bg-[#4b6bff] hover:text-white transition-all duration-300">
                  <FaYoutube className="text-sm" />
                </a>
              </div>
            </div>

            {/* Middle Column - TAUTAN CEPAT (Takes 3 columns) */}
            <div className="md:col-span-3 lg:pl-10">
              <h3 className="text-base font-bold uppercase tracking-wider mb-8 text-gray-900 dark:text-white">{t('footer.quick_links')}</h3>
              <ul className="flex flex-col gap-4 text-base text-gray-600 dark:text-gray-400">
                <li><a href="#" className="hover:text-[#122C93] dark:hover:text-white transition-colors">{t('footer.home')}</a></li>
                <li><a href="#tentang" className="hover:text-[#122C93] dark:hover:text-white transition-colors">{t('footer.about')}</a></li>
                <li><a href="#layanan" className="hover:text-[#122C93] dark:hover:text-white transition-colors">{t('footer.services')}</a></li>
                <li><a href="#operasi-kami" className="hover:text-[#122C93] dark:hover:text-white transition-colors">{t('footer.operations')}</a></li>
                <li><a href="#mitra" className="hover:text-[#122C93] dark:hover:text-white transition-colors">{t('footer.partners')}</a></li>
                <li><a href="#kontak" className="hover:text-[#122C93] dark:hover:text-white transition-colors">{t('footer.contact')}</a></li>
              </ul>
            </div>

            {/* Right Column - HUBUNGI KAMI (Takes 4 columns) */}
            <div className="md:col-span-4">
              <h3 className="text-base font-bold uppercase tracking-wider mb-8 text-gray-900 dark:text-white">{t('footer.contact_us')}</h3>
              <ul className="flex flex-col gap-6 text-base text-gray-600 dark:text-gray-400">
                <li className="flex items-start gap-4">
                  <FaMapMarkerAlt className="text-[#122C93] dark:text-[#4b6bff] mt-1 shrink-0 text-base" />
                  <span className="leading-relaxed pr-4">Jalan Candi Prambanan 770, Kalipancur, Ngaliyan, Semarang, Indonesia</span>
                </li>
                <li className="flex items-center gap-4">
                  <FaPhoneAlt className="text-[#122C93] dark:text-[#4b6bff] shrink-0 text-base" />
                  <span>+62 857 9721 9631</span>
                </li>
                <li className="flex items-center gap-4">
                  <FaEnvelope className="text-[#122C93] dark:text-[#4b6bff] shrink-0 text-base" />
                  <span>marketing@bimasecurity.co.id</span>
                </li>
              </ul>
            </div>

          </div>
        </AnimatedContent>

          <div className="mt-10 pt-6 border-t border-gray-200 dark:border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
            <p>{copyright}</p>
            <div className="flex items-center gap-3">
              <a href="#" className="hover:text-[#122C93] dark:hover:text-white transition-colors">{t('footer.privacy')}</a>
              <span className="text-gray-300 dark:text-gray-700">·</span>
              <a href="#" className="hover:text-[#122C93] dark:hover:text-white transition-colors">{t('footer.terms')}</a>
            </div>
          </div>
      </div>
    </footer>
  );
};
