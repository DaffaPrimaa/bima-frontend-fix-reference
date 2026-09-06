import { useState, useEffect, useCallback } from "react";
import { activityLogService } from "../services/activityLogService";
import type { ActivityLogItem, ActivityLogActionItem } from "../types/activityLog";
import { addToast } from "@heroui/react";

export const useActivityLogData = () => {
  const [data, setData] = useState<ActivityLogItem[]>([]);
  const [actionsList, setActionsList] = useState<ActivityLogActionItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Filters
  const [actionFilter, setActionFilter] = useState<string>("all");
  const [dateRange, setDateRange] = useState<{ start?: Date; end?: Date }>({});
  const [limit, setLimit] = useState(20);
  
  // Pagination
  const [historyCursor, setHistoryCursor] = useState<(string | null)[]>([null]);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [hasMore, setHasMore] = useState(false);

  // Format date to YYYY-MM-DD
  const formatDate = (date?: Date) => {
    if (!date) return undefined;
    return date.toISOString().split("T")[0];
  };

  const fetchActions = useCallback(async () => {
    try {
      const res = await activityLogService.getActions();
      setActionsList(res.data);
    } catch (err: any) {
      console.error("Gagal memuat list actions:", err);
    }
  }, []);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      const currentCursor = historyCursor[currentPageIndex];
      const res = await activityLogService.getAll({
        limit,
        cursor: currentCursor,
        action: actionFilter,
        from: formatDate(dateRange.start),
        to: formatDate(dateRange.end),
      });
      
      if (currentPageIndex === 0) {
        setData(res.data);
      } else {
        // filter out duplicates just in case
        setData(prev => {
          const newItems = res.data.filter(
            (newItem: ActivityLogItem) => !prev.some((oldItem) => oldItem.uuid === newItem.uuid)
          );
          return [...prev, ...newItems];
        });
      }
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
        description: err.message || "Gagal mengambil data activity log",
        variant: "flat",
        color: "danger",
        timeout: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  }, [limit, actionFilter, dateRange, currentPageIndex, historyCursor]);

  // Reset pagination on filter change
  useEffect(() => {
    setHistoryCursor([null]);
    setCurrentPageIndex(0);
  }, [actionFilter, dateRange, limit]);

  useEffect(() => {
    fetchActions();
  }, [fetchActions]);

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
    actionsList,
    isLoading,
    actionFilter,
    setActionFilter,
    dateRange,
    setDateRange,
    limit,
    setLimit,
    hasMore,
    currentPageIndex,
    handleNextPage,
    handlePrevPage,
    refreshData,
  };
};
