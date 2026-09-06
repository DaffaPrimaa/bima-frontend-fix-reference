import { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  RadioGroup,
  Radio,
} from "@heroui/react";
import { FaExclamationTriangle } from "react-icons/fa";

export type DeleteScope = "single" | "forward";

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** Konfirmasi hapus polos (tanpa pilihan cakupan) — dipakai halaman lain. */
  onConfirm?: () => void;
  /**
   * Kalau diisi, modal menampilkan pilihan cakupan (hari ini saja / dan
   * seterusnya) dan memanggil ini dengan pilihan pengguna, bukan onConfirm.
   * Cuma dipakai untuk hapus jadwal — halaman lain tidak perlu berubah.
   */
  onConfirmScoped?: (scope: DeleteScope) => void;
  scopeLabels?: { single: string; forward: string };
  title?: string;
  message?: string;
  isLoading?: boolean;
}

export const DeleteConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  onConfirmScoped,
  scopeLabels = {
    single: "Hapus hari ini saja",
    forward: "Hapus hari ini dan seterusnya",
  },
  title = "Konfirmasi Hapus",
  message = "Apakah anda yakin ingin menghapus data ini?",
  isLoading = false,
}: DeleteConfirmationModalProps) => {
  const [scope, setScope] = useState<DeleteScope>("single");

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
              {onConfirmScoped && (
                <RadioGroup
                  value={scope}
                  onValueChange={(v) => setScope(v as DeleteScope)}
                  className="text-left mt-2"
                >
                  <Radio value="single">{scopeLabels.single}</Radio>
                  <Radio value="forward">{scopeLabels.forward}</Radio>
                </RadioGroup>
              )}
            </ModalBody>
            <ModalFooter className="justify-center">
              <Button variant="light" onPress={onClose}>
                Batal
              </Button>
              <Button
                color="danger"
                className="bg-[#A70202]"
                isLoading={isLoading}
                onPress={() =>
                  onConfirmScoped ? onConfirmScoped(scope) : onConfirm?.()
                }
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
