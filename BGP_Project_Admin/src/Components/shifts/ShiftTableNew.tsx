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
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

import type { ShiftPattern } from "../../types/shiftPattern";

interface ShiftTableProps {
  data: ShiftPattern[];
  currentPage: number;
  hasMore: boolean;
  limit: number;
  isLoading?: boolean;
  onNextPage: () => void;
  onPrevPage: () => void;
  onEdit: (uuid: string) => void;
  onDelete: (uuid: string) => void;
}

const ShiftTableNew = ({
  data,
  currentPage,
  hasMore,
  limit,
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
            <TableCell>{(currentPage - 1) * limit + index + 1}</TableCell>

            <TableCell>
              <div className="w-[150px] truncate">{item.nama}</div>
            </TableCell>

            <TableCell>{item.start_local}</TableCell>
            <TableCell>{item.end_local}</TableCell>

            <TableCell className="text-center">
              <div className="flex flex-row items-center justify-center gap-2">
                <button
                  type="button"
                  className="border border-[#C7D2FE] text-[#122C93] rounded-lg p-2 hover:bg-[#F5F7FF] cursor-pointer transition-colors"
                  onClick={() => onEdit(item.uuid)}
                >
                  <FaEdit className="text-base" />
                </button>
                <button
                  type="button"
                  className="border border-[#C7D2FE] text-[#A70202] rounded-lg p-2 hover:bg-[#FDEDED] cursor-pointer transition-colors"
                  onClick={() => onDelete(item.uuid)}
                >
                  <MdDelete className="text-base" />
                </button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default ShiftTableNew;
