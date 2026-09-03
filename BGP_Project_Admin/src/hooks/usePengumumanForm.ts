import { useState } from "react";
import { useDisclosure, addToast } from "@heroui/react";
import { now, getLocalTimeZone, parseAbsoluteToLocal } from "@internationalized/date";
import { announcementService } from "../services/announcementService";
import type { Announcement } from "../types/announcement";


const ALL_KEY = "all";

export const usePengumumanForm = (
  refreshData: () => void,
  targetOptions: { key: string; label: string }[]
) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [datetime, setDatetime] = useState(now(getLocalTimeZone()));
  const [description, setDescription] = useState("");
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set());
  const [editUuid, setEditUuid] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

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
    setTitle("");
    setLocation("");
    setDescription("");
    setDatetime(now(getLocalTimeZone()));
    setSelectedKeys(new Set());
    onOpen();
  };

  const openEditModal = async (item: Announcement) => {
    setEditUuid(item.uuid);
    onOpen();
    try {
      const data = await announcementService.getById(item.uuid);
      if (data && data.data) {
        const ann = data.data;
        setTitle(ann.title || "");
        setDescription(ann.description || "");
        setLocation(ann.location || "");
        if (ann.datetime) {
          try {
            setDatetime(parseAbsoluteToLocal(ann.datetime));
          } catch (e) {
            setDatetime(now(getLocalTimeZone()));
          }
        }
        
        if (ann.recipient && ann.recipient.type === "all_client") {
          setSelectedKeys(new Set(targetOptions.map((t) => t.key)));
        } else if (ann.recipient && ann.recipient.clients) {
          const clientIds = ann.recipient.clients.map((c: any) => c.client_uuid);
          setSelectedKeys(new Set(clientIds));
        } else {
          setSelectedKeys(new Set());
        }
      }
    } catch (error: any) {
      addToast({
        title: "Gagal",
        description: error.message || "Gagal mengambil data pengumuman",
        color: "danger",
        variant: "flat",
      });
    }
  };

  const handleSubmit = async () => {
    let recipient: any = {};
    if (selectedKeys.has(ALL_KEY)) {
      recipient = { type: "all_client" };
    } else {
      const selectedUuids = Array.from(selectedKeys).filter((key) => key !== ALL_KEY);
      recipient = { type: "client", client_ids: selectedUuids };
    }

    const payload = {
      title,
      description,
      datetime: datetime.toDate().toISOString(),
      location,
    };

    setSubmitting(true);
    try {
      if (editUuid) {
        await announcementService.update(editUuid, payload);
        await announcementService.updateRecipients(editUuid, recipient);
        addToast({
          title: "Berhasil",
          description: "Pengumuman berhasil diupdate.",
          color: "success",
          variant: "flat",
        });
      } else {
        await announcementService.create({ ...payload, recipient });
        addToast({
          title: "Berhasil",
          description: "Pengumuman berhasil dibuat.",
          color: "success",
          variant: "flat",
        });
      }
      refreshData();
      
      // Reset form
      onClose();
      setTitle("");
      setLocation("");
      setDescription("");
      setDatetime(now(getLocalTimeZone()));
      setSelectedKeys(new Set());
      setEditUuid(null);
    } catch (error: any) {
      addToast({
        title: "Gagal",
        description: error.message || (editUuid ? "Gagal mengupdate pengumuman" : "Gagal membuat pengumuman"),
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
    title,
    setTitle,
    location,
    setLocation,
    datetime,
    setDatetime,
    description,
    setDescription,
    selectedKeys,
    editUuid,
    submitting,
    handleSelectionChange,
    clearAll,
    openCreateModal,
    openEditModal,
    handleSubmit,
    ALL_KEY
  };
};
