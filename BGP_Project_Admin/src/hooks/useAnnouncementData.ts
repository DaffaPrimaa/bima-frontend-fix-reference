import { useState, useEffect, useCallback } from "react";
import { announcementService } from "../services/announcementService";
import { satpamService } from "../services/satpamService";
import type { Announcement } from "../types/announcement";
import type { MitraOption } from "../types/satpam";
import { getRole } from "../Utils/helpers";
import { addToast } from "@heroui/react";

export const useAnnouncementData = () => {
  const [dataAnnouncement, setDataAnnouncement] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [limit, setLimit] = useState(10);

  const [mitraOptions, setMitraOptions] = useState<MitraOption[]>([]);
  const [loadingMitra, setLoadingMitra] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Pagination State (Cursor Based)
  const [cursorHistory, setCursorHistory] = useState<(string | null)[]>([null]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [nextCursor, setNextCursor] = useState<string | null>(null);

  const [filterClient, setFilterClient] = useState("all");

  const [userRole, setUserRole] = useState<string>("");
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  useEffect(() => {
    const role = getRole();
    if (role) setUserRole(role);
  }, []);

  const fetchMitraOptions = useCallback(async () => {
    setLoadingMitra(true);
    try {
      const res = await satpamService.getMitraOptions();
      if (res && Array.isArray(res.data)) {
        setMitraOptions(res.data);
      }
    } catch (error) {
      console.error("Fetch mitra error:", error);
    } finally {
      setLoadingMitra(false);
    }
  }, []);

  useEffect(() => {
    fetchMitraOptions();
  }, [fetchMitraOptions]);

  const fetchAnnouncements = useCallback(async () => {
    setLoading(true);
    try {
      const currentCursor = cursorHistory[currentIndex];
      const recipientType = filterClient === "all" ? undefined : "client";
      const recipient = filterClient === "all" ? undefined : filterClient;
      const response = await announcementService.getAll(limit, currentCursor, searchQuery, recipientType, recipient);
      if (response && Array.isArray(response.data)) {
        setDataAnnouncement(response.data);
        if (response.meta) {
          setHasMore(response.meta.has_more);
          setNextCursor(response.meta.next_cursor);
        }
      } else {
        setDataAnnouncement([]);
        setHasMore(false);
        setNextCursor(null);
      }
    } catch (error: any) {
      console.error("Fetch announcement error:", error);
      setDataAnnouncement([]);
      setHasMore(false);
      setNextCursor(null);
    } finally {
      setLoading(false);
    }
  }, [limit, currentIndex, cursorHistory, searchQuery]);

  useEffect(() => {
    fetchAnnouncements();
  }, [fetchAnnouncements]);

  // Reset pagination when filter or search changes
  useEffect(() => {
    setCursorHistory([null]);
    setCurrentIndex(0);
  }, [searchQuery, filterClient, limit]);

  const confirmDelete = (uuid: string) => {
    setDeleteTargetId(uuid);
    setDeleteModalOpen(true);
  };

  const executeDelete = async () => {
    if (!deleteTargetId) return;
    setSubmitting(true);
    setDeleteModalOpen(false);
    try {
      await announcementService.delete(deleteTargetId);
      addToast({
        title: "Berhasil",
        description: "Pengumuman berhasil dihapus.",
        color: "success",
        variant: "flat",
      });
      fetchAnnouncements();
    } catch (error: any) {
      addToast({
        title: "Gagal",
        description: error.message || "Gagal menghapus pengumuman",
        color: "danger",
        variant: "flat",
      });
    } finally {
      setSubmitting(false);
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
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const resetPagination = () => {
    setCursorHistory([null]);
    setCurrentIndex(0);
  };

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    resetPagination();
  }, []);

  return {
    dataAnnouncement,
    loading,
    limit,
    setLimit,
    hasMore,
    currentPage: currentIndex + 1,
    handleNextPage,
    handlePrevPage,
    resetPagination,
    userRole,
    refreshData: fetchAnnouncements,
    mitraOptions,
    loadingMitra,
    submitting,
    searchQuery,
    handleSearch,
    deleteState: {
      isOpen: isDeleteModalOpen,
      setIsOpen: setDeleteModalOpen,
      confirm: confirmDelete,
      execute: executeDelete,
    },
    filterClient,
    setFilterClient,
  };
};
