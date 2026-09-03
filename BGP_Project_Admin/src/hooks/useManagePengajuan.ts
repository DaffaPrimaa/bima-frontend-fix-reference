import { useState, useEffect, useCallback } from "react";
import { getRequests, acceptRequest, rejectRequest } from "../services/requestService";
import type { PengajuanRequest } from "../types/request";
import { addToast } from "@heroui/react";

export const useManagePengajuan = () => {
  const [data, setData] = useState<PengajuanRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [statusFilter, setStatusFilter] = useState("pending"); // 'semua', 'pending', 'accepted', 'rejected'

  const [cursorStack, setCursorStack] = useState<(string | null)[]>([null]);
  const [currentStackIndex, setCurrentStackIndex] = useState(0);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);

  const [limit, setLimit] = useState(10);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);
    return () => clearTimeout(handler);
  }, [search]);

  const fetchPengajuan = useCallback(
    async (cursorToFetch: string | null = null, reset: boolean = false) => {
      setLoading(true);
      try {
        const queryStatus = statusFilter === "semua" ? undefined : statusFilter;
        const querySearch = debouncedSearch || undefined;
        const queryType = filterType === "all" ? undefined : filterType;

        const response = await getRequests(cursorToFetch, limit, querySearch, queryType, queryStatus);

        setData(response.data);
        setHasMore(response.meta.has_more);
        setNextCursor(response.meta.next_cursor);

        if (reset) {
          setCursorStack([null]);
          setCurrentStackIndex(0);
        } else if (cursorToFetch && cursorToFetch === nextCursor) {
          setCursorStack((prev) => [...prev, response.meta.next_cursor]);
        }
      } catch (error) {
        addToast({
          title: "Error",
          description: "Gagal mengambil data pengajuan",
          color: "danger",
          variant: "flat",
        });
        console.error("Error fetching pengajuan:", error);
      } finally {
        setLoading(false);
      }
    },
    [limit, debouncedSearch, statusFilter, filterType]
  );

  // Reset pagination if search or filter changes
  useEffect(() => {
    setCursorStack([null]);
    setCurrentStackIndex(0);
  }, [debouncedSearch, statusFilter, filterType, limit]);

  useEffect(() => {
    fetchPengajuan(cursorStack[currentStackIndex]);
  }, [fetchPengajuan, currentStackIndex]);

  const handleNextPage = () => {
    if (hasMore && !loading) {
      if (currentStackIndex === cursorStack.length - 1) {
        setCursorStack((prev) => [...prev, nextCursor]);
      }
      setCurrentStackIndex((prev) => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentStackIndex > 0 && !loading) {
      setCurrentStackIndex((prev) => prev - 1);
    }
  };

  const handleSetujui = async (uuid: string) => {
    try {
      setLoading(true);
      await acceptRequest(uuid);
      addToast({
        title: "Berhasil",
        description: "Pengajuan berhasil disetujui",
        color: "success",
        variant: "flat",
      });
      // refresh current page
      await fetchPengajuan(cursorStack[currentStackIndex]);
    } catch (error) {
      addToast({
        title: "Gagal",
        description: "Gagal menyetujui pengajuan",
        color: "danger",
        variant: "flat",
      });
      setLoading(false);
    }
  };

  const handleTolak = async (uuid: string) => {
    try {
      setLoading(true);
      await rejectRequest(uuid);
      addToast({
        title: "Berhasil",
        description: "Pengajuan berhasil ditolak",
        color: "success",
        variant: "flat",
      });
      // refresh current page
      await fetchPengajuan(cursorStack[currentStackIndex]);
    } catch (error) {
      addToast({
        title: "Gagal",
        description: "Gagal menolak pengajuan",
        color: "danger",
        variant: "flat",
      });
      setLoading(false);
    }
  };

  return {
    data,
    loading,
    search,
    setSearch,
    filterType,
    setFilterType,
    statusFilter,
    setStatusFilter,
    currentPage: currentStackIndex + 1,
    hasMore,
    handleNextPage,
    handlePrevPage,
    handleSetujui,
    handleTolak,
    limit,
    setLimit,
  };
};
