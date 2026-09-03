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
} from "@heroui/react";
import { FiSearch } from "react-icons/fi";
import { useManagePengajuan } from "../hooks/useManagePengajuan";
import type { PengajuanRequest } from "../types/request";
import { formatTanggalIndo, getRole } from "../Utils/helpers";


const filters = [
  { key: "semua", label: "Semua" },
  { key: "pending", label: "Menunggu" },
  { key: "accepted", label: "Disetujui" },
  { key: "rejected", label: "Ditolak" },
];

const INITIAL_COLUMNS = [
  { name: "No", uid: "no" },
  { name: "Nama", uid: "nama" },
  { name: "NIP", uid: "nip" },
  { name: "Mitra", uid: "mitra" },
  { name: "Tipe", uid: "tipe" },
  { name: "Tanggal Izin", uid: "tanggal_izin" },
  { name: "Alasan", uid: "alasan" },
  { name: "Tanggal Pengajuan", uid: "tanggal_pengajuan" },
  { name: "Status", uid: "status" },
  { name: "Aksi", uid: "aksi" },
];

const tipeStyles: Record<string, string> = {
  cuti: "bg-[#E8EEFF] text-[#122C93]",
  lembur: "bg-[#F1E8FF] text-[#7C3AED]",
};

const tipeLabels: Record<string, string> = {
  cuti: "Cuti",
  lembur: "Lembur",
};

const statusStyles: Record<string, string> = {
  pending: "bg-[#FEF6E0] text-[#B45309]",
  accepted: "bg-[#E4F9EE] text-[#02A758]",
  rejected: "bg-[#FCE7E9] text-[#E11D48]",
};

const statusLabels: Record<string, string> = {
  pending: "Menunggu",
  accepted: "Disetujui",
  rejected: "Ditolak",
};

interface PengajuanTableProps {
  data: PengajuanRequest[];
  loading: boolean;
  currentPage: number;
  hasMore: boolean;
  rowsPerPage: number;
  onNextPage: () => void;
  onPrevPage: () => void;
  onSetujui: (uuid: string) => void;
  onTolak: (uuid: string) => void;
}

const PengajuanTable = ({
  data,
  loading,
  currentPage,
  hasMore,
  rowsPerPage,
  onNextPage,
  onPrevPage,
  onSetujui,
  onTolak,
}: PengajuanTableProps) => {
  const role = getRole();
  const columns = role === "client" ? INITIAL_COLUMNS.filter(c => c.uid !== "aksi") : INITIAL_COLUMNS;

  return (
    <Table
      aria-label="Tabel Pengajuan Lembur & Cuti"
      shadow="none"
      isStriped
      className="rounded-xl"
      bottomContent={
        <div className="flex w-full justify-center px-4 py-2">
          <Pagination
            showControls
            page={currentPage}
            total={Math.max(currentPage + (hasMore ? 1 : 0), 1)}
            onChange={(page) => {
              if (page > currentPage) onNextPage();
              else if (page < currentPage) onPrevPage();
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
            align={
              column.uid === "tipe" ||
                column.uid === "status" ||
                column.uid === "aksi"
                ? "center"
                : "start"
            }
          >
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody
        items={data}
        emptyContent={loading ? <Spinner size="lg" /> : "Tidak ada data"}
      >
        {(item) => (
          <TableRow key={item.uuid}>
            {(columnKey) => {
              switch (columnKey) {
                case "no":
                  return (
                    <TableCell>
                      {(currentPage - 1) * rowsPerPage + data.indexOf(item) + 1}
                    </TableCell>
                  );
                case "nama":
                  return <TableCell>{item.satpam?.nama || "-"}</TableCell>;
                case "nip":
                  return <TableCell>{item.satpam?.nip || "-"}</TableCell>;
                case "mitra":
                  return <TableCell>{item.satpam?.client || "-"}</TableCell>;
                case "tipe":
                  return (
                    <TableCell>
                      <div className="flex justify-center">
                        <span
                          className={`text-xs font-medium px-3 py-1.5 rounded-full ${tipeStyles[item.type] || "bg-gray-100 text-gray-700"}`}
                        >
                          {tipeLabels[item.type] || item.type}
                        </span>
                      </div>
                    </TableCell>
                  );
                case "tanggal_izin":
                  return (
                    <TableCell>
                      <div className="w-[170px] text-sm text-black">
                        {item.start_date === item.end_date
                          ? formatTanggalIndo(item.start_date)
                          : `${formatTanggalIndo(item.start_date)} - ${formatTanggalIndo(item.end_date)}`}
                      </div>
                    </TableCell>
                  );
                case "alasan":
                  return (
                    <TableCell>
                      <div className="w-[260px] text-sm text-black">
                        {item.description}
                      </div>
                    </TableCell>
                  );
                case "tanggal_pengajuan":
                  return <TableCell>{formatTanggalIndo(item.created_at)}</TableCell>;
                case "status":
                  return (
                    <TableCell>
                      <div className="flex justify-center">
                        <span
                          className={`text-xs font-medium px-3 py-1.5 rounded-full ${statusStyles[item.status] || "bg-gray-100 text-gray-700"}`}
                        >
                          {statusLabels[item.status] || item.status}
                        </span>
                      </div>
                    </TableCell>
                  );
                case "aksi":
                  return (
                    <TableCell>
                      <div className="flex justify-center gap-2">
                        {item.status === "pending" ? (
                          <>
                            <Button
                              size="sm"
                              className="bg-[#02A758] text-white font-semibold"
                              onPress={() => onSetujui(item.uuid)}
                              isLoading={loading}
                            >
                              Setuju
                            </Button>
                            <Button
                              size="sm"
                              variant="bordered"
                              className="border-[#E11D48] text-[#E11D48] font-semibold"
                              onPress={() => onTolak(item.uuid)}
                              isLoading={loading}
                            >
                              Tolak
                            </Button>
                          </>
                        ) : (
                          <span className="text-[#8D8787]">-</span>
                        )}
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
  );
};

const AdminManagePengajuan = () => {
  const {
    data,
    loading,
    search,
    setSearch,
    filterType,
    setFilterType,
    statusFilter,
    setStatusFilter,
    currentPage,
    hasMore,
    handleNextPage,
    handlePrevPage,
    handleSetujui,
    handleTolak,
    limit,
    setLimit,
  } = useManagePengajuan();



  return (
    <div className="flex flex-col gap-2 p-2.5 overflow-hidden">
      {/* Header here */}
      <div className="header-container flex flex-row items-center justify-between mt-2">
        <div className="flex flex-col items-start">
          <h2 className="font-semibold text-2xl text-[#122C93]">
            Pengajuan Lembur & Cuti
          </h2>
          <p className="text-md text-black text-sm w-200">
            Pengajuan dari satpam. Setujui atau tolak setelah review.
          </p>
        </div>
      </div>
      {/* end of header here */}

      {/* search engine */}
      <div className="container-search rounded-2xl flex flex-row gap-3 items-center bg-[#FFFFFF] p-3 border border-[#E4E9F7] max-md:flex-col">
        <div className="flex flex-row items-center gap-2 bg-white border border-[#E4E9F7] rounded-xl px-4 h-11 flex-1 w-full">
          <FiSearch className="text-[#B0B0B0] text-base flex-shrink-0" />
          <input
            type="search"
            placeholder="Cari nama deskripsi, atau status"
            className="bg-transparent text-sm text-gray-700 placeholder:text-[#B0B0B0] outline-none w-full h-full"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select
          className="w-48 max-md:w-full"
          placeholder="Semua Type"
          selectedKeys={[filterType]}
          onChange={(e) => setFilterType(e.target.value || "all")}
          classNames={{
            trigger:
              "bg-white border border-[#E4E9F7] rounded-xl shadow-none h-11 min-h-11 data-[hover=true]:bg-white",
            value: "text-[#8D8787] text-sm",
          }}
        >
          <SelectItem key="all">Semua Type</SelectItem>
          <SelectItem key="cuti">Cuti</SelectItem>
          <SelectItem key="lembur">Lembur</SelectItem>
        </Select>
        <div className="container-selector-filter flex flex-row gap-2 items-center max-md:w-full max-md:overflow-x-auto">
          {filters.map((f) => (
            <Button
              key={f.key}
              size="sm"
              onPress={() => setStatusFilter(f.key)}
              className={
                statusFilter === f.key
                  ? "bg-[#122C93] text-white font-semibold h-11"
                  : "bg-white text-[#122C93] border border-[#E4E9F7] h-11 font-medium"
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
      {/* end of search engine */}

      <div className="main-content flex flex-col gap-2 rounded-2xl border border-[#E4E9F7] bg-white">
        <PengajuanTable
          data={data}
          loading={loading}
          currentPage={currentPage}
          hasMore={hasMore}
          rowsPerPage={limit}
          onNextPage={handleNextPage}
          onPrevPage={handlePrevPage}
          onSetujui={handleSetujui}
          onTolak={handleTolak}
        />
      </div>
    </div>
  );
};

export default AdminManagePengajuan;
