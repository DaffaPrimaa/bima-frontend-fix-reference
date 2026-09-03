import { useState, useEffect, useCallback, useMemo } from "react";
import { DateRangePicker, Select, SelectItem, Spinner, Button } from "@heroui/react";
import { AiOutlineDelete, AiOutlineUpload } from "react-icons/ai";
import { FaUserTimes } from "react-icons/fa";
import { FaAddressCard, FaUserCheck, FaUserPlus } from "react-icons/fa6";
import { FiSearch } from "react-icons/fi";
import { GoAlertFill } from "react-icons/go";
import { HiDocumentCheck } from "react-icons/hi2";
import { MdOutlineCalendarMonth, MdOutlineFileDownload, MdOutlineEdit } from "react-icons/md";
import { RiEditBoxFill } from "react-icons/ri";
import type { IconType } from "react-icons";
import { activityLogService } from "../services/activityLogService";
import { formatDateTimeZone } from "../Utils/helpers";
import type { ActivityLog } from "../types/activityLog";

const roleOptions = [
  { key: "all", label: "Semua Peran" },
  { key: "admin", label: "Admin" },
  { key: "client", label: "Client" },
];

const actionIconFor = (log: ActivityLog): IconType => {
  const actionMap: Record<string, IconType> = {
    "satpam.approve": FaUserCheck,
    "satpam.reject": FaUserTimes,
    "satpam.delete": AiOutlineDelete,
    "violation.delete": AiOutlineDelete,
    "document.download": HiDocumentCheck,
    "message.create": FaUserPlus,
  };
  if (actionMap[log.action]) return actionMap[log.action];

  const resourceMap: Record<string, IconType> = {
    satpam: FaUserCheck,
    violation: GoAlertFill,
    document: AiOutlineUpload,
    shared_document: AiOutlineUpload,
    shift_assignment: FaAddressCard,
    shift_pattern: MdOutlineCalendarMonth,
    shift_instance: MdOutlineCalendarMonth,
    shift_exception: MdOutlineCalendarMonth,
    attendance: MdOutlineFileDownload,
    patrol: MdOutlineFileDownload,
    alert: GoAlertFill,
    event_report: GoAlertFill,
    message: FaUserPlus,
    client_settings: MdOutlineEdit,
    post: RiEditBoxFill,
  };
  return resourceMap[log.resource] || RiEditBoxFill;
};

const actionMessage = (log: ActivityLog): string => {
  const actorRole = log.actor.role === "admin" ? "Admin" : log.actor.role === "client" ? log.actor.nama : log.actor.nama;
  const payload = log.payload || {};
  const target = payload.nama || payload.satpam?.nama || payload.title || "";
  const verbMap: Record<string, string> = {
    "satpam.approve": "menyetujui akun satpam",
    "satpam.reject": "menolak akun satpam",
    "satpam.update": "mengubah data satpam",
    "satpam.delete": "menghapus data satpam",
    "satpam.card_data": "mencetak kartu tanda anggota",
    "violation.create": "mencatat pelanggaran",
    "violation.update": "mengubah pelanggaran",
    "violation.delete": "menghapus pelanggaran",
    "document.download": "mengunduh dokumen",
    "message.create": "mengirim pesan",
    "alert.handle": "menandai panic alert sedang ditangani",
    "alert.resolve": "menyelesaikan panic alert",
    "event_report.handle": "menandai laporan kejadian sedang ditangani",
    "event_report.resolve": "menyelesaikan laporan kejadian",
    "attendance.update": "mengubah data absensi",
    "attendance.download": "mengunduh rekap absensi",
    "patrol.update": "mengubah data patroli",
    "patrol.download": "mengunduh rekap patroli",
    "post.create": "membuat pos",
    "post.update": "mengubah pos",
    "post.delete": "menghapus pos",
    "client_settings.update": "mengubah pengaturan radius",
  };
  const verb = verbMap[log.action] || log.action;
  return `${actorRole} ${verb}${target ? ` ${target}` : ""}`;
};

const AdminActivityLog = () => {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [dateRange, setDateRange] = useState<{ start?: any; end?: any }>({});

  const [cursorHistory, setCursorHistory] = useState<(string | null)[]>([null]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [nextCursor, setNextCursor] = useState<string | null>(null);

  const from = dateRange.start ? dateRange.start.toString() : undefined;
  const to = dateRange.end ? dateRange.end.toString() : undefined;

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    try {
      const cursor = cursorHistory[currentIndex];
      const res = await activityLogService.getAll({ limit: 15, cursor, from, to });
      setLogs(res.data || []);
      setHasMore(res.meta?.has_more ?? false);
      setNextCursor(res.meta?.next_cursor ?? null);
    } catch (error) {
      console.error("Fetch activity log error:", error);
      setLogs([]);
      setHasMore(false);
      setNextCursor(null);
    } finally {
      setLoading(false);
    }
  }, [cursorHistory, currentIndex, from, to]);

  useEffect(() => {
    setCursorHistory([null]);
    setCurrentIndex(0);
  }, [from, to]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const handleNextPage = () => {
    if (hasMore && nextCursor) {
      setCursorHistory([...cursorHistory.slice(0, currentIndex + 1), nextCursor]);
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      if (roleFilter !== "all" && log.actor.role !== roleFilter) return false;
      if (search.trim()) {
        const term = search.trim().toLowerCase();
        if (!log.actor.nama?.toLowerCase().includes(term)) return false;
      }
      return true;
    });
  }, [logs, roleFilter, search]);

  return (
    <div className="container-main flex flex-col items-start gap-3 p-2.5">
      <h2 className="font-semibold text-xl text-[#122C93]">Activity Log</h2>

      <div className="container-search rounded-2xl w-full flex flex-row gap-3 items-center bg-[#FFFFFF] p-3 border border-[#E4E9F7]">
        <div className="flex flex-row items-center gap-2 bg-white border border-[#E4E9F7] rounded-xl px-4 h-11 flex-1">
          <FiSearch className="text-[#B0B0B0] text-base flex-shrink-0" />
          <input
            type="search"
            placeholder="Cari nama pelaku"
            className="bg-transparent text-sm text-gray-700 placeholder:text-[#B0B0B0] outline-none w-full h-full"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select
          className="w-48"
          placeholder="Peran"
          selectedKeys={[roleFilter]}
          onChange={(e) => setRoleFilter(e.target.value || "all")}
          classNames={{
            trigger:
              "bg-white border border-[#E4E9F7] rounded-xl shadow-none h-11 min-h-11 data-[hover=true]:bg-white",
            value: "text-[#8D8787] text-sm",
          }}
        >
          {roleOptions.map((r) => (
            <SelectItem key={r.key}>{r.label}</SelectItem>
          ))}
        </Select>

        <DateRangePicker
          variant="bordered"
          className="h-11 w-70"
          label="Filter Tanggal"
          onChange={(value) => setDateRange(value || {})}
        />
      </div>

      <div className="main-content-container flex flex-col gap-2 w-full max-h-[680px] flex-1 overflow-y-auto pr-1">
        {loading ? (
          <div className="flex justify-center py-10">
            <Spinner size="lg" />
          </div>
        ) : filteredLogs.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-10">Tidak ada aktivitas</p>
        ) : (
          filteredLogs.map((log) => {
            const Icon = actionIconFor(log);
            return (
              <div
                key={log.uuid}
                className="card-1 flex flex-row items-center gap-5 p-5 rounded-lg bg-white border border-[#E4E9F7]"
              >
                <Icon className="text-3xl text-[#8D8787] flex-shrink-0" />
                <div className="container-caption flex flex-col items-start">
                  <h2 className="text-sm font-medium">{actionMessage(log)}</h2>
                  <h2 className="text-xs font-light">
                    {log.actor.role === "admin" ? "Admin" : "Client"} · {formatDateTimeZone(log.created_at)}
                  </h2>
                </div>
              </div>
            );
          })
        )}
      </div>

      {(hasMore || currentIndex > 0) && (
        <div className="flex w-full justify-center gap-2 pt-1">
          <Button
            size="sm"
            isDisabled={currentIndex === 0}
            onPress={handlePrevPage}
            className="bg-white border border-[#E4E9F7] text-[#122C93]"
          >
            Sebelumnya
          </Button>
          <Button
            size="sm"
            isDisabled={!hasMore}
            onPress={handleNextPage}
            className="bg-white border border-[#E4E9F7] text-[#122C93]"
          >
            Berikutnya
          </Button>
        </div>
      )}
    </div>
  );
};

export default AdminActivityLog;
