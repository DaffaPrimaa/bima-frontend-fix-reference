import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Select,
  SelectItem,
  DatePicker,
  CheckboxGroup,
  Checkbox,
  addToast,
} from "@heroui/react";
import { useState, useEffect } from "react";
import { CalendarDate } from "@internationalized/date";
import { scheduleService } from "../../services/scheduleService";
import { InfiniteScrollTrigger } from "../common/InfiniteScrollTrigger";

interface AssignJadwalModalProps {
  isOpen: boolean;
  onClose: () => void;
  scheduleOptions: any;
  onSuccess: () => void;
  selectedJadwalUuid?: string | null;
  initialData?: {
    tanggalMulai?: CalendarDate;
    tanggalAkhir?: CalendarDate;
    pos_uuid: string;
    satpam_uuid: string;
    shift_uuid: string;
    selectedDays: number[];
  };
}

const AssignJadwalModal = ({
  isOpen,
  onClose,
  scheduleOptions,
  onSuccess,
  selectedJadwalUuid,
  initialData,
}: AssignJadwalModalProps) => {
  const [manualData, setManualData] = useState({
    tanggalMulai: undefined as CalendarDate | undefined,
    tanggalAkhir: undefined as CalendarDate | undefined,
    pos_uuid: "",
    satpam_uuid: "",
    shift_uuid: "",
    selectedDays: [1, 2, 3, 4, 5, 6, 0],
  });

  const [manualErrors, setManualErrors] = useState<Record<string, string | undefined>>({});
  const [isManualSubmitting, setIsManualSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setManualData({
        tanggalMulai: initialData?.tanggalMulai,
        tanggalAkhir: initialData?.tanggalAkhir,
        pos_uuid: initialData?.pos_uuid || "",
        satpam_uuid: initialData?.satpam_uuid || "",
        shift_uuid: initialData?.shift_uuid || "",
        selectedDays: initialData?.selectedDays || [1, 2, 3, 4, 5, 6, 0],
      });
      setManualErrors({});
    }
  }, [isOpen, initialData]);

  const validateManual = () => {
    const errs: Record<string, string | undefined> = {};
    if (!manualData.satpam_uuid) errs.satpam_uuid = "Satpam wajib dipilih";
    if (!manualData.shift_uuid) errs.shift_uuid = "Shift wajib dipilih";
    if (!manualData.pos_uuid) errs.pos_uuid = "Pos wajib dipilih";
    if (!manualData.tanggalMulai) errs.tanggalMulai = "Tanggal wajib diisi";
    if (
      manualData.tanggalMulai &&
      manualData.tanggalAkhir &&
      manualData.tanggalAkhir.compare(manualData.tanggalMulai) < 0
    ) {
      errs.tanggalAkhir = "Tanggal akhir harus setelah tanggal mulai";
    }
    setManualErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleManualSubmit = async () => {
    if (!validateManual()) {
      addToast({
        title: "Validasi Gagal",
        description: "Periksa kembali inputan anda",
        color: "warning",
      });
      return;
    }

    setIsManualSubmitting(true);
    try {
      if (selectedJadwalUuid) {
        await scheduleService.update(selectedJadwalUuid, {
          satpam_uuid: manualData.satpam_uuid,
          pos_uuid: manualData.pos_uuid,
          shift_uuid: manualData.shift_uuid,
          tanggal: manualData.tanggalMulai!.toString(),
        });
      } else {
        if (manualData.tanggalAkhir) {
          // It's a recurring schedule (assignment)
          await scheduleService.generate({
            satpam_uuid: manualData.satpam_uuid,
            pos_uuid: manualData.pos_uuid,
            shift_uuid: manualData.shift_uuid,
            start_date: manualData.tanggalMulai!.toString(),
            end_date: manualData.tanggalAkhir!.toString(),
            days_of_week: manualData.selectedDays,
          });
        } else {
          // It's a one-off manual schedule
          await scheduleService.create({
            satpam_uuid: manualData.satpam_uuid,
            pos_uuid: manualData.pos_uuid,
            shift_uuid: manualData.shift_uuid,
            tanggal: manualData.tanggalMulai!.toString(),
          });
        }
      }

      addToast({
        title: "Berhasil",
        description: `Jadwal berhasil ${selectedJadwalUuid ? "diubah" : "ditambahkan"}`,
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
      setIsManualSubmitting(false);
    }
  };

  return (
    <Modal backdrop="opaque" isOpen={isOpen} onClose={onClose} size="4xl">
      <ModalContent>
        <ModalHeader className="text-[#122C93]">
          {selectedJadwalUuid ? "Edit Shift" : "Tambah Shift Manual"}
        </ModalHeader>
        <ModalBody>
          <div className="grid grid-cols-2 gap-x-10 gap-y-6 p-3">
            <Select
              label="Nama & NIP"
              variant="underlined"
              labelPlacement="inside"
              placeholder="Pilih Personel"
              isInvalid={!!manualErrors.satpam_uuid}
              errorMessage={manualErrors.satpam_uuid}
              selectedKeys={manualData.satpam_uuid ? [manualData.satpam_uuid] : []}
              onSelectionChange={(k) =>
                setManualData({ ...manualData, satpam_uuid: String(Array.from(k)[0]) })
              }
              listboxProps={{
                bottomContent: (
                  <InfiniteScrollTrigger
                    hasMore={scheduleOptions.hasMoreSatpam}
                    isLoading={scheduleOptions.isLoadingSatpam}
                    onLoadMore={scheduleOptions.loadMoreSatpam}
                  />
                ),
              }}
            >
              {scheduleOptions.listSatpam.map((s: any) => (
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
              isInvalid={!!manualErrors.shift_uuid}
              errorMessage={manualErrors.shift_uuid}
              selectedKeys={manualData.shift_uuid ? [manualData.shift_uuid] : []}
              onSelectionChange={(k) =>
                setManualData({ ...manualData, shift_uuid: String(Array.from(k)[0]) })
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

            <DatePicker
              label="Tanggal Mulai"
              variant="underlined"
              labelPlacement="inside"
              isInvalid={!!manualErrors.tanggalMulai}
              errorMessage={manualErrors.tanggalMulai}
              value={manualData.tanggalMulai}
              onChange={(d) => setManualData({ ...manualData, tanggalMulai: d as CalendarDate })}
            />

            <DatePicker
              label="Tanggal Akhir (Opsional)"
              variant="underlined"
              labelPlacement="inside"
              isInvalid={!!manualErrors.tanggalAkhir}
              errorMessage={manualErrors.tanggalAkhir}
              value={manualData.tanggalAkhir}
              onChange={(d) => setManualData({ ...manualData, tanggalAkhir: d as CalendarDate })}
            />

            <Select
              label="Pos"
              variant="underlined"
              labelPlacement="inside"
              placeholder="Pilih Pos"
              isInvalid={!!manualErrors.pos_uuid}
              errorMessage={manualErrors.pos_uuid}
              selectedKeys={manualData.pos_uuid ? [manualData.pos_uuid] : []}
              onSelectionChange={(k) =>
                setManualData({ ...manualData, pos_uuid: String(Array.from(k)[0]) })
              }
              listboxProps={{
                bottomContent: (
                  <InfiniteScrollTrigger
                    hasMore={scheduleOptions.hasMorePos}
                    isLoading={scheduleOptions.isLoadingPos}
                    onLoadMore={scheduleOptions.loadMorePos}
                  />
                ),
              }}
            >
              {scheduleOptions.listPos.map((p: any) => (
                <SelectItem key={p.uuid} textValue={p.nama}>
                  {p.nama}
                </SelectItem>
              ))}
            </Select>

            {manualData.tanggalAkhir && (
              <div className="col-span-2 mt-2 flex justify-start w-full">
                <CheckboxGroup
                  label="Pilih Hari"
                  orientation="horizontal"
                  value={manualData.selectedDays.map(String)}
                  onValueChange={(val) =>
                    setManualData({ ...manualData, selectedDays: val.map(Number) })
                  }
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
            )}
          </div>
        </ModalBody>
        <ModalFooter className="flex justify-center pb-8">
          <Button variant="light" color="danger" onPress={onClose}>
            Batal
          </Button>
          <Button
            className="bg-[#122C93] text-white px-10"
            onPress={handleManualSubmit}
            isLoading={isManualSubmitting}
          >
            {selectedJadwalUuid ? "Update" : "Simpan"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AssignJadwalModal;
