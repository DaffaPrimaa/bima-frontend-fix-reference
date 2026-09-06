import { useState } from "react";
import { attendanceService } from "../services/attendanceService";
import { toDateTimeLocal } from "../Utils/helpers";
import type { FormData, UpdateAttendancePayload } from "../types/attendance";
import { addToast } from "@heroui/react";

interface UseAttendanceFormProps {
  onSuccess: () => void;
  onClose: () => void;
}

export const useAttendanceForm = ({
  onSuccess,
  onClose,
}: UseAttendanceFormProps) => {
  const [formData, setFormData] = useState<FormData>({
    checked_in_at: "",
    checked_out_at: "",
  });
  const [selectedUuid, setSelectedUuid] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadData = async (uuid: string) => {
    setSelectedUuid(uuid);
    try {
      const res = await attendanceService.getById(uuid);
      const item = res.data;
      if (item) {
        setFormData({
          checked_in_at: toDateTimeLocal(item.checked_in_at),
          checked_out_at: toDateTimeLocal(item.checked_out_at),
        });
      }
    } catch (error: any) {
      addToast({
        title: "Error",
        description: error.message,
        color: "danger",
        variant: "flat",
      });
    }
  };

  const handleSubmit = async () => {
    if (!selectedUuid) return;
    setIsSubmitting(true);

    const payload: UpdateAttendancePayload = {};
    if (formData.checked_in_at)
      payload.checked_in_at = new Date(formData.checked_in_at).toISOString();
    if (formData.checked_out_at)
      payload.checked_out_at = new Date(formData.checked_out_at).toISOString();

    try {
      await attendanceService.update(selectedUuid, payload);
      addToast({
        title: "Berhasil",
        description: "Data absensi diperbarui.",
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
      setIsSubmitting(false);
    }
  };

  return {
    formState: { formData, selectedUuid, isSubmitting },
    setFormData,
    actions: { loadData, handleSubmit },
  };
};
