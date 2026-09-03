import { useState, useEffect, useCallback } from "react";
import { posService } from "../services/posService";
import type { Pos } from "../types/pos";
import { addToast } from "@heroui/react";

export const usePosUtamaData = () => {
  const [dataPos, setDataPos] = useState<Pos[]>([]);
  const [loadingTable, setLoadingTable] = useState(false);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [cursorHistory, setCursorHistory] = useState<(string | null)[]>([null]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteTargetUuid, setDeleteTargetUuid] = useState<string | null>(null);

  const resetPagination = useCallback(() => {
    setCursorHistory([null]);
    setCurrentIndex(0);
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (debouncedSearch !== search) {
        setDebouncedSearch(search);
        resetPagination();
      }
    }, 500);
    return () => clearTimeout(handler);
  }, [search, debouncedSearch, resetPagination]);

  useEffect(() => {
    resetPagination();
  }, [limit, resetPagination]);

  const fetchData = useCallback(async () => {
    setLoadingTable(true);
    try {
      const currentCursor = cursorHistory[currentIndex];
      const response = await posService.getAll(limit, currentCursor, "utama", debouncedSearch);
      if (response && Array.isArray(response.data)) {
        setDataPos(response.data);
        if (response.meta) {
          setHasMore(response.meta.has_more);
          setNextCursor(response.meta.next_cursor);
        }
      } else {
        setDataPos([]);
        setHasMore(false);
        setNextCursor(null);
      }
    } catch (error) {
      console.error("Gagal memuat data pos:", error);
      setDataPos([]);
      setHasMore(false);
      setNextCursor(null);
    } finally {
      setLoadingTable(false);
    }
  }, [limit, currentIndex, cursorHistory, debouncedSearch]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const confirmDelete = (uuid: string) => {
    setDeleteTargetUuid(uuid);
    setDeleteModalOpen(true);
  };

  const executeDelete = async () => {
    if (!deleteTargetUuid) return;
    setDeleteModalOpen(false);

    try {
      await posService.delete(deleteTargetUuid);
      addToast({
        title: "Berhasil",
        description: "Data pos berhasil dihapus.",
        color: "danger",
        variant: "flat",
      });
      fetchData();
    } catch (error: any) {
      addToast({
        title: "Gagal",
        description: "Gagal menghapus data pos.",
        color: "danger",
        variant: "flat",
      });
    } finally {
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
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  return {
    dataPos,
    loadingTable,
    limit,
    setLimit,
    search,
    setSearch,
    hasMore,
    currentPage: currentIndex + 1,
    handleNextPage,
    handlePrevPage,
    refreshData: fetchData,
    deleteState: {
      isOpen: isDeleteModalOpen,
      setIsOpen: setDeleteModalOpen,
      confirm: confirmDelete,
      execute: executeDelete,
    },
  };
};
