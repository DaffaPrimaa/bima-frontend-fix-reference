import { Button, useDisclosure, Select, SelectItem } from "@heroui/react";
import { FaDownload } from "react-icons/fa";
import { FiSearch } from "react-icons/fi";
import { useAttendanceData } from "../hooks/useAttendanceData";
import { useAttendanceForm } from "../hooks/useAttendanceForm";
import { useAttendanceExport } from "../hooks/useAttendanceExport";
import { AttendanceTable } from "../Components/attendance/AttendanceTable";
import { AttendanceEditModal } from "../Components/attendance/AttendanceEditModal";
import { MessageModal } from "../Components/attendance/MessageModal";
import { useState } from "react";

const AdminRekapAbsensi = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const {
    isOpen: isMessageOpen,
    onOpen: onMessageOpen,
    onClose: onMessageClose,
  } = useDisclosure();
  const [selectedSatpamUuid, setSelectedSatpamUuid] = useState<string | null>(null);

  const {
    data,
    setLimit,
    setSearch,
    setStatus,
    setFilterClient,
    handleNextPage,
    handlePrevPage,
    refreshData
  } = useAttendanceData();
  const { isDownloading, handleDownload, handleDownloadById } = useAttendanceExport();

  const formHook = useAttendanceForm({
    onSuccess: refreshData,
    onClose: () => onOpenChange(),
  });

  const handleOpenEdit = async (uuid: string) => {
    await formHook.actions.loadData(uuid);
    onOpen();
  };

  const handleOpenMessage = (satpamUuid: string) => {
    setSelectedSatpamUuid(satpamUuid);
    onMessageOpen();
  };

  return (
    <div className="flex flex-col gap-10 p-5">
      <div className="container-content flex flex-col gap-4">
        <div className="header-container flex flex-row items-center justify-between mt-5">
          <h2 className="font-semibold text-[25px] text-[#122C93]">
            Rekap Absensi Satpam
          </h2>
          <Button
            onPress={handleDownload}
            isLoading={isDownloading}
            className="bg-[#122C93] text-white font-semibold h-12 px-6"
            startContent={!isDownloading && <FaDownload />}
          >
            Download
          </Button>
        </div>

        {/* Filters */}
        <div className="container-search rounded-2xl flex flex-row gap-3 items-center bg-[#FFFFFF] p-3 border border-[#E4E9F7]">
          <div className="flex flex-row items-center gap-2 bg-white border border-[#E4E9F7] rounded-xl px-4 h-11 flex-1">
            <FiSearch className="text-[#B0B0B0] text-base flex-shrink-0" />
            <input
              type="search"
              placeholder="Cari satpam..."
              className="bg-transparent text-sm text-gray-700 placeholder:text-[#B0B0B0] outline-none w-full h-full"
              value={data.search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <Select
            className="w-48"
            placeholder="Semua Status"
            selectedKeys={[data.status]}
            onChange={(e) => setStatus(e.target.value)}
            classNames={{
              trigger:
                "bg-white border border-[#E4E9F7] rounded-xl shadow-none h-11 min-h-11 data-[hover=true]:bg-white",
              value: "text-[#8D8787] text-sm",
            }}
          >
            {[
              { key: "all", label: "Semua Status" },
              { key: "present", label: "Hadir" },
              { key: "late", label: "Terlambat" },
              { key: "partial", label: "Hadir Sebagian" },
              { key: "absent", label: "Alpha" },
              { key: "excused", label: "Izin" },
            ].map((c) => (
              <SelectItem key={c.key} textValue={c.label}>
                {c.label}
              </SelectItem>
            ))}
          </Select>

          {data.userRole !== "client" && (
            <Select
              className="w-48"
              placeholder="Semua Client"
              selectedKeys={[data.filterClient]}
              onChange={(e) => setFilterClient(e.target.value || "all")}
              classNames={{
                trigger:
                  "bg-white border border-[#E4E9F7] rounded-xl shadow-none h-11 min-h-11 data-[hover=true]:bg-white",
                value: "text-[#8D8787] text-sm",
              }}
            >
              {[
                <SelectItem key="all">Semua Client</SelectItem>,
                ...data.mitraOptions.map((c) => (
                  <SelectItem key={c.uuid}>{c.nama}</SelectItem>
                )),
              ]}
            </Select>
          )}

          <Select
            className="w-32"
            placeholder="Tampilkan"
            selectedKeys={[data.limit.toString()]}
            onChange={(e) => {
              const newLimit = parseInt(e.target.value);
              if (!isNaN(newLimit)) setLimit(newLimit);
            }}
            classNames={{
              trigger:
                "bg-white border border-[#E4E9F7] rounded-xl shadow-none h-11 min-h-11 data-[hover=true]:bg-white",
              value: "text-[#8D8787] text-sm",
            }}
          >
            {[5, 10, 15, 20, 25, 30, 35, 40, 45, 50].map((pageSize) => (
              <SelectItem key={pageSize.toString()} textValue={`${pageSize} Data`}>
                {pageSize} Data
              </SelectItem>
            ))}
          </Select>
        </div>

        <AttendanceTable
          data={data.dataAbsen}
          isLoading={data.isLoading}
          currentPage={data.currentPage}
          hasMore={data.hasMore}
          limit={data.limit}
          onNextPage={handleNextPage}
          onPrevPage={handlePrevPage}
          onEdit={handleOpenEdit}
          onDownload={handleDownloadById}
          onMessage={handleOpenMessage}
        />

        <AttendanceEditModal
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          formHook={formHook}
        />

        <MessageModal
          isOpen={isMessageOpen}
          onClose={onMessageClose}
          satpamUuid={selectedSatpamUuid}
        />
      </div>
    </div>
  );
};

export default AdminRekapAbsensi;
