import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
} from "@heroui/react";
import type { useAttendanceForm } from "../../hooks/useAttendanceForm";

interface AttendanceEditModalProps {
  isOpen: boolean;
  onOpenChange: () => void;
  formHook: ReturnType<typeof useAttendanceForm>;
}

export const AttendanceEditModal = ({
  isOpen,
  onOpenChange,
  formHook,
}: AttendanceEditModalProps) => {
  const { formState, setFormData, actions } = formHook;
  const { formData, isSubmitting } = formState;

  return (
    <Modal isOpen={isOpen} onClose={onOpenChange} size="lg">
      <ModalContent>
        <ModalHeader className="text-[#122C93]">Edit Data Absensi</ModalHeader>
        <ModalBody>
          <div className="flex flex-col gap-6 p-2">
            <div className="container-input-date-custom flex flex-col">
              <h2 className="font-light text-[12px]">Waktu Check In</h2>
              <Input
                type="datetime-local"
                variant="underlined"
                labelPlacement="inside"
                value={formData.checked_in_at}
                errorMessage="Input harus benar atau setidaknya terisi"
                onChange={(e) =>
                  setFormData({ ...formData, checked_in_at: e.target.value })
                }
              />
            </div>
            <div className="container-input-date-custom flex flex-col">
              <h2 className="font-light text-[12px]">Waktu Check Out</h2>
              <Input
                type="datetime-local"
                variant="underlined"
                labelPlacement="inside"
                value={formData.checked_out_at}
                errorMessage="Input harus benar atau setidaknya terisi"
                onChange={(e) =>
                  setFormData({ ...formData, checked_out_at: e.target.value })
                }
              />
            </div>

          </div>
        </ModalBody>
        <ModalFooter className="flex justify-center pb-8">
          <Button variant="light" color="danger" onPress={onOpenChange}>
            Batal
          </Button>
          <Button
            className="bg-[#122C93] text-white px-10"
            onPress={actions.handleSubmit}
            isLoading={isSubmitting}
          >
            Simpan Perubahan
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
