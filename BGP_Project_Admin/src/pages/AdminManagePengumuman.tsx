import React from "react";
import { Button, Select, SelectItem } from "@heroui/react";
import { FiSearch } from "react-icons/fi";

import { useAnnouncementData } from "../hooks/useAnnouncementData";
import { usePengumumanForm } from "../hooks/usePengumumanForm";
import { DeleteConfirmationModal } from "../Components/common/DeleteConfirmationModal";
import { PengumumanModal } from "../Components/pengumuman/PengumumanModal";
import { PengumumanList } from "../Components/pengumuman/PengumumanList";

export const clients = [
  { key: "all", label: "Semua Client" },
  { key: "smb", label: "Sumarecon Bandung" },
  { key: "mitra1", label: "Mitra Sejahtera" },
  { key: "mitra2", label: "Graha Properti" },
];

const ALL_KEY = "all";

const AdminManagePengumuman = () => {
  const {
    dataAnnouncement,
    loading,
    limit,
    setLimit,
    hasMore,
    currentPage,
    handleNextPage,
    handlePrevPage,
    mitraOptions,
    searchQuery,
    handleSearch,
    userRole,
    refreshData,
    deleteState,
    filterClient,
    setFilterClient,
  } = useAnnouncementData();

  const targetOptions = [
    { key: ALL_KEY, label: "Seluruh Client" },
    ...mitraOptions.map((m) => ({ key: m.uuid, label: m.nama })),
  ];

  const pengumumanForm = usePengumumanForm(refreshData, targetOptions);

  const [searchText, setSearchText] = React.useState(searchQuery || "");

  React.useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      handleSearch(searchText);
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchText, handleSearch]);

  return (
    <div className="flex flex-col gap-2 p-2.5 overflow-hidden">
      <div className="flex flex-row items-center justify-between mt-2">
        <div className="flex flex-col items-start">
          <h2 className="font-semibold text-2xl text-[#122C93]">Pengumuman</h2>
          <p className="text-md text-black text-sm">
            {userRole === "client" 
              ? "Pengumuman dari admin untuk satpam Anda."
              : "Broadcast informasi ke semua satpam atau hanya satpam di client tertentu."}
          </p>
        </div>
        {userRole !== "client" && (
          <Button
            className="text-white font-semibold bg-[#122C93]"
            size="md"
            onPress={pengumumanForm.openCreateModal}
          >
            + Buat Pengumuman
          </Button>
        )}
      </div>

      <div className="container-search rounded-2xl flex flex-row gap-3 items-center bg-[#FFFFFF] p-3 border border-[#E4E9F7]">
        <div className="flex flex-row items-center gap-2 bg-white border border-[#E4E9F7] rounded-xl px-4 h-11 flex-1">
          <FiSearch className="text-[#B0B0B0] text-base flex-shrink-0" />
          <input
            type="search"
            placeholder="Cari nama pengumuman, atau nama mitra"
            className="bg-transparent text-sm text-gray-700 placeholder:text-[#B0B0B0] outline-none w-full h-full"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>
        {userRole !== "client" && (
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
          >
            {targetOptions.map((c) => (
              <SelectItem key={c.key}>{c.label}</SelectItem>
            ))}
          </Select>
        )}

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

      <PengumumanList
        data={dataAnnouncement}
        loading={loading}
        hasMore={hasMore}
        currentPage={currentPage}
        userRole={userRole}
        onNextPage={handleNextPage}
        onPrevPage={handlePrevPage}
        onEdit={pengumumanForm.openEditModal}
        onDelete={(item) => deleteState.confirm(item.uuid)}
      />

      <PengumumanModal
        isOpen={pengumumanForm.isOpen}
        onClose={pengumumanForm.onClose}
        editUuid={pengumumanForm.editUuid}
        submitting={pengumumanForm.submitting}
        title={pengumumanForm.title}
        setTitle={pengumumanForm.setTitle}
        location={pengumumanForm.location}
        setLocation={pengumumanForm.setLocation}
        datetime={pengumumanForm.datetime}
        setDatetime={pengumumanForm.setDatetime}
        description={pengumumanForm.description}
        setDescription={pengumumanForm.setDescription}
        selectedKeys={pengumumanForm.selectedKeys}
        handleSelectionChange={pengumumanForm.handleSelectionChange}
        clearAll={pengumumanForm.clearAll}
        targetOptions={targetOptions}
        handleSubmit={pengumumanForm.handleSubmit}
        ALL_KEY={pengumumanForm.ALL_KEY}
      />

      <DeleteConfirmationModal
        isOpen={deleteState.isOpen}
        onClose={() => deleteState.setIsOpen(false)}
        onConfirm={deleteState.execute}
        title="Hapus Pengumuman"
        message="Apakah Anda yakin ingin menghapus pengumuman ini?"
      />
    </div>
  );
};

export default AdminManagePengumuman;
