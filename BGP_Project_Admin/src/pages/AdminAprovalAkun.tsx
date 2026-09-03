import { Select, SelectItem } from "@heroui/react";
import { FiSearch } from "react-icons/fi";
import { useSatpamData } from "../hooks/useSatpamData";
import { useApprovalAkun } from "../hooks/useApprovalAkun";
import { ApprovalAkunTable } from "../Components/satpam/ApprovalAkunTable";
import { ApprovalAkunModal } from "../Components/satpam/ApprovalAkunModal";

const AdminAprovalAkun = () => {
  const { 
    dataSatpam, 
    loading, 
    limit,
    setLimit,
    search,
    setSearch,
    filterStatus,
    setFilterStatus,
    filterDays,
    setFilterDays,
    hasMore, 
    currentPage, 
    handleNextPage, 
    handlePrevPage, 
    refreshData 
  } = useSatpamData();
  
  const { modalState, approvalState, actions } = useApprovalAkun(refreshData);

  return (
    <div className="flex flex-col p-5">
      <div className="container-content flex flex-col gap-4">
        <div className="header-container flex flex-row items-center justify-between mt-5">
          <h2 className="font-semibold text-[25px] text-[#122C93]">
            Approval Akun Satpam
          </h2>
        </div>

        <div className="container-search rounded-2xl flex flex-row gap-3 items-center bg-[#FFFFFF] p-3 border border-[#E4E9F7] mt-2">
          <div className="flex flex-row items-center gap-2 bg-white border border-[#E4E9F7] rounded-xl px-4 h-11 flex-1">
            <FiSearch className="text-[#B0B0B0] text-base flex-shrink-0" />
            <input
              type="search"
              placeholder="Cari nama satpam"
              className="bg-transparent text-sm text-gray-700 placeholder:text-[#B0B0B0] outline-none w-full h-full"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          
          <Select
            className="w-40"
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
            ].map((c) => (
              <SelectItem key={c.key} textValue={c.label}>
                {c.label}
              </SelectItem>
            ))}
          </Select>

          <Select
            className="w-60"
            placeholder="Semua Waktu"
            selectedKeys={[filterDays]}
            onChange={(e) => setFilterDays(e.target.value || "all")}
            classNames={{
              trigger:
                "bg-white border border-[#E4E9F7] rounded-xl shadow-none h-11 min-h-11 data-[hover=true]:bg-white",
              value: "text-[#8D8787] text-sm",
            }}
          >
            {[
              { key: "all", label: "Semua Waktu Keputusan" },
              { key: "1", label: "1 Hari Terakhir" },
              { key: "7", label: "7 Hari Terakhir" },
              { key: "14", label: "14 Hari Terakhir" },
              { key: "30", label: "30 Hari Terakhir" },
            ].map((c) => (
              <SelectItem key={c.key} textValue={c.label}>
                {c.label}
              </SelectItem>
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

        <div className="table-section-container mt-6">
          <ApprovalAkunTable
            data={dataSatpam.filter((item) => item.status !== 'inactive')}
            loading={loading}
            hasMore={hasMore}
            limit={limit}
            currentPage={currentPage}
            isRejecting={approvalState.isRejecting}
            onNextPage={handleNextPage}
            onPrevPage={handlePrevPage}
            onApproveConfirm={actions.handleOpenModal}
            onReject={actions.handleReject}
          />
        </div>

        <ApprovalAkunModal
          isOpen={modalState.isOpen}
          onClose={modalState.onClose}
          selectedSatpam={approvalState.selectedSatpam}
          mitraOptions={approvalState.mitraOptions}
          selectedMitraId={approvalState.selectedMitraId}
          setSelectedMitraId={approvalState.setSelectedMitraId}
          loadingMitra={approvalState.loadingMitra}
          hasMoreMitra={approvalState.hasMoreMitra}
          loadingMoreMitra={approvalState.loadingMoreMitra}
          loadMoreMitra={approvalState.loadMoreMitra}
          isApproving={approvalState.isApproving}
          onApprove={actions.handleApprove}
        />
      </div>
    </div>
  );
};

export default AdminAprovalAkun;
