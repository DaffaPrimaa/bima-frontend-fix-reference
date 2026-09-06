import { useState, useEffect, useCallback } from "react";
import { scheduleService } from "../services/scheduleService";
import type { Jadwal } from "../types/schedule";
import { addToast } from "@heroui/react";

export const useScheduleData = () => {
  const [dataJadwal, setDataJadwal] = useState<Jadwal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const rowsPerPage = 12;

  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteTargetUuid, setDeleteTargetUuid] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchJadwal = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await scheduleService.getAll(page);
      if (result.data && Array.isArray(result.data.data)) {
        setDataJadwal(result.data.data);
        if (result.data.pagination) {
          setTotalPages(result.data.pagination.total_pages);
        }
      } else {
        setDataJadwal([]);
      }
    } catch (error: any) {
      console.error(error);
      addToast({
        title: "Gagal memuat jadwal",
        color: "danger",
      });
    } finally {
      setIsLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchJadwal();
  }, [fetchJadwal]);

  const confirmDelete = (uuid: string) => {
    setDeleteTargetUuid(uuid);
    setDeleteModalOpen(true);
  };

  const executeDelete = async () => {
    if (!deleteTargetUuid) return;
    setIsDeleting(true);
    try {
      await scheduleService.delete(deleteTargetUuid);
      addToast({
        title: "Berhasil",
        description: "Data shift berhasil dihapus",
        color: "danger",
      });
      fetchJadwal();
      setDeleteModalOpen(false);
    } catch (error: any) {
      addToast({
        title: "Gagal",
        description: "Gagal menghapus data shift",
        color: "danger",
      });
    } finally {
      setIsDeleting(false);
      setDeleteTargetUuid(null);
    }
  };

  return {
    data: { dataJadwal, isLoading, page, totalPages, rowsPerPage },
    setPage,
    refreshData: fetchJadwal,
    deleteState: {
      isOpen: isDeleteModalOpen,
      setIsOpen: setDeleteModalOpen,
      isDeleting,
      confirm: confirmDelete,
      execute: executeDelete,
    },
  };
};
