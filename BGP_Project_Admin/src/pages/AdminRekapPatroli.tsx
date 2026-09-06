import { Button, useDisclosure, Select, SelectItem } from "@heroui/react";
import { FaDownload } from "react-icons/fa";
import { FiSearch } from "react-icons/fi";
import { usePatroliData } from "../hooks/usePatroliData";
import { usePatroliForm } from "../hooks/usePatroliForm";
import { usePatroliExport } from "../hooks/usePatroliExport";
import { usePatroliImages } from "../hooks/usePatroliImages";
import { PatroliTable } from "../Components/patroli/PatroliTable";
import { PatroliEditModal } from "../Components/patroli/PatroliEditModal";
import { PatroliImageModal } from "../Components/patroli/PatroliImageModal";
import type { Patroli } from "../types/patroli";

const AdminRekapPatroli = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const {
    data,
    setLimit,
    setSearch,
    setFilterClient,
    setStatus,
    handleNextPage,
    handlePrevPage,
    refreshData
  } = usePatroliData();
  const { isDownloading, handleDownload } = usePatroliExport();
  const {
    imageState,
    handleViewImages,
    onClose: onCloseImages,
  } = usePatroliImages();

  const formHook = usePatroliForm({
    onSuccess: refreshData,
    onClose: () => onOpenChange(),
  });

  const handleOpenEdit = (item: Patroli) => {
    formHook.actions.initForm(item);
    onOpen();
  };

  return (
    <div className="flex flex-col gap-10 p-5">
      <div className="container-content flex flex-col gap-4">
        <div className="header-container flex flex-row items-center justify-between mt-5">
          <h2 className="font-semibold text-[25px] text-[#122C93]">
            Rekap Patroli Satpam
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

        <div className="container-search rounded-2xl flex flex-row gap-3 items-center bg-[#FFFFFF] p-3 border border-[#E4E9F7]">
          <div className="flex flex-row items-center gap-2 bg-white border border-[#E4E9F7] rounded-xl px-4 h-11 flex-1">
            <FiSearch className="text-[#B0B0B0] text-base flex-shrink-0" />
            <input
              type="search"
              placeholder="Cari nama satpam, atau nama mitra"
              className="bg-transparent text-sm text-gray-700 placeholder:text-[#B0B0B0] outline-none w-full h-full"
              value={data.search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>


          <Select
            className="w-48"
            placeholder="Semua Status"
            selectedKeys={[data.status]}
            onChange={(e) => setStatus(e.target.value || "all")}
            classNames={{
              trigger:
                "bg-white border border-[#E4E9F7] rounded-xl shadow-none h-11 min-h-11 data-[hover=true]:bg-white",
              value: "text-[#8D8787] text-sm",
            }}
          >
            {[
              <SelectItem key="all">Semua Status</SelectItem>,
              <SelectItem key="aman">Aman</SelectItem>,
              <SelectItem key="tidak aman">Tidak Aman</SelectItem>,
            ]}
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

        <PatroliTable
          data={data.dataPatroli}
          isLoading={data.isLoading}
          page={data.currentPage}
          limit={data.limit}
          hasMore={data.hasMore}
          role={data.userRole}
          onNextPage={handleNextPage}
          onPrevPage={handlePrevPage}
          onEdit={handleOpenEdit}
          onViewImages={handleViewImages}
        />

        <PatroliEditModal
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          formHook={formHook}
        />

        <PatroliImageModal
          isOpen={imageState.isOpen}
          onClose={onCloseImages}
          images={imageState.previewImages}
        />
      </div>
    </div>
  );
};

export default AdminRekapPatroli;
