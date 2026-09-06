import { useState, useEffect, useCallback } from "react";
import { attendanceService } from "../services/attendanceService";
import type { Absensi } from "../types/attendance";
import type { MitraOption } from "../types/satpam";
import { satpamService } from "../services/satpamService";
import { getRole } from "../Utils/helpers";
import { addToast } from "@heroui/react";

export const useAttendanceData = () => {
  const [dataAbsen, setDataAbsen] = useState<Absensi[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [filterClient, setFilterClient] = useState("all");

  const [cursorStack, setCursorStack] = useState<(string | null)[]>([null]);
  const [currentStackIndex, setCurrentStackIndex] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [nextCursor, setNextCursor] = useState<string | null>(null);

  const [userRole, setUserRole] = useState<string>("");
  const [mitraOptions, setMitraOptions] = useState<MitraOption[]>([]);

  useEffect(() => {
    const role = getRole();
    if (role) setUserRole(role);
  }, []);

  const fetchMitraOptions = useCallback(async () => {
    try {
      const res = await satpamService.getMitraOptions();
      if (res && Array.isArray(res.data)) {
        setMitraOptions(res.data);
      }
    } catch (error) {
      console.error("Fetch mitra error:", error);
    }
  }, []);

  useEffect(() => {
    fetchMitraOptions();
  }, [fetchMitraOptions]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);
    return () => clearTimeout(handler);
  }, [search]);

  const fetchAbsensi = useCallback(async () => {
    setIsLoading(true);
    try {
      const currentCursor = cursorStack[currentStackIndex];
      const apiStatus = status === "all" ? undefined : status;
      const apiClient = filterClient === "all" ? undefined : filterClient;
      
      const result = await attendanceService.getAll(
        limit, 
        currentCursor, 
        debouncedSearch || undefined, 
        apiStatus,
        undefined,
        apiClient
      );
      
      if (result && Array.isArray(result.data)) {
        setDataAbsen(result.data);
        if (result.meta) {
          setHasMore(result.meta.has_more);
          setNextCursor(result.meta.next_cursor);
        }
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
      setDataAbsen([]);
      setHasMore(false);
      setNextCursor(null);
    } finally {
      setIsLoading(false);
    }
  }, [limit, currentStackIndex, cursorStack, debouncedSearch, status, filterClient]);

  useEffect(() => {
    fetchAbsensi();
  }, [fetchAbsensi]);

  useEffect(() => {
    setCursorStack([null]);
    setCurrentStackIndex(0);
  }, [limit, debouncedSearch, status, filterClient]);

  const handleNextPage = () => {
    if (hasMore && !isLoading) {
      if (currentStackIndex === cursorStack.length - 1) {
        setCursorStack((prev) => [...prev, nextCursor]);
      }
      setCurrentStackIndex((prev) => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentStackIndex > 0 && !isLoading) {
      setCurrentStackIndex((prev) => prev - 1);
    }
  };

  return {
    data: { 
      dataAbsen, 
      isLoading, 
      limit,
      search,
      status,
      filterClient,
      hasMore,
      currentPage: currentStackIndex + 1,
      userRole,
      mitraOptions,
    },
    setLimit,
    setSearch,
    setStatus,
    setFilterClient,
    handleNextPage,
    handlePrevPage,
    refreshData: fetchAbsensi,
  };
};
