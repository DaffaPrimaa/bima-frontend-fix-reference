import { useState } from "react";
import { Button, useDisclosure, RadioGroup, Radio } from "@heroui/react";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import { useShiftPatternData } from "../hooks/useShiftPatternData";
import { useScheduleOptions } from "../hooks/useScheduleOptions";
import { useJadwalSatpam, toIsoDate } from "../hooks/useJadwalSatpam";
import { parseDate } from "@internationalized/date";
import type { Jadwal } from "../types/schedule";

// Components
import { DeleteConfirmationModal } from "../Components/common/DeleteConfirmationModal";
import AssignJadwalModal from "../Components/penjadwalan/AssignJadwalModal";
import AssignPerHariModal from "../Components/penjadwalan/AssignPerHariModal";
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
    deleteJadwalTarget,
    deleteMode,
    setDeleteMode,
  } = useJadwalSatpam("jadwal");

  const scheduleOptions = useScheduleOptions(activeSwitch === "jadwal");

  // Fetch shiftData exclusively for JadwalHarianView so we can map through them
  // We don't need the pagination state here since that's handled inside ShiftConfigSection
  const { data: shiftData } = useShiftPatternData();

  // === Modal States ===
  const [selectedJadwalUuid, setSelectedJadwalUuid] = useState<string | null>(null);
  const {
    isOpen: isManualOpen,
    onOpen: onManualOpen,
    onClose: onManualClose,
  } = useDisclosure();
  const [manualInitialData, setManualInitialData] = useState<any>();

  const [selectedJadwalItem, setSelectedJadwalItem] = useState<Jadwal | null>(null);
  const {
    isOpen: isAssignPerHariOpen,
    onOpen: onAssignPerHariOpen,
    onClose: onAssignPerHariClose,
  } = useDisclosure();
  const [assignPerHariInitialData, setAssignPerHariInitialData] = useState<any>();

  // === Handlers for Assigning / Editing ===
  const handleOpenTambahJadwal = () => {
    setSelectedJadwalUuid(null);
    setManualInitialData({
      tanggalMulai: undefined,
      tanggalAkhir: undefined,
      pos_uuid: "",
      satpam_uuid: "",
      shift_uuid: "",
      selectedDays: [1, 2, 3, 4, 5, 6, 0],
    });
    onManualOpen();
  };

  const handleOpenAssign = (shiftUuid: string) => {
    setSelectedJadwalUuid(null);
    setManualInitialData({
      tanggalMulai: parseDate(toIsoDate(currentDate)),
      tanggalAkhir: undefined,
      pos_uuid: "",
      satpam_uuid: "",
      shift_uuid: shiftUuid,
      selectedDays: [1, 2, 3, 4, 5, 6, 0],
    });
    onManualOpen();
  };

  const handleOpenAssignForDate = (satpamUuid: string, dateIso: string) => {
    setSelectedJadwalItem(null);
    setAssignPerHariInitialData({
      satpam_uuid: satpamUuid,
      tanggal: dateIso,
      shift_uuid: "",
      pos_uuid: scheduleOptions.listPos.length > 0 ? scheduleOptions.listPos[0].uuid : "",
    });
    onAssignPerHariOpen();
  };

  const handleEditJadwalInstance = (item: Jadwal) => {
    setSelectedJadwalItem(item);
    setAssignPerHariInitialData({
      satpam_uuid: item.satpam.uuid,
      tanggal: String(item.work_date).split("T")[0],
      shift_uuid: item.pattern.uuid,
      pos_uuid: item.pos.uuid,
    });
    onAssignPerHariOpen();
  };

  const formatTanggal = (date: Date) => {
    return date.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const formatRentangMinggu = (date: Date) => {
    const dayOfWeek = date.getDay();
    const start = new Date(date);
    start.setDate(start.getDate() - dayOfWeek);

    const end = new Date(start);
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

  return (
    <div className="manage-penjadwalan-satpam-container p-6">
      <div className="title flex flex-col gap-1 items-start">
        <h1 className="text-xl font-bold text-[#122C93]">Manajemen Shift & Penjadwalan</h1>
        <p className="text-[#8D8787] text-sm">
          Kelola jam kerja, atur posisi satpam, dan atur jadwal tugas untuk memastikan operasional harian yang lancar dan terorganisir.
        </p>
      </div>

      {/* Switcher & Header */}
      <div className="header-actions flex flex-row items-center justify-between mb-5 w-full mt-6">
        <div className="left-side flex flex-row items-center gap-5 flex-1">
          <div className="container-switcher flex flex-row w-fit items-center gap-1 bg-[#F1F1F1] p-1 rounded-4xl">
            <h2
              onClick={() => setActiveSwitch("jadwal")}
              className={`text-sm px-4 py-2 rounded-2xl cursor-pointer font-medium transition-colors ${activeSwitch === "jadwal" ? "bg-white text-[#122C93]" : "text-[#6B6B6B]"
                }`}
            >
              Jadwal Jaga
            </h2>
            <h2
              onClick={() => setActiveSwitch("shift")}
              className={`text-sm px-4 py-2 rounded-2xl cursor-pointer font-medium transition-colors ${activeSwitch === "shift" ? "bg-white text-[#122C93]" : "text-[#6B6B6B]"
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
                  className={`text-sm px-4 py-2 rounded-2xl cursor-pointer font-medium transition-colors ${rangeMode === "harian" ? "bg-white text-[#122C93]" : "text-[#6B6B6B]"
                    }`}
                >
                  Hari Ini
                </h2>
                <h2
                  onClick={() => setRangeMode("mingguan")}
                  className={`text-sm px-4 py-2 rounded-2xl cursor-pointer font-medium transition-colors ${rangeMode === "mingguan" ? "bg-white text-[#122C93]" : "text-[#6B6B6B]"
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
              shiftData={shiftData}
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
        isOpen={isManualOpen}
        onClose={onManualClose}
        scheduleOptions={scheduleOptions}
        onSuccess={fetchAllJadwal}
        selectedJadwalUuid={selectedJadwalUuid}
        initialData={manualInitialData}
      />

      <AssignPerHariModal
        isOpen={isAssignPerHariOpen}
        onClose={onAssignPerHariClose}
        scheduleOptions={scheduleOptions}
        onSuccess={fetchAllJadwal}
        selectedJadwalItem={selectedJadwalItem}
        initialData={assignPerHariInitialData}
      />

      <DeleteConfirmationModal
        isOpen={jadwalDeleteModal.isOpen}
        onClose={jadwalDeleteModal.onClose}
        onConfirm={executeDeleteJadwal}
        title="Konfirmasi Hapus Jadwal"
        message="Apakah anda yakin ingin menghapus jadwal ini?"
      >
        {deleteJadwalTarget && (deleteJadwalTarget.assignment_uuid || deleteJadwalTarget.assignment?.uuid) && (
          <div className="mt-4 text-left">
            <RadioGroup
              label="Terapkan penghapusan pada:"
              value={deleteMode}
              onValueChange={(val) => setDeleteMode(val as "single" | "future")}
              size="sm"
            >
              <Radio value="single">Hanya hari ini saja</Radio>
              <Radio value="future">Mulai hari ini & seterusnya</Radio>
            </RadioGroup>
          </div>
        )}
      </DeleteConfirmationModal>
    </div>
  );
};

export default ClientPenjadwalanSatpam;
