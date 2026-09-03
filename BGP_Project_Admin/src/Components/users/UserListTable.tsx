import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Spinner,
  Button,
  Pagination,
} from "@heroui/react";
import { FaTrash } from "react-icons/fa";
import type { User } from "../../types/user";
import { formatTanggal } from "../../Utils/helpers";

interface UserListTableProps {
  users: User[];
  loading: boolean;
  hasMore: boolean;
  currentPage: number;
  onNextPage: () => void;
  onPrevPage: () => void;
  onDeleteClick: (uuid: string) => void;
}

export const UserListTable = ({
  users,
  loading,
  hasMore,
  currentPage,
  onNextPage,
  onPrevPage,
  onDeleteClick,
}: UserListTableProps) => {
  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <Spinner label="Memuat data..." />
      </div>
    );
  }

  return (
    <Table
      aria-label="Tabel Data User"
      shadow="none"
      isStriped
      className="rounded-xl border border-gray-200"
      bottomContent={
        <div className="flex w-full justify-center items-center px-4 py-2">
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
      <TableHeader>
        <TableColumn>Nama Mitra</TableColumn>
        <TableColumn>Email</TableColumn>
        <TableColumn>Pembuatan</TableColumn>
        <TableColumn className="text-center">Aksi</TableColumn>
      </TableHeader>
      <TableBody emptyContent={"Tidak ada data user"}>
        {users.map((item) => (
          <TableRow key={item.uuid}>
            <TableCell>
              <div className="w-[150px] truncate">{item.nama}</div>
            </TableCell>
            <TableCell>
              <div className="w-[150px] truncate">{item.email}</div>
            </TableCell>
            <TableCell>{formatTanggal(item.created_at)}</TableCell>
            <TableCell>
              <div className="flex justify-center">
                <Button
                  size="sm"
                  className="bg-[#A70202] text-white font-semibold"
                  startContent={<FaTrash />}
                  onPress={() => onDeleteClick(item.uuid)}
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
