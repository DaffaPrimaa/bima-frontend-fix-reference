import { useState, useEffect } from "react";
import { useDisclosure, addToast } from "@heroui/react";
import { sharedDocumentService } from "../services/sharedDocumentService";
import { satpamService } from "../services/satpamService";

const ALL_KEY = "semua";

export const useSharedDocumentForm = (refreshData: () => void) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [judul, setJudul] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set());
  const [submitting, setSubmitting] = useState(false);
  const [targetOptions, setTargetOptions] = useState<{ key: string, label: string }[]>([{ key: ALL_KEY, label: "Semua Client" }]);
  const [loadingTargets, setLoadingTargets] = useState(false);
  const [editUuid, setEditUuid] = useState<string | null>(null);

  useEffect(() => {
    fetchTargetOptions();
  }, []);

  const fetchTargetOptions = async () => {
    setLoadingTargets(true);
    try {
      const res = await satpamService.getMitraOptions();
      if (res && res.data) {
        const options = res.data.map((m: any) => ({
          key: m.uuid,
          label: m.nama,
        }));
        setTargetOptions([{ key: ALL_KEY, label: "Semua Client" }, ...options]);
      }
    } catch (error) {
      // ignore or show toast
    } finally {
      setLoadingTargets(false);
    }
  };

  const clearAll = () => setSelectedKeys(new Set());

  const handleSelectionChange = (keys: any) => {
    const keysArray = Array.from(keys as Set<string>);

    if (keysArray.includes(ALL_KEY) && !selectedKeys.has(ALL_KEY)) {
      setSelectedKeys(new Set(targetOptions.map((t) => t.key)));
      return;
    }

    if (!keysArray.includes(ALL_KEY) && selectedKeys.has(ALL_KEY)) {
      setSelectedKeys(new Set());
      return;
    }

    const withoutAll = keysArray.filter((k) => k !== ALL_KEY);
    const allNonAllKeys = targetOptions
      .filter((t) => t.key !== ALL_KEY)
      .map((t) => t.key);
    const allSelected = allNonAllKeys.length > 0 && allNonAllKeys.every((k) => withoutAll.includes(k));

    if (allSelected) {
      setSelectedKeys(new Set(targetOptions.map((t) => t.key)));
    } else {
      setSelectedKeys(new Set(withoutAll));
    }
  };

  const openCreateModal = () => {
    setEditUuid(null);
    setJudul("");
    setDeskripsi("");
    setFile(null);
    setSelectedKeys(new Set());
    onOpen();
  };

  const openEditModal = async (uuid: string) => {
    setEditUuid(uuid);
    setJudul("");
    setDeskripsi("");
    setFile(null);
    setSelectedKeys(new Set());
    onOpen();

    try {
      const res = await sharedDocumentService.getById(uuid);
      const data = res.data;
      setJudul(data.nama || "");
      setDeskripsi(data.deskripsi || "");
      if (data.recipient?.type === "all_client") {
        setSelectedKeys(new Set([ALL_KEY]));
      } else if (data.recipient?.type === "client" && data.recipient.clients) {
        setSelectedKeys(new Set(data.recipient.clients.map((c: any) => c.client_uuid)));
      }
    } catch (error: any) {
      addToast({
        title: "Gagal",
        description: "Gagal memuat detail dokumen",
        color: "danger",
        variant: "flat",
      });
      onClose();
    }
  };

  const handleSubmit = async () => {
    if (!judul.trim()) {
      addToast({ title: "Gagal", description: "Judul tidak boleh kosong", color: "danger", variant: "flat" });
      return;
    }
    if (!editUuid && !file) {
      addToast({ title: "Gagal", description: "Dokumen belum diunggah", color: "danger", variant: "flat" });
      return;
    }
    if (selectedKeys.size === 0) {
      addToast({ title: "Gagal", description: "Pilih target penerima", color: "danger", variant: "flat" });
      return;
    }

    let recipient: any = {};
    if (selectedKeys.has(ALL_KEY)) {
      recipient = { type: "all_client" };
    } else {
      const selectedUuids = Array.from(selectedKeys).filter((key) => key !== ALL_KEY);
      recipient = { type: "client", client_ids: selectedUuids };
    }
    
    setSubmitting(true);
    try {
      if (editUuid) {
        let objectUuid = undefined;
        if (file) {
          const ext = file.name.split('.').pop()?.toLowerCase() || "pdf";
          const uploadData = await sharedDocumentService.getUploadUrl(ext);
          await sharedDocumentService.uploadToGcs(uploadData.upload_url, uploadData.fields, file);
          objectUuid = uploadData.object_uuid;
        }

        await sharedDocumentService.update(editUuid, { nama: judul, deskripsi, object_uuid: objectUuid });
        await sharedDocumentService.updateRecipients(editUuid, recipient);
        
        addToast({
          title: "Berhasil",
          description: "Dokumen berhasil diperbarui.",
          color: "success",
          variant: "flat",
        });
      } else {
        const ext = file!.name.split('.').pop()?.toLowerCase() || "pdf";
        const uploadData = await sharedDocumentService.getUploadUrl(ext);
        const { object_uuid, upload_url, fields } = uploadData;

        await sharedDocumentService.uploadToGcs(upload_url, fields, file!);

        const payload = {
          nama: judul,
          deskripsi: deskripsi,
          object_uuid: object_uuid,
          recipient: recipient
        };
        await sharedDocumentService.create(payload);

        addToast({
          title: "Berhasil",
          description: "Dokumen berhasil diunggah.",
          color: "success",
          variant: "flat",
        });
      }

      refreshData();
      onClose();
      setTimeout(() => {
        window.location.reload();
      }, 5000);
    } catch (error: any) {
      addToast({
        title: "Gagal",
        description: error.message || "Gagal memproses dokumen",
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
    judul,
    setJudul,
    deskripsi,
    setDeskripsi,
    file,
    setFile,
    selectedKeys,
    submitting,
    targetOptions,
    loadingTargets,
    handleSelectionChange,
    clearAll,
    openCreateModal,
    openEditModal,
    editUuid,
    handleSubmit,
    ALL_KEY
  };
};
