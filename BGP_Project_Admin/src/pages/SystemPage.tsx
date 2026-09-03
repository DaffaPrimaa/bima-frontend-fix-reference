import "@fontsource/geist-sans";
import { SystemNavbar } from "../Components/system/SystemNavbar";
import { SystemHero } from "../Components/system/SystemHero";
import { SystemFeatures } from "../Components/system/SystemFeatures";
import { SystemGPS } from "../Components/system/SystemGPS";
import { SystemShift } from "../Components/system/SystemShift";
import { SystemRecognition } from "../Components/system/SystemRecognition";
import { SystemIntegration } from "../Components/system/SystemIntegration";
import { SystemUrgent } from "../Components/system/SystemUrgent";
import { SystemStandard } from "../Components/system/SystemStandard";
import { SystemCTA } from "../Components/system/SystemCTA";
import { SystemFooter } from "../Components/system/SystemFooter";

import { ThemeProvider } from "../contexts/ThemeProvider";
import { LanguageProvider } from "../contexts/LanguageContext";

const SystemPage = () => {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <div className="font-geist bg-white dark:bg-[#0B1330] min-h-screen">
          <SystemNavbar />
          <SystemHero />
          <SystemFeatures />
          <SystemGPS />
          <SystemShift />
          <SystemRecognition />
          <SystemIntegration />
          <SystemUrgent />
          <SystemStandard />
          <SystemCTA />
          <SystemFooter />
        </div>
      </LanguageProvider>
    </ThemeProvider>
  );
};

export default SystemPage;
