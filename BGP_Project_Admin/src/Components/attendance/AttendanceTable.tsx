import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Pagination,
  Spinner,
  Button,
} from "@heroui/react";
import { FaEdit } from "react-icons/fa";
import { formatDateTimeZone } from "../../Utils/helpers";
import type { Absensi } from "../../types/attendance";

interface AttendanceTableProps {
  data: Absensi[];
  isLoading: boolean;
  currentPage: number;
  hasMore: boolean;
  rowsPerPage: number;
  onNextPage: () => void;
  onPrevPage: () => void;
  onEdit: (uuid: string) => void;
}

const getStatusStyles = (status: string) => {
  switch (status) {
    case "present":
      return "bg-green-100 text-green-700";
    case "late":
      return "bg-yellow-100 text-yellow-800";
    case "absent":
      return "bg-red-100 text-red-700";
    case "excused":
      return "bg-blue-100 text-blue-700";
    case "partial":
      return "bg-orange-100 text-orange-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

const STATUS_LABELS: Record<string, string> = {
  pending: "Pending",
  present: "Tepat Waktu",
  late: "Terlambat",
  partial: "Sebagian",
  absent: "Alpha",
  excused: "Izin",
};

export const AttendanceTable = ({
  data,
  isLoading,
  currentPage,
  hasMore,
  rowsPerPage,
  onNextPage,
  onPrevPage,
  onEdit,
}: AttendanceTableProps) => {
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
            total={hasMore ? currentPage + 1 : currentPage}
            onChange={(p) => {
              if (p > currentPage) onNextPage();
              else if (p < currentPage) onPrevPage();
            }}
          />
        </div>
      }
    >
      <TableHeader>
        <TableColumn>No</TableColumn>
        <TableColumn>Nama</TableColumn>
        <TableColumn>NIP</TableColumn>
        <TableColumn>Status</TableColumn>
        <TableColumn>Waktu Check In</TableColumn>
        <TableColumn>Waktu Check Out</TableColumn>
        <TableColumn className="text-center">Aksi</TableColumn>
      </TableHeader>
      <TableBody
        emptyContent="Data tidak ditemukan"
        isLoading={isLoading}
        loadingContent={<Spinner />}
      >
        {data.map((item, index) => (
          <TableRow key={item.uuid}>
            <TableCell>{(currentPage - 1) * rowsPerPage + index + 1}</TableCell>

            <TableCell>
              <div className="w-[150px] truncate">{item.satpam.nama}</div>
            </TableCell>

            <TableCell>
              <div className="w-[150px] truncate">{item.satpam.nip}</div>
            </TableCell>
            <TableCell>
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusStyles(item.status)}`}
              >
                {STATUS_LABELS[item.status] ?? item.status}
              </span>
            </TableCell>
            <TableCell>{formatDateTimeZone(item.checked_in_at)}</TableCell>
            <TableCell>{formatDateTimeZone(item.checked_out_at)}</TableCell>
            <TableCell className="text-center">
              <Button
                size="sm"
                onPress={() => onEdit(item.uuid)}
                className="bg-[#02A758] text-white font-semibold"
                startContent={<FaEdit />}
              >
                Ubah
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
