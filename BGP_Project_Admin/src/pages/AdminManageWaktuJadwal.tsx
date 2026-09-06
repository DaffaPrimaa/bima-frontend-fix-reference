import { Button, useDisclosure } from "@heroui/react";
import { useShiftData } from "../hooks/useShiftData";
import { useShiftForm } from "../hooks/useShiftForm";
import { ShiftTable } from "../Components/shifts/ShiftTable";
import { ShiftFormModal } from "../Components/shifts/ShiftFormModal";
import { DeleteConfirmationModal } from "../Components/common/DeleteConfirmationModal";

const AdminManageWaktuJadwal = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { data, setPage, refreshData, deleteState } = useShiftData();

  const formHook = useShiftForm({
    onSuccess: () => {
      if (!formHook.formState.selectedId) setPage(1);
      refreshData();
    },
    onClose: () => onOpenChange(),
  });

  const handleOpenAdd = () => {
    formHook.actions.resetForm();
    onOpen();
  };

  const handleOpenEdit = async (uuid: string) => {
    await formHook.actions.loadData(uuid);
    onOpen();
  };

  return (
    <div className="flex flex-col p-5">
      <div className="container-content flex flex-col gap-4">
        <div className="header-container flex flex-row items-center justify-between mt-5">
          <h2 className="font-semibold text-[25px] text-[#122C93]">
            Manage Waktu Jadwal
          </h2>
          <Button
            onPress={handleOpenAdd}
            className="bg-[#122C93] text-white font-semibold w-30 h-12 text-[16px]"
          >
            Tambah +
          </Button>
        </div>

        <div className="table-section-container mt-6">
          <ShiftTable
            data={data.listWaktu}
            isLoading={data.isLoading}
            page={data.page}
            totalPages={data.totalPages}
            rowsPerPage={data.rowsPerPage}
            onPageChange={setPage}
            onEdit={handleOpenEdit}
            onDelete={deleteState.confirm}
          />
        </div>

        <ShiftFormModal
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          formHook={formHook}
        />

        <DeleteConfirmationModal
          isOpen={deleteState.isOpen}
          onClose={() => deleteState.setIsOpen(false)}
          onConfirm={deleteState.execute}
          isLoading={deleteState.isDeleting}
        />
      </div>
    </div>
  );
};

export default AdminManageWaktuJadwal;
