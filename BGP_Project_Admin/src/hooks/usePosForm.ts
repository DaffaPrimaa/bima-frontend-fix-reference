import { useState } from "react";
import { LatLng } from "leaflet";
import { posService } from "../services/posService";
import type { Pos } from "../types/pos";
import { addToast } from "@heroui/react";

interface UsePosFormProps {
  onSuccess: () => void;
  onClose: () => void;
  type: string;
}

export const usePosForm = ({ onSuccess, onClose, type }: UsePosFormProps) => {
  const [formData, setFormData] = useState<Pos>({
    uuid: null,
    nama: "",
    kode: "",
    lat: 0,
    lng: 0,
  });
  const [selectedPosition, setSelectedPosition] = useState<LatLng | null>(null);
  const [loading, setLoading] = useState(false);

  const resetForm = () => {
    setFormData({
      uuid: null,
      nama: "",
      kode: "",
      lat: 0,
      lng: 0,
    });
    setSelectedPosition(null);
  };

  const updateCoordinates = (latlng: LatLng) => {
    setSelectedPosition(latlng);
    setFormData((prev) => ({
      ...prev,
      lat: latlng.lat,
      lng: latlng.lng,
    }));
  };

  const handleManualCoordChange = (field: "lat" | "lng", value: string) => {
    const numVal = parseFloat(value) || 0;
    setFormData((prev) => ({ ...prev, [field]: numVal }));
    const latVal = field === "lat" ? numVal : formData.lat;
    const lngVal = field === "lng" ? numVal : formData.lng;

    if (!isNaN(latVal) && !isNaN(lngVal)) {
      setSelectedPosition(new LatLng(latVal, lngVal));
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          updateCoordinates(new LatLng(latitude, longitude));
        },
        (error) => {
          console.error("Error getting location:", error);
          addToast({
            title: "Lokasi Gagal",
            description: "Pastikan GPS aktif dan izin diberikan.",
            color: "warning",
            variant: "flat",
          });
        },
      );
    }
  };

  const handleOpenAdd = () => {
    resetForm();
    getCurrentLocation();
  };

  const handleEdit = async (uuid: string) => {
    try {
      const res = await posService.getById(uuid);
      const item = res.data;
      if (item) {
        setFormData({
          uuid: item.uuid,
          nama: item.nama || "",
          kode: item.kode || "",
          lat: item.lat || 0,
          lng: item.lng || 0,
        });
        const lat = typeof item.lat === 'number' ? item.lat : parseFloat(item.lat);
        const lng = typeof item.lng === 'number' ? item.lng : parseFloat(item.lng);
        if (!isNaN(lat) && !isNaN(lng)) {
          setSelectedPosition(new LatLng(lat, lng));
        } else {
          setSelectedPosition(null);
        }
      }
    } catch (error) {
      addToast({
        title: "Error",
        description: "Gagal memuat detail pos.",
        color: "danger",
        variant: "flat",
      });
    }
  };

  const validateForm = () => {
    if (
      !formData.nama ||
      formData.nama.length < 4 ||
      formData.nama.length > 100
    ) {
      addToast({
        title: "Validasi Gagal",
        description: "Nama harus 4-100 karakter.",
        color: "danger",
        variant: "flat",
      });
      return false;
    }
    if (
      !formData.kode ||
      formData.kode.length < 1 ||
      formData.kode.length > 20
    ) {
      addToast({
        title: "Validasi Gagal",
        description: "Kode harus 1-20 karakter.",
        color: "danger",
        variant: "flat",
      });
      return false;
    }
    if (!selectedPosition) {
      addToast({
        title: "Validasi Gagal",
        description: "Lokasi (Lat/Lng) wajib diisi.",
        color: "danger",
        variant: "flat",
      });
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const payload = {
        nama: formData.nama,
        kode: formData.kode,
        type: type,
        lat: selectedPosition!.lat,
        lng: selectedPosition!.lng,
      };

      if (formData.uuid) {
        await posService.update(formData.uuid, payload);
      } else {
        await posService.create(payload);
      }

      onSuccess();
      onClose();
      addToast({
        title: "Berhasil",
        description: "Data tersimpan",
        color: "success",
        variant: "flat",
      });
    } catch (error) {
      addToast({
        title: "Gagal",
        description: "Terjadi kesalahan saat menyimpan data.",
        color: "danger",
        variant: "flat",
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    formState: { formData, selectedPosition, loading },
    setters: { setFormData, updateCoordinates, handleManualCoordChange },
    actions: { handleOpenAdd, handleEdit, handleSave, resetForm },
  };
};
