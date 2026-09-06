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
import type { Shift } from "../../types/shift";

interface ShiftTableProps {
  data: Shift[];
  isLoading: boolean;
  page: number;
  totalPages: number;
  rowsPerPage: number;
  onPageChange: (page: number) => void;
  onEdit: (uuid: string) => void;
  onDelete: (uuid: string) => void;
}

export const ShiftTable = ({
  data,
  isLoading,
  page,
  totalPages,
  rowsPerPage,
  onPageChange,
  onEdit,
  onDelete,
}: ShiftTableProps) => {
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
        <TableColumn>Nama</TableColumn>
        <TableColumn>Mulai</TableColumn>
        <TableColumn>Selesai</TableColumn>
        <TableColumn className="text-center">Aksi</TableColumn>
      </TableHeader>
      <TableBody
        emptyContent="Tidak ada data waktu."
        isLoading={isLoading}
        loadingContent={<Spinner />}
      >
        {data.map((item, index) => (
          <TableRow key={item.uuid}>
            <TableCell>{(page - 1) * rowsPerPage + index + 1}</TableCell>
            <TableCell>
              <div className="w-[150px] truncate">{item.nama}</div>
            </TableCell>
            <TableCell>{item.mulai}</TableCell>
            <TableCell>{item.selesai}</TableCell>
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
