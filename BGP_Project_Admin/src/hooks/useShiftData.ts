import { useState, useEffect, useCallback } from "react";
import { shiftService } from "../services/shiftService";
import type { Shift } from "../types/shift";
import { addToast } from "@heroui/react";

export const useShiftData = () => {
  const [listWaktu, setListWaktu] = useState<Shift[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const rowsPerPage = 12;

  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchWaktu = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await shiftService.getAll(page);
      if (result.data && Array.isArray(result.data.data)) {
        setListWaktu(result.data.data);
        if (result.data.pagination) {
          setTotalPages(result.data.pagination.total_pages);
        }
      } else {
        setListWaktu([]);
      }
    } catch (error: any) {
      console.error(error);
      setListWaktu([]);
      addToast({
        title: "Error",
        description: error.message,
        color: "danger",
        variant: "flat",
      });
    } finally {
      setIsLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchWaktu();
  }, [fetchWaktu]);

  const confirmDelete = (uuid: string) => {
    setDeleteTargetId(uuid);
    setDeleteModalOpen(true);
  };

  const executeDelete = async () => {
    if (!deleteTargetId) return;
    setIsDeleting(true);
    try {
      await shiftService.delete(deleteTargetId);
      addToast({
        title: "Berhasil",
        description: "Data waktu berhasil dihapus",
        color: "danger",
        variant: "flat",
      });
      fetchWaktu();
      setDeleteModalOpen(false);
    } catch (error: any) {
      addToast({
        title: "Gagal",
        description: error.message,
        color: "danger",
        variant: "flat",
      });
    } finally {
      setIsDeleting(false);
      setDeleteTargetId(null);
    }
  };

  return {
    data: { listWaktu, isLoading, page, totalPages, rowsPerPage },
    setPage,
    refreshData: fetchWaktu,
    deleteState: {
      isOpen: isDeleteModalOpen,
      setIsOpen: setDeleteModalOpen,
      isDeleting,
      confirm: confirmDelete,
      execute: executeDelete,
    },
  };
};
