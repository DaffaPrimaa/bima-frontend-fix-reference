import { useCallback, useEffect, useState } from "react";
import { FaLocationDot, FaRegClock, FaUser } from "react-icons/fa6";
import { FiSearch } from "react-icons/fi";
import { LuRoute } from "react-icons/lu";
import { MapContainer, Marker, Polyline, TileLayer, useMap } from "react-leaflet";
import { Spinner } from "@heroui/react";
import "leaflet/dist/leaflet.css";
import { decodePolyline, trackingService } from "../services/trackingService";
import { formatDateTimeZone, formatTanggalIndo } from "../Utils/helpers";
import type { TrackingSession, TrackingSessionDetail } from "../types/tracking";

const DEFAULT_CENTER: [number, number] = [-6.9147, 107.6098];

const ATTENDANCE_STATUS_STYLES: Record<string, string> = {
  present: "bg-[#DCFCE7] text-[#008236]",
  late: "bg-[#FEF3C7] text-[#B45309]",
  partial: "bg-[#FEF3C7] text-[#B45309]",
  pending: "bg-[#E8EEFF] text-[#122C93]",
  absent: "bg-[#FEE2E2] text-[#B91C1C]",
  excused: "bg-[#E5E7EB] text-[#374151]",
};

const ATTENDANCE_STATUS_LABELS: Record<string, string> = {
  present: "Tepat Waktu",
  late: "Terlambat",
  partial: "Sebagian",
  pending: "Berlangsung",
  absent: "Tidak Hadir",
  excused: "Izin",
};

const formatJarak = (meters: number): string => {
  const km = meters / 1000;
  return `${km.toFixed(1).replace(".", ",")} Km`;
};

const formatDurasi = (minutes: number | null): string => {
  if (minutes == null) return "-";
  const jam = Math.floor(minutes / 60);
  const menit = minutes % 60;
  if (jam === 0) return `${menit}m`;
  return `${jam}j ${menit}m`;
};

const FitBounds = ({ points }: { points: { lat: number; lng: number }[] }) => {
  const map = useMap();

  useEffect(() => {
    if (points.length === 0) return;
    if (points.length === 1) {
      map.setView([points[0].lat, points[0].lng], 16);
      return;
    }
    map.fitBounds(
      points.map((p) => [p.lat, p.lng]),
      { padding: [24, 24] },
    );
  }, [points, map]);

  return null;
};

const ClientTrackingGps = () => {
  const [sessions, setSessions] = useState<TrackingSession[]>([]);
  const [loadingList, setLoadingList] = useState(true);
  const [listError, setListError] = useState("");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [selectedUuid, setSelectedUuid] = useState<string | null>(null);
  const [detail, setDetail] = useState<TrackingSessionDetail | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [detailError, setDetailError] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(handler);
  }, [search]);

  const fetchSessions = useCallback(async () => {
    setLoadingList(true);
    setListError("");
    try {
      const res = await trackingService.getAll(20, null, debouncedSearch);
      setSessions(res.data || []);
    } catch (error: any) {
      setListError(error.message || "Gagal memuat data sesi absensi");
      setSessions([]);
    } finally {
      setLoadingList(false);
    }
  }, [debouncedSearch]);

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  useEffect(() => {
    if (sessions.length === 0) {
      setSelectedUuid(null);
      return;
    }
    if (!sessions.some((s) => s.uuid === selectedUuid)) {
      setSelectedUuid(sessions[0].uuid);
    }
  }, [sessions]);

  useEffect(() => {
    if (!selectedUuid) {
      setDetail(null);
      return;
    }
    let cancelled = false;
    setLoadingDetail(true);
    setDetailError("");
    trackingService
      .getById(selectedUuid)
      .then((res) => {
        if (!cancelled) setDetail(res.data);
      })
      .catch((error: any) => {
        if (!cancelled) {
          setDetailError(error.message || "Gagal memuat detail sesi absensi");
          setDetail(null);
        }
      })
      .finally(() => {
        if (!cancelled) setLoadingDetail(false);
      });
    return () => {
      cancelled = true;
    };
  }, [selectedUuid]);

  const routePoints = detail ? decodePolyline(detail.clean_polyline) : [];

  return (
    <div className="flex flex-col gap-2 p-2.5 overflow-hidden">
      <div className="header-container flex flex-row items-center justify-between mt-2">
        <div className="flex flex-col items-start">
          <h2 className="font-semibold text-2xl text-[#122C93]">
            Tracking GPS Satpam
          </h2>
          <p className="text-md text-black text-sm w-230">
            Lihat rute perjalanan satpam berdasarkan sesi absensi
          </p>
        </div>
      </div>
      <div className="container-main-content h-[40rem] flex flex-row w-full gap-3">
        <div className="container-left-side w-1/4 h-full flex flex-col bg-white gap-4 rounded-2xl border border-[#E8EEFF] p-3 overflow-hidden">
          <div className="search-bar flex flex-row items-center gap-2 bg-white border border-[#E4E9F7] rounded-xl px-4 h-11 flex-shrink-0">
            <FiSearch className="text-[#B0B0B0] text-base flex-shrink-0" />
            <input
              type="search"
              placeholder="Cari histori pesan"
              className="bg-transparent text-sm text-gray-700 placeholder:text-[#B0B0B0] outline-none w-full"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <hr className="w-full border-[#E4E9F7] flex-shrink-0" />
          <div className="container-list flex flex-col gap-3 flex-1 min-h-0 overflow-y-auto scrollbar-hide pr-1">
            {loadingList ? (
              <div className="flex items-center justify-center py-6">
                <Spinner size="md" />
              </div>
            ) : listError ? (
              <p className="text-xs text-[#B91C1C] text-center py-6">{listError}</p>
            ) : sessions.length === 0 ? (
              <p className="text-xs text-[#8D8787] text-center py-6">
                Belum ada sesi absensi
              </p>
            ) : (
              sessions.map((item) => {
                const status = item.attendance.status;
                return (
                  <div
                    key={item.uuid}
                    onClick={() => setSelectedUuid(item.uuid)}
                    className={`card-1 cursor-pointer border rounded-2xl flex flex-col gap-2 p-3 flex-shrink-0 ${
                      selectedUuid === item.uuid
                        ? "border-[#122C93] bg-[#F0F4FF]"
                        : "border-[#E4E9F7]"
                    }`}
                  >
                    <h2 className="font-medium text-sm">{item.satpam.nama}</h2>
                    <div className="desc-details flex flex-col items-start">
                      <h2 className="text-xs font-light text-[#8D8787]">
                        NIP {item.satpam.nip}
                      </h2>
                      <h2 className="text-xs font-light text-[#8D8787]">
                        {formatTanggalIndo(item.work_date)}
                      </h2>
                    </div>
                    <div
                      className={`chip -mt-4 self-end rounded-4xl px-4 py-1 ${
                        ATTENDANCE_STATUS_STYLES[status] || ATTENDANCE_STATUS_STYLES.pending
                      }`}
                    >
                      <h2 className="text-xs">
                        {ATTENDANCE_STATUS_LABELS[status] || status}
                      </h2>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
        <div className="container-right-side flex flex-col gap-4 w-3/4">
          {loadingDetail ? (
            <div className="flex-1 flex items-center justify-center bg-white rounded-2xl border border-[#E4E9F7]">
              <Spinner size="lg" />
            </div>
          ) : detailError ? (
            <div className="flex-1 flex items-center justify-center bg-white rounded-2xl border border-[#E4E9F7]">
              <p className="text-sm text-[#B91C1C]">{detailError}</p>
            </div>
          ) : !detail ? (
            <div className="flex-1 flex items-center justify-center bg-white rounded-2xl border border-[#E4E9F7]">
              <p className="text-sm text-[#8D8787]">Pilih sesi absensi untuk melihat detail</p>
            </div>
          ) : (
            <>
              <div className="header-name-user flex flex-row w-full items-center justify-between bg-white rounded-2xl border border-[#E4E9F7] p-4">
                <div className="left-side flex flex-row items-center gap-3">
                  <div className="user-logo-container p-3 rounded-2xl bg-[#e0e0e0]">
                    <FaUser className="text-3xl" />
                  </div>
                  <div className="name-content flex flex-col items-start">
                    <h2 className="text-md font-semibold">{detail.satpam.nama}</h2>
                    <h2 className="text-xs text-[#8D8787]">NIP {detail.satpam.nip}</h2>
                    <h2 className="text-xs text-[#8D8787]">
                      Masuk: {formatDateTimeZone(detail.attendance.checked_in_at)} • Keluar:{" "}
                      {formatDateTimeZone(detail.attendance.checked_out_at)}
                    </h2>
                  </div>
                </div>
                <div className="right-side">
                  <div
                    className={`chip rounded-4xl px-4 py-1 ${
                      ATTENDANCE_STATUS_STYLES[detail.attendance.status] ||
                      ATTENDANCE_STATUS_STYLES.pending
                    }`}
                  >
                    <h2 className="text-xs">
                      {ATTENDANCE_STATUS_LABELS[detail.attendance.status] ||
                        detail.attendance.status}
                    </h2>
                  </div>
                </div>
              </div>
              <div className="maps-section flex-1 flex flex-col w-full gap-3 bg-white rounded-2xl border border-[#E4E9F7] p-4 min-h-0">
                <div className="header-container-user flex flex-col">
                  <h2 className="text-md font-semibold text-[#122C93]">
                    Statistik Perjalanan
                  </h2>
                  <h2 className="text-xs text-[#8D8787]">Ringkasan Patroli</h2>
                </div>

                <div className="indicator-container flex flex-row w-full justify-between gap-2">
                  <div className="card-1 flex flex-row w-full gap-2 items-center border border-[#E4E9F7] rounded-2xl p-3">
                    <div className="logo-content p-3 bg-[#DBEAFE] rounded-xl">
                      <LuRoute className="text-xl text-[#122C93]" />
                    </div>
                    <div className="desc flex flex-col items-start">
                      <h2 className="text-md font-semibold text-[#122C93]">
                        {formatJarak(detail.distance_meters)}
                      </h2>
                      <h2 className="text-xs">Total Jarak Tempuh</h2>
                    </div>
                  </div>
                  <div className="card-1 flex flex-row w-full gap-2 items-center border border-[#E4E9F7] rounded-2xl p-3">
                    <div className="logo-content p-3 bg-[#DBEAFE] rounded-xl">
                      <FaRegClock className="text-xl text-[#122C93]" />
                    </div>
                    <div className="desc flex flex-col items-start">
                      <h2 className="text-md font-semibold text-[#122C93]">
                        {formatDurasi(detail.duration_minutes)}
                      </h2>
                      <h2 className="text-xs">Total Durasi</h2>
                    </div>
                  </div>
                  <div className="card-1 flex flex-row w-full gap-2 items-center border border-[#E4E9F7] rounded-2xl p-3">
                    <div className="logo-content p-3 bg-[#DBEAFE] rounded-xl">
                      <FaLocationDot className="text-xl text-[#122C93]" />
                    </div>
                    <div className="desc flex flex-col items-start">
                      <h2 className="text-md font-semibold text-[#122C93]">
                        {routePoints.length}
                      </h2>
                      <h2 className="text-xs">Titik GPS Terekam</h2>
                    </div>
                  </div>
                </div>

                <div className="relative flex-1 min-h-0 rounded-xl overflow-hidden">
                  {routePoints.length === 0 && (
                    <div className="absolute inset-0 z-[1000] flex items-center justify-center bg-white/70">
                      <p className="text-sm text-[#8D8787]">Rute GPS belum tercatat</p>
                    </div>
                  )}
                  <MapContainer
                    center={DEFAULT_CENTER}
                    zoom={13}
                    scrollWheelZoom
                    style={{ height: "100%", width: "100%" }}
                  >
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    {routePoints.length > 0 && (
                      <>
                        <Polyline
                          positions={routePoints.map((p) => [p.lat, p.lng])}
                          pathOptions={{ color: "#122C93", weight: 4 }}
                        />
                        <Marker position={[routePoints[0].lat, routePoints[0].lng]} />
                        {routePoints.length > 1 && (
                          <Marker
                            position={[
                              routePoints[routePoints.length - 1].lat,
                              routePoints[routePoints.length - 1].lng,
                            ]}
                          />
                        )}
                        <FitBounds points={routePoints} />
                      </>
                    )}
                  </MapContainer>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClientTrackingGps;
