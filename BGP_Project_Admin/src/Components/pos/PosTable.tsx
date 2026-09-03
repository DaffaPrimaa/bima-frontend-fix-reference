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
import type { Pos } from "../../types/pos";
import { formatTanggal } from "../../Utils/helpers";

interface PosTableProps {
  data: Pos[];
  loading: boolean;
  limit: number;
  hasMore: boolean;
  currentPage: number;
  onNextPage: () => void;
  onPrevPage: () => void;
  onEdit: (uuid: string) => void;
  onDelete: (uuid: string) => void;
}

export const PosTable = ({
  data,
  loading,
  limit,
  hasMore,
  currentPage,
  onNextPage,
  onPrevPage,
  onEdit,
  onDelete,
}: PosTableProps) => {
  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <Spinner label="Memuat data..." />
      </div>
    );
  }

  return (
    <Table
      aria-label="Tabel Data Pos"
      shadow="none"
      isStriped
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
        <TableColumn>Nama Pos</TableColumn>
        <TableColumn>Kode Pos</TableColumn>
        <TableColumn>Longitude</TableColumn>
        <TableColumn>Latitude</TableColumn>
        <TableColumn>Pembuatan</TableColumn>
        <TableColumn className="text-center">Aksi</TableColumn>
      </TableHeader>
      <TableBody items={data} emptyContent="Tidak ada data pos">
        {(item) => (
          <TableRow key={item.uuid}>
            <TableCell>
              {(currentPage - 1) * limit + data.indexOf(item) + 1}
            </TableCell>
            <TableCell>
              <div className="w-[150px] truncate">{item.nama}</div>
            </TableCell>
            <TableCell>
              <div className="w-[150px] truncate">{item.kode}</div>
            </TableCell>
            <TableCell>{item.lng}</TableCell>
            <TableCell>{item.lat}</TableCell>
            <TableCell>{formatTanggal(item.created_at)}</TableCell>
            <TableCell>
              <div className="flex justify-center gap-3">
                <Button
                  size="sm"
                  className="bg-[#02A758] text-white font-semibold"
                  startContent={<FaEdit />}
                  onPress={() => item.uuid && onEdit(item.uuid)}
                >
                  Ubah
                </Button>
                <Button
                  size="sm"
                  className="bg-[#A70202] text-white font-semibold"
                  startContent={<FaTrash />}
                  onPress={() => item.uuid && onDelete(item.uuid)}
                >
                  Hapus
                </Button>
              </div>
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};
