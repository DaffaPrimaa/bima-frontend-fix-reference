import { useState, useEffect } from "react";
import { useTheme } from "../../contexts/ThemeProvider";
import { FiSun, FiMoon, FiGlobe } from "react-icons/fi";
import { motion } from "framer-motion";
import { useLanguage } from "../../contexts/LanguageContext";
import logo from "../../assets/images/logo.webp";
import { LuMoveRight } from "react-icons/lu";

export const SystemNavbar = () => {
  const { theme, toggleTheme } = useTheme();
  const { language, toggleLanguage } = useLanguage();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial check

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed z-50 w-full flex justify-center transition-all duration-500 ease-in-out ${scrolled ? "top-4 px-4 md:px-6" : "top-0 px-0"}`}
    >
      <motion.div
        layout
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
        className={`w-full backdrop-blur-2xl backdrop-saturate-150 border-b sm:border flex items-center justify-between transition-all duration-500 ease-in-out
          ${scrolled
            ? "max-w-5xl px-6 py-3 rounded-full bg-white/70 dark:bg-slate-900/80 border-white/40 dark:border-slate-700/50 shadow-[0_8px_32px_0_rgba(0,0,0,0.1)] dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.4)]"
            : "max-w-full px-6 md:px-12 py-6 rounded-none shadow-none bg-transparent border-transparent sm:border-transparent"
          }`}
      >
        <div className="container-company flex items-center gap-4">
          <img src={logo} className="w-12" alt="BGS Logo" />
          <a
            href="/"
            className="hidden sm:block font-bold text-2xl tracking-tighter text-[#122C93] dark:text-white transition-colors"
          >
            Bima Global Security
          </a>
        </div>

        <ul className="hidden md:flex gap-6 lg:gap-8 items-center font-medium">
          <li>
            <a
              href="/"
              className="font-medium transition-colors text-slate-600 hover:text-[#122C93] dark:text-slate-300 dark:hover:text-[#122C93]"
            >
              {language === 'id' ? 'Beranda' : 'Home'}
            </a>
          </li>
          <li>
            <a
              href="#shift"
              className="font-medium transition-colors text-slate-600 hover:text-[#122C93] dark:text-slate-300 dark:hover:text-[#122C93]"
            >
              Web Dashboard
            </a>
          </li>
          <li>
            <a
              href="#recognition"
              className="font-medium transition-colors text-slate-600 hover:text-[#122C93] dark:text-slate-300 dark:hover:text-[#122C93]"
            >
              Mobile App
            </a>
          </li>
        </ul>

        <div className="flex items-center gap-4">
          <button
            onClick={toggleTheme}
            className="w-10 h-10 rounded-full flex items-center justify-center transition-all border shadow-sm bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-[#122C93] dark:hover:border-[#122C93] hover:text-[#122C93] dark:hover:text-[#122C93]"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <FiSun size={20} /> : <FiMoon size={20} />}
          </button>

          <button
            onClick={toggleLanguage}
            className="w-10 h-10 rounded-full flex items-center justify-center transition-all border shadow-sm bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-[#122C93] dark:hover:border-[#122C93] hover:text-[#122C93] dark:hover:text-[#122C93] relative group"
            aria-label="Toggle language"
          >
            <FiGlobe size={18} />
            <span className="absolute -bottom-8 px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity font-bold text-[10px] bg-slate-800 text-white dark:bg-white dark:text-black">
              {language === "en" ? "ID" : "EN"}
            </span>
          </button>

          <motion.a
            href="https://wa.me/6285797219631"
            target="_blank"
            rel="noreferrer"
            whileHover="hover"
            className="px-5 py-2.5 rounded-full flex flex-row items-center gap-2 font-semibold shadow-lg text-sm transition-all bg-[#122C93] text-white shadow-[#122C93]/20 dark:bg-[#4b6bff] dark:shadow-[#4b6bff]/20 hover:scale-105"
          >
            <span>{language === 'id' ? 'Hubungi Kami' : 'Contact Us'}</span>
            <motion.span
              variants={{
                hover: { x: 5 }
              }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
              className="flex items-center"
            >
              <LuMoveRight />
            </motion.span>
          </motion.a>
        </div>
      </motion.div>
    </nav>
  );
};
