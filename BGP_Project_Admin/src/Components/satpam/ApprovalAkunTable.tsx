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
import type { Satpam } from "../../types/satpam";

const statusStyles: Record<string, string> = {
  pending: "bg-[#FEF6E0] text-[#B45309]",
  active: "bg-[#E4F9EE] text-[#02A758]",
  rejected: "bg-[#FCE7E9] text-[#E11D48]",
};

const statusLabels: Record<string, string> = {
  pending: "Menunggu",
  active: "Disetujui",
  rejected: "Ditolak",
};

interface ApprovalAkunTableProps {
  data: Satpam[];
  loading: boolean;
  limit: number;
  hasMore: boolean;
  currentPage: number;
  isRejecting: string | null;
  onNextPage: () => void;
  onPrevPage: () => void;
  onApproveConfirm: (item: Satpam) => void;
  onReject: (uuid: string) => void;
}

export const ApprovalAkunTable = ({
  data,
  loading,
  limit,
  hasMore,
  currentPage,
  isRejecting,
  onNextPage,
  onPrevPage,
  onApproveConfirm,
  onReject,
}: ApprovalAkunTableProps) => {
  return (
    <Table
      aria-label="Tabel Approval Akun Satpam"
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
        <TableColumn>No</TableColumn>
        <TableColumn>Nama</TableColumn>
        <TableColumn>Email</TableColumn>
        <TableColumn>NIP</TableColumn>
        <TableColumn>Jabatan</TableColumn>
        <TableColumn>No Telp</TableColumn>
        <TableColumn align="center">Status</TableColumn>
        <TableColumn>Pembuatan</TableColumn>
        <TableColumn align="center">Aksi</TableColumn>
      </TableHeader>

      <TableBody
        items={data}
        emptyContent={loading ? <Spinner /> : "Tidak ada data satpam."}
        isLoading={loading}
        loadingContent={<Spinner />}
      >
        {(item: Satpam) => (
          <TableRow key={item.uuid}>
            <TableCell>
              {(currentPage - 1) * limit + data.indexOf(item) + 1}
            </TableCell>
            <TableCell>{item.nama || "-"}</TableCell>
            <TableCell>{item.email || "-"}</TableCell>
            <TableCell>{item.nip || "-"}</TableCell>
            <TableCell>{item.jabatan || "-"}</TableCell>
            <TableCell>{item.nomor_hp || item.no_telp || "-"}</TableCell>
            <TableCell>
              <div className="flex justify-center">
                <span
                  className={`text-xs font-medium px-3 py-1.5 rounded-full ${
                    statusStyles[item.status || ""] || "bg-gray-100 text-gray-800"
                  }`}
                >
                  {statusLabels[item.status || ""] || item.status || "-"}
                </span>
              </div>
            </TableCell>
            <TableCell>
              {item.created_at ? new Date(item.created_at).toLocaleDateString("id-ID") : "-"}
            </TableCell>
            <TableCell>
              <div className="flex justify-center gap-2">
                {item.status === "pending" ? (
                  <>
                    <Button
                      size="sm"
                      className="bg-[#E4F9EE] text-[#02A758] font-medium"
                      onPress={() => onApproveConfirm(item)}
                    >
                      Setuju
                    </Button>
                    <Button
                      size="sm"
                      className="bg-[#FCE7E9] text-[#E11D48] font-medium"
                      onPress={() => onReject(item.uuid)}
                      isLoading={isRejecting === item.uuid}
                    >
                      Tolak
                    </Button>
                  </>
                ) : (
                  <span className="text-gray-400 text-xs font-medium">
                    {statusLabels[item.status || ""] || "-"}
                  </span>
                )}
              </div>
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};
