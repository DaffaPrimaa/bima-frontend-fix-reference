import { useDashboard } from "../hooks/useDashboard";
import { IoLocationOutline, IoPersonOutline } from "react-icons/io5";
import { GiPoliceOfficerHead } from "react-icons/gi";
import {
  LineChart,
  Line,
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

const trendData = [
  { bulan: "jan", hadir: 29, terlambat: 13, izin: 5, tidakHadir: 2 },
  { bulan: "feb", hadir: 28, terlambat: 12, izin: 6, tidakHadir: 2 },
  { bulan: "mar", hadir: 29, terlambat: 12, izin: 6, tidakHadir: 2 },
  { bulan: "apr", hadir: 31, terlambat: 10, izin: 7, tidakHadir: 1 },
  { bulan: "mei", hadir: 30, terlambat: 10, izin: 7, tidakHadir: 3 },
  { bulan: "jun", hadir: 29, terlambat: 9, izin: 5, tidakHadir: 4 },
];

const perhatianData = [
  {
    nama: "Prasertyo Teguh",
    hadir: 15,
    terlambat: 25,
    izin: 29,
    tidakHadir: 15,
  },
  { nama: "Satpam 2", hadir: 7, terlambat: 22, izin: 11, tidakHadir: 26 },
  { nama: "Satpam 3", hadir: 8, terlambat: 22, izin: 28, tidakHadir: 18 },
];

const CustomDot = (props: any) => {
  const { cx, cy, stroke } = props;
  return <circle cx={cx} cy={cy} r={3} fill={stroke} stroke={stroke} />;
};

const legendFormatter = (value: string) => {
  const labels: Record<string, string> = {
    hadir: "Hadir",
    terlambat: "Terlambat",
    izin: "Izin/Sakit",
    tidakHadir: "Tidak Hadir",
  };
  return (
    <span style={{ fontSize: 11, color: "#374151" }}>
      {labels[value] || value}
    </span>
  );
};

const ClientDashboard = () => {
  const { user, greeting } = useDashboard();

  return (
    <div className="flex flex-col p-3 bg-gray-50/50 gap-2">
      {/* HEADER */}
      <div>
        <h1 className="text-lg font-bold text-[#122C93]">Dashboard</h1>
        <p className="text-gray-500 text-[11px]">
          {greeting}, {user?.nama || "User"}. Silakan pilih menu di bawah ini.
        </p>
      </div>

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
              170
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
              6
            </h2>
            <div className="flex flex-col">
              <h2 className="font-light text-[11px] text-black">
                titik penjagaan
              </h2>
              <h2 className="font-light text-[11px] text-black">
                1 Pos Utama · 5 Pos Patroli
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
              19
            </h2>
            <h2 className="font-light text-[11px] text-black mb-0.5">
              Dari 30 Personel
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
          {[
            {
              label: "Tepat Waktu",
              count: 13,
              color: "#122C93",
              sub: "Check in sesuai jadwal",
            },
            {
              label: "Terlambat",
              count: 3,
              color: "#CB9235",
              sub: "Melewati jam masuk shift",
            },
            {
              label: "Izin/Sakit",
              count: 3,
              color: "#2F58FB",
              sub: "Dengan keterangan resmi",
            },
            {
              label: "Tidak Hadir",
              count: 0,
              color: "#A70202",
              sub: "Tanpa kabar",
            },
          ].map((item) => (
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

      {/* LINE CHART */}
      <div className="flex flex-col border border-[#E8EEFF] bg-white rounded-lg gap-1 p-2.5">
        <div>
          <h2 className="text-[#122C93] font-semibold text-base">
            Tren kehadiran satpam per Bulan
          </h2>
          <h2 className="text-[#8D8787] font-light text-[11px]">
            Rata-rata tingkat kehadiran personel
          </h2>
        </div>
        <ResponsiveContainer width="100%" height={170}>
          <LineChart
            data={trendData}
            margin={{ top: 8, right: 16, left: -15, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="4 4"
              stroke="#e0e0e0"
              vertical={false}
            />
            <XAxis
              dataKey="bulan"
              tick={{ fontSize: 11, fill: "#6b7280" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "#6b7280" }}
              axisLine={false}
              tickLine={false}
              domain={[0, 35]}
              ticks={[0, 10, 20, 30]}
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
            <Line
              type="monotone"
              dataKey="hadir"
              stroke="#122C93"
              strokeWidth={2}
              dot={<CustomDot />}
              activeDot={{ r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="terlambat"
              stroke="#CB9235"
              strokeWidth={2}
              dot={<CustomDot />}
              activeDot={{ r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="izin"
              stroke="#2F58FB"
              strokeWidth={2}
              dot={<CustomDot />}
              activeDot={{ r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="tidakHadir"
              stroke="#A70202"
              strokeWidth={2}
              dot={<CustomDot />}
              activeDot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* BAR CHART */}
      <div className="flex flex-col border border-[#E8EEFF] bg-white rounded-lg gap-1 p-2.5">
        <div>
          <h2 className="font-semibold text-base text-[#122C93]">
            Satpam Perlu Perhatian
          </h2>
          <h2 className="text-[11px] text-gray-500">
            Skor perhatian tertinggi berdasarkan telat & tidak hadir · 30 hari
            terakhir
          </h2>
        </div>
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
              domain={[0, 35]}
              ticks={[0, 5, 10, 15, 20, 25, 30]}
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
            <Bar dataKey="hadir" fill="#122C93" radius={[3, 3, 0, 0]}>
              <LabelList
                dataKey="hadir"
                position="top"
                style={{ fontSize: 10, fill: "#374151" }}
              />
            </Bar>
            <Bar dataKey="terlambat" fill="#CB9235" radius={[3, 3, 0, 0]}>
              <LabelList
                dataKey="terlambat"
                position="top"
                style={{ fontSize: 10, fill: "#374151" }}
              />
            </Bar>
            <Bar dataKey="izin" fill="#2F58FB" radius={[3, 3, 0, 0]}>
              <LabelList
                dataKey="izin"
                position="top"
                style={{ fontSize: 10, fill: "#374151" }}
              />
            </Bar>
            <Bar dataKey="tidakHadir" fill="#A70202" radius={[3, 3, 0, 0]}>
              <LabelList
                dataKey="tidakHadir"
                position="top"
                style={{ fontSize: 10, fill: "#374151" }}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ClientDashboard;
