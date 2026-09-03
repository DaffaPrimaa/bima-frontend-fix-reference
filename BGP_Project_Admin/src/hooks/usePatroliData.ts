import { useState, useEffect, useCallback } from "react";
import { patroliService } from "../services/patroliService";
import type { Patroli } from "../types/patroli";
import { addToast } from "@heroui/react";

export const usePatroliData = () => {
  const [dataPatroli, setDataPatroli] = useState<Patroli[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const limit = 12;
  const [cursorHistory, setCursorHistory] = useState<(string | null)[]>([null]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [nextCursor, setNextCursor] = useState<string | null>(null);

  const fetchPatroli = useCallback(async () => {
    setIsLoading(true);
    try {
      const cursor = cursorHistory[currentIndex];
      const result = await patroliService.getAll({ limit, cursor });
      if (result && Array.isArray(result.data)) {
        setDataPatroli(result.data);
        setHasMore(result.meta?.has_more ?? false);
        setNextCursor(result.meta?.next_cursor ?? null);
      } else {
        setDataPatroli([]);
        setHasMore(false);
        setNextCursor(null);
      }
    } catch (error: any) {
      console.error(error);
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
    fetchPatroli();
  }, [fetchPatroli]);

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
      dataPatroli,
      isLoading,
      currentPage: currentIndex + 1,
      hasMore,
      rowsPerPage: limit,
    },
    handleNextPage,
    handlePrevPage,
    refreshData: fetchPatroli,
  };
};
