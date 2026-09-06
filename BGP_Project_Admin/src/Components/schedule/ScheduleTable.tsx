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
import { FaEdit, FaTrash } from "react-icons/fa";
import type { Jadwal } from "../../types/schedule";
import { getHari } from "../../Utils/helpers";

interface ScheduleTableProps {
  data: Jadwal[];
  isLoading: boolean;
  page: number;
  totalPages: number;
  rowsPerPage: number;
  onPageChange: (page: number) => void;
  onEdit: (uuid: string) => void;
  onDelete: (uuid: string) => void;
}

export const ScheduleTable = ({
  data,
  isLoading,
  page,
  totalPages,
  rowsPerPage,
  onPageChange,
  onEdit,
  onDelete,
}: ScheduleTableProps) => {
  return (
    <Table
      isStriped
      shadow="none"
      className="rounded-xl border border-gray-200"
      bottomContent={
        totalPages > 0 ? (
          <div className="flex w-full justify-center">
            <Pagination
              showControls
              showShadow
              color="primary"
              page={page}
              total={totalPages}
              onChange={onPageChange}
            />
          </div>
        ) : null
      }
    >
      <TableHeader>
        <TableColumn>No</TableColumn>
        <TableColumn>Hari</TableColumn>
        <TableColumn>Tanggal</TableColumn>
        <TableColumn>Sesi Shift</TableColumn>
        <TableColumn>Nama Satpam</TableColumn>
        <TableColumn>Shift</TableColumn>
        <TableColumn>Pos</TableColumn>
        <TableColumn className="text-center">Aksi</TableColumn>
      </TableHeader>
      <TableBody
        emptyContent="Tidak ada data."
        isLoading={isLoading}
        loadingContent={<Spinner />}
      >
        {data.map((item, index) => (
          <TableRow key={item.uuid}>
            <TableCell>{(page - 1) * rowsPerPage + index + 1}</TableCell>
            <TableCell>{getHari(item.tanggal)}</TableCell>
            <TableCell>{item.tanggal}</TableCell>
            <TableCell>{`${item.mulai.slice(0, 5)} - ${item.selesai.slice(0, 5)}`}</TableCell>
            <TableCell>
              <div className="w-[150px] truncate">{item.satpam_name}</div>
            </TableCell>
            <TableCell>
              <div className="w-[150px] truncate">{item.shift_nama}</div>
            </TableCell>
            <TableCell>
              <div className="w-[150px] truncate">{item.nama_pos}</div>
            </TableCell>
            <TableCell>
              <div className="flex justify-center gap-3">
                <Button
                  size="sm"
                  className="bg-[#02A758] text-white font-semibold"
                  startContent={<FaEdit />}
                  onPress={() => onEdit(item.uuid)}
                >
                  Ubah
                </Button>
                <Button
                  size="sm"
                  className="bg-[#A70202] text-white font-semibold"
                  startContent={<FaTrash />}
                  onPress={() => onDelete(item.uuid)}
                >
                  Hapus
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
