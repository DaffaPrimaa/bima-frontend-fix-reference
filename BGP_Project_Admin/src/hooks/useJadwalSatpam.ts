import { useState, useCallback, useEffect } from "react";
import { scheduleService } from "../services/scheduleService";
import type { Jadwal } from "../types/schedule";
import { addToast, useDisclosure } from "@heroui/react";
import type { DeleteScope } from "../Components/common/DeleteConfirmationModal";

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

      // BE tidak punya filter "selain cancelled" (cuma satu status pasti
      // atau semua), dan tabel ini butuh lihat status apa pun (termasuk
      // completed buat minggu yang sudah lewat) — jadi ambil SEMUA halaman,
      // bukan cuma 50 baris pertama. Tanpa ini, jadwal aktif bisa "hilang"
      // dari tampilan kalau ketutup banyak baris cancelled lain dalam
      // rentang tanggal yang sama (kejadian nyata pas testing).
      let cursor: string | null = null;
      const all: Jadwal[] = [];
      do {
        const result = await scheduleService.getAll(50, cursor, from, to);
        if (Array.isArray(result.data)) all.push(...result.data);
        cursor = result.meta?.has_more ? result.meta.next_cursor : null;
      } while (cursor);

      setAllJadwal(all);
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

  // === Hapus Jadwal — 3 cakupan (single / sameDayForward / forward) ===
  const jadwalDeleteModal = useDisclosure();
  const [deleteJadwalTarget, setDeleteJadwalTarget] = useState<Jadwal | null>(null);
  const [isDeletingJadwal, setIsDeletingJadwal] = useState(false);

  const confirmDeleteJadwal = useCallback(
    (item: Jadwal) => {
      setDeleteJadwalTarget(item);
      jadwalDeleteModal.onOpen();
    },
    [jadwalDeleteModal],
  );

  /**
   * 3 cakupan hapus:
   * - single: cuma instance ini.
   * - sameDayForward: hari ini + hari yang sama (mis. tiap Kamis) ke depan
   *   saja — Assignment: buang hari itu dari BYDAY rrule-nya (hari lain di
   *   pola yang sama tidak disentuh); manual: cancel yang match kombinasi
   *   + hari yang sama, hari lain dibiarkan.
   * - forward: hari ini dan SEMUA hari ke depan tanpa pandang hari apa —
   *   Assignment: hapus assignment-nya sekalian (BE cascade-cancel semua
   *   instance depan yang belum di-checkin); manual: ditebak lewat
   *   kombinasi satpam+pos+shift yang sama dari tanggal ini dan seterusnya,
   *   gak ada seri resmi buat manual di BE.
   */
  const executeDeleteJadwal = useCallback(
    async (scope: DeleteScope) => {
      const target = deleteJadwalTarget;
      if (!target) return;
      setIsDeletingJadwal(true);
      try {
        const dayOfWeek = new Date(`${String(target.work_date).split("T")[0]}T00:00:00`).getDay();

        if (scope === "single") {
          await scheduleService.delete(target.uuid);
        } else if (scope === "sameDayForward") {
          if (target.assignment_uuid) {
            await scheduleService.removeDayFromAssignment(target.assignment_uuid, dayOfWeek);
          } else {
            await scheduleService.cancelManualSeriesFrom({
              satpam_uuid: target.satpam.uuid,
              pos_uuid: target.pos.uuid,
              pattern_uuid: target.pattern.uuid,
              from: String(target.work_date).split("T")[0],
              dayOfWeek,
            });
          }
        } else if (target.assignment_uuid) {
          await scheduleService.deleteAssignment(target.assignment_uuid);
        } else {
          await scheduleService.cancelManualSeriesFrom({
            satpam_uuid: target.satpam.uuid,
            pos_uuid: target.pos.uuid,
            pattern_uuid: target.pattern.uuid,
            from: String(target.work_date).split("T")[0],
          });
        }

        const scopeLabel = {
          single: "Jadwal hari itu berhasil dihapus",
          sameDayForward: "Jadwal hari itu dan hari yang sama selanjutnya berhasil dihapus",
          forward: "Jadwal hari itu dan semua hari selanjutnya berhasil dihapus",
        }[scope];
        addToast({ title: "Berhasil", description: scopeLabel, color: "success" });
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
    },
    [deleteJadwalTarget, fetchAllJadwal, jadwalDeleteModal],
  );

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
  };
};
