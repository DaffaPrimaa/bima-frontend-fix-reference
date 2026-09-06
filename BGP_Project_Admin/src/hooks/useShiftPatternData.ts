import { useState, useEffect, useCallback } from "react";
import { shiftPatternService } from "../services/shiftPatternService";
import type { ShiftPattern } from "../types/shiftPattern";
import { addToast } from "@heroui/react";

export const useShiftPatternData = () => {
  const [data, setData] = useState<ShiftPattern[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [limit, setLimit] = useState(10);
  
  // Pagination
  const [historyCursor, setHistoryCursor] = useState<(string | null)[]>([null]);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);
    return () => clearTimeout(handler);
  }, [search]);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      const currentCursor = historyCursor[currentPageIndex];
      const res = await shiftPatternService.getAll(limit, currentCursor, debouncedSearch);
      
      setData(res.data);
      setHasMore(res.meta.has_more);
      
      if (res.meta.has_more && res.meta.next_cursor) {
        setHistoryCursor((prev) => {
          const newHistory = [...prev];
          newHistory[currentPageIndex + 1] = res.meta.next_cursor;
          return newHistory;
        });
      }
    } catch (err: any) {
      addToast({
        title: "Gagal",
        description: err.message || "Gagal mengambil data shift",
        variant: "flat",
        color: "danger",
        timeout: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  }, [limit, debouncedSearch, currentPageIndex, historyCursor]);

  useEffect(() => {
    setHistoryCursor([null]);
    setCurrentPageIndex(0);
  }, [debouncedSearch, limit]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleNextPage = () => {
    if (hasMore) {
      setCurrentPageIndex((prev) => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPageIndex > 0) {
      setCurrentPageIndex((prev) => prev - 1);
    }
  };

  const refreshData = () => {
    setHistoryCursor([null]);
    setCurrentPageIndex(0);
    fetchData();
  };

  return {
    data,
    isLoading,
    search,
    setSearch,
    limit,
    setLimit,
    hasMore,
    currentPageIndex,
    handleNextPage,
    handlePrevPage,
    refreshData,
  };
};
