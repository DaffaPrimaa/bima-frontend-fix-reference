import {
  Button,
  Select,
  SelectItem,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  DatePicker,
  useDisclosure,
  addToast,
  Spinner,
  Checkbox,
  RadioGroup,
  Radio,
} from "@heroui/react";
import { useState, useEffect, useCallback } from "react";
import { CalendarDate, parseDate } from "@internationalized/date";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import { MdDelete, MdEditCalendar } from "react-icons/md";
import ShiftTableNew, {
  type ShiftData,
} from "../Components/shifts/ShiftTableNew";
import { DeleteConfirmationModal } from "../Components/common/DeleteConfirmationModal";
import { scheduleService } from "../services/scheduleService";
import { useShiftData } from "../hooks/useShiftData";
import { useShiftForm } from "../hooks/useShiftForm";
import { useScheduleOptions } from "../hooks/useScheduleOptions";
import { getDeviceTimezone } from "../Utils/helpers";
import type { Jadwal } from "../types/schedule";

const toIsoDate = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const hariSingkatanMingguTable = [
  "Min",
  "Sen",
  "Sel",
  "Rab",
  "Kam",
  "Jum",
  "Sab",
];

const ClientPenjadwalanSatpam = () => {
  const [activeSwitch, setActiveSwitch] = useState<"jadwal" | "shift">(
    "jadwal",
  );
  const [rangeMode, setRangeMode] = useState<"harian" | "mingguan">("harian");
  const [currentDate, setCurrentDate] = useState(new Date());

  const [allJadwal, setAllJadwal] = useState<Jadwal[]>([]);
  const [isJadwalLoading, setIsJadwalLoading] = useState(true);

  const fetchAllJadwal = useCallback(async () => {
    setIsJadwalLoading(true);
    try {
      const rangeEnd = new Date(currentDate);
      if (rangeMode === "mingguan") rangeEnd.setDate(rangeEnd.getDate() + 6);
      const from = toIsoDate(currentDate);
      const to = toIsoDate(rangeEnd);
      const result = await scheduleService.getAll(50, null, from, to);
      setAllJadwal(Array.isArray(result.data) ? result.data : []);
    } catch (error: any) {
      addToast({
        title: "Gagal",
        description: error.message || "Gagal memuat jadwal jaga",
        color: "danger",
      });
    } finally {
      setIsJadwalLoading(false);
    }
  }, [currentDate, rangeMode]);

  useEffect(() => {
    fetchAllJadwal();
  }, [fetchAllJadwal]);

  const shiftDataHook = useShiftData();
  const shiftFormHook = useShiftForm({
    onSuccess: () => {
      if (!shiftFormHook.formState.selectedId) shiftDataHook.setPage(1);
      shiftDataHook.refreshData();
    },
    onClose: () => modalShiftForm.onOpenChange(),
  });
  const scheduleOptions = useScheduleOptions(activeSwitch === "jadwal");

  const shiftTableData: ShiftData[] = shiftDataHook.data.listWaktu.map(
    (s) => ({
      uuid: s.uuid,
      nama_shift: s.nama,
      jam_mulai: s.mulai ? s.mulai.slice(0, 5) : "-",
      jam_selesai: s.selesai ? s.selesai.slice(0, 5) : "-",
    }),
  );

  const handleOpenAddShift = () => {
    shiftFormHook.actions.resetForm();
    modalShiftForm.onOpen();
  };

  const handleEditShift = async (uuid: string) => {
    await shiftFormHook.actions.loadData(uuid);
    modalShiftForm.onOpen();
  };

  // === Modal: Tambah/Edit Jadwal Manual ===
  const modalManual = useDisclosure();
  const [selectedJadwalUuid, setSelectedJadwalUuid] = useState<string | null>(
    null,
  );
  const [manualData, setManualData] = useState<{
    tanggalMulai?: CalendarDate;
    tanggalAkhir?: CalendarDate;
    pos_uuid: string;
    satpam_uuid: string;
    shift_uuid: string;
  }>({
    tanggalMulai: undefined,
    tanggalAkhir: undefined,
    pos_uuid: "",
    satpam_uuid: "",
    shift_uuid: "",
  });
  const [manualErrors, setManualErrors] = useState<
    Record<string, string | undefined>
  >({});
  const [isManualSubmitting, setIsManualSubmitting] = useState(false);

  // Snapshot satpam+pos+shift ASLI pas modal Edit dibuka — dipakai buat
  // nyari jadwal mana aja yang mau diganti kalau "Tanggal Akhir" diisi
  // (manualData sendiri berubah begitu user ganti pilihan di form, jadi
  // gak bisa dipakai buat nyari data lama lagi).
  const [originalEditKey, setOriginalEditKey] = useState<{
    satpam_uuid: string;
    pos_uuid: string;
    pattern_uuid: string;
  } | null>(null);

  // Hari mana aja yang kepakai kalau rentang tanggal (Tambah/Ubah s.d.)
  // dipilih — JS Date.getDay(): 0=Minggu..6=Sabtu. Default semua kecentang
  // (sama seperti perilaku lama sebelum fitur ini ada: rentang = tiap hari).
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
  const [selectedDays, setSelectedDays] = useState<number[]>(ALL_DAYS);

  // Pas Edit, "Pilih Hari" cuma boleh 1 (radio behavior) — ini geser SATU
  // hari ke SATU hari lain, bukan pilih beberapa hari sekaligus (beda dari
  // Tambah Jadwal yang memang multi-select buat pilih beberapa hari
  // sekaligus di rentang tanggal baru).
  const toggleDay = (day: number) => {
    if (selectedJadwalUuid) {
      setSelectedDays([day]);
      return;
    }
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day],
    );
  };

  const resetManualForm = () => {
    setManualData({
      tanggalMulai: undefined,
      tanggalAkhir: undefined,
      pos_uuid: "",
      satpam_uuid: "",
      shift_uuid: "",
    });
    setManualErrors({});
    setSelectedJadwalUuid(null);
    setOriginalEditKey(null);
    setSelectedDays(ALL_DAYS);
  };

  const handleCloseManual = () => {
    resetManualForm();
    modalManual.onOpenChange();
  };

  const handleOpenTambahJadwal = () => {
    resetManualForm();
    modalManual.onOpen();
  };

  const handleOpenAssign = (shiftUuid: string) => {
    resetManualForm();
    setManualData((prev) => ({
      ...prev,
      shift_uuid: shiftUuid,
      tanggalMulai: parseDate(toIsoDate(currentDate)),
    }));
    setSelectedDays([currentDate.getDay()]);
    modalManual.onOpen();
  };

  const handleOpenAssignForDate = (satpamUuid: string, dateIso: string) => {
    resetManualForm();
    setManualData((prev) => ({
      ...prev,
      satpam_uuid: satpamUuid,
      tanggalMulai: parseDate(dateIso),
    }));
    setSelectedDays([new Date(`${dateIso}T00:00:00`).getDay()]);
    modalManual.onOpen();
  };

  const handleEditJadwalInstance = (item: Jadwal) => {
    setSelectedJadwalUuid(item.uuid);
    setManualErrors({});
    setOriginalEditKey({
      satpam_uuid: item.satpam.uuid,
      pos_uuid: item.pos.uuid,
      pattern_uuid: item.pattern.uuid,
    });
    setManualData({
      tanggalMulai: parseDate(String(item.work_date).split("T")[0]),
      tanggalAkhir: undefined,
      pos_uuid: item.pos.uuid,
      satpam_uuid: item.satpam.uuid,
      shift_uuid: item.pattern.uuid,
    });
    // Default "Pilih Hari" cuma hari ASAL instance ini (bukan semua 7
    // hari) — checkbox ini representasi "mau digeser ke hari apa", jadi
    // wajarnya start dari hari yang sekarang, baru user ganti kalau mau
    // dipindah/diperluas.
    setSelectedDays([
      new Date(`${String(item.work_date).split("T")[0]}T00:00:00`).getDay(),
    ]);
    modalManual.onOpen();
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
      addToast({
        title: "Validasi Gagal",
        description: "Periksa kembali inputan anda",
        color: "warning",
      });
      return;
    }

    setIsManualSubmitting(true);
    let skippedCount = 0;
    try {
      if (selectedJadwalUuid) {
        if (manualData.tanggalAkhir && originalEditKey) {
          // "Tanggal Akhir" diisi — geser/sinkronkan jadwal manual milik
          // kombinasi satpam+pos+shift ASLI (sebelum diedit) dari tanggal
          // mulai s.d. tanggal akhir ke hari-hari yang dicentang.
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
          await scheduleService.update(selectedJadwalUuid, {
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
            description: "Tidak ada hari yang cocok dengan pilihan \"Pilih Hari\" di rentang tanggal ini.",
            color: "warning",
          });
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
            : `Jadwal berhasil ${selectedJadwalUuid ? "diubah" : "ditambahkan"}`,
        color: skippedCount > 0 ? "warning" : "success",
      });
      handleCloseManual();
      fetchAllJadwal();
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

  // === Hapus Jadwal (satu hari, atau hari itu + seterusnya) ===
  const jadwalDeleteModal = useDisclosure();
  const [deleteJadwalTarget, setDeleteJadwalTarget] = useState<Jadwal | null>(
    null,
  );
  const [isDeletingJadwal, setIsDeletingJadwal] = useState(false);

  const confirmDeleteJadwal = (item: Jadwal) => {
    setDeleteJadwalTarget(item);
    jadwalDeleteModal.onOpen();
  };

  /**
   * "Dan seterusnya": kalau jadwal ini berasal dari Assignment (rrule),
   * hapus assignment-nya (BE cascade-cancel semua instance depan yang
   * belum di-checkin). Kalau manual (assignment_uuid null — ini yang
   * paling sering terjadi lewat form "Tambah Jadwal" di halaman ini),
   * gak ada seri resmi di BE untuk dihapus sekaligus — jadi ditebak lewat
   * kombinasi satpam+pos+shift yang sama dari tanggal ini dan seterusnya
   * (lihat scheduleService.cancelManualSeriesFrom).
   */
  const executeDeleteJadwal = async (scope: "single" | "forward") => {
    const target = deleteJadwalTarget;
    if (!target) return;
    setIsDeletingJadwal(true);
    try {
      if (scope === "single") {
        await scheduleService.delete(target.uuid);
      } else if (target.assignment_uuid) {
        await scheduleService.deleteAssignment(target.assignment_uuid);
      } else {
        await scheduleService.cancelManualSeriesFrom({
          satpam_uuid: target.satpam.uuid,
          pos_uuid: target.pos.uuid,
          pattern_uuid: target.pattern.uuid,
          from: String(target.work_date).split("T")[0],
        });
      }
      addToast({
        title: "Berhasil",
        description:
          scope === "single"
            ? "Jadwal hari itu berhasil dihapus"
            : "Jadwal hari itu dan seterusnya berhasil dihapus",
        color: "success",
      });
      fetchAllJadwal();
      jadwalDeleteModal.onOpenChange();
    } catch (error: any) {
      addToast({
        title: "Gagal",
        description: error.message || "Gagal menghapus jadwal",
        color: "danger",
      });
    } finally {
      setIsDeletingJadwal(false);
      setDeleteJadwalTarget(null);
    }
  };

  // === Modal: Tambah/Edit Konfigurasi Shift ===
  const modalShiftForm = useDisclosure();

  const handleCloseShiftForm = () => {
    shiftFormHook.actions.resetForm();
    modalShiftForm.onOpenChange();
  };

  const formatTanggal = (date: Date) => {
    return date.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const formatRentangMinggu = (date: Date) => {
    const start = new Date(date);
    const end = new Date(date);
    end.setDate(start.getDate() + 6);

    const startLabel = start.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
    });
    const endLabel = end.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });

    return `${startLabel} - ${endLabel}`;
  };

  const getTanggalTableMingguan = (date: Date) => {
    const dayOfWeek = date.getDay();
    const minggu = new Date(date);
    minggu.setDate(date.getDate() - dayOfWeek);

    return hariSingkatanMingguTable.map((hari, i) => {
      const tanggal = new Date(minggu);
      tanggal.setDate(minggu.getDate() + i);
      return {
        hari,
        tanggal: tanggal.getDate(),
        iso: toIsoDate(tanggal),
      };
    });
  };

  const handlePrev = () => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      newDate.setDate(prev.getDate() - (rangeMode === "harian" ? 1 : 7));
      return newDate;
    });
    fetchAllJadwal();
  };

  const handleNext = () => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      newDate.setDate(prev.getDate() + (rangeMode === "harian" ? 1 : 7));
      return newDate;
    });
    fetchAllJadwal();
  };

  const renderJadwalHarian = () => {
    const tanggalIso = toIsoDate(currentDate);

    return (
      <div className="card-jadwal-container grid grid-cols-3 content-start gap-1 w-full h-152 overflow-y-auto">
        {isJadwalLoading ? (
          <div className="col-span-3 flex justify-center py-10">
            <Spinner />
          </div>
        ) : shiftDataHook.data.listWaktu.length === 0 ? (
          <div className="col-span-3 text-center text-sm text-[#6B6B6B] py-10">
            Belum ada konfigurasi shift. Tambahkan di tab "Atur Shift".
          </div>
        ) : (
          shiftDataHook.data.listWaktu.map((shift) => {
            const satpamForShift = allJadwal.filter(
              (j) =>
                j.pattern.uuid === shift.uuid &&
                j.work_date === tanggalIso &&
                j.status !== "cancelled",
            );

            return (
              <div
                key={shift.uuid}
                className="card-shift flex flex-col bg-white border border-[#E4E9F7] p-3 rounded-2xl h-[300px]"
              >
                <div className="card-header flex flex-row items-center justify-between flex-shrink-0">
                  <div className="jadwal flex flex-col items-start">
                    <h2 className="font-semibold">{shift.nama}</h2>
                    <h2 className="text-light text-sm text-[#6B6B6B]">
                      {shift.mulai?.slice(0, 5)} - {shift.selesai?.slice(0, 5)}
                    </h2>
                  </div>
                  <Button
                    variant="bordered"
                    className="rounded-2xl"
                    onPress={() => handleOpenAssign(shift.uuid)}
                  >
                    Assign +
                  </Button>
                </div>
                <hr className="w-full mt-4 border-[#E4E9F7] flex-shrink-0" />

                <div className="flex flex-col gap-3 mt-4 flex-1 min-h-0 overflow-y-auto pr-1">
                  {satpamForShift.length === 0 ? (
                    <p className="text-xs text-[#9CA3AF] text-center mt-4">
                      Belum ada satpam yang ditugaskan
                    </p>
                  ) : (
                    satpamForShift.map((item) => (
                      <div
                        key={item.uuid}
                        className="list-satpam flex flex-row justify-between items-center flex-shrink-0"
                      >
                        <div className="left-side flex flex-row items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-[#122C93] text-white flex items-center justify-center text-sm font-semibold flex-shrink-0">
                            {item.satpam.nama.charAt(0).toUpperCase()}
                          </div>
                          <div className="container-details-satpam flex flex-col gap-1 items-start">
                            <h2 className="text-sm">{item.satpam.nama}</h2>
                            <h2 className="text-xs text-[#6B6B6B]">
                              {item.pos.nama} · {item.satpam.nip}
                            </h2>
                          </div>
                        </div>
                        <div className="right-side flex flex-row items-center gap-3">
                          <MdEditCalendar
                            className="text-xl text-[#8D8787] cursor-pointer"
                            onClick={() => handleEditJadwalInstance(item)}
                          />
                          <MdDelete
                            className="text-xl text-[#A70202] cursor-pointer"
                            onClick={() => confirmDeleteJadwal(item)}
                          />
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    );
  };

  const renderJadwalMingguan = () => {
    const tanggalTable = getTanggalTableMingguan(currentDate);
    const listSatpam = scheduleOptions.listSatpam;

    return (
      <div className="table-container mt-2 rounded-2xl border border-[#E4E9F7] overflow-hidden overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-[#F1F1F1]">
              <th className="text-left py-4 px-5 font-bold text-base text-black min-w-[220px]">
                Nama
              </th>
              {tanggalTable.map(({ hari, tanggal }) => (
                <th key={hari} className="py-4 px-3 text-center min-w-[110px]">
                  <div className="flex flex-col items-center">
                    <span className="text-sm font-normal text-[#8D8787]">
                      {hari}
                    </span>
                    <span className="text-base font-bold text-black">
                      {tanggal}
                    </span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {listSatpam.length === 0 ? (
              <tr>
                <td
                  colSpan={hariSingkatanMingguTable.length + 1}
                  className="py-6 text-center text-sm text-[#6B6B6B]"
                >
                  Belum ada data satpam
                </td>
              </tr>
            ) : (
              listSatpam.map((satpam) => (
                <tr key={satpam.uuid} className="border-t border-[#E4E9F7]">
                  <td className="py-3 px-5">
                    <div className="flex flex-row items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#122C93] text-white flex items-center justify-center text-sm font-semibold flex-shrink-0">
                        {satpam.nama.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex flex-col items-start">
                        <span className="text-sm font-medium text-black">
                          {satpam.nama}
                        </span>
                        <span className="text-xs text-[#8D8787]">
                          NIP · {satpam.nip}
                        </span>
                      </div>
                    </div>
                  </td>
                  {tanggalTable.map(({ hari, iso }) => {
                    const match = allJadwal.find(
                      (j) =>
                        j.satpam.uuid === satpam.uuid &&
                        j.work_date === iso &&
                        j.status !== "cancelled",
                    );

                    return (
                      <td key={hari} className="py-3 px-3 text-center">
                        {match ? (
                          <button
                            type="button"
                            onClick={() => handleEditJadwalInstance(match)}
                            className="min-h-8 h-8 px-3 rounded-full text-xs font-medium !bg-[#EFF6FF] !text-[#2563EB] border border-[#BFDBFE]"
                          >
                            {match.pattern.nama}
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleOpenAssignForDate(satpam.uuid, iso)}
                            className="w-8 h-8 rounded-full border border-dashed border-[#C4C4C4] text-[#9CA3AF] text-xs data-[hover=true]:bg-[#F5F7FF]"
                          >
                            +
                          </button>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    );
  };

  const renderContent = () => {
    switch (activeSwitch) {
      case "jadwal":
        return (
          <div className="flex flex-col gap-4">
            <div className="flex flex-row items-center justify-between w-full">
              <div className="left-side flex flex-row items-center gap-4">
                <div className="container-switcher flex flex-row w-fit items-center gap-1 bg-[#F1F1F1] p-1 rounded-4xl">
                  <h2
                    onClick={() => setRangeMode("harian")}
                    className={`text-sm px-4 py-2 rounded-2xl cursor-pointer font-medium transition-colors ${rangeMode === "harian"
                      ? "bg-white text-[#122C93]"
                      : "text-[#6B6B6B]"
                      }`}
                  >
                    Hari Ini
                  </h2>
                  <h2
                    onClick={() => setRangeMode("mingguan")}
                    className={`text-sm px-4 py-2 rounded-2xl cursor-pointer font-medium transition-colors ${rangeMode === "mingguan"
                      ? "bg-white text-[#122C93]"
                      : "text-[#6B6B6B]"
                      }`}
                  >
                    7 Hari
                  </h2>
                </div>
                <div className="container-date-switch flex flex-row gap-3 items-center">
                  <button
                    onClick={handlePrev}
                    className="w-9 h-9 flex items-center justify-center rounded-full bg-white border border-[#E4E9F7] hover:bg-[#F5F7FF] transition-colors"
                  >
                    <IoChevronBack className="text-[#122C93] text-base" />
                  </button>

                  <div className="bg-[#F1F1F1] px-6 py-3 rounded-4xl">
                    <h2 className="text-sm font-medium text-black">
                      {rangeMode === "harian"
                        ? formatTanggal(currentDate)
                        : formatRentangMinggu(currentDate)}
                    </h2>
                  </div>

                  <button
                    onClick={handleNext}
                    className="w-9 h-9 flex items-center justify-center rounded-full bg-white border border-[#E4E9F7] hover:bg-[#F5F7FF] transition-colors"
                  >
                    <IoChevronForward className="text-[#122C93] text-base" />
                  </button>
                </div>
              </div>

              <div className="right-side flex flex-row items-center gap-3">
                <Button
                  className="bg-[#122C93] text-white font-semibold h-10"
                  onPress={handleOpenTambahJadwal}
                >
                  Tambah Jadwal +
                </Button>
              </div>
            </div>

            {rangeMode === "harian"
              ? renderJadwalHarian()
              : renderJadwalMingguan()}
          </div>
        );
      case "shift":
        return (
          <div className="flex flex-col gap-4">
            <div className="flex flex-row items-center justify-between">
              <h2 className="font-semibold text-md text-[#122C93]">
                Konfigurasi Shift
              </h2>

              <Button
                className="bg-[#122C93] text-white font-semibold h-10"
                onPress={handleOpenAddShift}
              >
                Tambah +
              </Button>
            </div>

            <div className="shift-table">
              <ShiftTableNew
                data={shiftTableData}
                page={shiftDataHook.data.currentPage}
                rowsPerPage={shiftDataHook.data.rowsPerPage}
                hasMore={shiftDataHook.data.hasMore}
                isLoading={shiftDataHook.data.isLoading}
                onNextPage={shiftDataHook.handleNextPage}
                onPrevPage={shiftDataHook.handlePrevPage}
                onEdit={handleEditShift}
                onDelete={shiftDataHook.deleteState.confirm}
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col gap-4 p-2.5 overflow-hidden">
      <div className="flex flex-row items-center justify-between mt-2">
        <div className="flex flex-col items-start">
          <h2 className="font-semibold text-2xl text-[#122C93]">
            Manage Penjadwalan Satpam
          </h2>
          <p className="text-sm text-black">
            Kelola jadwal tugas satpam dan pengaturan shift
          </p>
        </div>
      </div>

      <div className="container-switcher flex flex-row w-fit items-center gap-1 bg-[#F1F1F1] p-1 rounded-4xl">
        <h2
          onClick={() => setActiveSwitch("jadwal")}
          className={`text-sm px-4 py-2 rounded-2xl cursor-pointer font-medium transition-colors ${activeSwitch === "jadwal"
            ? "bg-white text-[#122C93]"
            : "text-[#6B6B6B]"
            }`}
        >
          Jadwal Jaga
        </h2>
        <h2
          onClick={() => setActiveSwitch("shift")}
          className={`text-sm px-4 py-2 rounded-2xl cursor-pointer font-medium transition-colors ${activeSwitch === "shift"
            ? "bg-white text-[#122C93]"
            : "text-[#6B6B6B]"
            }`}
        >
          Atur Shift
        </h2>
      </div>

      {renderContent()}

      {/* Modal Tambah/Edit Jadwal Manual */}
      <Modal
        backdrop="opaque"
        isOpen={modalManual.isOpen}
        onClose={handleCloseManual}
        size="4xl"
      >
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
                selectedKeys={
                  manualData.satpam_uuid ? [manualData.satpam_uuid] : []
                }
                onSelectionChange={(k) =>
                  setManualData({
                    ...manualData,
                    satpam_uuid: String(Array.from(k)[0]),
                  })
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
                selectedKeys={
                  manualData.shift_uuid ? [manualData.shift_uuid] : []
                }
                onSelectionChange={(k) =>
                  setManualData({
                    ...manualData,
                    shift_uuid: String(Array.from(k)[0]),
                  })
                }
              >
                {scheduleOptions.listShift.map((s) => (
                  <SelectItem
                    key={s.uuid}
                    textValue={`${s.nama} (${s.mulai.slice(0, 5)} - ${s.selesai.slice(0, 5)})`}
                  >
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
                onChange={(d) =>
                  setManualData({
                    ...manualData,
                    tanggalMulai: d as CalendarDate,
                  })
                }
              />

              <DatePicker
                label={
                  selectedJadwalUuid
                    ? "Ubah s.d. Tanggal (Opsional)"
                    : "Tanggal Akhir (Opsional)"
                }
                variant="underlined"
                labelPlacement="inside"
                isInvalid={!!manualErrors.tanggalAkhir}
                errorMessage={manualErrors.tanggalAkhir}
                value={manualData.tanggalAkhir}
                onChange={(d) =>
                  setManualData({
                    ...manualData,
                    tanggalAkhir: d as CalendarDate,
                  })
                }
              />

              <Select
                label="Pos"
                variant="underlined"
                labelPlacement="inside"
                placeholder="Pilih Pos"
                isInvalid={!!manualErrors.pos_uuid}
                errorMessage={manualErrors.pos_uuid}
                selectedKeys={
                  manualData.pos_uuid ? [manualData.pos_uuid] : []
                }
                onSelectionChange={(k) =>
                  setManualData({
                    ...manualData,
                    pos_uuid: String(Array.from(k)[0]),
                  })
                }
              >
                {scheduleOptions.listPos.map((p) => (
                  <SelectItem key={p.uuid} textValue={p.nama}>
                    {p.nama}
                  </SelectItem>
                ))}
              </Select>
            </div>

            {/* Cuma relevan kalau ada rentang tanggal (Tanggal Akhir/Ubah
                s.d. Tanggal diisi). Tambah: multi-select (pilih beberapa
                hari buat dibuatkan jadwal baru sekaligus). Edit: cuma 1
                (radio) — ini geser SATU hari ke SATU hari lain, bukan
                sinkronisasi banyak hari sekaligus. */}
            <div className="px-3 pb-2">
              <p className="text-sm text-[#6B6B6B] mb-2">Pilih Hari</p>
              {selectedJadwalUuid ? (
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
                    <Checkbox
                      key={day}
                      isSelected={selectedDays.includes(day)}
                      onValueChange={() => toggleDay(day)}
                    >
                      {label}
                    </Checkbox>
                  ))}
                </div>
              )}
            </div>
          </ModalBody>
          <ModalFooter className="flex justify-center pb-8">
            <Button variant="light" color="danger" onPress={handleCloseManual}>
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

      {/* Modal Tambah/Edit Konfigurasi Shift */}
      <Modal
        backdrop="opaque"
        isOpen={modalShiftForm.isOpen}
        onClose={handleCloseShiftForm}
        size="2xl"
      >
        <ModalContent>
          <ModalHeader className="text-[#122C93]">
            {shiftFormHook.formState.selectedId
              ? "Edit Waktu Jadwal"
              : "Tambah Waktu Jadwal"}
          </ModalHeader>
          <ModalBody>
            <div className="container-form flex flex-col gap-6 p-3">
              <Input
                label="Nama Waktu"
                placeholder="Contoh: Shift Pagi"
                variant="underlined"
                labelPlacement="inside"
                value={shiftFormHook.formState.formData.nama}
                maxLength={21}
                minLength={1}
                isInvalid={!!shiftFormHook.formState.errors.nama}
                errorMessage={shiftFormHook.formState.errors.nama}
                onChange={(e) =>
                  shiftFormHook.setFormData({
                    ...shiftFormHook.formState.formData,
                    nama: e.target.value,
                  })
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
                  value={shiftFormHook.formState.formData.mulai}
                  isInvalid={!!shiftFormHook.formState.errors.mulai}
                  errorMessage={shiftFormHook.formState.errors.mulai}
                  onChange={(e) =>
                    shiftFormHook.setFormData({
                      ...shiftFormHook.formState.formData,
                      mulai: e.target.value,
                    })
                  }
                />
                <Input
                  className="w-full"
                  label="Jam Selesai"
                  type="time"
                  variant="underlined"
                  labelPlacement="inside"
                  step="1"
                  value={shiftFormHook.formState.formData.selesai}
                  isInvalid={!!shiftFormHook.formState.errors.selesai}
                  errorMessage={shiftFormHook.formState.errors.selesai}
                  onChange={(e) =>
                    shiftFormHook.setFormData({
                      ...shiftFormHook.formState.formData,
                      selesai: e.target.value,
                    })
                  }
                />
              </div>
              {!shiftFormHook.formState.selectedId && (
                <p className="text-xs text-gray-400 italic mt-[-10px]">
                  * Timezone akan otomatis terdeteksi: {getDeviceTimezone()}
                </p>
              )}
            </div>
          </ModalBody>
          <ModalFooter className="flex justify-center pb-8">
            <Button
              variant="light"
              color="danger"
              onPress={handleCloseShiftForm}
            >
              Batal
            </Button>
            <Button
              className="bg-[#122C93] text-white px-10"
              onPress={shiftFormHook.actions.handleSubmit}
              isLoading={shiftFormHook.formState.isSubmitting}
            >
              {shiftFormHook.formState.selectedId ? "Update" : "Simpan"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <DeleteConfirmationModal
        isOpen={shiftDataHook.deleteState.isOpen}
        onClose={() => shiftDataHook.deleteState.setIsOpen(false)}
        onConfirm={shiftDataHook.deleteState.execute}
        isLoading={shiftDataHook.deleteState.isDeleting}
        title="Hapus Konfigurasi Shift"
        message="Apakah anda yakin ingin menghapus shift ini?"
      />

      <DeleteConfirmationModal
        isOpen={jadwalDeleteModal.isOpen}
        onClose={() => jadwalDeleteModal.onOpenChange()}
        onConfirmScoped={executeDeleteJadwal}
        isLoading={isDeletingJadwal}
        title="Hapus Jadwal"
        message="Apakah anda yakin ingin menghapus jadwal ini?"
      />
    </div>
  );
};

export default ClientPenjadwalanSatpam;
