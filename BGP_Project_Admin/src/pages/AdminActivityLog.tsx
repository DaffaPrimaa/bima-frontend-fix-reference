import { DateRangePicker, Select, SelectItem } from "@heroui/react";
import { AiOutlineDelete, AiOutlineUpload } from "react-icons/ai";
import { FaUserTimes } from "react-icons/fa";
import { FaAddressCard, FaUserCheck, FaUserPlus } from "react-icons/fa6";
import { FiSearch } from "react-icons/fi";
import { GoAlertFill } from "react-icons/go";
import { HiDocumentCheck } from "react-icons/hi2";
import { MdOutlineCalendarMonth, MdOutlineFileDownload } from "react-icons/md";
import { RiEditBoxFill } from "react-icons/ri";
import type { IconType } from "react-icons";

export const clients = [
  { key: "all", label: "Semua Client" },
  { key: "smb", label: "Sumarecon Bandung" },
  { key: "mitra1", label: "Mitra Sejahtera" },
  { key: "mitra2", label: "Graha Properti" },
];

export const role = [
  { key: "admin", label: "Admin" },
  { key: "client", label: "Client" },
];

type ActivityAction =
  | "user_approved"
  | "user_rejected"
  | "edit"
  | "delete"
  | "download"
  | "upload"
  | "assign"
  | "user_added"
  | "schedule"
  | "alert"
  | "document_verified";

interface ActivityLogItem {
  uuid: string;
  action: ActivityAction;
  message: string;
  role: string;
  tanggal: string;
  jam: string;
}

const actionIcons: Record<ActivityAction, IconType> = {
  user_approved: FaUserCheck,
  user_rejected: FaUserTimes,
  edit: RiEditBoxFill,
  delete: AiOutlineDelete,
  download: MdOutlineFileDownload,
  upload: AiOutlineUpload,
  assign: FaAddressCard,
  user_added: FaUserPlus,
  schedule: MdOutlineCalendarMonth,
  alert: GoAlertFill,
  document_verified: HiDocumentCheck,
};

const dummyActivityLog: ActivityLogItem[] = [
  {
    uuid: "1",
    action: "user_approved",
    message: "Admin menyetujui akun satpam Budi Santoso",
    role: "Admin",
    tanggal: "12 Jul 2026",
    jam: "09:12",
  },
  {
    uuid: "2",
    action: "user_rejected",
    message: "Admin menolak akun satpam Andi Wijaya",
    role: "Admin",
    tanggal: "12 Jul 2026",
    jam: "09:20",
  },
  {
    uuid: "3",
    action: "edit",
    message: "Admin mengubah data satpam Rudi Hartono",
    role: "Admin",
    tanggal: "12 Jul 2026",
    jam: "10:05",
  },
  {
    uuid: "4",
    action: "delete",
    message: "Admin menghapus data satpam Joko Prasetyo",
    role: "Admin",
    tanggal: "12 Jul 2026",
    jam: "10:30",
  },
  {
    uuid: "5",
    action: "download",
    message: "Client mengunduh dokumen SOP Kebakaran",
    role: "Client",
    tanggal: "12 Jul 2026",
    jam: "11:00",
  },
  {
    uuid: "6",
    action: "upload",
    message: "Admin mengunggah dokumen Panduan Penggunaan APAR",
    role: "Admin",
    tanggal: "12 Jul 2026",
    jam: "11:45",
  },
  {
    uuid: "7",
    action: "assign",
    message: "Admin menugaskan satpam Budi Santoso ke Client Sumarecon Bandung",
    role: "Admin",
    tanggal: "12 Jul 2026",
    jam: "12:15",
  },
  {
    uuid: "8",
    action: "user_added",
    message: "Admin menambahkan akun satpam baru Dedi Kurniawan",
    role: "Admin",
    tanggal: "12 Jul 2026",
    jam: "13:00",
  },
  {
    uuid: "9",
    action: "schedule",
    message: "Admin membuat jadwal shift satpam untuk minggu depan",
    role: "Admin",
    tanggal: "12 Jul 2026",
    jam: "13:40",
  },
  {
    uuid: "10",
    action: "alert",
    message: "Sistem mengirim peringatan keterlambatan absensi ke satpam Rudi",
    role: "Admin",
    tanggal: "12 Jul 2026",
    jam: "14:10",
  },
  {
    uuid: "11",
    action: "document_verified",
    message: "Admin memverifikasi dokumen pengajuan cuti satpam Budi Santoso",
    role: "Admin",
    tanggal: "12 Jul 2026",
    jam: "14:50",
  },
];

const AdminActivityLog = () => {
  return (
    <div className="container-main flex flex-col items-start gap-3 p-2.5">
      {/* header title */}
      <h2 className="font-semibold text-xl text-[#122C93]">Activity Log</h2>

      {/* search engine */}
      <div className="container-search rounded-2xl w-full flex flex-row gap-3 items-center bg-[#FFFFFF] p-3 border border-[#E4E9F7]">
        <div className="flex flex-row items-center gap-2 bg-white border border-[#E4E9F7] rounded-xl px-4 h-11 flex-1">
          <FiSearch className="text-[#B0B0B0] text-base flex-shrink-0" />
          <input
            type="search"
            placeholder="Cari nama client, role, atau aksi"
            className="bg-transparent text-sm text-gray-700 placeholder:text-[#B0B0B0] outline-none w-full h-full"
          />
        </div>
        <Select
          className="w-48"
          placeholder="Role"
          classNames={{
            trigger:
              "bg-white border border-[#E4E9F7] rounded-xl shadow-none h-11 min-h-11 data-[hover=true]:bg-white",
            value: "text-[#8D8787] text-sm",
          }}
        >
          {role.map((c) => (
            <SelectItem key={c.key}>{c.label}</SelectItem>
          ))}
        </Select>
        <Select
          className="w-48"
          placeholder="Semua Client"
          classNames={{
            trigger:
              "bg-white border border-[#E4E9F7] rounded-xl shadow-none h-11 min-h-11 data-[hover=true]:bg-white",
            value: "text-[#8D8787] text-sm",
          }}
        >
          {clients.map((c) => (
            <SelectItem key={c.key}>{c.label}</SelectItem>
          ))}
        </Select>

        <DateRangePicker
          variant="bordered"
          className="h-11 w-70"
          label="Filter Tanggal"
        />
      </div>
      {/* end of search engine */}

      {/* main content here */}
      <div className="main-content-container flex flex-col gap-2 w-full max-h-[680px] flex-1 overflow-y-auto pr-1">
        {dummyActivityLog.map((log) => {
          const Icon = actionIcons[log.action];
          return (
            <div
              key={log.uuid}
              className="card-1 flex flex-row items-center gap-5 p-5 rounded-lg bg-white border border-[#E4E9F7]"
            >
              <Icon className="text-3xl text-[#8D8787] flex-shrink-0" />
              <div className="container-caption flex flex-col items-start">
                <h2 className="text-sm font-medium">{log.message}</h2>
                <h2 className="text-xs font-light">
                  {log.role} · {log.tanggal}, {log.jam}
                </h2>
              </div>
            </div>
          );
        })}
      </div>
      {/* end of main content */}
    </div>
  );
};

export default AdminActivityLog;
