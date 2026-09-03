import "@fontsource/geist-sans";
import { Navbar } from "../Components/landing/Navbar";
import { Hero } from "../Components/landing/Hero";
import { StandarLayanan } from "../Components/landing/StandarLayanan";
import { LayananKami } from "../Components/landing/LayananKami";
import { OperasiKami } from "../Components/landing/OperasiKami";
import { KompetensiSecurity } from "../Components/landing/KompetensiSecurity";
import { Alamat } from "../Components/landing/Alamat";
import { Legalitas } from "../Components/landing/Legalitas";
import { Mitra } from "../Components/landing/Mitra";
import { Kontak } from "../Components/landing/Kontak";
import { Footer } from "../Components/landing/Footer";

import { ThemeProvider } from "../contexts/ThemeProvider";
import { LanguageProvider } from "../contexts/LanguageContext";

const LandingPage = () => {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <div className="font-geist landing-grid-bg min-h-screen">
          <Navbar />
          <Hero />
          <StandarLayanan />
          <LayananKami />
          <OperasiKami />
          <KompetensiSecurity />
          <Alamat />
          <Legalitas />
          <Mitra />
          <Kontak />
          <Footer />
        </div>
      </LanguageProvider>
    </ThemeProvider>
  );
};

export default LandingPage;
