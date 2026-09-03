import { useState, useEffect, useCallback } from "react";
import { scheduleService } from "../services/scheduleService";
import type { Jadwal } from "../types/schedule";
import { addToast } from "@heroui/react";

export const useScheduleData = () => {
  const [dataJadwal, setDataJadwal] = useState<Jadwal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const limit = 12;
  const [cursorHistory, setCursorHistory] = useState<(string | null)[]>([null]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [nextCursor, setNextCursor] = useState<string | null>(null);

  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteTargetUuid, setDeleteTargetUuid] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchJadwal = useCallback(async () => {
    setIsLoading(true);
    try {
      const cursor = cursorHistory[currentIndex];
      const result = await scheduleService.getAll(limit, cursor);
      if (result && Array.isArray(result.data)) {
        setDataJadwal(result.data);
        setHasMore(result.meta?.has_more ?? false);
        setNextCursor(result.meta?.next_cursor ?? null);
      } else {
        setDataJadwal([]);
        setHasMore(false);
        setNextCursor(null);
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
  }, [currentIndex, cursorHistory]);

  useEffect(() => {
    fetchJadwal();
  }, [fetchJadwal]);

  const resetPagination = (_page?: number) => {
    setCursorHistory([null]);
    setCurrentIndex(0);
  };

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

  const handleNextPage = () => {
    if (hasMore && nextCursor) {
      if (currentIndex === cursorHistory.length - 1) {
        setCursorHistory((prev) => [...prev, nextCursor]);
      }
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentIndex > 0) setCurrentIndex((prev) => prev - 1);
  };

  return {
    data: {
      dataJadwal,
      isLoading,
      currentPage: currentIndex + 1,
      hasMore,
      rowsPerPage: limit,
    },
    setPage: resetPagination,
    handleNextPage,
    handlePrevPage,
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
