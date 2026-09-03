import { useState } from "react";
import { patroliService } from "../services/patroliService";
import { addToast } from "@heroui/react";

export const usePatroliExport = () => {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      const blob = await patroliService.export();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "rekap_patroli.xlsx";
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
