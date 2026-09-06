import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Pagination,
  Spinner,
} from "@heroui/react";
import { FaRegEdit } from "react-icons/fa";
import { LuDownload } from "react-icons/lu";
import { BiMessageDetail } from "react-icons/bi";
import { formatDateTimeZone, getRole } from "../../Utils/helpers";
import type { Absensi } from "../../types/attendance";

interface AttendanceTableProps {
  data: Absensi[];
  isLoading: boolean;
  currentPage: number;
  limit: number;
  hasMore: boolean;
  onNextPage: () => void;
  onPrevPage: () => void;
  onEdit: (uuid: string) => void;
  onDownload: (uuid: string) => void;
  onMessage: (satpamUuid: string) => void;
}

const getStatusStyles = (status: string) => {
  switch (status) {
    case "present":
      return "bg-green-100 text-green-700";
    case "late":
      return "bg-yellow-100 text-yellow-800";
    case "absent":
      return "bg-red-100 text-red-700";
    case "partial":
      return "bg-orange-100 text-orange-800";
    case "excused":
      return "bg-blue-100 text-blue-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case "present":
      return "Hadir";
    case "late":
      return "Terlambat";
    case "absent":
      return "Alpha";
    case "partial":
      return "Hadir Sebagian";
    case "excused":
      return "Izin";
    default:
      return status;
  }
};

export const AttendanceTable = ({
  data,
  isLoading,
  currentPage,
  limit,
  hasMore,
  onNextPage,
  onPrevPage,
  onEdit,
  onDownload,
  onMessage,
}: AttendanceTableProps) => {
  const role = getRole();

  return (
    <Table
      isStriped
      shadow="none"
      className="border border-gray-200 rounded-xl"
      bottomContent={
        <div className="flex w-full justify-center">
          <Pagination
            showControls
            showShadow
            color="primary"
            page={currentPage}
            total={Math.max(currentPage + (hasMore ? 1 : 0), 1)}
            onChange={(p) => {
              if (p > currentPage) onNextPage();
              else if (p < currentPage) onPrevPage();
            }}
            classNames={{
              item: "[&:not([data-active=true])]:hidden",
            }}
          />
        </div>
      }
    >
      <TableHeader>
        <TableColumn>No</TableColumn>
        <TableColumn>Nama</TableColumn>
        <TableColumn>NIP</TableColumn>
        {role !== "client" ? <TableColumn>Mitra</TableColumn> : <TableColumn className="hidden">Mitra</TableColumn>}
        <TableColumn>Kategori</TableColumn>
        <TableColumn>Waktu Check In</TableColumn>
        <TableColumn>Waktu Check Out</TableColumn>
        <TableColumn>Selisih</TableColumn>
        <TableColumn className="text-center">Aksi</TableColumn>
      </TableHeader>
      <TableBody
        emptyContent="Data tidak ditemukan"
        isLoading={isLoading}
        loadingContent={<Spinner />}
      >
        {data.map((item, index) => (
          <TableRow key={item.uuid}>
            <TableCell>{(currentPage - 1) * limit + index + 1}</TableCell>

            <TableCell>
              <div className="w-[150px] truncate">{item.satpam?.nama || "-"}</div>
            </TableCell>

            <TableCell>
              <div className="w-[150px] truncate">{item.satpam?.nip || "-"}</div>
            </TableCell>
            {role !== "client" ? (
              <TableCell>
                <div className="w-[150px] truncate">{item.satpam?.client || "-"}</div>
              </TableCell>
            ) : (
              <TableCell className="hidden">{""}</TableCell>
            )}
            <TableCell>
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusStyles(item.status)}`}
              >
                {getStatusLabel(item.status)}
              </span>
            </TableCell>
            <TableCell>{formatDateTimeZone(item.checked_in_at)}</TableCell>
            <TableCell>{formatDateTimeZone(item.checked_out_at)}</TableCell>
            <TableCell>
              {item.late_minutes && item.late_minutes > 0 ? (
                <span className="text-red-500 font-medium">-{item.late_minutes} mnt</span>
              ) : item.early_leave_minutes && item.early_leave_minutes > 0 ? (
                <span className="text-orange-500 font-medium">-{item.early_leave_minutes} mnt</span>
              ) : (
                <span className="text-gray-500">-</span>
              )}
            </TableCell>
            <TableCell>
              <div className="flex justify-center gap-2">
                {role === "client" && (
                  <button
                    className="border border-[#C7D2FE] text-[#122C93] rounded-lg p-2 hover:bg-[#F5F7FF] cursor-pointer"
                    onClick={() => onMessage(item.satpam.uuid)}
                    title="Kirim Pesan"
                  >
                    <BiMessageDetail className="text-base" />
                  </button>
                )}
                <button
                  className="border border-[#C7D2FE] text-[#122C93] rounded-lg p-2 hover:bg-[#F5F7FF] cursor-pointer"
                  onClick={() => onEdit(item.uuid)}
                  title="Ubah Data"
                >
                  <FaRegEdit className="text-base" />
                </button>
                <button
                  className="border border-[#C7D2FE] text-[#122C93] rounded-lg p-2 hover:bg-[#F5F7FF] flex cursor-pointer"
                  onClick={() => onDownload(item.uuid)}
                  title="Download File"
                >
                  <LuDownload className="text-base" />
                </button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
