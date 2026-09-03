import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Select,
  SelectItem,
  Input,
  Textarea,
} from "@heroui/react";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { KartuAnggotaPreview, KartuAnggotaPrintPortal } from "../KartuAnggota";
import { jenisDokumen, kategoriPelanggaran } from "../constants";
import { DeleteConfirmationModal } from "../../common/DeleteConfirmationModal";

const labelClass = "!text-xs !font-semibold !text-[#122C93]";

interface SatpamDetailModalsProps {
  state: any;
  setters: any;
  handlers: any;
  modals: any;
  dataKartu: any;
}

export const SatpamDetailModals: React.FC<SatpamDetailModalsProps> = ({
  state,
  setters,
  handlers,
  modals,
  dataKartu,
}) => {
  return (
    <>
      {/* Modal Generate Kartu Anggota */}
      <Modal
        isOpen={modals.modalGenerateKartu.isOpen}
        onOpenChange={modals.modalGenerateKartu.onOpenChange}
        backdrop="blur"
        size="lg"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="text-[#122C93] font-semibold">
                Pratinjau KTA
              </ModalHeader>
              <ModalBody className="gap-3 flex items-center py-4">
                <KartuAnggotaPreview {...dataKartu} />
              </ModalBody>
              <ModalFooter>
                <Button variant="bordered" onPress={onClose}>
                  Batal
                </Button>
                <Button
                  className="bg-[#122C93] text-white font-medium"
                  onPress={() => window.print()}
                >
                  Unduh KTA
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Inject Portal secara paralel jika modal kartu terbuka */}
      {modals.modalGenerateKartu.isOpen && <KartuAnggotaPrintPortal {...dataKartu} />}

      {/* Modal Dokumen Pendukung */}
      <Modal
        isOpen={modals.modalDokumen.isOpen}
        onOpenChange={modals.modalDokumen.onOpenChange}
        backdrop="blur"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="text-[#122C93] font-semibold">
                Tambah Dokumen Pendukung
              </ModalHeader>
              <ModalBody className="gap-3">
                <Select
                  className="max-w-full"
                  label="Jenis Dokumen"
                  labelPlacement="outside-top"
                  placeholder="Pilih Jenis Dokumen"
                  variant="bordered"
                  selectedKeys={state.selectedTipeDokumen}
                  onSelectionChange={(keys) => setters.setSelectedTipeDokumen(keys as Set<string>)}
                  classNames={{ label: labelClass }}
                >
                  {jenisDokumen.map((item) => (
                    <SelectItem key={item.key}>{item.label}</SelectItem>
                  ))}
                </Select>
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-semibold text-[#122C93]">
                    Upload Dokumen
                  </span>
                  <label
                    htmlFor="upload-dokumen"
                    className="flex flex-col items-center justify-center w-full h-36 bg-[#F5F7FF] border-2 border-dashed border-[#8D8787] rounded-xl cursor-pointer hover:bg-[#e6ecff] transition-colors"
                  >
                    <div className="flex flex-col items-center gap-1 text-[#9095A0]">
                      <AiOutlineCloudUpload className="text-2xl" />
                      <span className="text-xs font-medium text-[#6B7280]">
                        {state.dokumenFile ? state.dokumenFile.name : "Unggah Dokumen"}
                      </span>
                      <span className="text-xs text-[#9CA3AF]">
                        PNG/JPG/JPEG
                      </span>
                    </div>
                    <input
                      id="upload-dokumen"
                      type="file"
                      accept=".png,.jpg,.jpeg"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setters.setDokumenFile(e.target.files[0]);
                        }
                      }}
                    />
                  </label>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button variant="bordered" onPress={onClose} isDisabled={state.isUploadingDokumen}>
                  Batal
                </Button>
                <Button
                  className="bg-[#122C93] text-white font-medium"
                  onPress={handlers.handleUploadDokumen}
                  isLoading={state.isUploadingDokumen}
                >
                  Simpan
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Modal Preview Dokumen */}
      <Modal
        isOpen={modals.modalPreviewDokumen.isOpen}
        onOpenChange={modals.modalPreviewDokumen.onOpenChange}
        backdrop="blur"
        size="2xl"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="text-[#122C93] font-semibold">
                Preview {state.previewDoc?.type ? state.previewDoc.type.toUpperCase() : "Dokumen"}
              </ModalHeader>
              <ModalBody className="flex justify-center items-center py-4">
                {state.previewDoc?.file?.view_url ? (
                  <img src={state.previewDoc.file.view_url} alt="Preview Dokumen" className="max-w-full max-h-[70vh] object-contain rounded-lg" />
                ) : (
                  <div className="text-gray-500 py-10">Gambar tidak tersedia atau masih diproses.</div>
                )}
              </ModalBody>
              <ModalFooter>
                <Button variant="bordered" onPress={onClose}>
                  Tutup
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Modal Pendidikan */}
      <Modal
        isOpen={modals.modalPendidikan.isOpen}
        onOpenChange={modals.modalPendidikan.onOpenChange}
        backdrop="blur"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="text-[#122C93] font-semibold">
                Tambah Riwayat Pendidikan
              </ModalHeader>
              <ModalBody className="gap-3">
                <Input
                  label="Judul / Nama"
                  labelPlacement="outside-top"
                  placeholder="mis. Gada Pratama"
                  variant="bordered"
                  value={state.eduTitle}
                  onChange={(e) => setters.setEduTitle(e.target.value)}
                  classNames={{ label: labelClass }}
                />
                <Input
                  label="Tahun"
                  labelPlacement="outside-top"
                  placeholder="Masukkan Tahun Pendidikan"
                  type="number"
                  variant="bordered"
                  value={state.eduYear}
                  onChange={(e) => setters.setEduYear(e.target.value)}
                  classNames={{ label: labelClass }}
                />
                <Textarea
                  label="Keterangan"
                  labelPlacement="outside"
                  placeholder="Detail atau institusi / penerbit"
                  variant="bordered"
                  value={state.eduDesc}
                  onChange={(e) => setters.setEduDesc(e.target.value)}
                  classNames={{ label: labelClass }}
                />
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-semibold text-[#122C93]">
                    Upload Dokumen (Opsional)
                  </span>
                  <label
                    htmlFor="upload-edu"
                    className="flex flex-col items-center justify-center w-full h-36 bg-[#F5F7FF] border-2 border-dashed border-[#8D8787] rounded-xl cursor-pointer hover:bg-[#e6ecff] transition-colors"
                  >
                    <div className="flex flex-col items-center gap-1 text-[#9095A0]">
                      <AiOutlineCloudUpload className="text-2xl" />
                      <span className="text-xs font-medium text-[#6B7280]">
                        {state.eduFile ? state.eduFile.name : "Unggah Dokumen"}
                      </span>
                      <span className="text-xs text-[#9CA3AF]">
                        PDF, PNG, JPG
                      </span>
                    </div>
                    <input
                      id="upload-edu"
                      type="file"
                      accept=".pdf,.png,.jpg,.jpeg"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setters.setEduFile(e.target.files[0]);
                        }
                      }}
                    />
                  </label>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button variant="bordered" onPress={onClose} isDisabled={state.isUploadingEdu}>
                  Batal
                </Button>
                <Button
                  className="bg-[#122C93] text-white font-medium"
                  onPress={handlers.handleUploadEducation}
                  isLoading={state.isUploadingEdu}
                >
                  Simpan
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Modal Penghargaan */}
      <Modal
        isOpen={modals.modalPenghargaan.isOpen}
        onOpenChange={modals.modalPenghargaan.onOpenChange}
        backdrop="blur"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="text-[#122C93] font-semibold">
                Tambah Riwayat Penghargaan
              </ModalHeader>
              <ModalBody className="gap-3">
                <Input
                  label="Judul / Nama"
                  labelPlacement="outside-top"
                  placeholder="mis. Satpam Teladan"
                  variant="bordered"
                  value={state.recTitle}
                  onChange={(e) => setters.setRecTitle(e.target.value)}
                  classNames={{ label: labelClass }}
                />
                <Input
                  label="Tahun"
                  labelPlacement="outside-top"
                  placeholder="Masukkan Tahun Penghargaan"
                  type="number"
                  variant="bordered"
                  value={state.recYear}
                  onChange={(e) => setters.setRecYear(e.target.value)}
                  classNames={{ label: labelClass }}
                />
                <Textarea
                  label="Keterangan"
                  labelPlacement="outside"
                  placeholder="Detail Prestasi"
                  variant="bordered"
                  value={state.recDesc}
                  onChange={(e) => setters.setRecDesc(e.target.value)}
                  classNames={{ label: labelClass }}
                />
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-semibold text-[#122C93]">
                    Upload Sertifikat (opsional)
                  </span>
                  <label
                    htmlFor="upload-rec"
                    className="flex flex-col items-center justify-center w-full h-36 bg-[#F5F7FF] border-2 border-dashed border-[#8D8787] rounded-xl cursor-pointer hover:bg-[#e6ecff] transition-colors"
                  >
                    <div className="flex flex-col items-center gap-1 text-[#9095A0]">
                      <AiOutlineCloudUpload className="text-2xl" />
                      <span className="text-xs font-medium text-[#6B7280]">
                        {state.recFile ? state.recFile.name : "Unggah Sertifikat"}
                      </span>
                      <span className="text-xs text-[#9CA3AF]">
                        PDF, PNG, JPG
                      </span>
                    </div>
                    <input
                      id="upload-rec"
                      type="file"
                      accept=".pdf,.png,.jpg,.jpeg"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setters.setRecFile(e.target.files[0]);
                        }
                      }}
                    />
                  </label>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button variant="bordered" onPress={onClose} isDisabled={state.isUploadingRec}>
                  Batal
                </Button>
                <Button
                  className="bg-[#122C93] text-white font-medium"
                  onPress={handlers.handleUploadRecognition}
                  isLoading={state.isUploadingRec}
                >
                  Simpan
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Modal Tambah Pelanggaran */}
      <Modal
        isOpen={modals.modalTambahPelanggaran.isOpen}
        onOpenChange={modals.modalTambahPelanggaran.onOpenChange}
        backdrop="blur"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="text-[#122C93] font-semibold">
                {state.editViolationUuid ? "Edit Pelanggaran" : "Tambah Pelanggaran"}
              </ModalHeader>
              <ModalBody className="gap-3">
                <Select
                  className="max-w-full"
                  label="Kategori Pelanggaran"
                  labelPlacement="outside-top"
                  placeholder="Pilih Kategori"
                  variant="bordered"
                  classNames={{ label: labelClass }}
                  selectedKeys={state.violationType ? new Set([state.violationType]) : new Set()}
                  onSelectionChange={(keys) => setters.setViolationType(Array.from(keys)[0] as string)}
                >
                  {kategoriPelanggaran.map((item) => (
                    <SelectItem key={item.key}>{item.label}</SelectItem>
                  ))}
                </Select>
                <Textarea
                  label="Keterangan"
                  labelPlacement="outside"
                  placeholder="Detail Pelanggaran"
                  variant="bordered"
                  classNames={{ label: labelClass }}
                  value={state.violationDesc}
                  onChange={(e) => setters.setViolationDesc(e.target.value)}
                />
              </ModalBody>
              <ModalFooter>
                <Button variant="bordered" onPress={onClose}>
                  Batal
                </Button>
                <Button
                  className="bg-[#122C93] text-white font-medium"
                  onPress={handlers.handleUploadViolation}
                  isLoading={state.isUploadingViolation}
                >
                  Simpan
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      <DeleteConfirmationModal
        isOpen={modals.modalDeleteConfirmation.isOpen}
        onClose={modals.modalDeleteConfirmation.onClose}
        onConfirm={async () => {
          if (state.deleteAction) {
            await state.deleteAction.execute();
            modals.modalDeleteConfirmation.onClose();
          }
        }}
        message={state.deleteAction?.message}
      />
    </>
  );
};
