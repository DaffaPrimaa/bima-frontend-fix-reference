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
  addToast,
  useDisclosure,
} from "@heroui/react";
import { useState } from "react";
import { FiSearch } from "react-icons/fi";
import ShiftTableNew from "./../shifts/ShiftTableNew";
import { DeleteConfirmationModal } from "../common/DeleteConfirmationModal";
import { useShiftPatternData } from "../../hooks/useShiftPatternData";
import { shiftPatternService } from "../../services/shiftPatternService";
import { getDeviceTimezone } from "../../Utils/helpers";

const ShiftConfigSection = () => {
  const {
    data: shiftData,
    isLoading: isShiftLoading,
    search: shiftSearch,
    setSearch: setShiftSearch,
    limit: shiftLimit,
    setLimit: setShiftLimit,
    hasMore: shiftHasMore,
    currentPageIndex: shiftCurrentPage,
    handleNextPage: handleShiftNextPage,
    handlePrevPage: handleShiftPrevPage,
    refreshData: refreshShiftData,
  } = useShiftPatternData();

  const [deleteShiftId, setDeleteShiftId] = useState<string | null>(null);

  const modalShiftForm = useDisclosure();
  const [selectedShiftId, setSelectedShiftId] = useState<string | null>(null);
  const [shiftFormData, setShiftFormData] = useState({
    nama: "",
    mulai: "",
    selesai: "",
  });
  const [shiftFormErrors, setShiftFormErrors] = useState<Record<string, string | undefined>>({});
  const [isShiftFormSubmitting, setIsShiftFormSubmitting] = useState(false);

  const handleEditShift = async (uuid: string) => {
    try {
      const res = await shiftPatternService.getById(uuid);
      setShiftFormData({
        nama: res.data.nama,
        mulai: res.data.start_local,
        selesai: res.data.end_local,
      });
      setSelectedShiftId(uuid);
      modalShiftForm.onOpen();
    } catch (err: any) {
      addToast({
        title: "Gagal",
        description: err.message || "Gagal mengambil detail shift",
        variant: "flat",
        color: "danger",
        timeout: 3000,
      });
    }
  };

  const confirmDeleteShift = (uuid: string) => {
    setDeleteShiftId(uuid);
  };

  const handleDeleteShift = async () => {
    if (!deleteShiftId) return;
    try {
      await shiftPatternService.delete(deleteShiftId);
      addToast({
        title: "Berhasil",
        description: "Berhasil menghapus shift",
        variant: "flat",
        color: "success",
        timeout: 3000,
      });
      refreshShiftData();
    } catch (err: any) {
      addToast({
        title: "Gagal",
        description: err.message || "Gagal menghapus shift",
        variant: "flat",
        color: "danger",
        timeout: 3000,
      });
    } finally {
      setDeleteShiftId(null);
    }
  };

  const resetShiftForm = () => {
    setShiftFormData({ nama: "", mulai: "", selesai: "" });
    setShiftFormErrors({});
    setSelectedShiftId(null);
  };

  const handleCloseShiftForm = () => {
    resetShiftForm();
    modalShiftForm.onOpenChange();
  };

  const handleShiftFormSubmit = async () => {
    const errors: Record<string, string> = {};
    if (!shiftFormData.nama) errors.nama = "Nama wajib diisi";
    if (!shiftFormData.mulai) errors.mulai = "Jam mulai wajib diisi";
    if (!shiftFormData.selesai) errors.selesai = "Jam selesai wajib diisi";

    if (Object.keys(errors).length > 0) {
      setShiftFormErrors(errors);
      return;
    }

    setIsShiftFormSubmitting(true);
    try {
      const payload = {
        nama: shiftFormData.nama,
        start_local: shiftFormData.mulai,
        end_local: shiftFormData.selesai,
        timezone: getDeviceTimezone(),
      };

      if (selectedShiftId) {
        await shiftPatternService.update(selectedShiftId, payload);
        addToast({
          title: "Berhasil",
          description: "Berhasil mengubah shift",
          variant: "flat",
          color: "success",
          timeout: 3000,
        });
      } else {
        await shiftPatternService.create(payload);
        addToast({
          title: "Berhasil",
          description: "Berhasil menambahkan shift",
          variant: "flat",
          color: "success",
          timeout: 3000,
        });
      }
      handleCloseShiftForm();
      refreshShiftData();
    } catch (err: any) {
      addToast({
        title: "Gagal",
        description: err.message || "Gagal menyimpan shift",
        variant: "flat",
        color: "danger",
        timeout: 3000,
      });
    } finally {
      setIsShiftFormSubmitting(false);
    }
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
              value={shiftSearch}
              onChange={(e) => setShiftSearch(e.target.value)}
            />
          </div>

          <Select
            className="w-32"
            placeholder="Tampilkan"
            selectedKeys={[shiftLimit.toString()]}
            onChange={(e) => {
              const newLimit = parseInt(e.target.value);
              if (!isNaN(newLimit)) setShiftLimit(newLimit);
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
            onPress={() => {
              resetShiftForm();
              modalShiftForm.onOpen();
            }}
          >
            Tambah +
          </Button>
        </div>
      </div>

      <div className="shift-table mt-4">
        <ShiftTableNew
          data={shiftData}
          currentPage={shiftCurrentPage + 1}
          hasMore={shiftHasMore}
          limit={shiftLimit}
          isLoading={isShiftLoading}
          onNextPage={handleShiftNextPage}
          onPrevPage={handleShiftPrevPage}
          onEdit={handleEditShift}
          onDelete={confirmDeleteShift}
        />
      </div>

      <Modal backdrop="opaque" isOpen={modalShiftForm.isOpen} onClose={handleCloseShiftForm} size="2xl">
        <ModalContent>
          <ModalHeader className="text-[#122C93]">
            {selectedShiftId ? "Edit Waktu Jadwal" : "Tambah Waktu Jadwal"}
          </ModalHeader>
          <ModalBody>
            <div className="container-form flex flex-col gap-6 p-3">
              <Input
                label="Nama Waktu"
                placeholder="Contoh: Shift Pagi"
                variant="underlined"
                labelPlacement="inside"
                value={shiftFormData.nama}
                maxLength={21}
                minLength={1}
                isInvalid={!!shiftFormErrors.nama}
                errorMessage={shiftFormErrors.nama}
                onChange={(e) => setShiftFormData({ ...shiftFormData, nama: e.target.value })}
              />
              <div className="flex gap-4 w-full">
                <Input
                  className="w-full"
                  label="Jam Mulai"
                  type="time"
                  variant="underlined"
                  labelPlacement="inside"
                  step="1"
                  value={shiftFormData.mulai}
                  isInvalid={!!shiftFormErrors.mulai}
                  errorMessage={shiftFormErrors.mulai}
                  onChange={(e) => setShiftFormData({ ...shiftFormData, mulai: e.target.value })}
                />
                <Input
                  className="w-full"
                  label="Jam Selesai"
                  type="time"
                  variant="underlined"
                  labelPlacement="inside"
                  step="1"
                  value={shiftFormData.selesai}
                  isInvalid={!!shiftFormErrors.selesai}
                  errorMessage={shiftFormErrors.selesai}
                  onChange={(e) => setShiftFormData({ ...shiftFormData, selesai: e.target.value })}
                />
              </div>
              {!selectedShiftId && (
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
              onPress={handleShiftFormSubmit}
              isLoading={isShiftFormSubmitting}
            >
              {selectedShiftId ? "Update" : "Simpan"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <DeleteConfirmationModal
        isOpen={!!deleteShiftId}
        onClose={() => setDeleteShiftId(null)}
        onConfirm={handleDeleteShift}
        title="Konfirmasi Hapus Shift"
        message="Apakah anda yakin ingin menghapus shift ini?"
      />
    </div>
  );
};

export default ShiftConfigSection;
