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
import { FaEdit, FaImage } from "react-icons/fa";
import { formatDateTimeZone } from "../../Utils/helpers";
import type { Patroli } from "../../types/patroli";

interface PatroliTableProps {
  data: Patroli[];
  isLoading: boolean;
  page: number;
  limit: number;
  hasMore: boolean;
  role: string;
  onNextPage: () => void;
  onPrevPage: () => void;
  onEdit: (item: Patroli) => void;
  onViewImages: (images: string[]) => void;
}

export const PatroliTable = ({
  data,
  isLoading,
  page,
  limit,
  hasMore,
  role,
  onNextPage,
  onPrevPage,
  onEdit,
  onViewImages,
}: PatroliTableProps) => {
  const total = Math.max(page + (hasMore ? 1 : 0), 1);
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
            total={total}
            onChange={(p) => {
              if (p > page) onNextPage();
              else if (p < page) onPrevPage();
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
        {role !== "client" ? (
          <TableColumn>Mitra</TableColumn>
        ) : (
          <TableColumn className="hidden">Mitra</TableColumn>
        )}
        <TableColumn>Waktu</TableColumn>
        <TableColumn>Pos</TableColumn>
        <TableColumn>Status</TableColumn>
        <TableColumn>Keterangan</TableColumn>
        <TableColumn className="text-center">Dokumentasi</TableColumn>
        <TableColumn className="text-center">Aksi</TableColumn>
      </TableHeader>
      <TableBody
        emptyContent="Data tidak ditemukan"
        isLoading={isLoading}
        loadingContent={<Spinner />}
      >
        {data.map((item, index) => (
          <TableRow key={item.uuid}>
            <TableCell>{(page - 1) * limit + index + 1}</TableCell>
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
            <TableCell>{formatDateTimeZone(item.created_at)}</TableCell>
            <TableCell>
              <div className="w-[150px] truncate">{item.pos?.nama || "-"}</div>
            </TableCell>
            <TableCell>
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${item.status?.toLowerCase() === "aman" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
              >
                {item.status || "-"}
              </span>
            </TableCell>
            <TableCell>
              <div className="w-[150px] truncate">{item.description || "-"}</div>
            </TableCell>
            <TableCell>
              <div className="flex justify-center">
                {item.photos && item.photos.length > 0 ? (
                  <Tooltip content="Lihat Foto">
                    <Button
                      isIconOnly
                      size="sm"
                      variant="light"
                      className="text-[#122C93]"
                      onPress={() => onViewImages(item.photos.map((p) => p.view_url))}
                    >
                      <FaImage size={18} />
                    </Button>
                  </Tooltip>
                ) : (
                  <span className="text-gray-400 text-xs">-</span>
                )}
              </div>
            </TableCell>
            <TableCell className="text-center">
              <Button
                size="sm"
                onPress={() => onEdit(item)}
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
