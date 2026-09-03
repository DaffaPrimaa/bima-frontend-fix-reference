import {
  FaUsers,
  FaCalendarAlt,
  FaMapMarkedAlt,
  FaCogs,
  FaRegClock,
  FaUserShield,
} from "react-icons/fa";
import { LuScanFace } from "react-icons/lu";
import { IoMdPhotos } from "react-icons/io";
import type { MenuItem } from "../types/dashboard";

export const DASHBOARD_MENU_ITEMS: MenuItem[] = [
  {
    title: "Manajemen Satpam",
    desc: "Kelola data personel, NIP, dan foto anggota.",
    icon: <FaUsers size={24} className="text-white" />,
    color: "bg-blue-600",
    path: "/AdminManageSatpam",
    allowedRoles: ["Client", "Admin"],
  },
  {
    title: "Manajemen Shift",
    desc: "Atur jadwal jaga, generate shift otomatis.",
    icon: <FaCalendarAlt size={24} className="text-white" />,
    color: "bg-green-600",
    path: "/AdminManageShift",
    allowedRoles: ["Client"],
  },
  {
    title: "Data Pos Patroli",
    desc: "Kelola titik koordinat Pos Patroli.",
    icon: <FaMapMarkedAlt size={24} className="text-white" />,
    color: "bg-orange-600",
    path: "/AdminManagePos",
    allowedRoles: ["Client"],
  },
  {
    title: "Data Pos Utama",
    desc: "Kelola titik koordinat Pos Utama.",
    icon: <FaMapMarkedAlt size={24} className="text-white" />,
    color: "bg-orange-600",
    path: "/AdminManagePosUtama",
    allowedRoles: ["Client"],
  },
  {
    title: "Rekap Absensi",
    desc: "Download rekap absensi",
    icon: <LuScanFace size={24} className="text-white" />,
    color: "bg-teal-600",
    path: "/AdminRekapAbsensi",
    allowedRoles: ["Admin", "Client"],
  },
  {
    title: "Rekap Patroli",
    desc: "Download rekap patroli",
    icon: <IoMdPhotos size={24} className="text-white" />,
    color: "bg-teal-600",
    path: "/AdminRekapPatroli",
    allowedRoles: ["Admin", "Client"],
  },
  {
    title: "Konfigurasi Radius",
    desc: "Setting batas jarak toleransi GPS (geofencing).",
    icon: <FaCogs size={24} className="text-white" />,
    color: "bg-gray-600",
    path: "/ClientManageRadius",
    allowedRoles: ["Client"],
  },
  {
    title: "Konfigurasi Waktu",
    desc: "Setting waktu untuk shift kerja.",
    icon: <FaRegClock size={24} className="text-white" />,
    color: "bg-red-600",
    path: "/AdminManageWaktu",
    allowedRoles: ["Client"],
  },
  {
    title: "Manajemen Client",
    desc: "Tambah atau hapus akses administrator sistem client.",
    icon: <FaUserShield size={24} className="text-white" />,
    color: "bg-red-600",
    path: "/AdminManageUsers",
    allowedRoles: ["Admin"],
  },
];
