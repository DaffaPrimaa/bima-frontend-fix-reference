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
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  addToast,
} from "@heroui/react";
import { FiCamera, FiMapPin } from "react-icons/fi";
import type { EventReport } from "../../types/eventReport";
import { useState } from "react";
import { eventReportService } from "../../services/eventReportService";
import { formatDateTimeZone } from "../../Utils/helpers";
import { EventReportImageModal } from "./EventReportImageModal";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

interface EventReportTableProps {
  data: EventReport[];
  loading: boolean;
  hasMore: boolean;
  currentPage: number;
  limit: number;
  userRole: string;
  onNextPage: () => void;
  onPrevPage: () => void;
  refreshData: () => void;
}

const statusStyles: Record<string, string> = {
  pending: "bg-[#FCE7E9] text-[#E11D48]",
  handled: "bg-[#E8EEFF] text-[#122C93]",
  resolved: "bg-[#E4F9EE] text-[#02A758]",
};

const statusLabels: Record<string, string> = {
  pending: "Masuk",
  handled: "Ditangani",
  resolved: "Selesai",
};

export const EventReportTable = ({
  data,
  loading,
  hasMore,
  currentPage,
  limit,
  userRole,
  onNextPage,
  onPrevPage,
  refreshData,
}: EventReportTableProps) => {
  const [loadingActionId, setLoadingActionId] = useState<string | null>(null);

  // Map modal states
  const { isOpen: isMapOpen, onOpen: onMapOpen, onClose: onMapClose } = useDisclosure();
  const [selectedMapLocation, setSelectedMapLocation] = useState<{ lat: number, lng: number } | null>(null);

  // Image modal states
  const { isOpen: isImageModalOpen, onOpen: onImageModalOpen, onClose: onImageModalClose } = useDisclosure();
  const [selectedPhotos, setSelectedPhotos] = useState<EventReport["photos"]>([]);

  const isClient = userRole.toLowerCase() === "client";

  const columns = [
    { name: "No", uid: "no" },
    { name: "Nama", uid: "nama" },
    { name: "NIP", uid: "nip" },
    { name: "Mitra", uid: "mitra" },
    { name: "Deskripsi", uid: "deskripsi" },
    { name: "Foto", uid: "foto" },
    { name: "Lokasi", uid: "lokasi" },
    { name: "Waktu", uid: "waktu" },
    { name: "Status", uid: "status" },
  ];

  if (isClient) {
    columns.push({ name: "Aksi", uid: "aksi" });
  }

  const handleAction = async (report: EventReport) => {
    setLoadingActionId(report.uuid);
    try {
      if (report.status === "pending") {
        await eventReportService.handleReport(report.uuid);
        addToast({ title: "Berhasil", description: "Laporan ditandai sedang ditangani", color: "success", variant: "flat" });
      } else if (report.status === "handled") {
        await eventReportService.resolveReport(report.uuid);
        addToast({ title: "Berhasil", description: "Laporan ditandai selesai", color: "success", variant: "flat" });
      }
      refreshData();
    } catch (err: any) {
      addToast({ title: "Gagal", description: err.message, color: "danger", variant: "flat" });
    } finally {
      setLoadingActionId(null);
    }
  };

  return (
    <>
      <div className="flex flex-col gap-2 rounded-2xl border border-[#E4E9F7] bg-white">
        <Table
          aria-label="Tabel Laporan Kejadian"
          shadow="none"
          isStriped
          className="rounded-xl"
          bottomContent={
            <div className="flex w-full justify-center">
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
                align={
                  column.uid === "foto" || column.uid === "status" || column.uid === "aksi" || column.uid === "lokasi"
                    ? "center"
                    : "start"
                }
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
                  switch (columnKey) {
                    case "no":
                      return (
                        <TableCell>
                          {(currentPage - 1) * limit + data.indexOf(item) + 1}
                        </TableCell>
                      );
                    case "nama":
                      return <TableCell>{item.satpam?.nama || "-"}</TableCell>;
                    case "nip":
                      return <TableCell>{item.satpam?.nip || "-"}</TableCell>;
                    case "mitra":
                      return <TableCell>{item.satpam?.client || "-"}</TableCell>;
                    case "deskripsi":
                      return (
                        <TableCell>
                          <div className="w-[280px] text-sm text-black line-clamp-2" title={item.description}>
                            {item.description || "-"}
                          </div>
                        </TableCell>
                      );
                    case "foto":
                      const hasPhotos = item.photos && item.photos.length > 0 && item.photos.some(p => p.view_url);
                      return (
                        <TableCell>
                          <div className="flex justify-center">
                            <button
                              onClick={() => {
                                if (hasPhotos) {
                                  setSelectedPhotos(item.photos);
                                  onImageModalOpen();
                                }
                              }}
                              className={`flex items-center justify-center w-9 h-9 rounded-lg ${hasPhotos
                                ? "bg-[#E8EEFF] hover:bg-[#DCE4FF] cursor-pointer text-[#122C93]"
                                : "bg-gray-100 opacity-50 cursor-not-allowed text-gray-400"
                                }`}
                              disabled={!hasPhotos}
                            >
                              <FiCamera className="text-base" />
                            </button>
                          </div>
                        </TableCell>
                      );
                    case "lokasi":
                      return (
                        <TableCell>
                          <div className="flex justify-center">
                            {item.location ? (
                              <button
                                onClick={() => {
                                  setSelectedMapLocation({ lat: item.location.lat, lng: item.location.lng });
                                  onMapOpen();
                                }}
                                className="flex items-center gap-1 text-[#122C93] font-medium text-sm hover:underline"
                              >
                                <FiMapPin /> Lihat Peta
                              </button>
                            ) : (
                              <span className="text-gray-400">-</span>
                            )}
                          </div>
                        </TableCell>
                      );
                    case "waktu":
                      return <TableCell>{formatDateTimeZone(item.created_at)}</TableCell>;
                    case "status":
                      return (
                        <TableCell>
                          <div className="flex justify-center">
                            <span
                              className={`text-xs font-medium px-3 py-1.5 rounded-full whitespace-nowrap ${statusStyles[item.status] || "bg-gray-100 text-gray-700"}`}
                            >
                              {statusLabels[item.status] || item.status}
                            </span>
                          </div>
                        </TableCell>
                      );
                    case "aksi":
                      return (
                        <TableCell>
                          <div className="flex justify-center min-w-[120px]">
                            {item.status === "pending" && (
                              <Button
                                size="sm"
                                className="bg-[#122C93] text-white font-semibold w-full"
                                isLoading={loadingActionId === item.uuid}
                                onPress={() => handleAction(item)}
                              >
                                Tandai Ditangani
                              </Button>
                            )}
                            {item.status === "handled" && (
                              <Button
                                size="sm"
                                className="bg-[#02A758] text-white font-semibold w-full"
                                isLoading={loadingActionId === item.uuid}
                                onPress={() => handleAction(item)}
                              >
                                Selesai
                              </Button>
                            )}
                            {item.status === "resolved" && (
                              <span className="text-xs font-semibold text-gray-400 italic">
                                Telah selesai
                              </span>
                            )}
                          </div>
                        </TableCell>
                      );
                    default:
                      return <TableCell>-</TableCell>;
                  }
                }}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Modal isOpen={isMapOpen} onClose={onMapClose} size="5xl">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Lokasi Kejadian</ModalHeader>
              <ModalBody>
                {selectedMapLocation && (
                  <div className="w-full h-[600px] rounded-lg overflow-hidden border border-gray-200">
                    <MapContainer
                      center={[selectedMapLocation.lat, selectedMapLocation.lng]}
                      zoom={15}
                      style={{ height: "100%", width: "100%", zIndex: 1 }}
                    >
                      <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      />
                      <Marker position={[selectedMapLocation.lat, selectedMapLocation.lng]} />
                    </MapContainer>
                  </div>
                )}
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Tutup
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      <EventReportImageModal
        isOpen={isImageModalOpen}
        onClose={onImageModalClose}
        photos={selectedPhotos}
      />
    </>
  );
};
