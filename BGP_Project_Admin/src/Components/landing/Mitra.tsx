import ScrollVelocity from "../ui/ScrollVelocity";
import { useLanguage } from "../../contexts/LanguageContext";
import AnimatedContent from "../ui/AnimatedContent";
import ikea from "../../assets/images/ikea.webp";
import globalindo from "../../assets/images/logo-globalindo.webp";
import nindya from "../../assets/images/nindya.webp";
import unnes from "../../assets/images/unnes.webp";
import waskita from "../../assets/images/waskita-precast.webp";
import wika from "../../assets/images/wika.webp";

export const Mitra = () => {
  const { t } = useLanguage();

  const logoRow1 = (
    <div className="flex items-center gap-12 sm:gap-20 px-6 sm:px-10">
      <img src={ikea} alt="IKEA" className="h-12 sm:h-16 w-auto object-contain grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-300 cursor-pointer" />
      <img src={globalindo} alt="Globalindo" className="h-12 sm:h-16 w-auto object-contain grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-300 cursor-pointer" />
      <img src={nindya} alt="Nindya" className="h-12 sm:h-18 w-auto object-contain grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-300 cursor-pointer" />
      <img src={unnes} alt="Unnes" className="h-12 sm:h-18 w-auto object-contain grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-300 cursor-pointer" />
      <img src={waskita} alt="Waskita" className="h-12 sm:h-16 w-auto object-contain grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-300 cursor-pointer" />
      <img src={wika} alt="Wika" className="h-12 sm:h-18 w-auto object-contain grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-300 cursor-pointer" />
    </div>
  );



  return (
    <section id="mitra" className="py-24 sm:py-32 standar-grid-bg overflow-hidden relative">
      <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="flex flex-col items-center justify-center text-center">
          <AnimatedContent
            distance={20}
            direction="vertical"
            duration={0.6}
            ease="easeOut"
          >
            <h2 className="text-lg font-bold text-[#122C93] dark:text-[#4b6bff] mb-2 tracking-widest uppercase font-geist-mono">
              {t('mitra.title').split(' ')[0]} {/* "MITRA" */}
            </h2>
          </AnimatedContent>
          <AnimatedContent
            distance={20}
            direction="vertical"
            delay={0.2}
            duration={0.6}
            ease="easeOut"
          >
            <h3 className="text-3xl sm:text-4xl md:text-5xl font-black leading-tight text-gray-900 dark:text-white max-w-5xl tracking-tight mb-4 uppercase">
              {t('mitra.title')}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto text-lg sm:text-xl leading-relaxed font-medium">
              {t('mitra.desc')}
            </p>
          </AnimatedContent>
        </div>
      </div>

      <div className="w-full relative z-10 flex flex-col gap-6 sm:gap-10">
        <AnimatedContent
          distance={40}
          direction="vertical"
          delay={0.4}
          duration={0.8}
          ease="power2.out"
        >
          <ScrollVelocity
            texts={[logoRow1]}
            velocity={30}
            className="scroll-logo-item"
          />
        </AnimatedContent>
      </div>
    </section>
  );
};
