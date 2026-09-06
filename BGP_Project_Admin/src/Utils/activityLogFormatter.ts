import type { ActivityLogItem } from "../types/activityLog";
import type { IconType } from "react-icons";
import { 
  AiOutlineDelete, 
  AiOutlineUpload 
} from "react-icons/ai";
import { 
  FaUserTimes, 
  FaUserCheck, 
  FaUserPlus, 
  FaAddressCard 
} from "react-icons/fa";
import { 
  RiEditBoxFill,
  RiMapPin2Fill,
  RiFileList3Fill
} from "react-icons/ri";
import { MdOutlineFileDownload, MdOutlineCalendarMonth, MdMessage, MdOutlineReportProblem } from "react-icons/md";
import { GoAlertFill } from "react-icons/go";
import { HiDocumentCheck } from "react-icons/hi2";
import { TbLayoutDashboard } from "react-icons/tb";

export const formatLogMessage = (log: ActivityLogItem): string => {
  const { action, payload } = log;

  switch (action) {
    case "patrol.update":
      return `Memperbarui data patroli untuk satpam ${payload?.satpam?.nama || ""} di pos ${payload?.pos || ""}`;
    case "patrol.download":
      return `Mengunduh laporan patroli (${payload?.filters?.from || ""} s/d ${payload?.filters?.to || ""})`;
      
    case "attendance.update":
      return `Memperbarui absensi satpam ${payload?.satpam?.nama || ""} pada tanggal ${payload?.work_date || ""}`;
    case "attendance.download":
      return `Mengunduh laporan absensi satpam ${payload?.satpam?.nama || ""} pada tanggal ${payload?.work_date || ""}`;
      
    case "post.create":
      return `Menambahkan data pos baru: ${payload?.nama || payload?.request?.nama || ""}`;
    case "post.update":
      return `Memperbarui data pos: ${payload?.nama || payload?.request?.nama || ""}`;
    case "post.delete":
      return `Menghapus data pos`;
      
    case "shift_pattern.create":
      return `Membuat pola shift baru: ${payload?.nama || payload?.request?.nama || ""}`;
    case "shift_pattern.update":
      return `Memperbarui pola shift: ${payload?.nama || payload?.request?.nama || ""}`;
    case "shift_pattern.delete":
      return `Menghapus konfigurasi pola shift`;
      
    case "shift_instance.create":
      return `Membuat jadwal shift tanggal ${payload?.work_date || ""}`;
    case "shift_instance.cancel":
      return `Membatalkan jadwal shift tanggal ${payload?.work_date || ""}`;
    case "shift_instance.generate":
      return `Melakukan generate jadwal shift secara massal`;
      
    case "satpam.card_data":
      return `Memperbarui/mengakses data kartu satpam ${payload?.nama || ""} (NIP: ${payload?.nip || ""})`;
    case "satpam.approve":
      return `Menyetujui pendaftaran satpam baru`;
    case "satpam.reject":
      return `Menolak pendaftaran satpam baru`;
    case "satpam.update":
      return `Memperbarui data satpam`;
    case "satpam.delete":
      return `Menghapus data satpam`;
      
    case "message.create":
      return `Mengirim pesan "${payload?.title || ""}" ke satpam ${payload?.satpam?.nama || ""}`;
      
    case "alert.handle":
      return `Merespon peringatan (alert)`;
    case "alert.resolve":
      return `Menyelesaikan masalah peringatan (alert)`;
      
    case "event_report.handle":
      return `Merespon laporan kejadian`;
    case "event_report.resolve":
      return `Menyelesaikan laporan kejadian`;
      
    case "document.download":
      return `Mengunduh dokumen sistem`;
      
    case "client_settings.update":
      return `Memperbarui pengaturan client`;
      
    case "violation.create":
      return `Mencatat pelanggaran untuk satpam`;
    case "violation.update":
      return `Memperbarui data pelanggaran`;
    case "violation.delete":
      return `Menghapus catatan pelanggaran`;
      
    case "shift_assignment.create":
      return `Membuat penugasan shift baru`;
    case "shift_assignment.update":
      return `Memperbarui penugasan shift`;
    case "shift_assignment.delete":
      return `Menghapus penugasan shift`;

    case "shift_exception.create":
      return `Mencatat pengecualian shift`;
    case "shift_exception.delete":
      return `Menghapus catatan pengecualian shift`;

    default:
      // Fallback
      return `Melakukan aksi ${action.replace("_", " ")}`;
  }
};

export const getLogIcon = (action: string): IconType => {
  const resource = action.split(".")[0];
  const method = action.split(".")[1];

  if (method === "create" || method === "generate") return FaUserPlus;
  if (method === "update") return RiEditBoxFill;
  if (method === "delete" || method === "cancel") return AiOutlineDelete;
  if (method === "download") return MdOutlineFileDownload;
  if (method === "approve" || method === "resolve") return FaUserCheck;
  if (method === "reject") return FaUserTimes;
  if (method === "card_data") return FaAddressCard;

  // Resource based fallback
  switch (resource) {
    case "post": return RiMapPin2Fill;
    case "shift_pattern": 
    case "shift_instance":
    case "shift_assignment":
    case "shift_exception":
      return MdOutlineCalendarMonth;
    case "attendance": return HiDocumentCheck;
    case "message": return MdMessage;
    case "alert": return GoAlertFill;
    case "event_report":
    case "violation":
      return MdOutlineReportProblem;
    case "client_settings": return TbLayoutDashboard;
    case "document": return RiFileList3Fill;
    default: return RiEditBoxFill;
  }
};
