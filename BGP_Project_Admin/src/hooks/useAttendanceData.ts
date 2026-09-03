import { useState, useEffect, useCallback } from "react";
import { attendanceService } from "../services/attendanceService";
import type { Absensi } from "../types/attendance";
import { addToast } from "@heroui/react";

export const useAttendanceData = () => {
  const [dataAbsen, setDataAbsen] = useState<Absensi[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const limit = 12;
  const [cursorHistory, setCursorHistory] = useState<(string | null)[]>([null]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [nextCursor, setNextCursor] = useState<string | null>(null);

  const fetchAbsensi = useCallback(async () => {
    setIsLoading(true);
    try {
      const cursor = cursorHistory[currentIndex];
      const result = await attendanceService.getAll({ limit, cursor });
      if (result && Array.isArray(result.data)) {
        setDataAbsen(result.data);
        setHasMore(result.meta?.has_more ?? false);
        setNextCursor(result.meta?.next_cursor ?? null);
      } else {
        setDataAbsen([]);
        setHasMore(false);
        setNextCursor(null);
      }
    } catch (error: any) {
      addToast({
        title: "Gagal",
        description: error.message,
        color: "danger",
        variant: "flat",
      });
    } finally {
      setIsLoading(false);
    }
  }, [currentIndex, cursorHistory]);

  useEffect(() => {
    fetchAbsensi();
  }, [fetchAbsensi]);

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
      dataAbsen,
      isLoading,
      currentPage: currentIndex + 1,
      hasMore,
      rowsPerPage: limit,
    },
    handleNextPage,
    handlePrevPage,
    refreshData: fetchAbsensi,
  };
};
