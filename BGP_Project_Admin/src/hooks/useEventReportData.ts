import { useState, useEffect, useCallback } from "react";
import { eventReportService } from "../services/eventReportService";
import { getRole } from "../Utils/helpers";
import type { EventReport } from "../types/eventReport";

export interface UseEventReportDataOptions {
  status?: string;
}

export const useEventReportData = (options?: UseEventReportDataOptions) => {
  const [dataReport, setDataReport] = useState<EventReport[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [userRole, setUserRole] = useState<string>("");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);
    return () => clearTimeout(handler);
  }, [search]);

  // Pagination states
  const [limit, setLimit] = useState(10);
  const [cursorHistory, setCursorHistory] = useState<(string | null)[]>([null]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [nextCursor, setNextCursor] = useState<string | null>(null);

  useEffect(() => {
    const role = getRole();
    if (role) setUserRole(role);
  }, []);

  const fetchReports = useCallback(async () => {
    setLoading(true);
    try {
      const currentCursor = cursorHistory[currentIndex];
      const response = await eventReportService.getAll(
        limit,
        currentCursor,
        debouncedSearch,
        options?.status
      );

      if (response && Array.isArray(response.data)) {
        setDataReport(response.data);
        if (response.meta) {
          setHasMore(response.meta.has_more);
          setNextCursor(response.meta.next_cursor);
        }
      } else {
        setDataReport([]);
        setHasMore(false);
        setNextCursor(null);
      }
    } catch (error: any) {
      console.error("Fetch event reports error:", error);
      setDataReport([]);
      setHasMore(false);
      setNextCursor(null);
    } finally {
      setLoading(false);
    }
  }, [limit, currentIndex, cursorHistory, debouncedSearch, options?.status]);

  // Refetch when dependencies change, but reset pagination if search or status changes
  useEffect(() => {
    setCursorHistory([null]);
    setCurrentIndex(0);
  }, [debouncedSearch, options?.status, limit]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  // Helper to trigger refetch (useful after handle/resolve action)
  const refreshData = () => {
    fetchReports();
  };

  const handleNextPage = () => {
    if (hasMore && nextCursor) {
      const newHistory = [...cursorHistory.slice(0, currentIndex + 1), nextCursor];
      setCursorHistory(newHistory);
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const resetPagination = () => {
    setCursorHistory([null]);
    setCurrentIndex(0);
  };

  return {
    dataReport,
    loading,
    limit,
    setLimit,
    hasMore,
    currentPage: currentIndex + 1,
    handleNextPage,
    handlePrevPage,
    userRole,
    refreshData,
    resetPagination,
    search,
    setSearch,
  };
};
