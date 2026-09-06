import { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Textarea,
  addToast,
} from "@heroui/react";
import { messageService } from "../../services/messageService";

interface MessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  satpamUuid: string | null;
}

export const MessageModal = ({ isOpen, onClose, satpamUuid }: MessageModalProps) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSend = async () => {
    if (!satpamUuid) return;
    if (!title.trim() || !content.trim()) {
      addToast({
        title: "Peringatan",
        description: "Judul dan Isi pesan harus diisi.",
        color: "warning",
        variant: "flat",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await messageService.create({ satpam_uuid: satpamUuid, title, content });
      addToast({
        title: "Berhasil",
        description: "Pesan berhasil dikirim ke satpam.",
        color: "success",
        variant: "flat",
      });
      setTitle("");
      setContent("");
      onClose();
    } catch (error: any) {
      addToast({
        title: "Gagal Mengirim",
        description: error.message || "Terjadi kesalahan saat mengirim pesan.",
        color: "danger",
        variant: "flat",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setTitle("");
    setContent("");
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="lg" backdrop="blur">
      <ModalContent>
        <ModalHeader className="text-[#122C93] font-semibold">
          Kirim Pesan Satu Arah ke Satpam
        </ModalHeader>
        <ModalBody className="gap-4">
          <Input
            label="Judul Pesan"
            value={title}
            onValueChange={setTitle}
            labelPlacement="outside-top"
            placeholder="mis. Pengecekan Area"
            isRequired
            variant="bordered"
            classNames={{ label: "text-xs font-semibold text-[#122C93]" }}
          />
          <Textarea
            label="Isi Pesan"
            value={content}
            onValueChange={setContent}
            labelPlacement="outside-top"
            placeholder="Tuliskan pesan Anda..."
            isRequired
            variant="bordered"
            minRows={4}
            classNames={{ label: "text-xs font-semibold text-[#122C93]" }}
          />
        </ModalBody>
        <ModalFooter>
          <Button variant="bordered" onPress={handleClose}>
            Batal
          </Button>
          <Button
            className="bg-[#122C93] text-white font-medium"
            onPress={handleSend}
            isLoading={isSubmitting}
          >
            Kirim Pesan
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
