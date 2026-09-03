import { useState } from "react";
import { addToast } from "@heroui/react";
import { userService } from "../services/userService";
import type { FormErrors } from "../types/user";

interface UseUserFormProps {
  onSuccess: () => void;
  onClose: () => void;
}

export const useUserForm = ({ onSuccess, onClose }: UseUserFormProps) => {
  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    if (!nama.trim()) {
      newErrors.nama = "Nama wajib diisi.";
      isValid = false;
    } else if (nama.length > 150) {
      newErrors.nama = "Nama maksimal 150 karakter.";
      isValid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      newErrors.email = "Email wajib diisi.";
      isValid = false;
    } else if (!emailRegex.test(email)) {
      newErrors.email = "Format email tidak valid.";
      isValid = false;
    } else if (email.length > 100) {
      newErrors.email = "Email maksimal 100 karakter.";
      isValid = false;
    }

    if (!password) {
      newErrors.password = "Password wajib diisi.";
      isValid = false;
    } else if (password.length < 8) {
      newErrors.password = "Password minimal 8 karakter.";
      isValid = false;
    } else if (password.length > 16) {
      newErrors.password = "Password maksimal 16 karakter.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const resetForm = () => {
    setNama("");
    setEmail("");
    setPassword("");
    setErrors({});
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      addToast({
        title: "Peringatan",
        description: "Mohon periksa inputan anda kembali.",
        variant: "flat",
        color: "warning",
      });
      return;
    }

    try {
      await userService.create({ nama, email, password });
      addToast({
        title: "Berhasil",
        description: "User berhasil ditambahkan.",
        variant: "flat",
        timeout: 3000,
        color: "success",
      });
      resetForm();
      onSuccess();
      onClose();
    } catch (error: any) {
      addToast({
        title: "Gagal",
        description: error.message || "Gagal menambahkan user.",
        variant: "flat",
        color: "danger",
      });
    }
  };

  return {
    formState: { nama, email, password },
    setters: { setNama, setEmail, setPassword },
    errors,
    resetForm,
    handleSubmit,
  };
};
