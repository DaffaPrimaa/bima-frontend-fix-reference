import { useMemo, useState } from "react";
import { formatDateTimeZone } from "../Utils/helpers";
import { useSharedDocumentData } from "../hooks/useSharedDocumentData";
import { useSharedDocumentForm } from "../hooks/useSharedDocumentForm";
import { satpamService } from "../services/satpamService";
import { InfiniteScrollTrigger } from "../Components/common/InfiniteScrollTrigger";
import { useEffect } from "react";
import {
  Button,
  Select,
  SelectItem,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Pagination,
  Spinner,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Textarea,
  useDisclosure,
  addToast,
} from "@heroui/react";
import { sharedDocumentService } from "../services/sharedDocumentService";

import { FiSearch } from "react-icons/fi";
import { FaRegEdit, FaRegTrashAlt } from "react-icons/fa";
import { LuDownload } from "react-icons/lu";
import { FaFilePdf } from "react-icons/fa6";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { IoClose } from "react-icons/io5";
import { DeleteConfirmationModal } from "../Components/common/DeleteConfirmationModal";

export const jenisDokumen = [
  { key: "peraturan", label: "Peraturan" },
  { key: "atribut", label: "Atribut" },
  { key: "sop", label: "SOP" },
  { key: "lainnya", label: "Lainnya" },
];



const labelClass = "text-xs font-semibold text-[#122C93]";



const columns = [
  { name: "No", uid: "no" },
  { name: "Nama Dokumen", uid: "nama_dokumen" },
  { name: "File", uid: "file" },
  { name: "Tujuan", uid: "tujuan" },
  { name: "Diunggah", uid: "diunggah" },
  { name: "Aksi", uid: "aksi" },
];

const AdminRepositoriDokumen = () => {
  const {
    dataDocs,
    loading,
    limit,
    setLimit,
    hasMore,
    currentPage,
    handleNextPage,
    handlePrevPage,
    refreshData,
    search,
    setSearch,
    filterClient,
    setFilterClient,
  } = useSharedDocumentData();

  const formHook = useSharedDocumentForm(refreshData);
  const {
    isOpen,
    onClose,
    judul,
    setJudul,
    deskripsi,
    setDeskripsi,
    file,
    setFile,
    selectedKeys,
    submitting,
    targetOptions,
    handleSelectionChange,
    clearAll,
    openCreateModal,
    openEditModal,
    editUuid,
    handleSubmit,
    ALL_KEY
  } = formHook;

  const selectedCount = useMemo(() => {
    if (selectedKeys as any === "all") return targetOptions.length;
    const keySet = selectedKeys as Set<string>;
    return keySet.has(ALL_KEY) ? targetOptions.length - 1 : keySet.size;
  }, [selectedKeys, targetOptions, ALL_KEY]);

  const selectedLabels = useMemo(() => {
    if (selectedKeys as any === "all") {
      return targetOptions.map((t) => t.label);
    }
    return targetOptions
      .filter((t) => (selectedKeys as Set<string>).has(t.key))
      .map((t) => t.label);
  }, [selectedKeys, targetOptions]);

  const handleEdit = (item: any) => {
    openEditModal(item.uuid);
  };

  // Filter Mitra State
  const [mitraOptions, setMitraOptions] = useState<any[]>([]);
  const [hasMoreMitra, setHasMoreMitra] = useState(false);
  const [nextCursorMitra, setNextCursorMitra] = useState<string | null>(null);
  const [loadingMoreMitra, setLoadingMoreMitra] = useState(false);

  useEffect(() => {
    const fetchInitialMitra = async () => {
      try {
        const res = await satpamService.getMitraOptions();
        if (res && Array.isArray(res.data)) {
          setMitraOptions(res.data);
          if (res.meta) {
            setHasMoreMitra(res.meta.has_more);
            setNextCursorMitra(res.meta.next_cursor);
          }
        }
      } catch (e) {
        console.error("Gagal load mitra for filter", e);
      }
    };
    fetchInitialMitra();
  }, []);

  const loadMoreMitra = async () => {
    if (!hasMoreMitra || !nextCursorMitra || loadingMoreMitra) return;
    setLoadingMoreMitra(true);
    try {
      const res = await satpamService.getMitraOptions(nextCursorMitra);
      if (res && Array.isArray(res.data)) {
        setMitraOptions((prev) => [...prev, ...res.data]);
        if (res.meta) {
          setHasMoreMitra(res.meta.has_more);
          setNextCursorMitra(res.meta.next_cursor);
        }
      }
    } catch (e) {}
    finally {
      setLoadingMoreMitra(false);
    }
  };

  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();
  const [deleteTarget, setDeleteTarget] = useState<any>(null);
  const [deleting, setDeleting] = useState(false);

  const handleDeletePrompt = (item: any) => {
    setDeleteTarget(item);
    onDeleteOpen();
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await sharedDocumentService.remove(deleteTarget.uuid);
      addToast({
        title: "Berhasil",
        description: "Dokumen berhasil dihapus",
        color: "success",
        variant: "flat",
      });
      refreshData();
      onDeleteClose();
    } catch (error: any) {
      addToast({
        title: "Gagal",
        description: error.message || "Gagal menghapus dokumen",
        color: "danger",
        variant: "flat",
      });
    } finally {
      setDeleting(false);
      setDeleteTarget(null); // Optional: clear target
    }
  };

  return (
    <div className="flex flex-col gap-2 p-2.5 overflow-hidden">
      <div className="header-container flex flex-row items-center justify-between mt-2">
        <div className="flex flex-col items-start">
          <h2 className="font-semibold text-2xl text-[#122C93]">
            Repositori Dokumen
          </h2>
          <p className="text-md text-black text-sm w-200">
            Upload dokumen (peraturan, atribut, dll) yang bisa dilihat & diunduh
            satpam via aplikasi. Bisa untuk semua satpam atau client tertentu.
          </p>
        </div>
        <Button
          className="text-white font-semibold bg-[#122C93]"
          size="md"
          onPress={openCreateModal}
        >
          + Upload Dokumen
        </Button>
      </div>

      <div className="container-search rounded-2xl flex flex-row gap-3 items-center bg-[#FFFFFF] p-3 border border-[#E4E9F7]">
        <div className="flex flex-row items-center gap-2 bg-white border border-[#E4E9F7] rounded-xl px-4 h-11 flex-1">
          <FiSearch className="text-[#B0B0B0] text-base flex-shrink-0" />
          <input
            type="search"
            placeholder="Cari nama dokumen, atau deskripsi"
            className="bg-transparent text-sm text-gray-700 placeholder:text-[#B0B0B0] outline-none w-full h-full"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select
          className="w-48"
          placeholder="Semua Client"
          selectedKeys={[filterClient]}
          onChange={(e) => setFilterClient(e.target.value || "all")}
          classNames={{
            trigger:
              "bg-white border border-[#E4E9F7] rounded-xl shadow-none h-11 min-h-11 data-[hover=true]:bg-white",
            value: "text-[#8D8787] text-sm",
          }}
          listboxProps={{
            bottomContent: (
              <InfiniteScrollTrigger
                hasMore={hasMoreMitra}
                isLoading={loadingMoreMitra}
                onLoadMore={loadMoreMitra}
              />
            ),
          }}
        >
          {[
            { key: "all", label: "Semua Client" },
            ...mitraOptions.map(m => ({ key: m.uuid, label: m.nama }))
          ].map((c) => (
            <SelectItem key={c.key} textValue={c.label}>{c.label}</SelectItem>
          ))}
        </Select>
        <Select
          className="w-32"
          placeholder="Tampilkan"
          selectedKeys={[limit.toString()]}
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

      <div className="main-content flex flex-col gap-2 rounded-2xl border border-[#E4E9F7] bg-white">
        <Table
          aria-label="Tabel Repositori Dokumen"
          shadow="none"
          isStriped
          className="rounded-xl"
          bottomContent={
            <div className="flex w-full justify-center items-center px-4 py-2">
              <Pagination
                showControls
                page={currentPage}
                total={Math.max(currentPage + (hasMore ? 1 : 0), 1)}
                onChange={(page) => {
                  if (page > currentPage) handleNextPage();
                  else if (page < currentPage) handlePrevPage();
                }}
                classNames={{
                  item: "[&:not([data-active=true])]:hidden",
                }}
              />
            </div>
          }
        >
          <TableHeader columns={columns}>
            {(column) => (
              <TableColumn
                key={column.uid}
                align={column.uid === "aksi" ? "center" : "start"}
              >
                {column.name}
              </TableColumn>
            )}
          </TableHeader>
          <TableBody
            items={dataDocs}
            emptyContent={loading ? <Spinner size="lg" /> : "Tidak ada data"}
          >
            {(item) => (
              <TableRow key={item.uuid}>
                {(columnKey) => {
                  switch (columnKey) {
                    case "no":
                      return (
                        <TableCell>
                          {(currentPage - 1) * limit +
                            dataDocs.indexOf(item) +
                            1}
                        </TableCell>
                      );
                    case "nama_dokumen":
                      return (
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium text-black">
                              {item.nama}
                            </span>
                            <span className="text-sm font-light text-[#8D8787] w-[280px] truncate">
                              {item.deskripsi}
                            </span>
                          </div>
                        </TableCell>
                      );
                    case "file":
                      return (
                        <TableCell>
                          <div className="flex flex-row items-center gap-2">
                            <FaFilePdf className="text-[#E5493A] text-2xl" />
                            {item.file?.view_url ? (
                              <a
                                href={item.file.view_url}
                                target="_blank"
                                rel="noreferrer"
                                className="text-sm text-[#122C93] hover:underline cursor-pointer"
                              >
                                Lihat Dokumen
                              </a>
                            ) : (
                              <span className="text-sm text-black">
                                Tidak ada file
                              </span>
                            )}
                          </div>
                        </TableCell>
                      );
                    case "tujuan":
                      return (
                        <TableCell>
                          {item.recipient_type === "all_client" ? (
                            <span className="bg-[#E8EEFF] text-[#122C93] text-xs font-medium px-3 py-1.5 rounded-full">
                              Semua satpam
                            </span>
                          ) : (
                            <span className="bg-[#E4F9EE] text-[#02A758] text-xs font-medium px-3 py-1.5 rounded-full">
                              {item.recipient_count} Mitra
                            </span>
                          )}
                        </TableCell>
                      );
                    case "diunggah":
                      return <TableCell>{formatDateTimeZone(item.created_at).replace(" pukul ", ", ").replace(".", ":")}</TableCell>;
                    case "aksi":
                      return (
                        <TableCell>
                          <div className="flex justify-center gap-2">
                            <button
                              className="border border-[#C7D2FE] text-[#122C93] rounded-lg p-2 hover:bg-[#F5F7FF] cursor-pointer"
                              onClick={() => handleEdit(item)}
                            >
                              <FaRegEdit className="text-base" />
                            </button>
                            {item.file?.download_url ? (
                              <a
                                href={item.file.download_url}
                                download
                                className="border border-[#C7D2FE] text-[#122C93] rounded-lg p-2 hover:bg-[#F5F7FF] flex cursor-pointer"
                              >
                                <LuDownload className="text-base" />
                              </a>
                            ) : (
                              <button className="border border-[#C7D2FE] text-[#122C93] rounded-lg p-2 hover:bg-[#F5F7FF] opacity-50 cursor-not-allowed">
                                <LuDownload className="text-base" />
                              </button>
                            )}
                            <button
                              className="border border-[#C7D2FE] text-[#A70202] rounded-lg p-2 hover:bg-[#FDEDED] cursor-pointer"
                              onClick={() => handleDeletePrompt(item)}
                            >
                              <FaRegTrashAlt className="text-base" />
                            </button>
                          </div>
                        </TableCell>
                      );
                    default:
                      return <TableCell>-</TableCell>;
                  }
                }}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Modal here */}
      <Modal
        isOpen={isOpen}
        onOpenChange={(open) => !open && onClose()}
        backdrop="blur"
      >
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="text-[#122C93] font-semibold">
                {editUuid ? "Update Dokumen" : "Tambah Dokumen"}
              </ModalHeader>
              <ModalBody className="gap-3">
                <Input
                  label="Judul / Nama"
                  value={judul}
                  onValueChange={setJudul}
                  labelPlacement="outside-top"
                  placeholder="mis. SOP Kebakaran"
                  isRequired
                  variant="bordered"
                  classNames={{ label: labelClass }}
                />
                <Textarea
                  label="Deskripsi (Opsional)"
                  value={deskripsi}
                  onValueChange={setDeskripsi}
                  labelPlacement="outside-top"
                  placeholder="Ringkasan isi dokumen"
                  variant="bordered"
                  classNames={{ label: labelClass }}
                />

                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-semibold text-[#122C93]">
                      Upload Dokumen {!editUuid && <span className="text-danger">*</span>}
                      {editUuid && <span className="text-gray-500 font-normal"> (Opsional - biarkan kosong jika tidak ingin mengubah file)</span>}
                    </span>
                    <label
                      htmlFor="upload-dokumen"
                      className="flex flex-col items-center justify-center w-full h-36 bg-[#F5F7FF] border-2 border-dashed border-[#8D8787] rounded-xl cursor-pointer hover:bg-[#e6ecff] transition-colors"
                    >
                      <div className="flex flex-col items-center gap-1 text-[#9095A0]">
                        <AiOutlineCloudUpload className="text-2xl" />
                        <span className="text-xs font-medium text-[#6B7280]">
                          {file ? file.name : (editUuid ? "Ganti Dokumen" : "Unggah Dokumen")}
                        </span>
                        <span className="text-xs text-[#9CA3AF]">
                          PDF, PNG/JPG
                        </span>
                      </div>
                      <input
                        id="upload-dokumen"
                        type="file"
                        accept=".pdf,.png,.jpg,.jpeg"
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files && e.target.files.length > 0) {
                            setFile(e.target.files[0]);
                          }
                        }}
                      />
                    </label>
                  </div>

                <div className="flex flex-col gap-1.5">
                  {/* Label row dengan counter + clear */}
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
                  {/* Select */}
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
                <Button variant="bordered" onPress={onClose}>
                  Batal
                </Button>
                <Button
                  className="bg-[#122C93] text-white font-medium"
                  onPress={handleSubmit}
                  isLoading={submitting}
                >
                  Simpan
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      {/* end of modal */}
      
      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteOpen}
        onClose={onDeleteClose}
        onConfirm={handleConfirmDelete}
        title="Konfirmasi Hapus"
        message={`Apakah Anda yakin ingin menghapus dokumen ${deleteTarget?.nama}? Tindakan ini tidak dapat dibatalkan.`}
        isLoading={deleting}
      />
    </div>
  );
};

export default AdminRepositoriDokumen;
