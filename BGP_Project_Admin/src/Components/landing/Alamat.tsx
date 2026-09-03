import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
} from "react-simple-maps";
import { FiMapPin } from "react-icons/fi";
import indonesiaMap from "../../assets/indonesia.json";
import AnimatedContent from "../ui/AnimatedContent";

import { useLanguage } from "../../contexts/LanguageContext";

const geoUrl = indonesiaMap;

const getLocations = (t: any) => [
  {
    name: t('alamat.hq_name'),
    address: t('alamat.hq_addr'),
    coordinates: [110.4381, -7.0051] as [number, number],
    link: "https://maps.app.goo.gl/3V7z9M6gY2hRXZeT8",
  },
  {
    name: t('alamat.banten_name'),
    address: t('alamat.banten_addr'),
    coordinates: [106.5167, -6.1783] as [number, number],
    link: "https://maps.app.goo.gl/8vUuPqJ6x6Yk7mR46",
  },
  {
    name: t('alamat.jakarta_name'),
    address: t('alamat.jakarta_addr'),
    coordinates: [106.9634, -6.3116] as [number, number],
    link: "https://maps.app.goo.gl/8vUuPqJ6x6Yk7mR46",
  },
];

export const Alamat = () => {
  const { t } = useLanguage();
  const locations = getLocations(t);

  return (
    <section id="alamat" className="standar-grid-bg relative overflow-hidden min-h-[850px] flex flex-col justify-end pb-12 lg:pb-24 pt-32">

      {/* Background Map */}
      <div className="absolute inset-0 z-0 flex items-center justify-end pointer-events-none">
        <ComposableMap
          projection="geoMercator"
          projectionConfig={{
            scale: 1550,
            center: [116.5, -2],
          }}
          style={{ width: "100%", height: "100%" }}
        >
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  stroke="#082f49"
                  strokeWidth={0.5}
                  style={{
                    default: { outline: "none" },
                    hover: { outline: "none" },
                    pressed: { outline: "none" },
                  }}
                  className="fill-[#122C93] dark:fill-white"
                />
              ))
            }
          </Geographies>
          {locations.map((loc) => (
            <Marker key={loc.name} coordinates={loc.coordinates}>
              <g
                fill="#e11d48"
                stroke="#f43f5e"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                transform="translate(-12, -24)"
              >
                <circle cx="12" cy="10" r="3" fill="#ffffff" className="dark:fill-slate-900" />
                <path d="M12 21.7C17.3 17 20 13 20 10a8 8 0 1 0-16 0c0 3 2.7 7 8 11.7z" />
              </g>
            </Marker>
          ))}
        </ComposableMap>
      </div>

      {/* Title */}
      <div className="absolute top-8 right-4 lg:top-20 lg:right-16 z-20 hidden lg:block pointer-events-auto">
        <AnimatedContent distance={30} direction="horizontal" reverse={true}>
          <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 dark:text-white text-right drop-shadow-sm dark:drop-shadow-lg">
            {t('alamat.title')}
          </h2>
        </AnimatedContent>
      </div>

      <div className="w-full px-4 sm:px-6 lg:px-12 relative z-10 pointer-events-none">
        
        {/* Left Text */}
        <div className="w-full lg:w-[20%] flex flex-col gap-10 z-20 mt-8 lg:mt-0 pointer-events-auto lg:bg-transparent backdrop-blur-md lg:backdrop-blur-none p-8 lg:p-0 shadow-2xl lg:shadow-none">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white text-left lg:hidden mb-2">
            {t('alamat.title')}
          </h2>

          <div className="flex flex-col gap-8">
            {locations.map((loc, index) => (
              <AnimatedContent
                key={index}
                distance={20}
                direction="vertical"
                delay={index * 0.15}
              >
                <div className="group">
                  <h3 className="font-bold text-gray-900 dark:text-white text-xl mb-2 drop-shadow-none dark:drop-shadow-md transition-colors">
                    {loc.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed drop-shadow-none dark:drop-shadow-md font-medium mb-3">
                    {loc.address}
                  </p>
                  <a
                    href={loc.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-[#122C93] dark:text-[#4b6bff] hover:text-[#0f247a] dark:hover:text-[#3a58e0] transition-colors"
                  >
                    <FiMapPin className="w-4 h-4" />
                    {t('alamat.map_button')}
                  </a>
                </div>
              </AnimatedContent>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
