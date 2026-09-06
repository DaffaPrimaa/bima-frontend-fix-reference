import { useState, useCallback, useEffect } from "react";
import { scheduleService } from "../services/scheduleService";
import type { Jadwal } from "../types/schedule";
import { addToast, useDisclosure } from "@heroui/react";

export const toIsoDate = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const useJadwalSatpam = (initialSwitch: "jadwal" | "shift" = "jadwal") => {
  const [activeSwitch, setActiveSwitch] = useState<"jadwal" | "shift">(initialSwitch);
  const [rangeMode, setRangeMode] = useState<"harian" | "mingguan">("harian");
  const [currentDate, setCurrentDate] = useState(new Date());

  const [allJadwal, setAllJadwal] = useState<Jadwal[]>([]);
  const [isJadwalLoading, setIsJadwalLoading] = useState(false);

  const fetchAllJadwal = useCallback(async () => {
    setIsJadwalLoading(true);
    try {
      let start = new Date(currentDate);
      let end = new Date(currentDate);

      if (rangeMode === "mingguan") {
        const dayOfWeek = start.getDay();
        start.setDate(start.getDate() - dayOfWeek);
        end = new Date(start);
        end.setDate(start.getDate() + 6);
      }

      const from = toIsoDate(start);
      const to = toIsoDate(end);
      const result = await scheduleService.getAll(50, null, from, to);
      setAllJadwal(Array.isArray(result.data) ? result.data : []);
    } catch (error: any) {
      addToast({
        title: "Gagal",
        description: error.message || "Gagal memuat jadwal jaga",
        color: "danger",
      });
    } finally {
      setIsJadwalLoading(false);
    }
  }, [currentDate, rangeMode]);

  useEffect(() => {
    if (activeSwitch === "jadwal") {
      fetchAllJadwal();
    }
  }, [fetchAllJadwal, activeSwitch]);

  const handlePrev = useCallback(() => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      newDate.setDate(prev.getDate() - (rangeMode === "harian" ? 1 : 7));
      return newDate;
    });
  }, [rangeMode]);

  const handleNext = useCallback(() => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      newDate.setDate(prev.getDate() + (rangeMode === "harian" ? 1 : 7));
      return newDate;
    });
  }, [rangeMode]);

  // Hapus Jadwal (satu instance)
  const jadwalDeleteModal = useDisclosure();
  const [deleteJadwalTarget, setDeleteJadwalTarget] = useState<Jadwal | null>(null);
  const [isDeletingJadwal, setIsDeletingJadwal] = useState(false);
  const [deleteMode, setDeleteMode] = useState<"single" | "future">("single");

  const confirmDeleteJadwal = useCallback((item: Jadwal) => {
    setDeleteJadwalTarget(item);
    setDeleteMode("single");
    jadwalDeleteModal.onOpen();
  }, [jadwalDeleteModal]);

  const executeDeleteJadwal = useCallback(async () => {
    if (!deleteJadwalTarget) return;
    setIsDeletingJadwal(true);
    try {
      await scheduleService.delete(deleteJadwalTarget, deleteMode);
      addToast({
        title: "Berhasil",
        description: "Jadwal berhasil dihapus",
        color: "success",
      });
      fetchAllJadwal();
      jadwalDeleteModal.onOpenChange();
    } catch (error: any) {
      addToast({
        title: "Gagal",
        description: error.message || "Gagal menghapus jadwal",
        color: "danger",
      });
    } finally {
      setIsDeletingJadwal(false);
      setDeleteJadwalTarget(null);
    }
  }, [deleteJadwalTarget, fetchAllJadwal, jadwalDeleteModal]);

  return {
    activeSwitch,
    setActiveSwitch,
    rangeMode,
    setRangeMode,
    currentDate,
    setCurrentDate,
    allJadwal,
    isJadwalLoading,
    fetchAllJadwal,
    handlePrev,
    handleNext,
    
    // Delete state
    jadwalDeleteModal,
    confirmDeleteJadwal,
    executeDeleteJadwal,
    isDeletingJadwal,
    deleteJadwalTarget,
    deleteMode,
    setDeleteMode,
  };
};
