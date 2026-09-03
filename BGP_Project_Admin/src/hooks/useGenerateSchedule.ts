import { useState } from "react";
import { scheduleService } from "../services/scheduleService";
import type { GenerateFormData } from "../types/schedule";
import { addToast } from "@heroui/react";

export const useGenerateSchedule = (
  onSuccess: () => void,
  onClose: () => void,
) => {
  const [generateData, setGenerateData] = useState<GenerateFormData>({
    satpam_uuid: "",
    pos_uuid: "",
    shift_uuid: "",
    start_date: null,
    end_date: null,
    days_of_week: [],
  });

  const [errors, setErrors] = useState<any>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateGenerate = () => {
    const newErrors: any = {};
    if (!generateData.start_date)
      newErrors.start_date = "Tanggal Mulai wajib diisi";
    if (!generateData.end_date)
      newErrors.end_date = "Tanggal Berakhir wajib diisi";
    if (!generateData.satpam_uuid)
      newErrors.satpam_uuid = "Satpam wajib dipilih";
    if (!generateData.pos_uuid) newErrors.pos_uuid = "Pos wajib dipilih";
    if (!generateData.shift_uuid) newErrors.shift_uuid = "Shift wajib dipilih";
    if (generateData.days_of_week.length === 0)
      newErrors.days_of_week = "Pilih minimal satu hari kerja";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleGenerateSubmit = async () => {
    if (!validateGenerate()) {
      addToast({
        title: "Validasi Gagal",
        description: "Lengkapi form generate",
        color: "warning",
      });
      return;
    }

    setIsSubmitting(true);
    const body = {
      satpam_uuid: generateData.satpam_uuid,
      pos_uuid: generateData.pos_uuid,
      shift_uuid: generateData.shift_uuid,
      start_date: generateData.start_date!.toString(),
      end_date: generateData.end_date!.toString(),
      days_of_week: generateData.days_of_week.map(Number),
    };

    try {
      await scheduleService.generate(body);
      addToast({
        title: "Berhasil",
        description: "Jadwal rutin berhasil dibuat",
        color: "success",
      });
      onSuccess();
      onClose();
    } catch (error: any) {
      addToast({
        title: "Gagal generate",
        description: error.message,
        color: "danger",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    generateState: { generateData, errors, isSubmitting },
    setGenerateData,
    setErrors,
    handleGenerateSubmit,
  };
};
