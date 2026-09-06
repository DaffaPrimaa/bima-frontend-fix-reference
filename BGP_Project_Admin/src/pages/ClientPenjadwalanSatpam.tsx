import { useState } from "react";
import { Button, useDisclosure } from "@heroui/react";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import { CalendarDate, parseDate } from "@internationalized/date";
import { useShiftData } from "../hooks/useShiftData";
import { useScheduleOptions } from "../hooks/useScheduleOptions";
import { useJadwalSatpam, toIsoDate } from "../hooks/useJadwalSatpam";
import type { Jadwal } from "../types/schedule";

import { DeleteConfirmationModal } from "../Components/common/DeleteConfirmationModal";
import AssignJadwalModal from "../Components/penjadwalan/AssignJadwalModal";
import JadwalHarianView from "../Components/penjadwalan/JadwalHarianView";
import JadwalMingguanView from "../Components/penjadwalan/JadwalMingguanView";
import ShiftConfigSection from "../Components/penjadwalan/ShiftConfigSection";

const ClientPenjadwalanSatpam = () => {
  const {
    activeSwitch,
    setActiveSwitch,
    rangeMode,
    setRangeMode,
    currentDate,
    allJadwal,
    isJadwalLoading,
    fetchAllJadwal,
    handlePrev,
    handleNext,
    jadwalDeleteModal,
    confirmDeleteJadwal,
    executeDeleteJadwal,
    isDeletingJadwal,
  } = useJadwalSatpam("jadwal");

  const scheduleOptions = useScheduleOptions(activeSwitch === "jadwal");

  // Dipakai cuma buat daftar shift di JadwalHarianView — pagination
  // konfigurasi shift sendiri sepenuhnya ada di dalam ShiftConfigSection.
  const shiftDataHook = useShiftData();

  // === Modal Tambah/Edit Jadwal (AssignJadwalModal — 1 modal buat semua:
  // Tambah baru, assign ke satu tanggal kosong, dan edit termasuk geser
  // rentang tanggal + Pilih Hari) ===
  const modalManual = useDisclosure();
  const [selectedJadwalItem, setSelectedJadwalItem] = useState<Jadwal | null>(null);
  const [manualInitialData, setManualInitialData] = useState<{
    tanggalMulai?: CalendarDate;
    pos_uuid?: string;
    satpam_uuid?: string;
    shift_uuid?: string;
  }>();

  const handleOpenTambahJadwal = () => {
    setSelectedJadwalItem(null);
    setManualInitialData(undefined);
    modalManual.onOpen();
  };

  const handleOpenAssign = (shiftUuid: string) => {
    setSelectedJadwalItem(null);
    setManualInitialData({
      tanggalMulai: parseDate(toIsoDate(currentDate)),
      shift_uuid: shiftUuid,
    });
    modalManual.onOpen();
  };

  const handleOpenAssignForDate = (satpamUuid: string, dateIso: string) => {
    setSelectedJadwalItem(null);
    setManualInitialData({
      tanggalMulai: parseDate(dateIso),
      satpam_uuid: satpamUuid,
    });
    modalManual.onOpen();
  };

  const handleEditJadwalInstance = (item: Jadwal) => {
    setSelectedJadwalItem(item);
    setManualInitialData(undefined);
    modalManual.onOpen();
  };

  const formatTanggal = (date: Date) =>
    date.toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" });

  const formatRentangMinggu = (date: Date) => {
    const dayOfWeek = date.getDay();
    const start = new Date(date);
    start.setDate(start.getDate() - dayOfWeek);
    const end = new Date(start);
    end.setDate(start.getDate() + 6);

    const startLabel = start.toLocaleDateString("id-ID", { day: "2-digit", month: "long" });
    const endLabel = end.toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" });
    return `${startLabel} - ${endLabel}`;
  };

  return (
    <div className="manage-penjadwalan-satpam-container p-6">
      <div className="title flex flex-col gap-1 items-start">
        <h1 className="text-xl font-bold text-[#122C93]">Manajemen Shift &amp; Penjadwalan</h1>
        <p className="text-[#8D8787] text-sm">
          Kelola jam kerja, atur posisi satpam, dan atur jadwal tugas untuk memastikan operasional harian yang
          lancar dan terorganisir.
        </p>
      </div>

      {/* Switcher Jadwal Jaga / Atur Shift */}
      <div className="header-actions flex flex-row items-center justify-between mb-5 w-full mt-6">
        <div className="left-side flex flex-row items-center gap-5 flex-1">
          <div className="container-switcher flex flex-row w-fit items-center gap-1 bg-[#F1F1F1] p-1 rounded-4xl">
            <h2
              onClick={() => setActiveSwitch("jadwal")}
              className={`text-sm px-4 py-2 rounded-2xl cursor-pointer font-medium transition-colors ${
                activeSwitch === "jadwal" ? "bg-white text-[#122C93]" : "text-[#6B6B6B]"
              }`}
            >
              Jadwal Jaga
            </h2>
            <h2
              onClick={() => setActiveSwitch("shift")}
              className={`text-sm px-4 py-2 rounded-2xl cursor-pointer font-medium transition-colors ${
                activeSwitch === "shift" ? "bg-white text-[#122C93]" : "text-[#6B6B6B]"
              }`}
            >
              Atur Shift
            </h2>
          </div>
        </div>
      </div>

      {activeSwitch === "jadwal" ? (
        <div className="flex flex-col gap-4">
          <div className="flex flex-row items-center justify-between w-full">
            <div className="left-side flex flex-row items-center gap-4">
              <div className="container-switcher flex flex-row w-fit items-center gap-1 bg-[#F1F1F1] p-1 rounded-4xl">
                <h2
                  onClick={() => setRangeMode("harian")}
                  className={`text-sm px-4 py-2 rounded-2xl cursor-pointer font-medium transition-colors ${
                    rangeMode === "harian" ? "bg-white text-[#122C93]" : "text-[#6B6B6B]"
                  }`}
                >
                  Hari Ini
                </h2>
                <h2
                  onClick={() => setRangeMode("mingguan")}
                  className={`text-sm px-4 py-2 rounded-2xl cursor-pointer font-medium transition-colors ${
                    rangeMode === "mingguan" ? "bg-white text-[#122C93]" : "text-[#6B6B6B]"
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
                    {rangeMode === "harian" ? formatTanggal(currentDate) : formatRentangMinggu(currentDate)}
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

            <Button
              className="bg-[#122C93] text-white font-semibold h-11 rounded-xl px-6"
              onPress={handleOpenTambahJadwal}
            >
              Tambah Jadwal +
            </Button>
          </div>

          {rangeMode === "harian" ? (
            <JadwalHarianView
              currentDateIso={toIsoDate(currentDate)}
              isJadwalLoading={isJadwalLoading}
              shiftData={shiftDataHook.data.listWaktu.map((s) => ({
                uuid: s.uuid,
                nama: s.nama,
                mulai: s.mulai,
                selesai: s.selesai,
              }))}
              allJadwal={allJadwal}
              handleOpenAssign={handleOpenAssign}
              handleEditJadwalInstance={handleEditJadwalInstance}
              confirmDeleteJadwal={confirmDeleteJadwal}
            />
          ) : (
            <JadwalMingguanView
              currentDate={currentDate}
              allJadwal={allJadwal}
              listSatpam={scheduleOptions.listSatpam}
              handleEditJadwalInstance={handleEditJadwalInstance}
              handleOpenAssignForDate={handleOpenAssignForDate}
            />
          )}
        </div>
      ) : (
        <ShiftConfigSection />
      )}

      <AssignJadwalModal
        isOpen={modalManual.isOpen}
        onClose={modalManual.onClose}
        scheduleOptions={scheduleOptions}
        onSuccess={fetchAllJadwal}
        selectedJadwalItem={selectedJadwalItem}
        initialData={manualInitialData}
      />

      <DeleteConfirmationModal
        isOpen={jadwalDeleteModal.isOpen}
        onClose={jadwalDeleteModal.onClose}
        onConfirmScoped={executeDeleteJadwal}
        isLoading={isDeletingJadwal}
        title="Hapus Jadwal"
        message="Apakah anda yakin ingin menghapus jadwal ini?"
      />
    </div>
  );
};

export default ClientPenjadwalanSatpam;
