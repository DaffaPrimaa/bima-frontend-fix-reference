import { useState, useEffect, useCallback } from "react";
import { sharedDocumentService } from "../services/sharedDocumentService";

export interface SharedDocumentItem {
  uuid: string;
  nama: string;
  deskripsi: string;
  file: {
    uuid: string;
    status: string;
    view_url: string;
    download_url: string;
  };
  created_at: string;
  recipient_type: string;
  recipient_count: number;
}

export const useSharedDocumentData = () => {
  const [dataDocs, setDataDocs] = useState<SharedDocumentItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [filterClient, setFilterClient] = useState("all");

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);
    return () => clearTimeout(handler);
  }, [search]);

  // Pagination State (Cursor Based)
  const [cursorHistory, setCursorHistory] = useState<(string | null)[]>([null]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [nextCursor, setNextCursor] = useState<string | null>(null);

  const fetchDocs = useCallback(async () => {
    setLoading(true);
    try {
      const currentCursor = cursorHistory[currentIndex];
      const response = await sharedDocumentService.getAll(limit, currentCursor, debouncedSearch, filterClient);
      if (response && Array.isArray(response.data)) {
        setDataDocs(response.data);
        if (response.meta) {
          setHasMore(response.meta.has_more);
          setNextCursor(response.meta.next_cursor);
        }
      } else {
        setDataDocs([]);
        setHasMore(false);
        setNextCursor(null);
      }
    } catch (error: any) {
      console.error("Fetch docs error:", error);
      setDataDocs([]);
      setHasMore(false);
      setNextCursor(null);
    } finally {
      setLoading(false);
    }
  }, [limit, currentIndex, cursorHistory, debouncedSearch, filterClient]);

  // Reset pagination if search or filter changes
  useEffect(() => {
    setCursorHistory([null]);
    setCurrentIndex(0);
  }, [debouncedSearch, filterClient, limit]);

  useEffect(() => {
    fetchDocs();
  }, [fetchDocs]);

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

  return {
    dataDocs,
    loading,
    limit,
    setLimit,
    hasMore,
    currentPage: currentIndex + 1,
    handleNextPage,
    handlePrevPage,
    resetPagination,
    refreshData: fetchDocs,
    search,
    setSearch,
    filterClient,
    setFilterClient,
  };
};
