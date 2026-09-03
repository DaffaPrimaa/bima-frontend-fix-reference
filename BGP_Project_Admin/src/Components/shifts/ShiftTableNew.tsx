import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Pagination,
  Button,
  Spinner,
} from "@heroui/react";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

export interface ShiftData {
  uuid: string;
  nama_shift: string;
  jam_mulai: string;
  jam_selesai: string;
}

interface ShiftTableProps {
  data: ShiftData[];
  page: number;
  rowsPerPage: number;
  hasMore: boolean;
  isLoading?: boolean;
  onNextPage: () => void;
  onPrevPage: () => void;
  onEdit: (uuid: string) => void;
  onDelete: (uuid: string) => void;
}

const ShiftTableNew = ({
  data,
  page,
  rowsPerPage,
  hasMore,
  isLoading,
  onNextPage,
  onPrevPage,
  onEdit,
  onDelete,
}: ShiftTableProps) => {
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
            page={page}
            total={hasMore ? page + 1 : page}
            onChange={(p) => {
              if (p > page) onNextPage();
              else if (p < page) onPrevPage();
            }}
          />
        </div>
      }
    >
      <TableHeader>
        <TableColumn>No</TableColumn>
        <TableColumn>Nama Shift</TableColumn>
        <TableColumn>Jam Mulai Shift</TableColumn>
        <TableColumn>Jam Berakhir Shift</TableColumn>
        <TableColumn className="text-center">Aksi</TableColumn>
      </TableHeader>
      <TableBody
        emptyContent="Data tidak ditemukan"
        isLoading={isLoading}
        loadingContent={<Spinner />}
      >
        {data.map((item, index) => (
          <TableRow key={item.uuid}>
            <TableCell>{(page - 1) * rowsPerPage + index + 1}</TableCell>

            <TableCell>
              <div className="w-[150px] truncate">{item.nama_shift}</div>
            </TableCell>

            <TableCell>{item.jam_mulai}</TableCell>
            <TableCell>{item.jam_selesai}</TableCell>

            <TableCell className="text-center">
              <div className="flex flex-row items-center justify-center gap-2">
                <Button
                  size="sm"
                  onPress={() => onEdit(item.uuid)}
                  className="bg-[#02A758] text-white font-semibold"
                  startContent={<FaEdit />}
                >
                  Ubah
                </Button>
                <Button
                  size="sm"
                  onPress={() => onDelete(item.uuid)}
                  className="bg-[#B91C1C] text-white font-semibold"
                  startContent={<MdDelete />}
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

export default ShiftTableNew;
