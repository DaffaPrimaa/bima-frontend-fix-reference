import { useState } from "react";
import { attendanceService } from "../services/attendanceService";
import { addToast } from "@heroui/react";

export const useAttendanceExport = () => {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      const blob = await attendanceService.export();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `rekap_absensi_${new Date().toISOString().split("T")[0]}.xlsx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error: any) {
      addToast({
        title: "Gagal",
        description: "Terjadi kesalahan saat mengunduh file.",
        color: "danger",
        variant: "flat",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  return { isDownloading, handleDownload };
};
