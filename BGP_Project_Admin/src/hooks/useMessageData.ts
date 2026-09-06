import { useState, useEffect, useCallback } from "react";
import { messageService } from "../services/messageService";
import type { MessageItem } from "../types/message";
import type { DateValue } from "@heroui/react";

export const useMessageData = () => {
  const [data, setData] = useState<MessageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  
  const [dateRange, setDateRange] = useState<{ start: DateValue | null, end: DateValue | null }>({
    start: null,
    end: null
  });

  const [cursorStack, setCursorStack] = useState<(string | null)[]>([null]);
  const [currentStackIndex, setCurrentStackIndex] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [nextCursor, setNextCursor] = useState<string | null>(null);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);
    return () => clearTimeout(handler);
  }, [search]);

  const fetchMessages = useCallback(async () => {
    setLoading(true);
    try {
      const currentCursor = cursorStack[currentStackIndex];
      const fromStr = dateRange.start ? `${dateRange.start.year}-${String(dateRange.start.month).padStart(2, '0')}-${String(dateRange.start.day).padStart(2, '0')}` : undefined;
      const toStr = dateRange.end ? `${dateRange.end.year}-${String(dateRange.end.month).padStart(2, '0')}-${String(dateRange.end.day).padStart(2, '0')}` : undefined;

      const response = await messageService.getAll(
        limit,
        currentCursor,
        debouncedSearch || undefined,
        undefined, // satpam
        undefined, // unread
        fromStr,
        toStr
      );

      if (response && Array.isArray(response.data)) {
        setData(response.data);
        if (response.meta) {
          setHasMore(response.meta.has_more);
          setNextCursor(response.meta.next_cursor);
        }
      } else {
        setData([]);
        setHasMore(false);
        setNextCursor(null);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
      setData([]);
      setHasMore(false);
      setNextCursor(null);
    } finally {
      setLoading(false);
    }
  }, [limit, currentStackIndex, cursorStack, debouncedSearch, dateRange]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  useEffect(() => {
    setCursorStack([null]);
    setCurrentStackIndex(0);
  }, [limit, debouncedSearch, dateRange]);

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

  return {
    data,
    loading,
    limit,
    setLimit,
    search,
    setSearch,
    dateRange,
    setDateRange,
    hasMore,
    currentPage: currentStackIndex + 1,
    handleNextPage,
    handlePrevPage,
    refreshData: fetchMessages
  };
};
