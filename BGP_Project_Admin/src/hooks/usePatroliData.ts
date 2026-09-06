import { useState, useEffect, useCallback } from "react";
import { patroliService } from "../services/patroliService";
import { satpamService } from "../services/satpamService";
import type { Patroli } from "../types/patroli";
import type { MitraOption } from "../types/satpam";
import { getRole } from "../Utils/helpers";
import { addToast } from "@heroui/react";

export const usePatroliData = () => {
  const [dataPatroli, setDataPatroli] = useState<Patroli[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [limit, setLimit] = useState(20);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [filterClient, setFilterClient] = useState("all");
  const [status, setStatus] = useState("all");

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

  const fetchPatroli = useCallback(async () => {
    setIsLoading(true);
    try {
      const currentCursor = cursorStack[currentStackIndex];
      const result = await patroliService.getAll(
        limit,
        currentCursor,
        debouncedSearch || undefined,
        filterClient,
        status
      );
      
      if (result && Array.isArray(result.data)) {
        setDataPatroli(result.data);
        if (result.meta) {
          setHasMore(result.meta.has_more);
          setNextCursor(result.meta.next_cursor);
        }
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
      setDataPatroli([]);
      setHasMore(false);
      setNextCursor(null);
    } finally {
      setIsLoading(false);
    }
  }, [limit, currentStackIndex, cursorStack, debouncedSearch, filterClient, status]);

  useEffect(() => {
    fetchPatroli();
  }, [fetchPatroli]);

  useEffect(() => {
    setCursorStack([null]);
    setCurrentStackIndex(0);
  }, [limit, debouncedSearch, filterClient, status]);

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
      dataPatroli, 
      isLoading, 
      limit, 
      search, 
      filterClient, 
      status,
      hasMore, 
      currentPage: currentStackIndex + 1,
      userRole,
      mitraOptions,
    },
    setLimit,
    setSearch,
    setFilterClient,
    setStatus,
    handleNextPage,
    handlePrevPage,
    refreshData: fetchPatroli,
  };
};
