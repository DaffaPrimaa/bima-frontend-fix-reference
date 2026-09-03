import { useState, useEffect, useCallback, useMemo } from "react";
import {
  Button,
  Select,
  SelectItem,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Pagination,
  Spinner,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  addToast,
} from "@heroui/react";
import { FiSearch, FiMapPin } from "react-icons/fi";
import { GoAlertFill } from "react-icons/go";
import { alertService } from "../services/alertService";
import { userService } from "../services/userService";
import { getRole, formatDateTimeZone } from "../Utils/helpers";
import type { Alert } from "../types/alert";
import type { User } from "../types/user";
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

const filters = [
  { key: "semua", label: "Semua" },
  { key: "active", label: "Aktif" },
  { key: "handled", label: "Dalam Penanganan" },
  { key: "resolved", label: "Selesai" },
];

const statusStyles: Record<Alert["status"], string> = {
  active: "bg-[#FFE2E2] text-[#F31260]",
  handled: "bg-[#E8EEFF] text-[#122C93]",
  resolved: "bg-[#E4F9EE] text-[#02A758]",
};

const statusLabels: Record<Alert["status"], string> = {
  active: "Aktif",
  handled: "Dalam Penanganan",
  resolved: "Selesai",
};

const AdminPanicAlert = () => {
  const [userRole, setUserRole] = useState("");
  const isClient = userRole.toLowerCase() === "client";

  const [activeFilter, setActiveFilter] = useState("semua");
  const [search, setSearch] = useState("");
  const [mitraFilter, setMitraFilter] = useState("all");
  const [clients, setClients] = useState<User[]>([]);

  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [activeAlerts, setActiveAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingActionId, setLoadingActionId] = useState<string | null>(null);

  const [cursorHistory, setCursorHistory] = useState<(string | null)[]>([null]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const limit = 10;

  const { isOpen: isMapOpen, onOpen: onMapOpen, onClose: onMapClose } = useDisclosure();
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    const role = getRole();
    if (role) setUserRole(role);
  }, []);

  useEffect(() => {
    if (userRole.toLowerCase() !== "admin") return;
    userService
      .getAll(50)
      .then((res) => setClients(res.data || []))
      .catch(() => setClients([]));
  }, [userRole]);

  const fetchAlerts = useCallback(async () => {
    setLoading(true);
    try {
      const cursor = cursorHistory[currentIndex];
      const status = activeFilter !== "semua" ? activeFilter : undefined;
      const res = await alertService.getAll({ limit, cursor, status });
      setAlerts(res.data || []);
      setHasMore(res.meta?.has_more ?? false);
      setNextCursor(res.meta?.next_cursor ?? null);
    } catch (error) {
      console.error("Fetch alerts error:", error);
      setAlerts([]);
      setHasMore(false);
      setNextCursor(null);
    } finally {
      setLoading(false);
    }
  }, [cursorHistory, currentIndex, activeFilter]);

  const fetchActiveAlerts = useCallback(async () => {
    try {
      const res = await alertService.getAll({ status: "active", limit: 4 });
      setActiveAlerts(res.data || []);
    } catch (error) {
      console.error("Fetch active alerts error:", error);
      setActiveAlerts([]);
    }
  }, []);

  useEffect(() => {
    setCursorHistory([null]);
    setCurrentIndex(0);
  }, [activeFilter]);

  useEffect(() => {
    fetchAlerts();
  }, [fetchAlerts]);

  useEffect(() => {
    fetchActiveAlerts();
  }, [fetchActiveAlerts]);

  const handleNextPage = () => {
    if (hasMore && nextCursor) {
      setCursorHistory([...cursorHistory.slice(0, currentIndex + 1), nextCursor]);
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };

  const handleAction = async (alert: Alert) => {
    setLoadingActionId(alert.uuid);
    try {
      if (alert.status === "active") {
        await alertService.handle(alert.uuid);
        addToast({ title: "Berhasil", description: "Panic alert ditandai sedang ditangani", color: "success", variant: "flat" });
      } else if (alert.status === "handled") {
        await alertService.resolve(alert.uuid);
        addToast({ title: "Berhasil", description: "Panic alert ditandai selesai", color: "success", variant: "flat" });
      }
      fetchAlerts();
      fetchActiveAlerts();
    } catch (err: any) {
      addToast({ title: "Gagal", description: err.message, color: "danger", variant: "flat" });
    } finally {
      setLoadingActionId(null);
    }
  };

  const filteredAlerts = useMemo(() => {
    return alerts.filter((a) => {
      if (mitraFilter !== "all" && a.client !== mitraFilter) return false;
      if (search.trim()) {
        const term = search.trim().toLowerCase();
        if (
          !a.satpam.nama.toLowerCase().includes(term) &&
          !a.satpam.nip.toLowerCase().includes(term)
        )
          return false;
      }
      return true;
    });
  }, [alerts, mitraFilter, search]);

  const columns = [
    { name: "No", uid: "no" },
    { name: "Nama", uid: "nama" },
    { name: "NIP", uid: "nip" },
    { name: "Mitra", uid: "mitra" },
    { name: "Lokasi", uid: "lokasi" },
    { name: "Waktu", uid: "waktu" },
    { name: "Status", uid: "status" },
  ];
  if (isClient) columns.push({ name: "Aksi", uid: "aksi" });

  return (
    <div className="flex flex-col gap-2 p-2.5">
      <div className="header-container flex flex-row items-center justify-between mt-2">
        <div className="flex flex-col items-start">
          <h2 className="font-semibold text-2xl text-[#122C93]">Panic Alert</h2>
          <p className="text-md text-black text-sm w-200">
            Tombol darurat satpam. Status Aktif perlu tindakan secepatnya.
          </p>
        </div>
      </div>

      <div className="container-search rounded-2xl flex flex-row gap-3 items-center bg-[#FFFFFF] p-3 border border-[#E4E9F7]">
        <div className="flex flex-row items-center gap-2 bg-white border border-[#E4E9F7] rounded-xl px-4 h-11 flex-1">
          <FiSearch className="text-[#B0B0B0] text-base flex-shrink-0" />
          <input
            type="search"
            placeholder="Cari nama atau NIP"
            className="bg-transparent text-sm text-gray-700 placeholder:text-[#B0B0B0] outline-none w-full h-full"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        {!isClient && (
          <Select
            className="w-52"
            placeholder="Semua Mitra"
            selectedKeys={[mitraFilter]}
            onChange={(e) => setMitraFilter(e.target.value || "all")}
            classNames={{
              trigger:
                "bg-white border border-[#E4E9F7] rounded-xl shadow-none h-11 min-h-11 data-[hover=true]:bg-white",
              value: "text-[#8D8787] text-sm",
            }}
          >
            <>
              <SelectItem key="all">Semua Mitra</SelectItem>
              {clients.map((c) => (
                <SelectItem key={c.nama}>{c.nama}</SelectItem>
              ))}
            </>
          </Select>
        )}
        <div className="container-selector-filter flex flex-row gap-2 items-center">
          {filters.map((f) => (
            <Button
              key={f.key}
              size="sm"
              onPress={() => setActiveFilter(f.key)}
              className={
                activeFilter === f.key
                  ? "bg-[#122C93] text-white font-semibold h-11"
                  : "bg-white text-[#122C93] border border-[#E4E9F7] h-11 font-medium"
              }
            >
              {f.label}
            </Button>
          ))}
        </div>
      </div>

      <div className="main-container-card-table flex flex-col gap-2 mt-3">
        <h2 className="font-semibold">
          Aktif <span className="text-danger">({activeAlerts.length})</span>
        </h2>

        {activeAlerts.length > 0 && (
          <div className="card-scroll flex flex-row items-center gap-2 overflow-x-auto">
            {activeAlerts.map((alert) => (
              <div
                key={alert.uuid}
                className="card-1 w-md flex-shrink-0 flex flex-col gap-3 items-start p-5 bg-white border border-[#A70202] rounded-xl"
              >
                <div className="header-card flex flex-row items-center w-full justify-between">
                  <div className="left-side flex flex-row items-center gap-3">
                    <div className="logo-container bg-[#FFE2E2] rounded-2xl p-5">
                      <GoAlertFill className="text-3xl text-[#A70202]" />
                    </div>
                    <div className="desc-container gap-1.5 flex flex-col items-start">
                      <h2 className="text-sm font-semibold">{alert.satpam.nama}</h2>
                      <h2 className="text-[#6B6B6B] text-xs font-medium">
                        NIP {alert.satpam.nip} · {formatDateTimeZone(alert.created_at)}
                      </h2>
                      <h2 className="font-semibold text-xs text-[#122C93]">
                        {alert.client || "-"}
                      </h2>
                    </div>
                  </div>
                  <div className="indicator-active bg-[#FFE2E2] -mt-15 rounded-2xl px-5">
                    <h2 className="text-[#F31260] font-medium text-sm">Aktif</h2>
                  </div>
                </div>
                <div className="bottom-side flex flex-row items-center justify-between w-full">
                  <button
                    onClick={() => {
                      setSelectedLocation({ lat: alert.lat, lng: alert.lng });
                      onMapOpen();
                    }}
                    className="font-medium text-md text-[#122C93] hover:underline"
                  >
                    Lihat Lokasi
                  </button>
                  <h2 className="italic text-[#6B6B6B] text-sm">
                    {isClient ? "Menunggu ditangani" : "Menunggu Client menangani"}
                  </h2>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="table-container mt-3">
          <Table
            aria-label="Tabel Riwayat Panic Alert"
            shadow="none"
            isStriped
            className="rounded-xl border border-gray-200"
            bottomContent={
              <div className="flex w-full justify-center gap-2">
                <Pagination
                  showControls
                  showShadow
                  color="primary"
                  page={currentIndex + 1}
                  total={Math.max(currentIndex + 1 + (hasMore ? 1 : 0), 1)}
                  onChange={(page) => {
                    if (page > currentIndex + 1) handleNextPage();
                    else if (page < currentIndex + 1) handlePrevPage();
                  }}
                  classNames={{ item: "[&:not([data-active=true])]:hidden" }}
                />
              </div>
            }
          >
            <TableHeader columns={columns}>
              {(column) => (
                <TableColumn key={column.uid} align={column.uid === "status" || column.uid === "aksi" || column.uid === "lokasi" ? "center" : "start"}>
                  {column.name}
                </TableColumn>
              )}
            </TableHeader>

            <TableBody items={filteredAlerts} emptyContent={loading ? <Spinner size="lg" /> : "Tidak ada data"}>
              {(item) => (
                <TableRow key={item.uuid}>
                  {(columnKey) => {
                    switch (columnKey) {
                      case "no":
                        return <TableCell>{currentIndex * limit + filteredAlerts.indexOf(item) + 1}</TableCell>;
                      case "nama":
                        return <TableCell>{item.satpam.nama}</TableCell>;
                      case "nip":
                        return <TableCell>{item.satpam.nip}</TableCell>;
                      case "mitra":
                        return <TableCell>{item.client || "-"}</TableCell>;
                      case "lokasi":
                        return (
                          <TableCell>
                            <div className="flex justify-center">
                              <button
                                onClick={() => {
                                  setSelectedLocation({ lat: item.lat, lng: item.lng });
                                  onMapOpen();
                                }}
                                className="flex items-center gap-1 text-[#122C93] font-medium text-sm hover:underline"
                              >
                                <FiMapPin /> Lihat Peta
                              </button>
                            </div>
                          </TableCell>
                        );
                      case "waktu":
                        return <TableCell>{formatDateTimeZone(item.created_at)}</TableCell>;
                      case "status":
                        return (
                          <TableCell>
                            <div className="flex justify-center">
                              <span className={`text-xs font-medium px-3 py-1.5 rounded-full whitespace-nowrap ${statusStyles[item.status]}`}>
                                {statusLabels[item.status]}
                              </span>
                            </div>
                          </TableCell>
                        );
                      case "aksi":
                        return (
                          <TableCell>
                            <div className="flex justify-center min-w-[120px]">
                              {item.status === "active" && (
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
                                <span className="text-xs font-semibold text-gray-400 italic">Telah selesai</span>
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
      </div>

      <Modal isOpen={isMapOpen} onClose={onMapClose} size="3xl">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Lokasi Panic Alert</ModalHeader>
              <ModalBody>
                {selectedLocation && (
                  <div className="w-full h-[400px] rounded-lg overflow-hidden border border-gray-200">
                    <MapContainer
                      center={[selectedLocation.lat, selectedLocation.lng]}
                      zoom={15}
                      style={{ height: "100%", width: "100%", zIndex: 1 }}
                    >
                      <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      />
                      <Marker position={[selectedLocation.lat, selectedLocation.lng]} />
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
    </div>
  );
};

export default AdminPanicAlert;
