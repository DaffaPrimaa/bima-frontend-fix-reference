import { useState, useEffect } from "react";
import { useDashboard } from "../hooks/useDashboard";
import { dashboardService } from "../services/dashboardService";
import { useNavigate } from "react-router-dom";
import { FaBuilding, FaTransgender, FaUsers, FaEye } from "react-icons/fa";
import { IoStatsChart } from "react-icons/io5";
import { PiWarningCircleFill } from "react-icons/pi";
import { BsPersonFillCheck } from "react-icons/bs";
import { GiPoliceOfficerHead } from "react-icons/gi";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import {
  Progress,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Pagination,
  Spinner,
} from "@heroui/react";
import type { AdminDashboardData, OffenderItem } from "../types/dashboard";

const columnsPerhatian = [
  { name: "No", uid: "no" },
  { name: "Nama", uid: "nama" },
  { name: "Telat", uid: "telat" },
  { name: "Tidak Hadir", uid: "tidak_hadir" },
  { name: "Teguran", uid: "teguran" },
  { name: "SP", uid: "sp" },
  { name: "Aksi", uid: "aksi" },
];

const ROWS_PER_PAGE = 5;

const LegendItem = ({ color, label, value }: any) => (
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-2">
      <div className="w-3.5 h-3.5 rounded-sm" style={{ background: color }} />
      <span className="text-xs font-medium text-gray-700">{label}</span>
    </div>
    <span className="text-sm font-bold text-gray-900">{value}</span>
  </div>
);

const DonutChart = ({ data, size = 110, label }: any) => (
  <div className="relative shrink-0" style={{ width: size, height: size }}>
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={size / 2 - 16}
          outerRadius={size / 2}
          dataKey="value"
          startAngle={90}
          endAngle={-270}
          strokeWidth={0}
        >
          {data.map((entry: any, i: any) => (
            <Cell key={i} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value, name) => [value, name]}
          contentStyle={{
            fontSize: 12,
            borderRadius: 6,
            border: "1px solid #e5e7eb",
          }}
        />
      </PieChart>
    </ResponsiveContainer>
    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
      <span className="text-xl font-bold text-[#122C93] leading-none">
        {label.value}
      </span>
      <span className="text-[10px] text-gray-500 mt-1">{label.sub}</span>
    </div>
  </div>
);

const AdminDashboard = () => {
  const { user, greeting } = useDashboard();
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [summary, setSummary] = useState<AdminDashboardData | null>(null);
  const [offenders, setOffenders] = useState<OffenderItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [summaryRes, offendersRes] = await Promise.all([
          dashboardService.getSummary(),
          dashboardService.getOffenders(10),
        ]);
        setSummary(summaryRes.data as AdminDashboardData);
        setOffenders(offendersRes.data);
      } catch (error) {
        console.error("Fetch dashboard error:", error);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const totalPersonel = summary?.satpam.total ?? 0;
  const aktifCount = summary?.satpam.active ?? 0;
  const maleCount = summary?.gender["1"] ?? 0;
  const femaleCount = summary?.gender["2"] ?? 0;
  const pendingCount = summary?.satpam.pending ?? 0;
  const tidakAktifCount = (summary?.satpam.inactive ?? 0) + (summary?.satpam.resign ?? 0) + (summary?.satpam.rejected ?? 0);
  const totalClient = summary?.clients.total ?? 0;
  const aktifPct = totalPersonel > 0 ? Math.round((aktifCount / totalPersonel) * 100) : 0;
  const topClients = (summary?.clients.distribution ?? []).slice(0, 5);
  const maxClientSatpam = Math.max(1, ...topClients.map((c) => c.satpam));

  const genderData = [
    { name: "Laki-laki", value: maleCount, color: "#122C93" },
    { name: "Perempuan", value: femaleCount, color: "#93c5fd" },
  ];
  const statusData = [
    { name: "Aktif", value: aktifCount, color: "#122C93" },
    { name: "Menunggu", value: pendingCount, color: "#93c5fd" },
    { name: "Tidak Aktif", value: tidakAktifCount, color: "#dbeafe" },
  ];

  const totalPages = Math.ceil(offenders.length / ROWS_PER_PAGE);
  const pagedData = offenders.slice(
    (page - 1) * ROWS_PER_PAGE,
    page * ROWS_PER_PAGE,
  );

  return (
    <div className="flex flex-col p-5 bg-gray-50/50 gap-4">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold text-[#122C93]">Dashboard</h1>
        <p className="text-gray-500 text-sm">
          {greeting}, {user?.nama || "User"}. Silakan pilih menu di bawah ini.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Spinner size="lg" />
        </div>
      ) : (
        <>
          {/* STAT GRID 3×2 */}
          <div className="grid grid-cols-3 gap-4">
            {/* Jumlah Satpam */}
            <div className="flex flex-col bg-white p-5 rounded-xl border border-[#E8EEFF] justify-between gap-2">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold">Jumlah Satpam</h2>
                <div className="bg-[#DBEAFE] p-2 rounded-xl">
                  <GiPoliceOfficerHead className="text-2xl text-[#122C93]" />
                </div>
              </div>
              <div className="flex items-end gap-2 mt-1">
                <h2 className="font-extrabold text-4xl leading-none text-[#122C93]">
                  {totalPersonel}
                </h2>
                <h2 className="font-light text-sm text-black mb-0.5">Personel</h2>
              </div>
            </div>

            {/* Satpam Aktif */}
            <div className="flex flex-col bg-white p-5 rounded-xl border border-[#E8EEFF] justify-between gap-2">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold">Satpam Aktif</h2>
                <div className="bg-[#DCFCE7] p-2 rounded-xl">
                  <BsPersonFillCheck className="text-2xl text-[#008236]" />
                </div>
              </div>
              <div className="flex items-end gap-2 mt-1">
                <h2 className="font-extrabold text-4xl leading-none text-[#008236]">
                  {aktifCount}
                </h2>
                <h2 className="font-light text-sm text-black mb-0.5">dari {totalPersonel}</h2>
              </div>
              <Progress
                aria-label="Satpam aktif"
                className="h-2 mt-1"
                value={aktifPct}
                classNames={{ track: "bg-[#D9D9D9]", indicator: "bg-[#008236]" }}
              />
            </div>

            {/* Total Client */}
            <div className="flex flex-col bg-white p-5 rounded-xl border border-[#E8EEFF] justify-between gap-2">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold">Total Client</h2>
                <div className="bg-[#DBEAFE] p-2 rounded-xl">
                  <FaBuilding className="text-2xl text-[#122C93]" />
                </div>
              </div>
              <div className="flex items-end gap-2 mt-1">
                <h2 className="font-extrabold text-4xl leading-none text-[#122C93]">
                  {totalClient}
                </h2>
                <h2 className="font-light text-sm text-black mb-0.5">
                  Mitra
                </h2>
              </div>
            </div>

            {/* Gender */}
            <div className="flex flex-col bg-white p-5 rounded-xl border border-[#E8EEFF] justify-between gap-2">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold">Gender</h2>
                <div className="bg-[#DBEAFE] p-2 rounded-xl">
                  <FaTransgender className="text-2xl text-[#122C93]" />
                </div>
              </div>
              <div className="flex items-center gap-4 mt-1">
                <DonutChart
                  data={genderData}
                  size={110}
                  label={{ value: totalPersonel, sub: "Total" }}
                />
                <div className="flex flex-col gap-3 w-full">
                  <LegendItem color="#122C93" label="Laki-laki" value={maleCount} />
                  <LegendItem
                    color="#93c5fd"
                    label="Perempuan"
                    value={femaleCount}
                  />
                </div>
              </div>
            </div>

            {/* Status Personel */}
            <div className="flex flex-col bg-white p-5 rounded-xl border border-[#E8EEFF] justify-between gap-2">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold">Status Personel</h2>
                <div className="bg-[#DBEAFE] p-2 rounded-xl">
                  <FaUsers className="text-2xl text-[#122C93]" />
                </div>
              </div>
              <div className="flex items-center gap-4 mt-1">
                <DonutChart
                  data={statusData}
                  size={110}
                  label={{ value: totalPersonel, sub: "Total" }}
                />
                <div className="flex flex-col gap-3 w-full">
                  <LegendItem color="#122C93" label="Aktif" value={aktifCount} />
                  <LegendItem
                    color="#93c5fd"
                    label="Menunggu"
                    value={pendingCount}
                  />
                  <LegendItem
                    color="#dbeafe"
                    label="Tidak Aktif"
                    value={tidakAktifCount}
                  />
                </div>
              </div>
            </div>

            {/* Distribusi per Client */}
            <div className="flex flex-col bg-white p-5 rounded-xl border border-[#E8EEFF] justify-between gap-2">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold">
                  Distribusi Satpam per Client
                </h2>
                <div className="bg-[#DBEAFE] p-2 rounded-xl">
                  <IoStatsChart className="text-2xl text-[#122C93]" />
                </div>
              </div>
              <div className="flex flex-col gap-3 mt-1">
                {topClients.length === 0 && (
                  <p className="text-xs text-gray-400">Belum ada data client</p>
                )}
                {topClients.map((item) => (
                  <div key={item.uuid} className="flex flex-col">
                    <div className="flex justify-between items-center">
                      <h2 className="font-medium text-xs truncate">{item.nama}</h2>
                      <h2 className="text-[#8D8787] text-xs ml-1">{item.satpam}</h2>
                    </div>
                    <Progress
                      aria-label={item.nama}
                      className="h-2 mt-1"
                      value={(item.satpam / maxClientSatpam) * 100}
                      classNames={{
                        track: "bg-[#D9D9D9]",
                        indicator: "bg-[#122C93]",
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* END STAT GRID */}

          {/* TABLE */}
          <div className="flex flex-col bg-white border border-[#E8EEFF] rounded-2xl w-full p-4 gap-3">
            <div className="flex items-center gap-4">
              <div className="bg-[#FFE2E2] p-2 rounded-xl flex items-center">
                <PiWarningCircleFill className="text-2xl text-[#C10007]" />
              </div>
              <div className="flex flex-col gap-0.5">
                <h2 className="font-semibold text-[#122C93] text-base">
                  Satpam Perlu Diperhatikan
                </h2>
                <h2 className="font-light text-xs text-gray-500">
                  Personel dengan catatan kedisiplinan tertinggi 30 hari terakhir
                </h2>
              </div>
            </div>

            <Table
              aria-label="Tabel Satpam Perlu Diperhatikan"
              shadow="none"
              isStriped
              classNames={{ th: "text-xs py-2.5 px-3", td: "text-sm py-2.5 px-3" }}
            >
              <TableHeader columns={columnsPerhatian}>
                {(column) => (
                  <TableColumn key={column.uid} align="center">
                    {column.name}
                  </TableColumn>
                )}
              </TableHeader>
              <TableBody items={pagedData} emptyContent="Tidak ada satpam yang perlu diperhatikan">
                {(item) => (
                  <TableRow key={item.uuid}>
                    {(columnKey) => {
                      switch (columnKey) {
                        case "no":
                          return (
                            <TableCell>
                              {offenders.indexOf(item) + 1}
                            </TableCell>
                          );
                        case "nama":
                          return (
                            <TableCell>
                              <div className="font-medium">{item.nama}</div>
                            </TableCell>
                          );
                        case "telat":
                          return <TableCell>{item.late}</TableCell>;
                        case "tidak_hadir":
                          return <TableCell>{item.absent}</TableCell>;
                        case "teguran":
                          return <TableCell>{item.teguran}</TableCell>;
                        case "sp":
                          return (
                            <TableCell>
                              <span
                                className={
                                  item.sp > 0
                                    ? "text-[#C10007] font-semibold"
                                    : ""
                                }
                              >
                                {item.sp || "-"}
                              </span>
                            </TableCell>
                          );
                        case "aksi":
                          return (
                            <TableCell>
                              <div className="flex justify-center">
                                <button
                                  onClick={() => navigate("/AdminDetailSatpam", { state: { uuid: item.uuid } })}
                                >
                                  <FaEye className="text-[#122C93] text-base" />
                                </button>
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

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center pt-1">
                <Pagination
                  total={totalPages}
                  page={page}
                  onChange={setPage}
                  size="sm"
                  showControls
                  classNames={{
                    cursor: "bg-[#122C93] text-white",
                  }}
                />
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
