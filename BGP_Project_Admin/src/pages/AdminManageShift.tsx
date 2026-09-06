import { Button, useDisclosure } from "@heroui/react";
import { useScheduleData } from "../hooks/useScheduleData";
import { useScheduleForm } from "../hooks/useScheduleForm";
import { useGenerateSchedule } from "../hooks/useGenerateSchedule";
import { useScheduleOptions } from "../hooks/useScheduleOptions";
import { ScheduleTable } from "../Components/schedule/ScheduleTable";
import { ScheduleFormModal } from "../Components/schedule/ScheduleFormModal";
import { GenerateScheduleModal } from "../Components/schedule/GenerateScheduleModal";
import { DeleteConfirmationModal } from "../Components/common/DeleteConfirmationModal";

const AdminManageShift = () => {
  const {
    isOpen: isOpenGenerate,
    onOpen: onOpenGenerate,
    onOpenChange: onGenerateChange,
  } = useDisclosure();
  const {
    isOpen: isOpenForm,
    onOpen: onOpenForm,
    onOpenChange: onFormChange,
  } = useDisclosure();

  const { data, setPage, refreshData, deleteState } = useScheduleData();
  const options = useScheduleOptions(isOpenForm || isOpenGenerate);

  const formHook = useScheduleForm({
    onSuccess: () => {
      if (!formHook.formState.selectedUuid) setPage(1);
      refreshData();
    },
    onClose: () => onFormChange(),
    listSatpam: options.listSatpam,
    listPos: options.listPos,
    listShift: options.listShift,
    dataJadwal: data.dataJadwal,
  });

  const generateHook = useGenerateSchedule(
    () => {
      setPage(1);
      refreshData();
    },
    () => onGenerateChange(),
  );

  const handleOpenAdd = () => {
    formHook.actions.resetForm();
    onOpenForm();
  };

  const handleOpenEdit = async (uuid: string) => {
    await formHook.actions.loadData(uuid);
    onOpenForm();
  };

  return (
    <div className="flex flex-col p-5">
      <div className="container-content flex flex-col gap-4">
        <div className="header-container flex flex-row items-center justify-between mt-5">
          <h2 className="font-semibold text-[25px] text-[#122C93]">
            Manage Shift
          </h2>
          <div className="container-generate flex flex-row gap-5">
            <Button
              onPress={onOpenGenerate}
              className="bg-[#122C93] text-white font-semibold h-10"
            >
              Generate Jadwal +
            </Button>
            <Button
              onPress={handleOpenAdd}
              className="bg-[#122C93] text-white font-semibold h-10"
            >
              Tambah +
            </Button>
          </div>
        </div>

        <div className="table-section-container mt-6">
          <ScheduleTable
            data={data.dataJadwal}
            isLoading={data.isLoading}
            page={data.page}
            totalPages={data.totalPages}
            rowsPerPage={data.rowsPerPage}
            onPageChange={setPage}
            onEdit={handleOpenEdit}
            onDelete={deleteState.confirm}
          />
        </div>

        <GenerateScheduleModal
          isOpen={isOpenGenerate}
          onOpenChange={onGenerateChange}
          hook={generateHook}
          options={options}
        />

        <ScheduleFormModal
          isOpen={isOpenForm}
          onOpenChange={onFormChange}
          formHook={formHook}
          options={options}
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

export default AdminManageShift;
