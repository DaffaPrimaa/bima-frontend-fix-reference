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
  Checkbox,
  RadioGroup,
  Radio,
  addToast,
} from "@heroui/react";
import { useEffect, useState } from "react";
import { CalendarDate, parseDate } from "@internationalized/date";
import { scheduleService } from "../../services/scheduleService";
import type { Jadwal, SatpamOption, ShiftOption, PosOption } from "../../types/schedule";

const HARI_OPTIONS = [
  { label: "Senin", day: 1 },
  { label: "Selasa", day: 2 },
  { label: "Rabu", day: 3 },
  { label: "Kamis", day: 4 },
  { label: "Jumat", day: 5 },
  { label: "Sabtu", day: 6 },
  { label: "Minggu", day: 0 },
];
const ALL_DAYS = HARI_OPTIONS.map((h) => h.day);

interface AssignJadwalModalProps {
  isOpen: boolean;
  onClose: () => void;
  scheduleOptions: {
    listSatpam: SatpamOption[];
    listShift: ShiftOption[];
    listPos: PosOption[];
  };
  onSuccess: () => void;
  /** null/undefined = mode Tambah. Diisi = mode Edit untuk instance ini. */
  selectedJadwalItem?: Jadwal | null;
  /** Dipakai buat pre-fill pas dibuka dari "Assign +" (tanggal/shift sudah diketahui). */
  initialData?: {
    tanggalMulai?: CalendarDate;
    pos_uuid?: string;
    satpam_uuid?: string;
    shift_uuid?: string;
  };
}

const AssignJadwalModal = ({
  isOpen,
  onClose,
  scheduleOptions,
  onSuccess,
  selectedJadwalItem,
  initialData,
}: AssignJadwalModalProps) => {
  const [manualData, setManualData] = useState({
    tanggalMulai: undefined as CalendarDate | undefined,
    tanggalAkhir: undefined as CalendarDate | undefined,
    pos_uuid: "",
    satpam_uuid: "",
    shift_uuid: "",
  });
  const [manualErrors, setManualErrors] = useState<Record<string, string | undefined>>({});
  const [isManualSubmitting, setIsManualSubmitting] = useState(false);
  const [selectedDays, setSelectedDays] = useState<number[]>(ALL_DAYS);

  // Snapshot satpam+pos+shift ASLI (dan apa instance ini berasal dari
  // Assignment/rrule) pas modal Edit dibuka — dipakai buat nyari jadwal
  // mana aja yang mau diganti kalau "Ubah s.d. Tanggal" diisi. manualData
  // sendiri berubah begitu user ganti pilihan form, jadi gak bisa dipakai
  // buat nyari data lama lagi.
  const [originalEditKey, setOriginalEditKey] = useState<{
    satpam_uuid: string;
    pos_uuid: string;
    pattern_uuid: string;
    hasAssignment: boolean;
  } | null>(null);

  const isEdit = !!selectedJadwalItem;

  useEffect(() => {
    if (!isOpen) return;

    if (selectedJadwalItem) {
      const workDate = String(selectedJadwalItem.work_date).split("T")[0];
      setManualData({
        tanggalMulai: parseDate(workDate),
        tanggalAkhir: undefined,
        pos_uuid: selectedJadwalItem.pos.uuid,
        satpam_uuid: selectedJadwalItem.satpam.uuid,
        shift_uuid: selectedJadwalItem.pattern.uuid,
      });
      setOriginalEditKey({
        satpam_uuid: selectedJadwalItem.satpam.uuid,
        pos_uuid: selectedJadwalItem.pos.uuid,
        pattern_uuid: selectedJadwalItem.pattern.uuid,
        hasAssignment: selectedJadwalItem.assignment_uuid != null,
      });
      // Default "Pilih Hari" cuma hari ASAL instance ini (bukan semua 7
      // hari) — checkbox/radio ini representasi "mau digeser ke hari
      // apa", jadi wajarnya start dari hari yang sekarang.
      setSelectedDays([new Date(`${workDate}T00:00:00`).getDay()]);
    } else {
      setManualData({
        tanggalMulai: initialData?.tanggalMulai,
        tanggalAkhir: undefined,
        pos_uuid: initialData?.pos_uuid || "",
        satpam_uuid: initialData?.satpam_uuid || "",
        shift_uuid: initialData?.shift_uuid || "",
      });
      setOriginalEditKey(null);
      setSelectedDays(
        initialData?.tanggalMulai ? [initialData.tanggalMulai.toDate("UTC").getUTCDay()] : ALL_DAYS,
      );
    }
    setManualErrors({});
  }, [isOpen, selectedJadwalItem, initialData]);

  // Pas Edit, "Pilih Hari" cuma boleh 1 (radio) — ini geser SATU hari ke
  // SATU hari lain, bukan pilih beberapa hari sekaligus. Beda dari Tambah
  // Jadwal yang memang multi-select buat pilih beberapa hari sekaligus di
  // rentang tanggal baru.
  const toggleDay = (day: number) => {
    if (isEdit) {
      setSelectedDays([day]);
      return;
    }
    setSelectedDays((prev) => (prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]));
  };

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
      addToast({ title: "Validasi Gagal", description: "Periksa kembali inputan anda", color: "warning" });
      return;
    }

    setIsManualSubmitting(true);
    let skippedCount = 0;
    try {
      if (selectedJadwalItem) {
        if (manualData.tanggalAkhir && originalEditKey?.hasAssignment) {
          // Belum didukung: instance ini berasal dari pola rrule
          // (Assignment), bukan manual — "Ubah s.d. Tanggal" cuma bisa
          // geser jadwal manual. Tolak eksplisit daripada diam-diam bikin
          // jadwal dobel (occurrence lama tetap aktif + instance manual
          // baru muncul di hari tujuan).
          addToast({
            title: "Belum Didukung",
            description:
              'Jadwal ini berasal dari pola berulang — geser rentang tanggal cuma bisa untuk jadwal manual. Hapus dulu ("hari ini dan hari yang sama selanjutnya") lalu tambahkan manual di hari baru.',
            color: "warning",
          });
          setIsManualSubmitting(false);
          return;
        }
        if (manualData.tanggalAkhir && originalEditKey) {
          // "Ubah s.d. Tanggal" diisi — geser/sinkronkan jadwal manual
          // milik kombinasi satpam+pos+shift ASLI (sebelum diedit) dari
          // tanggal mulai s.d. tanggal akhir ke hari-hari yang dicentang.
          const result = await scheduleService.updateManualSeriesRange({
            satpam_uuid: originalEditKey.satpam_uuid,
            pos_uuid: originalEditKey.pos_uuid,
            pattern_uuid: originalEditKey.pattern_uuid,
            from: manualData.tanggalMulai!.toString(),
            to: manualData.tanggalAkhir.toString(),
            daysOfWeek: selectedDays,
            newBody: {
              satpam_uuid: manualData.satpam_uuid,
              pos_uuid: manualData.pos_uuid,
              shift_uuid: manualData.shift_uuid,
            },
          });
          skippedCount = result.skipped;
        } else {
          await scheduleService.update(selectedJadwalItem.uuid, {
            satpam_uuid: manualData.satpam_uuid,
            pos_uuid: manualData.pos_uuid,
            shift_uuid: manualData.shift_uuid,
            tanggal: manualData.tanggalMulai!.toString(),
          });
        }
      } else {
        const end = manualData.tanggalAkhir ?? manualData.tanggalMulai!;
        let cursor = manualData.tanggalMulai!;
        const dates: string[] = [];
        while (cursor.compare(end) <= 0) {
          // toDate() perlu timezone eksplisit — CalendarDate itu wall-clock
          // tanpa zona, cukup pakai "UTC" di sini karena cuma dipakai buat
          // baca day-of-week, bukan disimpan/dikirim ke server.
          if (selectedDays.includes(cursor.toDate("UTC").getUTCDay())) {
            dates.push(cursor.toString());
          }
          cursor = cursor.add({ days: 1 });
        }
        if (dates.length === 0) {
          addToast({
            title: "Tidak Ada Tanggal",
            description: 'Tidak ada hari yang cocok dengan pilihan "Pilih Hari" di rentang tanggal ini.',
            color: "warning",
          });
          setIsManualSubmitting(false);
          return;
        }
        for (const tanggal of dates) {
          await scheduleService.create({
            satpam_uuid: manualData.satpam_uuid,
            pos_uuid: manualData.pos_uuid,
            shift_uuid: manualData.shift_uuid,
            tanggal,
          });
        }
      }

      addToast({
        title: skippedCount > 0 ? "Berhasil Sebagian" : "Berhasil",
        description:
          skippedCount > 0
            ? `Jadwal diubah, tapi ${skippedCount} tanggal dilewati karena bentrok dengan jadwal lain.`
            : `Jadwal berhasil ${selectedJadwalItem ? "diubah" : "ditambahkan"}`,
        color: skippedCount > 0 ? "warning" : "success",
      });
      onSuccess();
      onClose();
    } catch (error: any) {
      addToast({ title: "Gagal", description: error.message || "Gagal menyimpan jadwal", color: "danger" });
    } finally {
      setIsManualSubmitting(false);
    }
  };

  return (
    <Modal backdrop="opaque" isOpen={isOpen} onClose={onClose} size="4xl">
      <ModalContent>
        <ModalHeader className="text-[#122C93]">
          {selectedJadwalItem ? "Edit Shift" : "Tambah Shift Manual"}
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
            >
              {scheduleOptions.listSatpam.map((s) => (
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
            >
              {scheduleOptions.listShift.map((s) => (
                <SelectItem key={s.uuid} textValue={`${s.nama} (${s.mulai.slice(0, 5)} - ${s.selesai.slice(0, 5)})`}>
                  {s.nama} ({s.mulai.slice(0, 5)} - {s.selesai.slice(0, 5)})
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
              label={isEdit ? "Ubah s.d. Tanggal (Opsional)" : "Tanggal Akhir (Opsional)"}
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
            >
              {scheduleOptions.listPos.map((p) => (
                <SelectItem key={p.uuid} textValue={p.nama}>
                  {p.nama}
                </SelectItem>
              ))}
            </Select>
          </div>

          {/* Cuma relevan kalau ada rentang tanggal (Tanggal Akhir/Ubah s.d.
              Tanggal diisi). Tambah: multi-select (pilih beberapa hari
              buat dibuatkan jadwal baru sekaligus). Edit: cuma 1 (radio)
              — geser SATU hari ke SATU hari lain. */}
          <div className="px-3 pb-2">
            <p className="text-sm text-[#6B6B6B] mb-2">Pilih Hari</p>
            {isEdit ? (
              <RadioGroup
                orientation="horizontal"
                value={String(selectedDays[0] ?? "")}
                onValueChange={(v) => toggleDay(Number(v))}
                classNames={{ wrapper: "flex flex-wrap gap-4" }}
              >
                {HARI_OPTIONS.map(({ label, day }) => (
                  <Radio key={day} value={String(day)}>
                    {label}
                  </Radio>
                ))}
              </RadioGroup>
            ) : (
              <div className="flex flex-wrap gap-4">
                {HARI_OPTIONS.map(({ label, day }) => (
                  <Checkbox key={day} isSelected={selectedDays.includes(day)} onValueChange={() => toggleDay(day)}>
                    {label}
                  </Checkbox>
                ))}
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
            {selectedJadwalItem ? "Update" : "Simpan"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AssignJadwalModal;
