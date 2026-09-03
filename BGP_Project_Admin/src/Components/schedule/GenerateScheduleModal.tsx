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
  CheckboxGroup,
  Checkbox,
} from "@heroui/react";
import type { useGenerateSchedule } from "../../hooks/useGenerateSchedule";
import type {
  SatpamOption,
  ShiftOption,
  PosOption,
} from "../../types/schedule";
import { CalendarDate } from "@internationalized/date";

interface GenerateScheduleModalProps {
  isOpen: boolean;
  onOpenChange: () => void;
  hook: ReturnType<typeof useGenerateSchedule>;
  options: {
    listSatpam: SatpamOption[];
    listShift: ShiftOption[];
    listPos: PosOption[];
  };
}

export const GenerateScheduleModal = ({
  isOpen,
  onOpenChange,
  hook,
  options,
}: GenerateScheduleModalProps) => {
  const { generateState, setGenerateData, setErrors, handleGenerateSubmit } =
    hook;
  const { generateData, errors, isSubmitting } = generateState;
  const { listSatpam, listShift, listPos } = options;

  return (
    <Modal
      backdrop="opaque"
      isOpen={isOpen}
      onClose={onOpenChange}
      size="4xl"
      scrollBehavior="inside"
    >
      <ModalContent>
        <ModalHeader className="text-[#122C93]">
          Auto-Generate Jadwal Rutin
        </ModalHeader>
        <ModalBody>
          <div className="grid grid-cols-2 gap-10 p-3">
            <div className="flex flex-col gap-6">
              <DatePicker
                label="Tanggal Mulai"
                variant="underlined"
                labelPlacement="inside"
                isInvalid={!!errors.start_date}
                errorMessage={errors.start_date}
                onChange={(d) => {
                  setGenerateData({
                    ...generateData,
                    start_date: d as CalendarDate,
                  });
                  if (errors.start_date)
                    setErrors({ ...errors, start_date: undefined });
                }}
              />
              <DatePicker
                label="Tanggal Berakhir"
                variant="underlined"
                labelPlacement="inside"
                isInvalid={!!errors.end_date}
                errorMessage={errors.end_date}
                onChange={(d) => {
                  setGenerateData({
                    ...generateData,
                    end_date: d as CalendarDate,
                  });
                  if (errors.end_date)
                    setErrors({ ...errors, end_date: undefined });
                }}
              />
              <Select
                label="Pos"
                variant="underlined"
                labelPlacement="inside"
                placeholder="Pilih Pos"
                isInvalid={!!errors.pos_uuid}
                errorMessage={errors.pos_uuid}
                selectedKeys={
                  generateData.pos_uuid ? [generateData.pos_uuid] : []
                }
                onSelectionChange={(k) => {
                  setGenerateData({
                    ...generateData,
                    pos_uuid: String(Array.from(k)[0]),
                  });
                  if (errors.pos_uuid)
                    setErrors({ ...errors, pos_uuid: undefined });
                }}
              >
                {listPos.map((p) => (
                  <SelectItem key={p.uuid} textValue={p.nama}>
                    {p.nama}
                  </SelectItem>
                ))}
              </Select>
            </div>
            <div className="flex flex-col gap-6">
              <Select
                label="Satpam"
                variant="underlined"
                labelPlacement="inside"
                placeholder="Pilih Personel"
                isInvalid={!!errors.satpam_uuid}
                errorMessage={errors.satpam_uuid}
                selectedKeys={
                  generateData.satpam_uuid ? [generateData.satpam_uuid] : []
                }
                onSelectionChange={(k) => {
                  setGenerateData({
                    ...generateData,
                    satpam_uuid: String(Array.from(k)[0]),
                  });
                  if (errors.satpam_uuid)
                    setErrors({ ...errors, satpam_uuid: undefined });
                }}
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
                selectedKeys={
                  generateData.shift_uuid ? [generateData.shift_uuid] : []
                }
                onSelectionChange={(k) => {
                  setGenerateData({
                    ...generateData,
                    shift_uuid: String(Array.from(k)[0]),
                  });
                  if (errors.shift_uuid)
                    setErrors({ ...errors, shift_uuid: undefined });
                }}
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
            <div className="col-span-2">
              <CheckboxGroup
                label="Pilih Hari Kerja"
                orientation="horizontal"
                isInvalid={!!errors.days_of_week}
                errorMessage={errors.days_of_week}
                value={generateData.days_of_week}
                onValueChange={(v) => {
                  setGenerateData({ ...generateData, days_of_week: v });
                  if (errors.days_of_week)
                    setErrors({ ...errors, days_of_week: undefined });
                }}
              >
                <Checkbox value="1">Senin</Checkbox>
                <Checkbox value="2">Selasa</Checkbox>
                <Checkbox value="3">Rabu</Checkbox>
                <Checkbox value="4">Kamis</Checkbox>
                <Checkbox value="5">Jumat</Checkbox>
                <Checkbox value="6">Sabtu</Checkbox>
                <Checkbox value="0">Minggu</Checkbox>
              </CheckboxGroup>
            </div>
          </div>
        </ModalBody>
        <ModalFooter className="flex justify-center pb-8">
          <Button variant="light" color="danger" onPress={onOpenChange}>
            Batal
          </Button>
          <Button
            className="bg-[#122C93] text-white px-10"
            onPress={handleGenerateSubmit}
            isLoading={isSubmitting}
          >
            Generate Sekarang
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
