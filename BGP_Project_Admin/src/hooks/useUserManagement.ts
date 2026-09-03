import { useState, useEffect, useCallback } from "react";
import { addToast } from "@heroui/react";
import { userService } from "../services/userService";
import type { User } from "../types/user";

export const useUserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Pagination State (Cursor Based)
  const [cursorHistory, setCursorHistory] = useState<(string | null)[]>([null]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [nextCursor, setNextCursor] = useState<string | null>(null);

  const [deleteTargetUuid, setDeleteTargetUuid] = useState<string | null>(null);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);

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

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const currentCursor = cursorHistory[currentIndex];
      const responseData = await userService.getAll(limit, currentCursor, debouncedSearch);
      if (responseData.data && Array.isArray(responseData.data)) {
        setUsers(responseData.data);
        if (responseData.meta) {
          setHasMore(responseData.meta.has_more);
          setNextCursor(responseData.meta.next_cursor);
        }
      } else {
        setUsers([]);
        setHasMore(false);
        setNextCursor(null);
      }
    } catch (error) {
      console.error("Error fetch users:", error);
      setUsers([]);
      setHasMore(false);
      setNextCursor(null);
    } finally {
      setLoading(false);
    }
  }, [limit, currentIndex, cursorHistory, debouncedSearch]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const confirmDelete = (uuid: string) => {
    setDeleteTargetUuid(uuid);
    setDeleteModalOpen(true);
  };

  const executeDelete = async () => {
    if (!deleteTargetUuid) return;
    setDeleteModalOpen(false);

    try {
      await userService.delete(deleteTargetUuid);
      addToast({
        title: "Berhasil",
        description: "Data user berhasil dihapus.",
        variant: "flat",
        timeout: 3000,
        color: "danger",
      });
      fetchUsers();
    } catch (error: any) {
      addToast({
        title: "Gagal",
        description: error.message || "Gagal menghapus user.",
        variant: "flat",
        color: "danger",
      });
    } finally {
      setDeleteTargetUuid(null);
    }
  };

  const handleNextPage = () => {
    if (hasMore && nextCursor) {
      // Jika kita berada di akhir riwayat kursor, tambahkan kursor baru ke riwayat
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
    users,
    loading,
    limit,
    setLimit,
    search,
    setSearch,
    hasMore,
    currentPage: currentIndex + 1,
    handleNextPage,
    handlePrevPage,
    resetPagination,
    refreshData: fetchUsers,
    deleteState: {
      isOpen: isDeleteModalOpen,
      setIsOpen: setDeleteModalOpen,
      confirm: confirmDelete,
      execute: executeDelete,
    },
  };
};
