import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Select,
  SelectItem,
  addToast,
  RadioGroup,
  Radio,
} from "@heroui/react";
import { useState, useEffect } from "react";
import { scheduleService } from "../../services/scheduleService";
import { InfiniteScrollTrigger } from "../common/InfiniteScrollTrigger";

interface AssignPerHariModalProps {
  isOpen: boolean;
  onClose: () => void;
  scheduleOptions: any;
  onSuccess: () => void;
  selectedJadwalItem?: any | null;
  initialData?: {
    satpam_uuid: string;
    tanggal: string;
    shift_uuid: string;
    pos_uuid: string;
  };
}

const AssignPerHariModal = ({
  isOpen,
  onClose,
  scheduleOptions,
  onSuccess,
  selectedJadwalItem,
  initialData,
}: AssignPerHariModalProps) => {
  const [assignPerHariData, setAssignPerHariData] = useState({
    satpam_uuid: "",
    tanggal: "",
    shift_uuid: "",
    pos_uuid: "",
  });

  const [assignPerHariErrors, setAssignPerHariErrors] = useState<Record<string, string>>({});
  const [isAssignPerHariSubmitting, setIsAssignPerHariSubmitting] = useState(false);
  const [editMode, setEditMode] = useState<"single" | "future">("single");

  useEffect(() => {
    if (isOpen) {
      setAssignPerHariData(
        initialData || {
          satpam_uuid: "",
          tanggal: "",
          shift_uuid: "",
          pos_uuid: scheduleOptions.listPos.length > 0 ? scheduleOptions.listPos[0].uuid : "",
        }
      );
      setAssignPerHariErrors({});
      setEditMode("single");
    }
  }, [isOpen, initialData, scheduleOptions.listPos]);

  const handleAssignPerHariSubmit = async () => {
    const errs: Record<string, string> = {};
    if (!assignPerHariData.shift_uuid) errs.shift_uuid = "Shift wajib dipilih";
    if (Object.keys(errs).length > 0) {
      setAssignPerHariErrors(errs);
      return;
    }

    setIsAssignPerHariSubmitting(true);
    try {
      if (selectedJadwalItem) {
        await scheduleService.update(selectedJadwalItem, {
          satpam_uuid: assignPerHariData.satpam_uuid,
          pos_uuid: assignPerHariData.pos_uuid,
          shift_uuid: assignPerHariData.shift_uuid,
          tanggal: assignPerHariData.tanggal,
        }, editMode);
      } else {
        await scheduleService.create({
          satpam_uuid: assignPerHariData.satpam_uuid,
          pos_uuid: assignPerHariData.pos_uuid,
          shift_uuid: assignPerHariData.shift_uuid,
          tanggal: assignPerHariData.tanggal,
        });
      }
      addToast({
        title: "Berhasil",
        description: `Jadwal berhasil ${selectedJadwalItem ? "diubah" : "ditambahkan"}`,
        color: "success",
      });
      onSuccess();
      onClose();
    } catch (error: any) {
      addToast({
        title: "Gagal",
        description: error.message || "Gagal menyimpan jadwal",
        color: "danger",
      });
    } finally {
      setIsAssignPerHariSubmitting(false);
    }
  };

  return (
    <Modal backdrop="opaque" isOpen={isOpen} onClose={onClose} size="md">
      <ModalContent>
        <ModalHeader className="text-[#122C93]">
          {selectedJadwalItem ? "Edit Shift" : "Pilih Shift"}
        </ModalHeader>
        <ModalBody>
          <div className="flex flex-col gap-6 p-3">
            <Select
              label="Shift"
              variant="underlined"
              labelPlacement="inside"
              placeholder="Pilih Shift Kerja"
              isInvalid={!!assignPerHariErrors.shift_uuid}
              errorMessage={assignPerHariErrors.shift_uuid}
              selectedKeys={assignPerHariData.shift_uuid ? [assignPerHariData.shift_uuid] : []}
              onSelectionChange={(k) =>
                setAssignPerHariData({
                  ...assignPerHariData,
                  shift_uuid: String(Array.from(k)[0]),
                })
              }
              listboxProps={{
                bottomContent: (
                  <InfiniteScrollTrigger
                    hasMore={scheduleOptions.hasMoreShift}
                    isLoading={scheduleOptions.isLoadingShift}
                    onLoadMore={scheduleOptions.loadMoreShift}
                  />
                ),
              }}
            >
              {scheduleOptions.listShift.map((s: any) => (
                <SelectItem
                  key={s.uuid}
                  textValue={`${s.nama} (${s.mulai?.slice(0, 5)} - ${s.selesai?.slice(0, 5)})`}
                >
                  {s.nama} ({s.mulai?.slice(0, 5)} - {s.selesai?.slice(0, 5)})
                </SelectItem>
              ))}
            </Select>

            {selectedJadwalItem && (selectedJadwalItem.assignment_uuid || selectedJadwalItem.assignment?.uuid) && (
              <RadioGroup
                label="Terapkan perubahan pada:"
                value={editMode}
                onValueChange={(val) => setEditMode(val as "single" | "future")}
                size="sm"
              >
                <Radio value="single">Hanya hari ini saja</Radio>
                <Radio value="future">Mulai hari ini & seterusnya</Radio>
              </RadioGroup>
            )}
          </div>
        </ModalBody>
        <ModalFooter className="flex justify-center pb-8">
          <Button variant="light" color="danger" onPress={onClose}>
            Batal
          </Button>
          <Button
            className="bg-[#122C93] text-white px-10"
            onPress={handleAssignPerHariSubmit}
            isLoading={isAssignPerHariSubmitting}
          >
            {selectedJadwalItem ? "Update" : "Simpan"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AssignPerHariModal;
