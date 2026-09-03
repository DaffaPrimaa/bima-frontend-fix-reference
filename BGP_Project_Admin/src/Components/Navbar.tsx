import { useEffect, useState } from "react";
import { IoCalendarClearOutline, IoTimeOutline } from "react-icons/io5";

const Navbar = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [username, setUsername] = useState("Admin");

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formattedDate = currentTime.toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const formattedTime = currentTime.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZoneName: "short",
  });

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 11) return "Selamat Pagi";
    if (hour < 15) return "Selamat Siang";
    if (hour < 18) return "Selamat Sore";
    return "Selamat Malam";
  };

  useEffect(() => {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1];

    if (token) {
      try {
        const base64Url = token.split(".")[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const jsonPayload = decodeURIComponent(
          window
            .atob(base64)
            .split("")
            .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
            .join(""),
        );
        const payload = JSON.parse(jsonPayload);

        setUsername(payload.nama || "Admin");
      } catch (error) {
        console.error("Gagal decode token:", error);
      }
    }
  }, []);

  return (
    <div className="sticky top-0 z-30 w-full bg-[#F5F7FF]">
      {/* --- Navbar Card --- */}
      <div className="w-full h-[72px] px-4 py-7 flex items-center justify-between bg-white/80 backdrop-blur-xl rounded-xl shadow-[0_8px_30px_rgb(18,44,147,0.04)] border border-white/60">
        {/* --- KIRI: Greeting --- */}
        <div className="flex flex-col">
          <h1 className="text-xl font-bold text-[#122C93] tracking-tight">
            {getGreeting()},{" "}
            <span className="text-gray-500 font-medium capitalize">
              {username}
            </span>
          </h1>
          <p className="text-[11px] text-gray-400 font-medium mt-[2px]">
            Pantau aktivitas keamanan hari ini.
          </p>
        </div>

        {/* --- KANAN: Date & Time Display (Pill Shape) --- */}
        <div className="flex items-center gap-3">
          {/* Chip Tanggal */}
          <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-blue-50/50 rounded-2xl border border-blue-100/50">
            <IoCalendarClearOutline className="text-[#122C93] opacity-70" />
            <span className="text-sm font-semibold text-gray-600">
              {formattedDate}
            </span>
          </div>

          {/* Chip Waktu */}
          <div className="flex items-center gap-2 px-4 py-2 bg-[#122C93] text-white rounded-2xl shadow-lg shadow-blue-900/20">
            <IoTimeOutline className="text-lg" />
            <span className="text-sm font-bold tracking-wide">
              {formattedTime}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
