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
  useDisclosure,
} from "@heroui/react";
import { FiSearch } from "react-icons/fi";
import ShiftTableNew, { type ShiftData } from "../shifts/ShiftTableNew";
import { DeleteConfirmationModal } from "../common/DeleteConfirmationModal";
import { useShiftData } from "../../hooks/useShiftData";
import { useShiftForm } from "../../hooks/useShiftForm";
import { getDeviceTimezone } from "../../Utils/helpers";

const ShiftConfigSection = () => {
  const shiftDataHook = useShiftData();
  const shiftFormHook = useShiftForm({
    onSuccess: () => {
      if (!shiftFormHook.formState.selectedId) shiftDataHook.setPage(1);
      shiftDataHook.refreshData();
    },
    onClose: () => modalShiftForm.onOpenChange(),
  });
  const modalShiftForm = useDisclosure();

  const shiftTableData: ShiftData[] = shiftDataHook.data.listWaktu.map((s) => ({
    uuid: s.uuid,
    nama_shift: s.nama,
    jam_mulai: s.mulai ? s.mulai.slice(0, 5) : "-",
    jam_selesai: s.selesai ? s.selesai.slice(0, 5) : "-",
  }));

  const handleOpenAddShift = () => {
    shiftFormHook.actions.resetForm();
    modalShiftForm.onOpen();
  };

  const handleEditShift = async (uuid: string) => {
    await shiftFormHook.actions.loadData(uuid);
    modalShiftForm.onOpen();
  };

  const handleCloseShiftForm = () => {
    shiftFormHook.actions.resetForm();
    modalShiftForm.onOpenChange();
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <div className="flex flex-row items-center justify-between">
          <h2 className="font-semibold text-md text-[#122C93]">Konfigurasi Shift</h2>
        </div>

        <div className="container-search rounded-2xl flex flex-row gap-3 items-center bg-[#FFFFFF] p-3 border border-[#E4E9F7]">
          <div className="flex flex-row items-center gap-2 bg-white border border-[#E4E9F7] rounded-xl px-4 h-11 flex-1">
            <FiSearch className="text-[#B0B0B0] text-base flex-shrink-0" />
            <input
              type="search"
              placeholder="Cari shift..."
              className="bg-transparent text-sm text-gray-700 placeholder:text-[#B0B0B0] outline-none w-full h-full"
              value={shiftDataHook.search}
              onChange={(e) => shiftDataHook.setSearch(e.target.value)}
            />
          </div>

          <Select
            className="w-32"
            placeholder="Tampilkan"
            selectedKeys={[shiftDataHook.limit.toString()]}
            onChange={(e) => {
              const newLimit = parseInt(e.target.value);
              if (!isNaN(newLimit)) shiftDataHook.setLimit(newLimit);
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

          <Button
            className="bg-[#122C93] text-white font-semibold h-11 rounded-xl px-6"
            onPress={handleOpenAddShift}
          >
            Tambah +
          </Button>
        </div>
      </div>

      <div className="shift-table mt-4">
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

      <Modal backdrop="opaque" isOpen={modalShiftForm.isOpen} onClose={handleCloseShiftForm} size="2xl">
        <ModalContent>
          <ModalHeader className="text-[#122C93]">
            {shiftFormHook.formState.selectedId ? "Edit Waktu Jadwal" : "Tambah Waktu Jadwal"}
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
                  shiftFormHook.setFormData({ ...shiftFormHook.formState.formData, nama: e.target.value })
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
                    shiftFormHook.setFormData({ ...shiftFormHook.formState.formData, mulai: e.target.value })
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
                    shiftFormHook.setFormData({ ...shiftFormHook.formState.formData, selesai: e.target.value })
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
            <Button variant="light" color="danger" onPress={handleCloseShiftForm}>
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
    </div>
  );
};

export default ShiftConfigSection;
