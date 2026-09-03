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
  Tooltip,
} from "@heroui/react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { MdAssignmentInd } from "react-icons/md";
import type { Satpam } from "../../types/satpam";
import { formatTanggal } from "../../Utils/helpers";
import { IoMdEye } from "react-icons/io";

const INITIAL_COLUMNS = [
  { name: "No", uid: "no" },
  { name: "Nama", uid: "nama" },
  { name: "NIP", uid: "nip" },
  { name: "Jabatan", uid: "jabatan" },
  { name: "Status", uid: "status" },
  { name: "Jenis Kelamin", uid: "gender" },
  { name: "Asal Daerah", uid: "asal_daerah" },
  { name: "No Telp", uid: "nomor_hp" },
  { name: "Mitra", uid: "mitra" },
  { name: "Pembuatan", uid: "created_at" },
  { name: "Aksi", uid: "aksi" },
];

interface SatpamTableProps {
  data: Satpam[];
  loading: boolean;
  hasMore: boolean;
  currentPage: number;
  userRole: string;
  onNextPage: () => void;
  onPrevPage: () => void;
  onEdit: (item: Satpam) => void;
  onDelete: (uuid: string) => void;
  onAssign: (item: Satpam) => void;
  onDetail: (item: Satpam) => void;
  limit: number;
}

export const SatpamTable = ({
  data,
  loading,
  hasMore,
  currentPage,
  userRole,
  onNextPage,
  onPrevPage,
  onEdit,
  onDelete,
  onAssign,
  onDetail,
  limit,
}: SatpamTableProps) => {
  const columns =
    userRole?.toLowerCase() === "client"
      ? INITIAL_COLUMNS.filter(
        (col) => col.uid !== "mitra",
      )
      : INITIAL_COLUMNS;

  return (
    <Table
      aria-label="Tabel Data Satpam"
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
      <TableHeader columns={columns}>
        {(column) => (
          <TableColumn
            key={column.uid}
            align={column.uid === "aksi" ? "center" : "start"}
          >
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody
        items={data}
        emptyContent={loading ? <Spinner size="lg" /> : "Tidak ada data"}
      >
        {(item) => (
          <TableRow key={item.uuid}>
            {(columnKey) => {
              const val = item[columnKey as keyof Satpam];
              switch (columnKey) {
                case "no":
                  return (
                    <TableCell>
                      {(currentPage - 1) * limit + data.indexOf(item) + 1}
                    </TableCell>
                  );
                case "nama":
                  return (
                    <TableCell>
                      <div className="max-w-[150px] truncate" title={String(item.nama)}>
                        {item.nama}
                      </div>
                    </TableCell>
                  );

                case "status":
                  return (
                    <TableCell>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${val === "active"
                          ? "bg-green-100 text-green-700"
                          : val === "pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                          }`}
                      >
                        {val === "active" ? "Aktif" : val === "pending" ? "Tertunda" : "Tidak Aktif"}
                      </span>
                    </TableCell>
                  );
                case "gender":
                  return (
                    <TableCell>
                      {val === "1" ? "Laki-laki" : val === "2" ? "Perempuan" : "-"}
                    </TableCell>
                  );
                case "asal_daerah":
                  return (
                    <TableCell>
                      <div className="max-w-[150px] truncate" title={String(val)}>
                        {val as string}
                      </div>
                    </TableCell>
                  );
                case "nip":
                  return (
                    <TableCell>
                      <div className="max-w-[150px] truncate" title={String(val)}>
                        {val as string}
                      </div>
                    </TableCell>
                  );
                case "created_at":
                  return (
                    <TableCell>{formatTanggal(item.created_at)}</TableCell>
                  );
                case "mitra":
                  const isClient = userRole?.toLowerCase() === "client";
                  return (
                    <TableCell>
                      <div className="max-w-[150px] truncate" title={isClient ? "" : (item.client && item.client !== "null" ? item.client : "")}>
                        {isClient ? null : (item.client && item.client !== "null" ? item.client : "-")}
                      </div>
                    </TableCell>
                  );
                case "aksi":
                  const isClientAction = userRole?.toLowerCase() === "client";
                  return (
                    <TableCell>
                      <div className="flex gap-2 w-max mx-auto justify-center">
                        <Tooltip content="Detail">
                          <Button
                            size="sm"
                            isIconOnly
                            className="bg-[#DBEAFE] text-[#122C93]"
                            onPress={() => onDetail(item)}
                          >
                            <IoMdEye size={18} />
                          </Button>
                        </Tooltip>
                        {!isClientAction && (
                          <>
                            <Tooltip content="Ubah">
                              <Button
                                size="sm"
                                isIconOnly
                                className="bg-[#02A758] text-white"
                                onPress={() => onEdit(item)}
                              >
                                <FaEdit size={16} />
                              </Button>
                            </Tooltip>
                            <Tooltip content="Hapus">
                              <Button
                                size="sm"
                                isIconOnly
                                className="bg-[#A70202] text-white"
                                onPress={() => onDelete(item.uuid)}
                              >
                                <FaTrash size={16} />
                              </Button>
                            </Tooltip>
                            <Tooltip content="Assign Mitra">
                              <Button
                                size="sm"
                                isIconOnly
                                className="bg-[#122C93] text-white"
                                onPress={() => onAssign(item)}
                              >
                                <MdAssignmentInd size={18} />
                              </Button>
                            </Tooltip>
                          </>
                        )}
                      </div>
                    </TableCell>
                  );
                default:
                  return <TableCell>{val as React.ReactNode}</TableCell>;
              }
            }}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};
