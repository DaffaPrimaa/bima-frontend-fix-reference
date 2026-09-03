import { MdSupportAgent } from "react-icons/md";
import { GiPoliceOfficerHead } from "react-icons/gi";
import { FaCheck } from "react-icons/fa6";
import { LiaBroomSolid } from "react-icons/lia";
import AnimatedContent from "../ui/AnimatedContent";

import { useLanguage } from "../../contexts/LanguageContext";

const getServices = (t: any) => [
  {
    title: t('layanan.sec_title'),
    icon: GiPoliceOfficerHead,
    items: [
      t('layanan.sec_1'),
      t('layanan.sec_2'),
      t('layanan.sec_3'),
      t('layanan.sec_4'),
      t('layanan.sec_5'),
      t('layanan.sec_6'),
      t('layanan.sec_7'),
    ],
  },
  {
    title: t('layanan.clean_title'),
    icon: LiaBroomSolid,
    items: [
      t('layanan.clean_1'),
      t('layanan.clean_2'),
      t('layanan.clean_3'),
      t('layanan.clean_4'),
      t('layanan.clean_5'),
      t('layanan.clean_6'),
    ],
  },
  {
    title: t('layanan.supp_title'),
    icon: MdSupportAgent,
    items: [
      t('layanan.supp_1'),
      t('layanan.supp_2'),
      t('layanan.supp_3'),
      t('layanan.supp_4'),
      t('layanan.supp_5'),
      t('layanan.supp_6'),
      t('layanan.supp_7'),
    ],
  },
];

export const LayananKami = () => {
  const { t } = useLanguage();
  const services = getServices(t);

  return (
    <section
      id="layanan"
      className="py-32 md:py-40 bg-white/50 dark:bg-slate-900/50 overflow-hidden"
    >
      <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center mb-16 text-center">
          <AnimatedContent
            distance={50}
            direction="vertical"
            duration={0.6}
            scale={0.8}
          >
            <h2 className="text-lg font-bold text-[#122C93] dark:text-[#4b6bff] mb-2 tracking-wide uppercase font-geist-mono">
              {t('layanan.section_title')}
            </h2>
          </AnimatedContent>
          <AnimatedContent
            distance={50}
            direction="vertical"
            delay={0.2}
            duration={0.6}
            scale={0.9}
          >
            <h3 className="text-4xl md:text-4xl font-extrabold leading-tight text-gray-900 dark:text-white max-w-4xl uppercase mb-4">
              {t('layanan.main_title')}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 max-w-lg mx-auto text-lg">
              {t('layanan.desc')}
            </p>
          </AnimatedContent>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {services.map((service, index) => (
            <AnimatedContent
              key={index}
              distance={40}
              direction="vertical"
              delay={index * 0.15}
              duration={0.6}
              scale={0.9}
              className="flex"
            >
              <div className="bg-white dark:bg-slate-800/80 rounded-2xl p-8 border border-gray-100 dark:border-slate-700 shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col w-full">
                <div className="flex items-center mb-8">
                  <div className="w-14 h-14 bg-[#122C93]/5 dark:bg-[#4b6bff]/10 text-[#122C93] dark:text-[#4b6bff] rounded-xl flex items-center justify-center mr-5 group-hover:bg-[#122C93] dark:group-hover:bg-[#122C93] group-hover:text-white dark:group-hover:text-slate-900 transition-colors duration-300">
                    <service.icon className="w-7 h-7" />
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-[#122C93] dark:group-hover:text-[#122C93] transition-colors duration-300">
                    {service.title}
                  </h4>
                </div>

                <div className="flex-1">
                  <ul className="space-y-4">
                    {service.items.map((item, i) => (
                      <li key={i} className="flex items-start">
                        <div className="flex items-center justify-center w-5 h-5 rounded-full border border-gray-200 dark:border-slate-600 shadow-sm mt-0.5 mr-3 flex-shrink-0 group-hover:border-[#122C93]/30 dark:group-hover:border-[#122C93]/30 group-hover:shadow transition-all duration-300 bg-white dark:bg-slate-800">
                          <FaCheck className="w-2.5 h-2.5 text-[#122C93]/40 dark:text-[#4b6bff]/40 group-hover:text-[#122C93] dark:group-hover:text-[#122C93] transition-colors duration-300" />
                        </div>
                        <span className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </AnimatedContent>
          ))}
        </div>
      </div>
    </section>
  );
};
