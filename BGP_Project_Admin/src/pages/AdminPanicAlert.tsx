import { useState } from "react";
import {
  Button,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Pagination,
} from "@heroui/react";
import { FiSearch } from "react-icons/fi";
import { GoAlertFill } from "react-icons/go";

const filters = [
  { key: "semua", label: "Semua" },
  { key: "aktif", label: "Aktif" },
  { key: "dalampenanganan", label: "Dalam Penanganan" },
  { key: "selesai", label: "Selesai" },
];

interface PanicAlertItem {
  uuid: string;
  nama: string;
  nip: string;
  mitra: string;
  lokasi_url?: string;
  waktu: string;
  status: "aktif" | "dalam_penanganan" | "selesai";
}

const dummyData: PanicAlertItem[] = [
  {
    uuid: "1",
    nama: "Nama Satpam",
    nip: "0123456789",
    mitra: "Nama Client",
    waktu: "01 Jun 2026, 23:00",
    status: "aktif",
  },
  {
    uuid: "2",
    nama: "Nama Satpam",
    nip: "0123456789",
    mitra: "Nama Client",
    waktu: "01 Jun 2026, 23:00",
    status: "dalam_penanganan",
  },
  {
    uuid: "3",
    nama: "Nama Satpam",
    nip: "0123456789",
    mitra: "Nama Client",
    waktu: "01 Jun 2026, 23:00",
    status: "selesai",
  },
  {
    uuid: "4",
    nama: "Nama Satpam",
    nip: "0123456789",
    mitra: "Nama Client",
    waktu: "01 Jun 2026, 23:00",
    status: "selesai",
  },
];

const statusStyles: Record<PanicAlertItem["status"], string> = {
  aktif: "bg-[#FFE2E2] text-[#F31260]",
  dalam_penanganan: "bg-[#E8EEFF] text-[#122C93]",
  selesai: "bg-[#E4F9EE] text-[#02A758]",
};

const statusLabels: Record<PanicAlertItem["status"], string> = {
  aktif: "Aktif",
  dalam_penanganan: "Dalam Penanganan",
  selesai: "Selesai",
};

const AdminPanicAlert = () => {
  const [activeFilter, setActiveFilter] = useState("semua");
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  return (
    <div className="flex flex-col gap-2 p-2.5">
      {/* Header placement here */}
      <div className="header-container flex flex-row items-center justify-between mt-2">
        <div className="flex flex-col items-start">
          <h2 className="font-semibold text-2xl text-[#122C93]">Panic Alert</h2>
          <p className="text-md text-black text-sm w-200">
            Tombol darurat satpam. Status Aktif perlu tindakan secepatnya.
          </p>
        </div>
      </div>
      {/* end of header */}

      {/* search engine placemnet here */}
      <div className="container-search rounded-2xl flex flex-row gap-3 items-center bg-[#FFFFFF] p-3 border border-[#E4E9F7]">
        <div className="flex flex-row items-center gap-2 bg-white border border-[#E4E9F7] rounded-xl px-4 h-11 flex-1">
          <FiSearch className="text-[#B0B0B0] text-base flex-shrink-0" />
          <input
            type="search"
            placeholder="Cari nama atau status"
            className="bg-transparent text-sm text-gray-700 placeholder:text-[#B0B0B0] outline-none w-full h-full"
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
                  ? "bg-[#122C93] text-white font-semibold h-11"
                  : "bg-white text-[#122C93] border border-[#E4E9F7] h-11 font-medium"
              }
            >
              {f.label}
            </Button>
          ))}
        </div>
      </div>
      {/* end of search engine */}

      {/* main content */}
      <div className="main-container-card-table flex flex-col gap-2 mt-3">
        <h2 className="font-semibold">
          Aktif <span className="text-danger">(1)</span>
        </h2>

        <div className="card-scroll flex flex-row items-center gap-2">
          <div className="card-1 w-md flex flex-col gap-3 items-start p-5 bg-white border border-[#A70202] rounded-xl">
            <div className="header-card flex flex-row items-center w-full justify-between">
              <div className="left-side flex flex-row items-center gap-3">
                <div className="logo-container bg-[#FFE2E2] rounded-2xl p-5">
                  <GoAlertFill className="text-3xl text-[#A70202]" />
                </div>
                <div className="desc-container gap-1.5 flex flex-col items-start">
                  <h2 className="text-sm font-semibold">Nama Satpam</h2>
                  <h2 className="text-[#6B6B6B] text-xs font-medium">
                    NIP 123xxx · 01 Jun 2026, 23:00
                  </h2>
                  <h2 className="font-semibold text-xs text-[#122C93]">
                    Nama Mitra
                  </h2>
                </div>
              </div>
              <div className="indicator-active bg-[#FFE2E2] -mt-15 rounded-2xl px-5">
                <h2 className="text-[#F31260] font-medium text-sm ">Aktif</h2>
              </div>
            </div>
            <div className="bottom-side flex flex-row items-center justify-between w-full">
              <h2 className="font-medium text-md text-[#122C93]">
                Lattitude, Longitude
              </h2>
              <h2 className="italic text-[#6B6B6B] text-sm">
                Menunggu ditangani
              </h2>
            </div>
          </div>
        </div>

        {/* Table here */}
        <div className="table-container mt-3">
          <Table
            aria-label="Tabel Riwayat Panic Alert"
            shadow="none"
            isStriped
            className="rounded-xl border border-gray-200"
            bottomContent={
              <div className="flex w-full justify-center">
                <Pagination
                  showControls
                  showShadow
                  color="primary"
                  page={page}
                  total={1}
                  onChange={setPage}
                />
              </div>
            }
          >
            <TableHeader>
              <TableColumn>No</TableColumn>
              <TableColumn>Nama</TableColumn>
              <TableColumn>NIP</TableColumn>
              <TableColumn>Mitra</TableColumn>
              <TableColumn>Lokasi</TableColumn>
              <TableColumn>Waktu</TableColumn>
              <TableColumn align="center">Status</TableColumn>
            </TableHeader>

            <TableBody items={dummyData} emptyContent="Tidak ada data">
              {(item) => (
                <TableRow key={item.uuid}>
                  <TableCell>
                    {(page - 1) * rowsPerPage + dummyData.indexOf(item) + 1}
                  </TableCell>
                  <TableCell>{item.nama}</TableCell>
                  <TableCell>{item.nip}</TableCell>
                  <TableCell>{item.mitra}</TableCell>
                  <TableCell>
                    <a
                      href={item.lokasi_url || "#"}
                      className="text-[#122C93] font-medium text-sm hover:underline"
                    >
                      Lattitude, Longitude
                    </a>
                  </TableCell>
                  <TableCell>{item.waktu}</TableCell>
                  <TableCell>
                    <div className="flex justify-center">
                      <span
                        className={`text-xs font-medium px-3 py-1.5 rounded-full ${statusStyles[item.status]}`}
                      >
                        {statusLabels[item.status]}
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        {/* end of table */}
      </div>
      {/* end of main content */}
    </div>
  );
};

export default AdminPanicAlert;
