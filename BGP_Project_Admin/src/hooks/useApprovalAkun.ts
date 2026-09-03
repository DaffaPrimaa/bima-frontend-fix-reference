import { useState, useCallback } from "react";
import { useDisclosure, addToast } from "@heroui/react";
import { satpamService } from "../services/satpamService";
import type { Satpam, MitraOption } from "../types/satpam";

export const useApprovalAkun = (refreshData: () => void) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  
  const [selectedSatpam, setSelectedSatpam] = useState<Satpam | null>(null);
  const [mitraOptions, setMitraOptions] = useState<MitraOption[]>([]);
  const [selectedMitraId, setSelectedMitraId] = useState<string>("");
  const [loadingMitra, setLoadingMitra] = useState(false);
  const [hasMoreMitra, setHasMoreMitra] = useState<boolean>(false);
  const [nextCursorMitra, setNextCursorMitra] = useState<string | null>(null);
  const [loadingMoreMitra, setLoadingMoreMitra] = useState<boolean>(false);
  
  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState<string | null>(null);

  const handleOpenModal = useCallback(async (satpam: Satpam) => {
    setSelectedSatpam(satpam);
    setSelectedMitraId("");
    onOpen();
    
    setLoadingMitra(true);
    try {
      const [mitraRes, assignmentRes] = await Promise.all([
        satpamService.getMitraOptions().catch(() => null),
        satpamService.getAssignment(satpam.uuid).catch(() => null)
      ]);
      
      if (mitraRes && Array.isArray(mitraRes.data)) {
        setMitraOptions(mitraRes.data);
        if (mitraRes.meta) {
          setHasMoreMitra(mitraRes.meta.has_more);
          setNextCursorMitra(mitraRes.meta.next_cursor);
        }
      } else {
        setMitraOptions([]);
        setHasMoreMitra(false);
        setNextCursorMitra(null);
      }
      
      if (assignmentRes && assignmentRes.data && assignmentRes.data.assigned && assignmentRes.data.client) {
        setSelectedMitraId(assignmentRes.data.client.uuid);
      } else {
        setSelectedMitraId("unassign");
      }
    } catch (error) {
      console.error("Fetch mitra/assignment error:", error);
      setMitraOptions([]);
      setSelectedMitraId("unassign");
    } finally {
      setLoadingMitra(false);
    }
  }, [onOpen]);

  const loadMoreMitra = async () => {
    if (!hasMoreMitra || !nextCursorMitra || loadingMoreMitra) return;
    setLoadingMoreMitra(true);
    try {
      const res = await satpamService.getMitraOptions(nextCursorMitra);
      if (res && Array.isArray(res.data)) {
        setMitraOptions((prev) => [...prev, ...res.data]);
        if (res.meta) {
          setHasMoreMitra(res.meta.has_more);
          setNextCursorMitra(res.meta.next_cursor);
        }
      }
    } catch (error) {
      console.error("Load more mitra error:", error);
    } finally {
      setLoadingMoreMitra(false);
    }
  };

  const handleApprove = useCallback(async () => {
    if (!selectedSatpam) return;
    setIsApproving(true);
    try {
      if (selectedMitraId && selectedMitraId !== "unassign") {
        await satpamService.assignMitra(selectedSatpam.uuid, selectedMitraId);
      }
      await satpamService.approve(selectedSatpam.uuid);
      
      addToast({
        title: "Berhasil",
        description: "Akun satpam berhasil disetujui",
        color: "success",
        variant: "flat",
      });
      refreshData();
      onClose();
    } catch (error: any) {
      addToast({
        title: "Gagal",
        description: error.message || "Terjadi kesalahan saat menyetujui akun",
        color: "danger",
        variant: "flat",
      });
    } finally {
      setIsApproving(false);
    }
  }, [selectedSatpam, selectedMitraId, refreshData, onClose]);

  const handleReject = useCallback(async (uuid: string) => {
    setIsRejecting(uuid);
    try {
      await satpamService.reject(uuid);
      addToast({
        title: "Berhasil",
        description: "Akun satpam berhasil ditolak",
        color: "success",
        variant: "flat",
      });
      refreshData();
    } catch (error: any) {
      addToast({
        title: "Gagal",
        description: error.message || "Terjadi kesalahan saat menolak akun",
        color: "danger",
        variant: "flat",
      });
    } finally {
      setIsRejecting(null);
    }
  }, [refreshData]);

  return {
    modalState: {
      isOpen,
      onClose,
    },
    approvalState: {
      selectedSatpam,
      mitraOptions,
      selectedMitraId,
      setSelectedMitraId,
      loadingMitra,
      hasMoreMitra,
      loadingMoreMitra,
      loadMoreMitra,
      isApproving,
      isRejecting,
    },
    actions: {
      handleOpenModal,
      handleApprove,
      handleReject,
    }
  };
};
