import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Textarea,
  Select,
  SelectItem,
  DatePicker,
} from "@heroui/react";
import { IoClose } from "react-icons/io5";

interface TargetOption {
  key: string;
  label: string;
}

interface PengumumanModalProps {
  isOpen: boolean;
  onClose: () => void;
  editUuid: string | null;
  submitting: boolean;
  title: string;
  setTitle: (val: string) => void;
  location: string;
  setLocation: (val: string) => void;
  datetime: any;
  setDatetime: (val: any) => void;
  description: string;
  setDescription: (val: string) => void;
  selectedKeys: Set<string>;
  handleSelectionChange: (keys: any) => void;
  clearAll: () => void;
  targetOptions: TargetOption[];
  handleSubmit: () => void;
  ALL_KEY: string;
}

export const PengumumanModal = ({
  isOpen,
  onClose,
  editUuid,
  submitting,
  title,
  setTitle,
  location,
  setLocation,
  datetime,
  setDatetime,
  description,
  setDescription,
  selectedKeys,
  handleSelectionChange,
  clearAll,
  targetOptions,
  handleSubmit,
  ALL_KEY,
}: PengumumanModalProps) => {
  const selectedCount = selectedKeys.has(ALL_KEY)
    ? targetOptions.length - 1
    : selectedKeys.size;

  const selectedLabels = targetOptions
    .filter((t) => t.key !== ALL_KEY && selectedKeys.has(t.key))
    .map((t) => t.label);

  return (
    <Modal size="lg" backdrop="blur" isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1 text-[#122C93]">
              {editUuid ? "Edit Pengumuman" : "Tambah Pengumuman"}
            </ModalHeader>
            <ModalBody className="flex flex-col w-full gap-3">
              <Input
                className="max-w-full"
                label="Nama Pengumuman / Agenda"
                isRequired
                labelPlacement="outside-top"
                placeholder="mis. Apel Pagi"
                variant="bordered"
                value={title}
                onValueChange={setTitle}
                classNames={{ label: "text-sm font-semibold text-[#122C93]" }}
              />
              <div className="flex flex-row gap-2">
                <Input
                  className="w-1/2"
                  label="Tempat"
                  isRequired
                  labelPlacement="outside-top"
                  placeholder="mis. Lapangan"
                  variant="bordered"
                  value={location}
                  onValueChange={setLocation}
                  classNames={{
                    label: "text-sm font-semibold text-[#122C93]",
                  }}
                />

                <DatePicker
                  hideTimeZone
                  showMonthAndYearPickers
                  value={datetime}
                  onChange={(val) => val && setDatetime(val)}
                  label="Waktu"
                  className="w-1/2"
                  labelPlacement="outside-top"
                  variant="bordered"
                  classNames={{
                    label: "text-sm font-semibold text-[#122C93]",
                  }}
                />
              </div>
              <Textarea
                className="max-w-full"
                label="Isi / Deskripsi"
                isRequired
                labelPlacement="outside-top"
                placeholder="Jelaskan isi pengumuman, agenda kegiatan atau hal yang perlu disiapkan"
                variant="bordered"
                value={description}
                onValueChange={setDescription}
                classNames={{ label: "text-sm font-semibold text-[#122C93]" }}
              />
              <hr className="w-full border-[#E4E9F7]" />

              <div className="flex flex-col gap-1.5">
                <div className="flex flex-row items-center justify-between">
                  <span className="text-sm font-semibold text-[#122C93]">
                    Target Penerima <span className="text-danger">*</span>
                  </span>
                  {selectedCount > 0 && (
                    <div className="flex flex-row items-center gap-1.5">
                      <span className="inline-flex items-center justify-center bg-[#122C93] text-white text-[10px] font-semibold rounded-full w-5 h-5">
                        {selectedCount}
                      </span>
                      <span className="text-[11px] text-[#8D8787]">
                        terpilih
                      </span>
                      <button
                        onClick={clearAll}
                        className="flex items-center justify-center w-4 h-4 rounded-full bg-[#E4E9F7] hover:bg-[#DBEAFE] transition-colors"
                      >
                        <IoClose className="text-[#122C93] text-[10px]" />
                      </button>
                    </div>
                  )}
                </div>

                <div className="flex flex-col border border-[#E4E9F7] rounded-xl overflow-hidden">
                  <Select
                    className="max-w-full"
                    labelPlacement="outside-top"
                    variant="bordered"
                    placeholder="Pilih target penerima"
                    selectedKeys={selectedKeys}
                    selectionMode="multiple"
                    onSelectionChange={handleSelectionChange}
                    renderValue={() => (
                      <span className="text-sm text-gray-700">
                        Pilih target penerima
                      </span>
                    )}
                    classNames={{
                      trigger:
                        "border-none shadow-none rounded-none rounded-t-xl data-[hover=true]:bg-white",
                      label: "text-sm font-semibold text-[#122C93]",
                    }}
                  >
                    {targetOptions.map((t) => (
                      <SelectItem key={t.key}>{t.label}</SelectItem>
                    ))}
                  </Select>

                  {selectedLabels.length > 0 && (
                    <div className="flex flex-row flex-wrap gap-x-1 gap-y-0.5 px-3 py-2 border-t border-[#E4E9F7] bg-[#F5F7FF]">
                      {selectedLabels.map((label, i) => (
                        <span
                          key={label}
                          className="text-xs text-[#122C93] font-medium"
                        >
                          {label}
                          {i < selectedLabels.length - 1 ? "," : ""}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button variant="bordered" onPress={onClose} isDisabled={submitting}>
                Batal
              </Button>
              <Button
                className="bg-[#122C93] text-white font-medium"
                onPress={handleSubmit}
                isLoading={submitting}
                isDisabled={!title || !description || !location || selectedKeys.size === 0}
              >
                {editUuid ? "Simpan Perubahan" : "Buat Pengumuman"}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
