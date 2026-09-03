import { Button, useDisclosure, Select, SelectItem } from "@heroui/react";
import { FiSearch } from "react-icons/fi";
import { useUserManagement } from "../hooks/useUserManagement";
import { UserListTable } from "../Components/users/UserListTable";
import { AddUserModal } from "../Components/users/AddUserModal";
import { DeleteConfirmationModal } from "../Components/common/DeleteConfirmationModal";

const AdminManageUsers = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const {
    users,
    loading,
    limit,
    setLimit,
    search,
    setSearch,
    hasMore,
    currentPage,
    handleNextPage,
    handlePrevPage,
    resetPagination,
    refreshData,
    deleteState,
  } = useUserManagement();

  return (
    <div className="flex flex-col p-5">
      <div className="container-content flex flex-col gap-4">
        <div className="header-container flex flex-row items-center justify-between mt-5">
          <h2 className="font-semibold text-[25px] text-[#122C93]">
            Manage Client
          </h2>
          <Button
            variant="solid"
            onPress={onOpen}
            className="bg-[#122C93] text-white font-semibold w-30 h-12 text-[16px]"
          >
            Tambah +
          </Button>
        </div>

        <div className="container-search rounded-2xl flex flex-row gap-3 items-center bg-[#FFFFFF] p-3 border border-[#E4E9F7] mt-2">
          <div className="flex flex-row items-center gap-2 bg-white border border-[#E4E9F7] rounded-xl px-4 h-11 flex-1">
            <FiSearch className="text-[#B0B0B0] text-base flex-shrink-0" />
            <input
              type="search"
              placeholder="Cari nama atau email client"
              className="bg-transparent text-sm text-gray-700 placeholder:text-[#B0B0B0] outline-none w-full h-full"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          
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

        <AddUserModal
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          onSuccess={() => {
            resetPagination();
            refreshData();
          }}
        />

        <div className="table-section-container mt-6">
          <UserListTable
            users={users}
            loading={loading}
            hasMore={hasMore}
            currentPage={currentPage}
            onNextPage={handleNextPage}
            onPrevPage={handlePrevPage}
            onDeleteClick={deleteState.confirm}
          />
        </div>

        <DeleteConfirmationModal
          isOpen={deleteState.isOpen}
          onClose={() => deleteState.setIsOpen(false)}
          onConfirm={deleteState.execute}
          message="Apakah anda yakin ingin menghapus data user ini?"
        />
      </div>
    </div>
  );
};

export default AdminManageUsers;