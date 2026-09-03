import AnimatedContent from "../ui/AnimatedContent";

import { useLanguage } from "../../contexts/LanguageContext";

const getStandards = (t: any) => [
  {
    number: "01",
    title: t('standar.prof_title'),
    description: t('standar.prof_desc'),
  },
  {
    number: "02",
    title: t('standar.resp_title'),
    description: t('standar.resp_desc'),
  },
  {
    number: "03",
    title: t('standar.unggul_title'),
    description: t('standar.unggul_desc'),
  },
  {
    number: "04",
    title: t('standar.percaya_title'),
    description: t('standar.percaya_desc'),
  },
];

export const StandarLayanan = () => {
  const { t } = useLanguage();
  const standards = getStandards(t);

  return (
    <section id="standar-layanan" className="py-32 md:py-40 standar-grid-bg overflow-hidden">
      <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start mb-16">
          <AnimatedContent
            distance={20}
            direction="horizontal"
            reverse={true}
            duration={0.5}
          >
            <h2 className="text-lg font-bold text-[#122C93] dark:text-[#4b6bff] mb-2 tracking-wide uppercase font-geist-mono">
              {t('standar.section_title')}
            </h2>
          </AnimatedContent>
          <AnimatedContent
            distance={20}
            direction="vertical"
            delay={0.2}
            duration={0.5}
          >
            <h3 className="text-4xl md:text-4xl font-extrabold leading-tight text-gray-900 dark:text-white max-w-4xl uppercase">
              <span className="text-[#122C93] dark:text-[#4b6bff]">{t('standar.main_title_highlight')}</span> {t('standar.main_title').split(t('standar.main_title_highlight'))[1]}
            </h3>
          </AnimatedContent>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {standards.map((item, index) => (
            <AnimatedContent
              key={index}
              distance={30}
              direction="vertical"
              delay={index * 0.15}
              duration={0.6}
              className="flex-1 flex"
            >
              <div className="flex-1 bg-white dark:bg-slate-800/80 rounded-2xl p-8 border border-gray-100 dark:border-slate-700 shadow-sm hover:shadow-xl transition-all duration-300 group w-full">
                <div className="text-5xl font-extrabold text-[#122C93] dark:text-[#4b6bff] mb-6 group-hover:text-[#122C93]/20 dark:group-hover:text-[#122C93]/20 transition-colors duration-300 font-geist-mono">
                  {item.number}
                </div>
                <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-[#122C93] dark:group-hover:text-[#122C93] transition-colors duration-300">
                  {item.title}
                </h4>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm">
                  {item.description}
                </p>
              </div>
            </AnimatedContent>
          ))}
        </div>
      </div>
    </section>
  );
};
