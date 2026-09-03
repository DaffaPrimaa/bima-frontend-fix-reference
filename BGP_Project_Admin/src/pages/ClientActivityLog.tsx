import { useState, useEffect, useCallback, useMemo } from "react";
import { DateRangePicker, Spinner, Button } from "@heroui/react";
import { AiOutlineDelete, AiOutlineUpload } from "react-icons/ai";
import { FaAddressCard, FaUserPlus } from "react-icons/fa6";
import { FiSearch } from "react-icons/fi";
import { GoAlertFill } from "react-icons/go";
import { MdOutlineCalendarMonth, MdOutlineFileDownload, MdOutlineEdit } from "react-icons/md";
import { RiEditBoxFill } from "react-icons/ri";
import type { IconType } from "react-icons";
import { activityLogService } from "../services/activityLogService";
import { formatDateTimeZone } from "../Utils/helpers";
import type { ActivityLog } from "../types/activityLog";

const actionIconFor = (log: ActivityLog): IconType => {
  const actionMap: Record<string, IconType> = {
    "violation.delete": AiOutlineDelete,
    "message.create": FaUserPlus,
  };
  if (actionMap[log.action]) return actionMap[log.action];

  const resourceMap: Record<string, IconType> = {
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
  const payload = log.payload || {};
  const target = payload.nama || payload.satpam?.nama || payload.title || "";
  const verbMap: Record<string, string> = {
    "violation.create": "Anda mencatat pelanggaran",
    "violation.update": "Anda mengubah pelanggaran",
    "violation.delete": "Anda menghapus pelanggaran",
    "message.create": "Anda mengirim pesan",
    "alert.handle": "Anda menandai panic alert sedang ditangani",
    "alert.resolve": "Anda menyelesaikan panic alert",
    "event_report.handle": "Anda menandai laporan kejadian sedang ditangani",
    "event_report.resolve": "Anda menyelesaikan laporan kejadian",
    "attendance.update": "Anda mengubah data absensi",
    "attendance.download": "Anda mengunduh rekap absensi",
    "patrol.update": "Anda mengubah data patroli",
    "patrol.download": "Anda mengunduh rekap patroli",
    "post.create": "Anda membuat pos",
    "post.update": "Anda mengubah pos",
    "post.delete": "Anda menghapus pos",
    "client_settings.update": "Anda mengubah pengaturan radius",
    "shift_pattern.create": "Anda membuat pola shift",
    "shift_pattern.update": "Anda mengubah pola shift",
    "shift_pattern.delete": "Anda menghapus pola shift",
    "shift_assignment.create": "Anda menugaskan satpam ke shift",
    "shift_assignment.update": "Anda mengubah penugasan shift",
    "shift_assignment.delete": "Anda menghapus penugasan shift",
    "shift_instance.generate": "Anda membangkitkan jadwal shift",
  };
  const verb = verbMap[log.action] || `Anda melakukan ${log.action}`;
  return `${verb}${target ? ` ${target}` : ""}`;
};

const ClientActivityLog = () => {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
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
    if (!search.trim()) return logs;
    const term = search.trim().toLowerCase();
    return logs.filter((log) => actionMessage(log).toLowerCase().includes(term));
  }, [logs, search]);

  return (
    <div className="container-main flex flex-col items-start gap-3 p-2.5">
      <h2 className="font-semibold text-xl text-[#122C93]">Activity Log</h2>

      <div className="container-search rounded-2xl w-full flex flex-row gap-3 items-center bg-[#FFFFFF] p-3 border border-[#E4E9F7]">
        <div className="flex flex-row items-center gap-2 bg-white border border-[#E4E9F7] rounded-xl px-4 h-11 flex-1">
          <FiSearch className="text-[#B0B0B0] text-base flex-shrink-0" />
          <input
            type="search"
            placeholder="Cari aktivitas"
            className="bg-transparent text-sm text-gray-700 placeholder:text-[#B0B0B0] outline-none w-full h-full"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

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
                  <h2 className="text-xs font-light">{formatDateTimeZone(log.created_at)}</h2>
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

export default ClientActivityLog;
