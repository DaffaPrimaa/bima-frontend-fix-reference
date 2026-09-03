import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
} from "@heroui/react";
import { getDeviceTimezone } from "../../Utils/helpers";
import type { useShiftForm } from "../../hooks/useShiftForm";

interface ShiftFormModalProps {
  isOpen: boolean;
  onOpenChange: () => void;
  formHook: ReturnType<typeof useShiftForm>;
}

export const ShiftFormModal = ({
  isOpen,
  onOpenChange,
  formHook,
}: ShiftFormModalProps) => {
  const { formState, setFormData, actions } = formHook;
  const { formData, errors, selectedId, isSubmitting } = formState;

  const handleClose = () => {
    actions.resetForm();
    onOpenChange();
  };

  return (
    <Modal backdrop="opaque" isOpen={isOpen} onClose={handleClose} size="2xl">
      <ModalContent>
        <ModalHeader className="text-[#122C93]">
          {selectedId ? "Edit Waktu Jadwal" : "Tambah Waktu Jadwal"}
        </ModalHeader>
        <ModalBody>
          <div className="container-form flex flex-col gap-6 p-3">
            <Input
              label="Nama Waktu"
              placeholder="Contoh: Shift Pagi"
              variant="underlined"
              labelPlacement="inside"
              value={formData.nama}
              maxLength={21}
              minLength={1}
              isInvalid={!!errors.nama}
              errorMessage={errors.nama}
              onChange={(e) =>
                setFormData({ ...formData, nama: e.target.value })
              }
            />
            <div className="flex gap-4 w-full">
              <Input
                className="w-full"
                label="Jam Mulai"
                type="time"
                variant="underlined"
                labelPlacement="inside"
                step="1"
                value={formData.mulai}
                isInvalid={!!errors.mulai}
                errorMessage={errors.mulai}
                onChange={(e) =>
                  setFormData({ ...formData, mulai: e.target.value })
                }
              />
              <Input
                className="w-full"
                label="Jam Selesai"
                type="time"
                variant="underlined"
                labelPlacement="inside"
                step="1"
                value={formData.selesai}
                isInvalid={!!errors.selesai}
                errorMessage={errors.selesai}
                onChange={(e) =>
                  setFormData({ ...formData, selesai: e.target.value })
                }
              />
            </div>
            {!selectedId && (
              <p className="text-xs text-gray-400 italic mt-[-10px]">
                * Timezone akan otomatis terdeteksi: {getDeviceTimezone()}
              </p>
            )}
          </div>
        </ModalBody>
        <ModalFooter className="flex justify-center pb-8">
          <Button variant="light" color="danger" onPress={handleClose}>
            Batal
          </Button>
          <Button
            className="bg-[#122C93] text-white px-10"
            onPress={actions.handleSubmit}
            isLoading={isSubmitting}
          >
            {selectedId ? "Update" : "Simpan"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
