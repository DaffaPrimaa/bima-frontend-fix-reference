import { Button, useDisclosure, Select, SelectItem } from "@heroui/react";
import { FiSearch } from "react-icons/fi";
import { usePosData } from "../hooks/usePosData";
import { usePosForm } from "../hooks/usePosForm";
import { PosTable } from "../Components/pos/PosTable";
import { PosFormModal } from "../Components/pos/PosFormModal";
import { DeleteConfirmationModal } from "../Components/common/DeleteConfirmationModal";

const AdminManagePos = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    dataPos,
    loadingTable,
    limit,
    setLimit,
    search,
    setSearch,
    hasMore,
    currentPage,
    handleNextPage,
    handlePrevPage,
    refreshData,
    deleteState,
  } = usePosData();

  const formHook = usePosForm({
    onSuccess: refreshData,
    onClose: onClose,
    type: "jaga",
  });

  const handleOpenAdd = () => {
    formHook.actions.handleOpenAdd();
    onOpen();
  };

  const handleOpenEdit = async (uuid: string) => {
    await formHook.actions.handleEdit(uuid);
    onOpen();
  };

  return (
    <div className="flex flex-col p-5">
      <div className="container-content flex flex-col gap-3">
        <div className="header-container flex flex-row items-center justify-between mt-5">
          <h2 className="font-semibold text-[25px] text-[#122C93]">
            Manage Pos Patroli
          </h2>
          <Button
            variant="solid"
            onPress={handleOpenAdd}
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
              placeholder="Cari nama pos"
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

        <div className="mt-6">
          <PosTable
            data={dataPos}
            loading={loadingTable}
            limit={limit}
            hasMore={hasMore}
            currentPage={currentPage}
            onNextPage={handleNextPage}
            onPrevPage={handlePrevPage}
            onEdit={handleOpenEdit}
            onDelete={deleteState.confirm}
          />
        </div>

        <PosFormModal isOpen={isOpen} onClose={onClose} formHook={formHook} />
        <DeleteConfirmationModal
          isOpen={deleteState.isOpen}
          onClose={() => deleteState.setIsOpen(false)}
          onConfirm={deleteState.execute}
        />
      </div>
    </div>
  );
};

export default AdminManagePos;
