import { DateRangePicker, Select, SelectItem, Spinner, Tooltip } from "@heroui/react";
import { FiSearch } from "react-icons/fi";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Pagination,
} from "@heroui/react";
import { useMessageData } from "../hooks/useMessageData";
import { formatDateTimeZone } from "../Utils/helpers";

const COLUMNS = [
  { name: "No", uid: "no" },
  { name: "Nama", uid: "nama" },
  { name: "NIP", uid: "nip" },
  { name: "Isi Pesan", uid: "isi_pesan" },
  { name: "Tanggal dikirim", uid: "tanggal_dikirim" },
];

const ClientRiwayatPesan = () => {
  const {
    data,
    loading,
    limit,
    setLimit,
    search,
    setSearch,
    dateRange,
    setDateRange,
    hasMore,
    currentPage,
    handleNextPage,
    handlePrevPage,
  } = useMessageData();

  return (
    <div className="flex flex-col gap-2 p-2.5 overflow-hidden">
      {/* Header here */}
      <div className="header-container flex flex-row items-center justify-between mt-2">
        <div className="flex flex-col items-start">
          <h2 className="font-semibold text-2xl text-[#122C93]">
            Riwayat Pesan
          </h2>
          <p className="text-md text-black text-sm w-230">
            Semua pesan yang pernah dikirim ke satpam. Untuk kirim pesan baru,
            buka Download Absensi → klik ikon chat pada satpam yang sedang
            shift.
          </p>
        </div>
      </div>
      {/* end of header */}

      {/* search engine */}
      <div className="container-search rounded-2xl flex flex-row gap-3 items-center bg-[#FFFFFF] p-3 border border-[#E4E9F7]">
        <div className="flex flex-row items-center gap-2 bg-white border border-[#E4E9F7] rounded-xl px-4 h-11 flex-1">
          <FiSearch className="text-[#B0B0B0] text-base flex-shrink-0" />
          <input
            type="search"
            placeholder="Cari histori pesan"
            className="bg-transparent text-sm text-gray-700 placeholder:text-[#B0B0B0] outline-none w-full h-full"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <DateRangePicker
          className="w-72"
          value={dateRange as any}
          onChange={(val: any) => setDateRange(val)}
          label="Filter Tanggal"
          classNames={{
            label: "!text-xs !font-light !text-[#122C93]",
            inputWrapper:
              "bg-white border border-[#E4E9F7] rounded-xl shadow-none h-11 min-h-11 data-[hover=true]:bg-white group-data-[focus=true]:bg-white",
          }}
        />
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
      {/* end of search engine */}

      {/* Table section */}
      <div className="table-container">
        <Table
          aria-label="Tabel Riwayat Pesan"
          shadow="none"
          isStriped
          className="rounded-xl border border-[#E8EEFF]"
          bottomContent={
            <div className="flex w-full justify-center items-center px-4 py-2">
              <Pagination
                showControls
                page={currentPage}
                total={Math.max(currentPage + (hasMore ? 1 : 0), 1)}
                onChange={(p) => {
                  if (p > currentPage) handleNextPage();
                  else if (p < currentPage) handlePrevPage();
                }}
                classNames={{
                  item: "[&:not([data-active=true])]:hidden",
                }}
              />
            </div>
          }
        >
          <TableHeader columns={COLUMNS}>
            {(column) => (
              <TableColumn
                key={column.uid}
                className="text-sm font-medium bg-[#E8E8E8] text-black"
              >
                {column.name}
              </TableColumn>
            )}
          </TableHeader>

          <TableBody items={data} emptyContent={loading ? <Spinner size="lg" /> : "Tidak ada data"}>
            {(item) => (
              <TableRow key={item.uuid}>
                {(columnKey) => {
                  switch (columnKey) {
                    case "no":
                      return (
                        <TableCell className="text-sm text-black">
                          {(currentPage - 1) * limit +
                            data.indexOf(item) +
                            1}
                        </TableCell>
                      );
                    case "nama":
                      return (
                        <TableCell className="text-sm text-black">
                          {item.satpam?.nama || "-"}
                        </TableCell>
                      );
                    case "nip":
                      return (
                        <TableCell className="text-sm text-black">
                          {item.satpam?.nip || "-"}
                        </TableCell>
                      );
                    case "isi_pesan":
                      return (
                        <TableCell className="text-sm text-black">
                          <Tooltip
                            content={
                              <div className="px-1 py-2 max-w-[300px] whitespace-normal">
                                <div className="text-sm font-bold mb-1">{item.title}</div>
                                <div className="text-xs">{item.content}</div>
                              </div>
                            }
                            placement="top"
                            className="bg-[#122C93] text-white"
                          >
                            <div className="flex flex-col cursor-pointer w-max">
                              <span className="font-semibold text-gray-800 truncate max-w-[250px]">{item.title}</span>
                              <span className="text-gray-600 truncate max-w-[250px]">{item.content}</span>
                            </div>
                          </Tooltip>
                        </TableCell>
                      );
                    case "tanggal_dikirim":
                      return (
                        <TableCell>
                          <span className="bg-[#E8EEFF] text-[#122C93] text-xs font-medium px-3 py-1.5 rounded-lg whitespace-nowrap">
                            {formatDateTimeZone(item.created_at)}
                          </span>
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
      {/* end of table section */}
    </div>
  );
};

export default ClientRiwayatPesan;
