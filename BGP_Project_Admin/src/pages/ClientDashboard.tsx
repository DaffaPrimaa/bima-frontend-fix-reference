import { useState, useEffect } from "react";
import { useDashboard } from "../hooks/useDashboard";
import { dashboardService } from "../services/dashboardService";
import { IoLocationOutline, IoPersonOutline } from "react-icons/io5";
import { GiPoliceOfficerHead } from "react-icons/gi";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LabelList,
} from "recharts";
import { Spinner } from "@heroui/react";
import type { ClientDashboardData, OffenderItem } from "../types/dashboard";

const legendFormatter = (value: string) => {
  const labels: Record<string, string> = {
    telat: "Telat",
    tidak_hadir: "Tidak Hadir",
    teguran: "Teguran",
    sp: "SP",
  };
  return (
    <span style={{ fontSize: 11, color: "#374151" }}>
      {labels[value] || value}
    </span>
  );
};

const ClientDashboard = () => {
  const { user, greeting } = useDashboard();
  const [summary, setSummary] = useState<ClientDashboardData | null>(null);
  const [offenders, setOffenders] = useState<OffenderItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [summaryRes, offendersRes] = await Promise.all([
          dashboardService.getSummary(),
          dashboardService.getOffenders(5),
        ]);
        setSummary(summaryRes.data as ClientDashboardData);
        setOffenders(offendersRes.data);
      } catch (error) {
        console.error("Fetch dashboard error:", error);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const satpamAssigned = summary?.satpam_assigned ?? 0;
  const posts = summary?.posts ?? 0;
  const scheduledToday = summary?.scheduled_today ?? 0;
  const today = summary?.today;

  const kehadiranHariIni = [
    {
      label: "Tepat Waktu",
      count: today?.ontime ?? 0,
      color: "#122C93",
      sub: "Check in sesuai jadwal",
    },
    {
      label: "Terlambat",
      count: today?.late ?? 0,
      color: "#CB9235",
      sub: "Melewati jam masuk shift",
    },
    {
      label: "Izin/Sakit",
      count: (today?.excused ?? 0) + (today?.cuti ?? 0),
      color: "#2F58FB",
      sub: "Dengan keterangan resmi",
    },
    {
      label: "Tidak Hadir",
      count: today?.absent ?? 0,
      color: "#A70202",
      sub: "Tanpa kabar",
    },
  ];

  const perhatianData = offenders.map((o) => ({
    nama: o.nama,
    telat: o.late,
    tidak_hadir: o.absent,
    teguran: o.teguran,
    sp: o.sp,
  }));

  return (
    <div className="flex flex-col p-3 bg-gray-50/50 gap-2">
      {/* HEADER */}
      <div>
        <h1 className="text-lg font-bold text-[#122C93]">Dashboard</h1>
        <p className="text-gray-500 text-[11px]">
          {greeting}, {user?.nama || "User"}. Silakan pilih menu di bawah ini.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Spinner size="lg" />
        </div>
      ) : (
        <>
          {/* STAT GRID */}
          <div className="grid grid-cols-3 gap-2">
            <div className="flex flex-col bg-white p-3 rounded-xl border border-[#E8EEFF] justify-between">
              <div className="flex flex-row items-center justify-between">
                <h2 className="text-[12px] font-semibold">Jumlah Satpam</h2>
                <div className="bg-[#DBEAFE] p-1.5 rounded-xl">
                  <GiPoliceOfficerHead className="text-xl text-[#122C93]" />
                </div>
              </div>
              <div className="flex flex-row items-end gap-1 mt-1">
                <h2 className="font-extrabold text-[26px] leading-none text-[#122C93]">
                  {satpamAssigned}
                </h2>
                <h2 className="font-light text-[11px] text-black mb-0.5">
                  Personel ditugaskan
                </h2>
              </div>
            </div>

            <div className="flex flex-col bg-white p-3 rounded-xl border border-[#E8EEFF] justify-between">
              <div className="flex flex-row items-center justify-between">
                <h2 className="text-[12px] font-semibold">Jumlah Pos</h2>
                <div className="bg-[#DBEAFE] p-1.5 rounded-xl">
                  <IoLocationOutline className="text-xl text-[#122C93]" />
                </div>
              </div>
              <div className="flex flex-row items-center gap-2 mt-1">
                <h2 className="font-extrabold text-[26px] leading-none text-[#122C93]">
                  {posts}
                </h2>
                <div className="flex flex-col">
                  <h2 className="font-light text-[11px] text-black">
                    titik penjagaan
                  </h2>
                </div>
              </div>
            </div>

            <div className="flex flex-col bg-white p-3 rounded-xl border border-[#E8EEFF] justify-between">
              <div className="flex flex-row items-center justify-between">
                <h2 className="text-[12px] font-semibold">Jadwal Hari ini</h2>
                <div className="bg-[#DBEAFE] p-1.5 rounded-xl">
                  <IoPersonOutline className="text-xl text-[#122C93]" />
                </div>
              </div>
              <div className="flex flex-row items-end gap-1 mt-1">
                <h2 className="font-extrabold text-[26px] leading-none text-[#122C93]">
                  {scheduledToday}
                </h2>
                <h2 className="font-light text-[11px] text-black mb-0.5">
                  Dari {satpamAssigned} Personel
                </h2>
              </div>
            </div>
          </div>

          {/* KEHADIRAN HARI INI */}
          <div className="flex flex-col gap-1.5">
            <div>
              <h2 className="font-semibold text-base text-[#122C93]">
                Kehadiran Hari Ini
              </h2>
              <h2 className="text-[11px] text-gray-500">
                Status absensi personel yang bertugas
              </h2>
            </div>
            <div className="flex flex-row justify-between bg-white rounded-2xl p-2.5 border border-[#E8EEFF]">
              {kehadiranHariIni.map((item) => (
                <div
                  key={item.label}
                  className="flex flex-row items-center gap-2 mr-40"
                >
                  <div
                    className="rounded-2xl w-1.5 h-14"
                    style={{ background: item.color }}
                  />
                  <div className="flex flex-col">
                    <h2 className="font-semibold text-[11px]">{item.label}</h2>
                    <h2 className="font-semibold text-[24px] leading-tight">
                      {item.count}
                    </h2>
                    <h2 className="text-[11px] text-gray-500">{item.sub}</h2>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* BAR CHART - Satpam Perlu Perhatian */}
          <div className="flex flex-col border border-[#E8EEFF] bg-white rounded-lg gap-1 p-2.5">
            <div>
              <h2 className="font-semibold text-base text-[#122C93]">
                Satpam Perlu Perhatian
              </h2>
              <h2 className="text-[11px] text-gray-500">
                Skor perhatian tertinggi berdasarkan telat, tidak hadir, teguran & SP · 30 hari terakhir
              </h2>
            </div>
            {perhatianData.length === 0 ? (
              <p className="text-xs text-gray-400 text-center py-10">
                Tidak ada satpam yang perlu diperhatikan
              </p>
            ) : (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart
                  data={perhatianData}
                  margin={{ top: 16, right: 16, left: -15, bottom: 0 }}
                  barCategoryGap="30%"
                  barGap={2}
                >
                  <CartesianGrid
                    strokeDasharray="4 4"
                    stroke="#e0e0e0"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="nama"
                    tick={{ fontSize: 11, fill: "#6b7280" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: "#6b7280" }}
                    axisLine={false}
                    tickLine={false}
                    allowDecimals={false}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "8px",
                      border: "1px solid #e5e7eb",
                      fontSize: "11px",
                    }}
                  />
                  <Legend
                    wrapperStyle={{ fontSize: "11px", paddingTop: "4px" }}
                    iconType="square"
                    iconSize={10}
                    formatter={legendFormatter}
                  />
                  <Bar dataKey="telat" fill="#CB9235" radius={[3, 3, 0, 0]}>
                    <LabelList
                      dataKey="telat"
                      position="top"
                      style={{ fontSize: 10, fill: "#374151" }}
                    />
                  </Bar>
                  <Bar dataKey="tidak_hadir" fill="#A70202" radius={[3, 3, 0, 0]}>
                    <LabelList
                      dataKey="tidak_hadir"
                      position="top"
                      style={{ fontSize: 10, fill: "#374151" }}
                    />
                  </Bar>
                  <Bar dataKey="teguran" fill="#2F58FB" radius={[3, 3, 0, 0]}>
                    <LabelList
                      dataKey="teguran"
                      position="top"
                      style={{ fontSize: 10, fill: "#374151" }}
                    />
                  </Bar>
                  <Bar dataKey="sp" fill="#122C93" radius={[3, 3, 0, 0]}>
                    <LabelList
                      dataKey="sp"
                      position="top"
                      style={{ fontSize: 10, fill: "#374151" }}
                    />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ClientDashboard;
