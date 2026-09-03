import { useState, useEffect } from "react";
import { radiusService } from "../services/radiusService";
import { addToast } from "@heroui/react";
import type { FormErrors } from "../types/radius";

export const useRadiusSettings = () => {
  const [loadingData, setLoadingData] = useState(false);
  const [saving, setSaving] = useState(false);
  const [radiusUtama, setRadiusUtama] = useState("");
  const [radiusPatroli, setRadiusPatroli] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});

  const fetchSettings = async () => {
    setLoadingData(true);
    try {
      const settings = await radiusService.getSettings();
      setRadiusUtama(String(settings.radius_utama || ""));
      setRadiusPatroli(String(settings.radius_jaga || ""));
    } catch (error) {
      console.error("Error fetch radius:", error);
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const validateForm = () => {
    const newErrors: FormErrors = {};
    let isValid = true;

    const valUtama = parseInt(radiusUtama);
    if (!radiusUtama) {
      newErrors.radiusUtama = "Radius Utama wajib diisi.";
      isValid = false;
    } else if (isNaN(valUtama)) {
      newErrors.radiusUtama = "Harus berupa angka valid.";
      isValid = false;
    } else if (valUtama < 20) {
      newErrors.radiusUtama = "Minimal 20 meter.";
      isValid = false;
    } else if (valUtama > 1000) {
      newErrors.radiusUtama = "Maksimal 1000 meter.";
      isValid = false;
    }

    const valPatroli = parseInt(radiusPatroli);
    if (!radiusPatroli) {
      newErrors.radiusPatroli = "Radius Patroli wajib diisi.";
      isValid = false;
    } else if (isNaN(valPatroli)) {
      newErrors.radiusPatroli = "Harus berupa angka valid.";
      isValid = false;
    } else if (valPatroli < 20) {
      newErrors.radiusPatroli = "Minimal 20 meter.";
      isValid = false;
    } else if (valPatroli > 1000) {
      newErrors.radiusPatroli = "Maksimal 1000 meter.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleUpdate = async () => {
    if (!validateForm()) {
      addToast({
        title: "Validasi Gagal",
        description: "Mohon periksa kembali inputan anda.",
        variant: "flat",
        color: "warning",
      });
      return;
    }

    setSaving(true);
    try {
      await radiusService.updateSettings({
        radius_utama: parseInt(radiusUtama),
        radius_jaga: parseInt(radiusPatroli),
      });

      addToast({
        title: "Berhasil",
        description: "Radius berhasil diperbarui.",
        variant: "flat",
        timeout: 3000,
        color: "success",
      });
      setErrors({});
      fetchSettings();
    } catch (error: any) {
      addToast({
        title: "Gagal",
        description: error.message || "Gagal memperbarui radius.",
        variant: "flat",
        color: "danger",
      });
    } finally {
      setSaving(false);
    }
  };

  return {
    state: { loadingData, saving, radiusUtama, radiusPatroli, errors },
    setters: { setRadiusUtama, setRadiusPatroli, setErrors },
    actions: { handleUpdate },
  };
};
