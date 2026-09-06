import { useState } from "react";
import { patroliService } from "../services/patroliService";
import type { Patroli, UpdatePatroliPayload } from "../types/patroli";
import { addToast } from "@heroui/react";

interface UsePatroliFormProps {
  onSuccess: () => void;
  onClose: () => void;
}

export const usePatroliForm = ({ onSuccess, onClose }: UsePatroliFormProps) => {
  const [formData, setFormData] = useState<UpdatePatroliPayload>({
    status: "",
    description: "",
  });
  const [selectedUuid, setSelectedUuid] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const initForm = (item: Patroli) => {
    setSelectedUuid(item.uuid);
    setFormData({
      status: item.status,
      description: item.description,
    });
  };

  const handleSubmit = async () => {
    if (!selectedUuid) return;
    setIsSubmitting(true);
    try {
      await patroliService.update(selectedUuid, formData);
      addToast({
        title: "Berhasil",
        description: "Laporan patroli diperbarui.",
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
    formState: { formData, isSubmitting },
    setFormData,
    actions: { initForm, handleSubmit },
  };
};
