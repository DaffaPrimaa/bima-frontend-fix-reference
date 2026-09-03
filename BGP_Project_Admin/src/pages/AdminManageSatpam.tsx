import type { Satpam } from "../types/satpam";
import { useNavigate } from "react-router-dom";
import { useSatpamData } from "../hooks/useSatpamData";
import { useMitraAssignment } from "../hooks/useMitraAssignment";
import { SatpamTable } from "../Components/satpam/SatpamTable";
import { MitraAssignmentModal } from "../Components/satpam/MitraAssignmentModal";
import { DeleteConfirmationModal } from "../Components/common/DeleteConfirmationModal";
import { Select, SelectItem } from "@heroui/react";
import { FiSearch } from "react-icons/fi";

const AdminManageSatpam = () => {
  const navigate = useNavigate();
  const {
    dataSatpam,
    loading,
    limit,
    setLimit,
    hasMore,
    currentPage,
    handleNextPage,
    handlePrevPage,
    userRole,
    search,
    setSearch,
    filterStatus,
    setFilterStatus,

    refreshData,
    deleteState,
  } = useSatpamData({ status: "active" });

  const assignmentHook = useMitraAssignment(refreshData);

  const handleOpenEdit = (item: Satpam) => {
    navigate("/AdminEditDetailSatpam", { state: { uuid: item.uuid } });
  };

  return (
    <div className="flex flex-col p-5">
      <div className="container-content flex flex-col gap-4">
        <div className="header-container flex flex-row items-center justify-between mt-5">
          <h2 className="font-semibold text-[25px] text-[#122C93]">
            Manage Satpam
          </h2>

        </div>

        <div className="container-search rounded-2xl flex flex-row gap-3 items-center bg-[#FFFFFF] p-3 border border-[#E4E9F7] mt-2">
          <div className="flex flex-row items-center gap-2 bg-white border border-[#E4E9F7] rounded-xl px-4 h-11 flex-1">
            <FiSearch className="text-[#B0B0B0] text-base flex-shrink-0" />
            <input
              type="search"
              placeholder="Cari nama satpam atau nomor ID"
              className="bg-transparent text-sm text-gray-700 placeholder:text-[#B0B0B0] outline-none w-full h-full"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          {userRole?.toLowerCase() === "admin" && (
            <Select
              className="w-48"
              placeholder="Semua Status"
              selectedKeys={[filterStatus]}
              onChange={(e) => setFilterStatus(e.target.value || "all")}
              classNames={{
                trigger:
                  "bg-white border border-[#E4E9F7] rounded-xl shadow-none h-11 min-h-11 data-[hover=true]:bg-white",
                value: "text-[#8D8787] text-sm",
              }}
            >
              {[
                { key: "all", label: "Semua Status" },
                { key: "pending", label: "Pending" },
                { key: "active", label: "Active" },
                { key: "rejected", label: "Rejected" },
                { key: "inactive", label: "Inactive" },
                { key: "resign", label: "Resign" },
              ].map((c) => (
                <SelectItem key={c.key} textValue={c.label}>
                  {c.label}
                </SelectItem>
              ))}
            </Select>
          )}
          
          {/* Limit Selector */}
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

        <div className="table-section-container mt-4">
          <SatpamTable
            data={dataSatpam}
            loading={loading}
            hasMore={hasMore}
            currentPage={currentPage}
            limit={limit}
            userRole={userRole}
            onNextPage={handleNextPage}
            onPrevPage={handlePrevPage}
            onEdit={handleOpenEdit}
            onDelete={deleteState.confirm}
            onAssign={assignmentHook.openAssignmentModal}
            onDetail={(item) => navigate(userRole?.toLowerCase() === "client" ? "/ClientDetailSatpam" : "/AdminDetailSatpam", { state: { uuid: item.uuid } })}
          />
        </div>

        <MitraAssignmentModal assignment={assignmentHook} />
        <DeleteConfirmationModal
          isOpen={deleteState.isOpen}
          onClose={() => deleteState.setIsOpen(false)}
          onConfirm={deleteState.execute}
        />
      </div>
    </div>
  );
};

export default AdminManageSatpam;
