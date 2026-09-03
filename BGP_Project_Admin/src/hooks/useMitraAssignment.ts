import { useState } from "react";
import { satpamService } from "../services/satpamService";
import type { MitraOption, Satpam } from "../types/satpam";
import { addToast, useDisclosure } from "@heroui/react";

export const useMitraAssignment = (onSuccess: () => void) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedSatpam, setSelectedSatpam] = useState<Satpam | null>(null);
  const [mitraOptions, setMitraOptions] = useState<MitraOption[]>([]);
  const [formMitraId, setFormMitraId] = useState<string>("");
  const [loadingMitra, setLoadingMitra] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [hasMoreMitra, setHasMoreMitra] = useState<boolean>(false);
  const [nextCursorMitra, setNextCursorMitra] = useState<string | null>(null);
  const [loadingMoreMitra, setLoadingMoreMitra] = useState<boolean>(false);

  const openAssignmentModal = async (item: Satpam) => {
    setSelectedSatpam(item);
    setFormMitraId("");
    onOpen();

    setLoadingMitra(true);
    try {
      const [mitraRes, assignmentRes] = await Promise.all([
        satpamService.getMitraOptions().catch(() => null),
        satpamService.getAssignment(item.uuid).catch(() => null)
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
        setFormMitraId(assignmentRes.data.client.uuid);
      } else {
        setFormMitraId("unassign");
      }
    } catch (error) {
      console.error("Fetch data for assignment error:", error);
      setMitraOptions([]);
      setFormMitraId("unassign");
    } finally {
      setLoadingMitra(false);
    }
  };

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

  const handleAssignMitra = async () => {
    if (!selectedSatpam || !formMitraId) return;
    setSubmitting(true);
    try {
      await satpamService.assignMitra(selectedSatpam.uuid, formMitraId);
      addToast({
        title: "Berhasil",
        description:
          formMitraId === "unassign"
            ? "Penugasan dilepas."
            : "Satpam berhasil ditugaskan.",
        color: "success",
        variant: "flat",
      });
      onSuccess();
      onClose();
    } catch (error: any) {
      addToast({
        title: "Gagal",
        description: error.message,
        color: "danger",
        variant: "flat",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return {
    isOpen,
    onClose,
    openAssignmentModal,
    mitraData: { mitraOptions, formMitraId, loadingMitra, submitting, hasMoreMitra, loadingMoreMitra, loadMoreMitra },
    setFormMitraId,
    handleAssignMitra,
  };
};
