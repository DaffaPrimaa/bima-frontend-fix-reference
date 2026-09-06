import { useState, useEffect, useCallback } from "react";
import { shiftService } from "../services/shiftService";
import type { Shift } from "../types/shift";
import { addToast } from "@heroui/react";

export const useShiftData = () => {
  const [listWaktu, setListWaktu] = useState<Shift[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [limit, setLimitState] = useState(12);
  const [search, setSearchState] = useState("");
  const [cursorHistory, setCursorHistory] = useState<(string | null)[]>([null]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [nextCursor, setNextCursor] = useState<string | null>(null);

  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Ganti limit/search berarti mulai dari halaman pertama lagi — cursor
  // lama gak valid buat kombinasi baru.
  const setLimit = (value: number) => {
    setLimitState(value);
    setCursorHistory([null]);
    setCurrentIndex(0);
  };
  const setSearch = (value: string) => {
    setSearchState(value);
    setCursorHistory([null]);
    setCurrentIndex(0);
  };

  const fetchWaktu = useCallback(async () => {
    setIsLoading(true);
    try {
      const cursor = cursorHistory[currentIndex];
      const result = await shiftService.getAll(limit, cursor, search);
      if (result && Array.isArray(result.data)) {
        setListWaktu(result.data);
        setHasMore(result.meta?.has_more ?? false);
        setNextCursor(result.meta?.next_cursor ?? null);
      } else {
        setListWaktu([]);
        setHasMore(false);
        setNextCursor(null);
      }
    } catch (error: any) {
      console.error(error);
      setListWaktu([]);
      addToast({
        title: "Error",
        description: error.message,
        color: "danger",
        variant: "flat",
      });
    } finally {
      setIsLoading(false);
    }
  }, [currentIndex, cursorHistory, limit, search]);

  useEffect(() => {
    fetchWaktu();
  }, [fetchWaktu]);

  const resetPagination = (_page?: number) => {
    setCursorHistory([null]);
    setCurrentIndex(0);
  };

  const confirmDelete = (uuid: string) => {
    setDeleteTargetId(uuid);
    setDeleteModalOpen(true);
  };

  const executeDelete = async () => {
    if (!deleteTargetId) return;
    setIsDeleting(true);
    try {
      await shiftService.delete(deleteTargetId);
      addToast({
        title: "Berhasil",
        description: "Data waktu berhasil dihapus",
        color: "danger",
        variant: "flat",
      });
      fetchWaktu();
      setDeleteModalOpen(false);
    } catch (error: any) {
      addToast({
        title: "Gagal",
        description: error.message,
        color: "danger",
        variant: "flat",
      });
    } finally {
      setIsDeleting(false);
      setDeleteTargetId(null);
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
      listWaktu,
      isLoading,
      currentPage: currentIndex + 1,
      hasMore,
      rowsPerPage: limit,
    },
    search,
    setSearch,
    limit,
    setLimit,
    setPage: resetPagination,
    handleNextPage,
    handlePrevPage,
    refreshData: fetchWaktu,
    deleteState: {
      isOpen: isDeleteModalOpen,
      setIsOpen: setDeleteModalOpen,
      isDeleting,
      confirm: confirmDelete,
      execute: executeDelete,
    },
  };
};
