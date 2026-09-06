import { DateRangePicker, Select, SelectItem, Spinner } from "@heroui/react";
import { useActivityLogData } from "../hooks/useActivityLogData";
import { formatLogMessage, getLogIcon } from "../Utils/activityLogFormatter";
import type { RangeValue } from "@react-types/shared";
import { getLocalTimeZone } from "@internationalized/date";

const ClientActivityLog = () => {
  const {
    data,
    actionsList,
    isLoading,
    actionFilter,
    setActionFilter,
    setDateRange,
    hasMore,
    handleNextPage,
  } = useActivityLogData();

  const formatDateTime = (isoString: string) => {
    const d = new Date(isoString);
    const tanggal = d.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
    const jam = d.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit"
    });
    return { tanggal, jam };
  };

  const handleDateChange = (value: RangeValue<any> | null) => {
    if (!value) {
      setDateRange({});
    } else {
      const timeZone = getLocalTimeZone();
      setDateRange({
        start: value.start.toDate(timeZone),
        end: value.end.toDate(timeZone),
      });
    }
  };

  return (
    <div className="container-main flex flex-col items-start gap-3 p-2.5 h-full">
      {/* header title */}
      <h2 className="font-semibold text-xl text-[#122C93]">Activity Log</h2>

      {/* search engine */}
      <div className="container-search rounded-2xl w-full flex flex-row gap-3 items-center bg-[#FFFFFF] p-3 border border-[#E4E9F7]">
        <Select
          className="w-80"
          placeholder="Semua Aksi"
          selectedKeys={[actionFilter]}
          onChange={(e) => setActionFilter(e.target.value || "all")}
          classNames={{
            trigger:
              "bg-white border border-[#E4E9F7] rounded-xl shadow-none h-11 min-h-11 data-[hover=true]:bg-white",
            value: "text-[#8D8787] text-sm",
          }}
        >
          {[
            <SelectItem key="all" textValue="Semua Aksi">Semua Aksi</SelectItem>,
            ...actionsList.map((c) => (
              <SelectItem key={c.action} textValue={c.action}>{c.action}</SelectItem>
            ))
          ]}
        </Select>

        <DateRangePicker
          variant="bordered"
          className="w-72"
          onChange={handleDateChange}
          classNames={{
            inputWrapper: "h-11 min-h-11 rounded-xl border-[#E4E9F7]"
          }}
        />
      </div>
      {/* end of search engine */}

      {/* main content here */}
      <div
        className="main-content-container flex flex-col gap-2 w-full max-h-[680px] flex-1 overflow-y-auto pr-1"
        onScroll={(e) => {
          const { scrollTop, clientHeight, scrollHeight } = e.currentTarget;
          if (scrollHeight - scrollTop <= clientHeight + 50 && hasMore && !isLoading) {
            handleNextPage();
          }
        }}
      >
        {data.map((log) => {
          const Icon = getLogIcon(log.action);
          const message = formatLogMessage(log);
          const { tanggal, jam } = formatDateTime(log.created_at);
          return (
            <div
              key={log.uuid}
              className="card-1 flex flex-row items-center gap-5 p-5 rounded-lg bg-white border border-[#E4E9F7]"
            >
              <Icon className="text-3xl text-[#8D8787] flex-shrink-0" />
              <div className="container-caption flex flex-col items-start w-full">
                <h2 className="text-sm font-medium text-black">{message}</h2>
                <h2 className="text-xs font-light text-[#8D8787] mt-1">
                  <span className="font-semibold text-gray-700 capitalize">{log.actor.nama}</span> ({log.actor.role}) · {tanggal}, {jam}
                </h2>
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex justify-center p-4">
            <Spinner size="sm" />
          </div>
        )}



        {!isLoading && data.length === 0 && (
          <div className="flex justify-center p-8 text-gray-500">
            Tidak ada log aktivitas ditemukan
          </div>
        )}
      </div>
      {/* end of main content */}
    </div>
  );
};

export default ClientActivityLog;
