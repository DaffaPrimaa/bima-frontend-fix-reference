import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  DatePicker,
  Select,
  SelectItem,
} from "@heroui/react";
import type { useScheduleForm } from "../../hooks/useScheduleForm";
import type {
  SatpamOption,
  ShiftOption,
  PosOption,
} from "../../types/schedule";
import { CalendarDate } from "@internationalized/date";

interface ScheduleFormModalProps {
  isOpen: boolean;
  onOpenChange: () => void;
  formHook: ReturnType<typeof useScheduleForm>;
  options: {
    listSatpam: SatpamOption[];
    listShift: ShiftOption[];
    listPos: PosOption[];
  };
}

export const ScheduleFormModal = ({
  isOpen,
  onOpenChange,
  formHook,
  options,
}: ScheduleFormModalProps) => {
  const { formState, setFormData, actions } = formHook;
  const { formData, errors, selectedUuid, isSubmitting } = formState;
  const { listSatpam, listShift, listPos } = options;

  const handleClose = () => {
    actions.resetForm();
    onOpenChange();
  };

  return (
    <Modal backdrop="opaque" isOpen={isOpen} onClose={handleClose} size="4xl">
      <ModalContent>
        <ModalHeader className="text-[#122C93]">
          {selectedUuid ? "Edit Shift" : "Tambah Shift Manual"}
        </ModalHeader>
        <ModalBody>
          <div className="container-form flex flex-row justify-between gap-10 p-3">
            <div className="flex flex-col gap-8 w-1/2">
              <DatePicker
                className="w-full"
                label="Tanggal"
                variant="underlined"
                labelPlacement="inside"
                isInvalid={!!errors.tanggal}
                errorMessage={errors.tanggal}
                value={formData.tanggal}
                onChange={(d) =>
                  setFormData({ ...formData, tanggal: d as CalendarDate })
                }
              />
              <Select
                className="w-full"
                label="Pos"
                variant="underlined"
                labelPlacement="inside"
                placeholder="Pilih Pos"
                isInvalid={!!errors.pos_uuid}
                errorMessage={errors.pos_uuid}
                selectedKeys={formData.pos_uuid ? [formData.pos_uuid] : []}
                onSelectionChange={(k) =>
                  setFormData({
                    ...formData,
                    pos_uuid: String(Array.from(k)[0]),
                  })
                }
              >
                {listPos.map((p) => (
                  <SelectItem key={p.uuid} textValue={p.nama}>
                    {p.nama}
                  </SelectItem>
                ))}
              </Select>
            </div>
            <div className="flex flex-col gap-8 w-1/2">
              <Select
                className="w-full"
                label="Nama & NIP"
                variant="underlined"
                labelPlacement="inside"
                placeholder="Pilih Personel"
                isInvalid={!!errors.satpam_uuid}
                errorMessage={errors.satpam_uuid}
                selectedKeys={
                  formData.satpam_uuid ? [formData.satpam_uuid] : []
                }
                onSelectionChange={(k) =>
                  setFormData({
                    ...formData,
                    satpam_uuid: String(Array.from(k)[0]),
                  })
                }
              >
                {listSatpam.map((s) => (
                  <SelectItem key={s.uuid} textValue={`${s.nama} - ${s.nip}`}>
                    {s.nama} - {s.nip}
                  </SelectItem>
                ))}
              </Select>

              <Select
                label="Shift"
                variant="underlined"
                labelPlacement="inside"
                placeholder="Pilih Shift Kerja"
                isInvalid={!!errors.shift_uuid}
                errorMessage={errors.shift_uuid}
                selectedKeys={formData.shift_uuid ? [formData.shift_uuid] : []}
                onSelectionChange={(k) =>
                  setFormData({
                    ...formData,
                    shift_uuid: String(Array.from(k)[0]),
                  })
                }
              >
                {listShift.map((s) => (
                  <SelectItem
                    key={s.uuid}
                    textValue={`${s.nama} (${s.mulai.slice(0, 5)} - ${s.selesai.slice(0, 5)})`}
                  >
                    {s.nama} ({s.mulai.slice(0, 5)} - {s.selesai.slice(0, 5)})
                  </SelectItem>
                ))}
              </Select>
            </div>
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
            {selectedUuid ? "Update" : "Simpan"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
