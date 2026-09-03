import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Select,
  SelectItem,
} from "@heroui/react";
import { FaUser } from "react-icons/fa6";
import type { Satpam, MitraOption } from "../../types/satpam";
import { InfiniteScrollTrigger } from "../common/InfiniteScrollTrigger";

interface ApprovalAkunModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedSatpam: Satpam | null;
  mitraOptions: MitraOption[];
  selectedMitraId: string;
  setSelectedMitraId: (id: string) => void;
  loadingMitra: boolean;
  hasMoreMitra: boolean;
  loadingMoreMitra: boolean;
  loadMoreMitra: () => void;
  isApproving: boolean;
  onApprove: () => void;
}

const getGenderLabel = (genderStr?: string) => {
  if (genderStr === "1") return "Laki - laki";
  if (genderStr === "2") return "Perempuan";
  return "-";
};

export const ApprovalAkunModal = ({
  isOpen,
  onClose,
  selectedSatpam,
  mitraOptions,
  selectedMitraId,
  setSelectedMitraId,
  loadingMitra,
  hasMoreMitra,
  loadingMoreMitra,
  loadMoreMitra,
  isApproving,
  onApprove,
}: ApprovalAkunModalProps) => {
  return (
    <Modal size="lg" isOpen={isOpen} backdrop="blur" onClose={onClose}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              <h2 className="text-[#122C93] font-semibold">
                Konfirmasi Persetujuan Akun
              </h2>
            </ModalHeader>
            <ModalBody className="flex flex-col items-start gap-4">
              {selectedSatpam && (
                <>
                  <div className="container-user flex flex-row gap-3 items-center">
                    <div className="profile-content overflow-hidden w-12 h-12 flex justify-center items-center bg-[#D9D9D9] rounded-xl">
                      {selectedSatpam.image_url ? (
                        <img src={selectedSatpam.image_url} alt="Profile" className="object-cover w-full h-full" />
                      ) : (
                        <FaUser className="text-2xl text-gray-500" />
                      )}
                    </div>
                    <h2 className="font-semibold text-black">{selectedSatpam.nama || "-"}</h2>
                  </div>

                  <div className="container-details-user flex bg-[#F5F7FF] border border-gray-200 rounded-2xl p-6 flex-wrap flex-col h-[180px] w-full gap-x-4 gap-y-5">
                    <div className="card-1 flex flex-col items-start">
                      <h2 className="text-xs">Email</h2>
                      <h2 className="text-xs text-[#8D8787]">
                        {selectedSatpam.email || "-"}
                      </h2>
                    </div>
                    <div className="card-1 flex flex-col items-start">
                      <h2 className="text-xs">Jabatan</h2>
                      <h2 className="text-xs text-[#8D8787]">{selectedSatpam.jabatan || "-"}</h2>
                    </div>
                    <div className="card-1 flex flex-col items-start">
                      <h2 className="text-xs">NIP</h2>
                      <h2 className="text-xs text-[#8D8787]">{selectedSatpam.nip || "-"}</h2>
                    </div>
                    <div className="card-1 flex flex-col items-start">
                      <h2 className="text-xs">No HP</h2>
                      <h2 className="text-xs text-[#8D8787]">
                        {selectedSatpam.nomor_hp || selectedSatpam.no_telp || "-"}
                      </h2>
                    </div>
                    <div className="card-1 flex flex-col items-start">
                      <h2 className="text-xs">Asal Daerah</h2>
                      <h2 className="text-xs text-[#8D8787]">{selectedSatpam.asal_daerah || "-"}</h2>
                    </div>
                    <div className="card-1 flex flex-col items-start">
                      <h2 className="text-xs">Jenis Kelamin</h2>
                      <h2 className="text-xs text-[#8D8787]">{getGenderLabel(selectedSatpam.gender)}</h2>
                    </div>
                  </div>

                  <Select
                    className="w-full"
                    label="Assign Mitra (Opsional)"
                    labelPlacement="outside-top"
                    placeholder={loadingMitra ? "Memuat mitra..." : "Pilih Mitra"}
                    selectedKeys={selectedMitraId ? [selectedMitraId] : []}
                    onChange={(e) => setSelectedMitraId(e.target.value)}
                    isDisabled={loadingMitra}
                    listboxProps={{
                      bottomContent: (
                        <InfiniteScrollTrigger
                          hasMore={hasMoreMitra}
                          isLoading={loadingMoreMitra}
                          onLoadMore={loadMoreMitra}
                        />
                      ),
                    }}
                    classNames={{
                      trigger:
                        "bg-white border border-[#E4E9F7] rounded-xl shadow-none h-11 min-h-11 data-[hover=true]:bg-white",
                      value: "text-[#8D8787] text-sm",
                      label: "font-semibold text-[#122C93]",
                    }}
                  >
                    {[
                      <SelectItem key="unassign">Tanpa Mitra (Unassign)</SelectItem>,
                      ...mitraOptions.map((c) => (
                        <SelectItem key={c.uuid}>{c.nama}</SelectItem>
                      ))
                    ]}
                  </Select>
                </>
              )}
            </ModalBody>
            <ModalFooter>
              <Button variant="bordered" onPress={onClose} isDisabled={isApproving}>
                Batal
              </Button>
              <Button
                className="bg-[#122C93] text-white font-medium"
                onPress={onApprove}
                isLoading={isApproving}
              >
                Simpan
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
