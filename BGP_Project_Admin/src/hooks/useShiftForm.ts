import { useState } from "react";
import { shiftService } from "../services/shiftService";
import { getDeviceTimezone } from "../Utils/helpers";
import type { FormErrors } from "../types/shift";
import { addToast } from "@heroui/react";

interface UseShiftFormProps {
  onSuccess: () => void;
  onClose: () => void;
}

export const useShiftForm = ({ onSuccess, onClose }: UseShiftFormProps) => {
  const [formData, setFormData] = useState({
    nama: "",
    mulai: "",
    selesai: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = () => {
    setFormData({ nama: "", mulai: "", selesai: "" });
    setErrors({});
    setSelectedId(null);
  };

  const loadData = async (uuid: string) => {
    setSelectedId(uuid);
    setErrors({});
    try {
      const res = await shiftService.getById(uuid);
      const item = res.data;
      setFormData({
        nama: item.nama,
        mulai: item.mulai ? item.mulai.slice(0, 5) : "",
        selesai: item.selesai ? item.selesai.slice(0, 5) : "",
      });
    } catch (error: any) {
      addToast({
        title: "Error",
        description: error.message,
        color: "danger",
        variant: "flat",
      });
    }
  };

  const validateForm = () => {
    const newErrors: FormErrors = {};
    let isValid = true;

    if (!formData.nama.trim()) {
      newErrors.nama = "Nama Shift wajib diisi.";
      isValid = false;
    } else if (formData.nama.length > 20) {
      newErrors.nama = "Nama Shift maksimal 20 karakter.";
      isValid = false;
    }
    if (!formData.mulai) {
      newErrors.mulai = "Jam Mulai wajib diisi.";
      isValid = false;
    }
    if (!formData.selesai) {
      newErrors.selesai = "Jam Selesai wajib diisi.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      addToast({
        title: "Validasi Gagal",
        description: "Mohon periksa kembali inputan Anda.",
        color: "warning",
        variant: "flat",
      });
      return;
    }

    setIsSubmitting(true);
    const formatTime = (time: string) =>
      time.length === 5 ? `${time}:00` : time;

    try {
      const payload = {
        nama: formData.nama,
        mulai: formatTime(formData.mulai),
        selesai: formatTime(formData.selesai),
        timezone: !selectedId ? getDeviceTimezone() : undefined,
      };

      if (selectedId) {
        await shiftService.update(selectedId, payload);
      } else {
        await shiftService.create(payload);
      }

      addToast({
        title: "Berhasil",
        description: `Data berhasil ${selectedId ? "diubah" : "ditambahkan"}`,
        color: "success",
        variant: "flat",
      });
      onSuccess();
      onClose();
      resetForm();
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
    formState: { formData, errors, selectedId, isSubmitting },
    setFormData,
    actions: { resetForm, loadData, handleSubmit },
  };
};
