import { FiSearch } from "react-icons/fi";
import { useState } from "react";
import { Button, Select, SelectItem } from "@heroui/react";
import { EventReportTable } from "../Components/kejadian/EventReportTable";
import { useEventReportData } from "../hooks/useEventReportData";

const filters = [
  { key: "semua", label: "Semua" },
  { key: "pending", label: "Masuk" },
  { key: "handled", label: "Ditangani" },
  { key: "resolved", label: "Selesai" },
];

const AdminLaporanKejadian = () => {
  const [activeFilter, setActiveFilter] = useState("semua");

  const {
    dataReport,
    loading,
    limit,
    setLimit,
    hasMore,
    currentPage,
    handleNextPage,
    handlePrevPage,
    userRole,
    refreshData,
    search,
    setSearch,
  } = useEventReportData({
    status: activeFilter,
  });

  return (
    <div className="flex flex-col gap-2 p-2.5 overflow-hidden h-full">
      {/* header here */}
      <div className="header-container flex flex-row items-center justify-between mt-2 flex-shrink-0">
        <div className="flex flex-col items-start">
          <h2 className="font-semibold text-2xl text-[#122C93]">
            Laporan Kejadian
          </h2>
          <p className="text-md text-black text-sm">
            Laporan insiden yang dikirim satpam dari lapangan.
          </p>
        </div>
      </div>
      {/* end of header here */}

      <div className="container-search rounded-2xl flex flex-row gap-3 items-center bg-[#FFFFFF] p-3 border border-[#E4E9F7] flex-shrink-0 mt-2">
        <div className="flex flex-row items-center gap-2 bg-white border border-[#E4E9F7] rounded-xl px-4 h-11 flex-1">
          <FiSearch className="text-[#B0B0B0] text-base flex-shrink-0" />
          <input
            type="search"
            placeholder="Cari deskripsi laporan"
            className="bg-transparent text-sm text-gray-700 placeholder:text-[#B0B0B0] outline-none w-full h-full"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="container-selector-filter flex flex-row gap-2 items-center">
          {filters.map((f) => (
            <Button
              key={f.key}
              size="sm"
              onPress={() => setActiveFilter(f.key)}
              className={
                activeFilter === f.key
                  ? "bg-[#122C93] text-white font-semibold h-11 px-6"
                  : "bg-white text-[#122C93] border border-[#E4E9F7] h-11 font-medium px-6"
              }
            >
              {f.label}
            </Button>
          ))}

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
      </div>

      {/* table here */}
      <div className="main-content flex-1 overflow-y-auto mt-2 pb-10">
        <EventReportTable
          data={dataReport}
          loading={loading}
          hasMore={hasMore}
          currentPage={currentPage}
          limit={limit}
          userRole={userRole}
          onNextPage={handleNextPage}
          onPrevPage={handlePrevPage}
          refreshData={refreshData}
        />
      </div>
      {/* end of table */}
    </div>
  );
};

export default AdminLaporanKejadian;
