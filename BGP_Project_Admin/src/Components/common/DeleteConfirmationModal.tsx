import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@heroui/react";
import { FaExclamationTriangle } from "react-icons/fa";

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  isLoading?: boolean;
}

export const DeleteConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Konfirmasi Hapus",
  message = "Apakah anda yakin ingin menghapus data ini?",
}: DeleteConfirmationModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm" backdrop="opaque">
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex flex-col gap-1 items-center text-danger">
              <FaExclamationTriangle size={40} className="text-[#A70202]" />
              <span className="mt-2 text-[#A70202]">{title}</span>
            </ModalHeader>
            <ModalBody className="text-center font-medium">
              <p>{message}</p>
            </ModalBody>
            <ModalFooter className="justify-center">
              <Button variant="light" onPress={onClose}>
                Batal
              </Button>
              <Button
                color="danger"
                className="bg-[#A70202]"
                onPress={onConfirm}
              >
                Ya, Hapus
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
