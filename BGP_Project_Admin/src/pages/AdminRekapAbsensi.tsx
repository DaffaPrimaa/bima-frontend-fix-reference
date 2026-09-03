import { Button, useDisclosure } from "@heroui/react";
import { FaDownload } from "react-icons/fa";
import { useAttendanceData } from "../hooks/useAttendanceData";
import { useAttendanceForm } from "../hooks/useAttendanceForm";
import { useAttendanceExport } from "../hooks/useAttendanceExport";
import { AttendanceTable } from "../Components/attendance/AttendanceTable";
import { AttendanceEditModal } from "../Components/attendance/AttendanceEditModal";

const AdminRekapAbsensi = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { data, handleNextPage, handlePrevPage, refreshData } = useAttendanceData();
  const { isDownloading, handleDownload } = useAttendanceExport();

  const formHook = useAttendanceForm({
    onSuccess: refreshData,
    onClose: () => onOpenChange(),
  });

  const handleOpenEdit = async (uuid: string) => {
    await formHook.actions.loadData(uuid);
    onOpen();
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

        <AttendanceTable
          data={data.dataAbsen}
          isLoading={data.isLoading}
          currentPage={data.currentPage}
          hasMore={data.hasMore}
          rowsPerPage={data.rowsPerPage}
          onNextPage={handleNextPage}
          onPrevPage={handlePrevPage}
          onEdit={handleOpenEdit}
        />

        <AttendanceEditModal
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          formHook={formHook}
        />
      </div>
    </div>
  );
};

export default AdminRekapAbsensi;
