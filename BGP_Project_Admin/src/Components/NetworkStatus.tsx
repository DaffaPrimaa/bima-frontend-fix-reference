import { useState, useEffect } from "react";

const NetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  if (isOnline) return null;

  return (
    // Fixed inset-0 dan z-50 memastikan ini menutupi seluruh layar
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/95 backdrop-blur-sm text-white overflow-hidden">
      {/* Background Animation (Monokromatik/Gelap untuk Offline) */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[10%] left-[10%] w-96 h-96 bg-gray-600/30 rounded-full mix-blend-screen filter blur-3xl opacity-50 animate-blob"></div>
        <div className="absolute bottom-[20%] right-[10%] w-96 h-96 bg-slate-600/30 rounded-full mix-blend-screen filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>
      </div>

      <div className="relative z-10 text-center px-4">
        {/* Icon WiFi Silang (SVG) */}
        <div className="mx-auto w-24 h-24 mb-6 text-gray-400 animate-pulse">
          <svg
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 3l18 18M12 18.75a24.62 24.62 0 01-5.714-1.396M12 12.75a8.966 8.966 0 00-3.182.72m6.364 0a8.966 8.966 0 00-3.182-.72m9.545-3.344a15.926 15.926 0 00-4.793-1.428m-9.504 0a15.926 15.926 0 00-4.793 1.428"
            />
          </svg>
        </div>

        <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-gray-200 to-gray-500">
          Koneksi Terputus
        </h1>

        <p className="mt-4 text-lg text-gray-400 max-w-md mx-auto">
          Anda sedang offline. Mohon periksa koneksi internet Anda untuk
          melanjutkan.
        </p>

        {/* Tombol Coba Lagi (Refresh) */}
        <div className="mt-8">
          <button
            onClick={() => window.location.reload()}
            className="inline-block px-8 py-3 text-lg font-semibold rounded-full text-white bg-gradient-to-r from-gray-700 to-gray-600 hover:from-gray-600 hover:to-gray-500 transition-all duration-300 shadow-lg border border-gray-500/30"
          >
            Coba Hubungkan Ulang
          </button>
        </div>
      </div>

      {/* Kita tidak perlu tag <style> lagi jika sudah ada di ErrorBoundary atau index.css. 
          Namun jika belum global, biarkan script ini ada. */}
    </div>
  );
};

export default NetworkStatus;
