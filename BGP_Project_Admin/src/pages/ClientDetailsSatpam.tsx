import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { createPortal } from "react-dom";
import logo from "../assets/images/logo.webp";
import { FaArrowLeftLong } from "react-icons/fa6";
import { FaIdCardAlt, FaUser, FaUserEdit, FaIdCard, FaRegEdit, FaRegTrashAlt } from "react-icons/fa";
import { LuOctagonAlert } from "react-icons/lu";
import { GoTrophy } from "react-icons/go";
import { GiGraduateCap } from "react-icons/gi";
import { IoIosAlert } from "react-icons/io";
import {
  Pagination,
  Tab,
  Tabs,
  Button,
  Spinner,
} from "@heroui/react";

import { useAdminSatpamDetails } from "../hooks/useAdminSatpamDetails";
import { SatpamDetailModals } from "../Components/satpam/Modals/SatpamDetailModals";
import { kategoriPelanggaran } from "../Components/satpam/constants";

interface KartuAnggotaProps {
  nama?: string;
  jabatan?: string;
  nip?: string;
  nrg?: string;
  mitra?: string;
  disahkanOleh?: string;
}

const Barcode = ({ value }: { value: string }) => {
  const bars = value.split("").map((char, i) => {
    const width = (char.charCodeAt(0) % 3) + 1;
    return (
      <div
        key={i}
        className="bg-black"
        style={{ width: `${width}px`, height: "44px", marginRight: "1.5px" }}
      />
    );
  });

  return (
    <div className="flex flex-col items-start gap-1">
      <div className="flex flex-row items-end">{bars}</div>
      <span className="text-[10px] font-mono tracking-widest text-black">
        {value}
      </span>
    </div>
  );
};

export const KartuAnggotaDepan = ({
  nama = "Nama Anggota",
  jabatan = "Jabatan",
  nip = "123xxx",
  nrg = "00103062026000007",
  mitra = "Nama Mitra",
  disahkanOleh = "Direktur Utama",
}: KartuAnggotaProps) => {
  return (
    <div className="w-[420px] h-[264px] rounded-2xl overflow-hidden flex flex-row bg-[#F5F3EE] shadow-md">
      <div className="w-[150px] bg-gradient-to-b from-[#122C93] to-[#0C1F6B] relative flex flex-col items-center pt-4 pb-3 gap-2">
        <div className="absolute right-0 top-0 h-full w-1 bg-[#C9A227]" />
        <img src={logo} className="w-12" alt="" />
        <div className="flex flex-col items-center text-center px-2 mt-1">
          <span className="text-white font-bold text-[11px] leading-tight">
            PT BIMA GLOBAL
          </span>
          <span className="text-[#C9A227] text-[7px] tracking-widest font-semibold">
            SECURITY SERVICES
          </span>
        </div>
        <div className="w-24 h-28 bg-[#E7E9F5] rounded-md flex items-center justify-center mt-2">
          <span className="text-[#9096B8] text-[9px]">PAS FOTO</span>
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-between p-5">
        <div>
          <div className="flex flex-row items-center gap-2 mb-1">
            <div className="w-5 h-[3px] bg-[#C9A227] rounded-full" />
            <span className="text-xs font-semibold text-[#3B3B3B]">
              Kartu Tanda Anggota
            </span>
          </div>
          <h2 className="text-xl font-extrabold text-[#12237A] leading-tight">
            {nama}
          </h2>
          <h3 className="text-sm font-semibold text-[#C9A227]">{jabatan}</h3>
        </div>

        <div className="border-t border-[#DDD8CC] pt-2 flex flex-row gap-10">
          <div>
            <span className="text-[9px] font-semibold text-[#8D8787] tracking-widest">
              NIP
            </span>
            <h4 className="text-sm font-bold text-[#1E1E1E]">{nip}</h4>
          </div>
          <div>
            <span className="text-[9px] font-semibold text-[#8D8787] tracking-widest">
              NRG
            </span>
            <h4 className="text-sm font-bold text-[#1E1E1E] font-mono">
              {nrg}
            </h4>
          </div>
        </div>

        <div>
          <span className="text-[9px] font-semibold text-[#8D8787] tracking-widest">
            MITRA
          </span>
          <h4 className="text-sm font-bold text-[#1E1E1E]">{mitra}</h4>
        </div>

        <div className="border-t border-[#DDD8CC] pt-1 flex flex-col items-end">
          <span className="text-[9px] italic text-[#8D8787]">
            Disahkan Oleh
          </span>
          <span className="text-xs font-bold text-[#1E1E1E]">
            {disahkanOleh}
          </span>
        </div>
      </div>
    </div>
  );
};

export const KartuAnggotaBelakang = ({
  nrg = "00103062026000007",
}: KartuAnggotaProps) => {
  return (
    <div className="w-[420px] h-[264px] rounded-2xl overflow-hidden bg-[#F5F3EE] shadow-md flex flex-col">
      <div className="bg-gradient-to-r from-[#0F1E5C] to-[#12237A] px-4 py-2 flex flex-row items-center gap-2 border-b-2 border-[#C9A227]">
        <img src={logo} className="w-10" alt="" />
        <span className="text-white font-bold text-xs tracking-wide">
          KARTU TANDA ANGGOTA (KTA)
        </span>
      </div>

      <div className="flex flex-row items-start p-4 gap-4">
        <div className="flex-1">
          <h4 className="font-bold text-xs text-[#1E1E1E] mb-1">
            KETENTUAN PENGGUNAAN
          </h4>
          <ol className="list-decimal list-inside text-[8px] text-[#3B3B3B] flex flex-col gap-1.5">
            <li>
              Kartu ini adalah milik PT Bima Global Security Services dan wajib
              dikembalikan saat masa kerja berakhir.
            </li>
            <li>
              Kartu ini hanya berlaku untuk pemegang yang tertera dan tidak
              dapat dipindahtangankan.
            </li>
            <li>
              Kehilangan kartu wajib segera dilaporkan ke pihak manajemen.
            </li>
          </ol>
        </div>

        <div className="flex flex-col">
          <span className="text-[9px] font-semibold text-[#8D8787] tracking-widest">
            NOMOR INDUK PEGAWAI (NIP)
          </span>
          <div className="mt-2">
            <Barcode value={nrg} />
          </div>
        </div>
      </div>

      <div className="px-4 pb-3">
        <h4 className="font-bold text-[10px] text-[#1E1E1E]">
          PT BIMA GLOBAL SECURITY SERVICES
        </h4>
        <span className="font-bold text-[9px] text-[#1E1E1E]">
          Never stop to protect
        </span>
      </div>
    </div>
  );
};

export const KartuAnggotaPreview = (props: KartuAnggotaProps) => {
  return (
    <div className="flex flex-col gap-4 items-center">
      <KartuAnggotaDepan {...props} />
      <KartuAnggotaBelakang {...props} />
    </div>
  );
};

export const KartuAnggotaPrintPortal = (props: KartuAnggotaProps) => {
  if (typeof document === "undefined") return null;

  return createPortal(
    <div className="print-portal-container hidden print:flex print:flex-col print:items-center print:pt-10 print:w-full print:absolute print:top-0 print:left-0 print:z-[99999] print:bg-white">
      <style>
        {`
          @media print {
            body > *:not(.print-portal-container) {
              display: none !important;
            }
            html, body {
              height: auto !important;
              min-height: 100% !important;
              overflow: visible !important;
              position: static !important;
              margin: 0;
              padding: 0;
              background-color: white !important;
            }
            .print-portal-container {
              display: flex !important;
              visibility: visible !important;
            }
            * {
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            @page {
              size: A4 portrait;
              margin: 15mm;
            }
          }
        `}
      </style>
      <div className="flex flex-col gap-8 items-center justify-center w-full">
        <KartuAnggotaDepan {...props} />
        <KartuAnggotaBelakang {...props} />
      </div>
    </div>,
    document.body,
  );
};

export const animals = [
  { key: "cat", label: "Cat" },
  { key: "dog", label: "Dog" },
  { key: "elephant", label: "Elephant" },
  { key: "lion", label: "Lion" },
];

const ClientDetailsSatpam = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const uuid = location.state?.uuid;

  const { state, setters, handlers, modals } = useAdminSatpamDetails(uuid);

  const [page, setPage] = useState(1);
  const [activeTab, setActiveTab] = useState("absensi");
  const totalPages = 10;

  const dataKartu = state.cardData ? {
    nama: state.cardData.nama,
    jabatan: state.cardData.jabatan,
    nip: state.cardData.nip,
    nrg: state.cardData.nrg,
    mitra: state.cardData.client,
    disahkanOleh: "Direktur Utama",
    avatar_url: state.cardData.avatar_url,
  } : {
    nama: "Nama Anggota",
    jabatan: "Jabatan",
    nip: "123xxx",
    nrg: "00103062026000007",
    mitra: "Nama Mitra",
    disahkanOleh: "Direktur Utama",
  };

  const kerabat1 = state.emergencyContacts && state.emergencyContacts.length > 0 ? state.emergencyContacts[0] : null;
  const kerabat2 = state.emergencyContacts && state.emergencyContacts.length > 1 ? state.emergencyContacts[1] : null;

  const absensiData = [
    {
      id: 1,
      tanggal: "dd/mm/yy",
      nip: "13012200",
      kategori: "Tepat Waktu",
      checkIn: "18:00",
      checkOut: "04:03",
      durasi: "10 jam 3 menit",
    },
    {
      id: 2,
      tanggal: "dd/mm/yy",
      nip: "13012200",
      kategori: "Terlambat",
      checkIn: "18:00",
      checkOut: "04:03",
      durasi: "10 jam 3 menit",
    },
    {
      id: 3,
      tanggal: "dd/mm/yy",
      nip: "13012200",
      kategori: "Tepat Waktu",
      checkIn: "18:00",
      checkOut: "04:03",
      durasi: "10 jam 3 menit",
    },
  ];

  const currentPelanggaran = state.violations.length > 0 ? state.violations[0] : null;

  const renderTabContent = () => {
    switch (activeTab) {
      case "absensi":
        return (
          <>
            <table className="w-full text-center border-separate border-spacing-y-0.5">
              <thead>
                <tr className="bg-[#F1F1F1] text-black">
                  <th className="py-2 px-3 font-normal text-xs rounded-l-lg">
                    Tanggal
                  </th>
                  <th className="py-2 px-3 font-normal text-xs">NIP</th>
                  <th className="py-2 px-3 font-normal text-xs">Kategori</th>
                  <th className="py-2 px-3 font-normal text-xs">Check In</th>
                  <th className="py-2 px-3 font-normal text-xs">Check Out</th>
                  <th className="py-2 px-3 font-normal text-xs rounded-r-lg">
                    Durasi
                  </th>
                </tr>
              </thead>
              <tbody>
                {absensiData.map((row, index) => (
                  <tr
                    key={row.id}
                    className={index % 2 !== 0 ? "bg-[#F1F1F1]" : "bg-white"}
                  >
                    <td
                      className={`py-2 px-3 text-xs ${index % 2 !== 0 ? "rounded-l-lg" : ""}`}
                    >
                      {row.tanggal}
                    </td>
                    <td className="py-2 px-3 text-xs">{row.nip}</td>
                    <td className="py-2 px-3">
                      <div
                        className={`mx-auto px-2 py-0.5 rounded-full text-[10px] font-medium w-fit ${row.kategori === "Tepat Waktu" ? "bg-[#DCFCE7] text-[#16A34A]" : "bg-[#FEF9C3] text-[#A16207]"}`}
                      >
                        {row.kategori}
                      </div>
                    </td>
                    <td className="py-2 px-3 text-xs">{row.checkIn}</td>
                    <td className="py-2 px-3 text-xs">{row.checkOut}</td>
                    <td
                      className={`py-2 px-3 text-xs ${index % 2 !== 0 ? "rounded-r-lg" : ""}`}
                    >
                      {row.durasi}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex w-full justify-center mt-1.5">
              <Pagination
                size="sm"
                showControls
                showShadow
                color="primary"
                page={page}
                total={totalPages}
                onChange={setPage}
              />
            </div>
          </>
        );

      case "pendukung":
        return (
          <div className="flex flex-col gap-2 p-2">
            {state.documents.length === 0 && (
              <div className="text-center text-sm text-gray-500 py-4">Belum ada dokumen pendukung</div>
            )}
            {state.documents.map((doc: any) => (
              <div
                key={doc.uuid}
                className="border border-[#E8EEFF] flex flex-row items-center w-full bg-[#F5F7FF] py-2.5 px-4 gap-3 rounded-xl cursor-pointer"
                onClick={() => handlers.openPreviewModal(doc)}
              >
                <div className="border rounded-xl p-2.5 bg-white">
                  <FaIdCard className="text-xl text-[#122C93]" />
                </div>
                <div className="flex flex-col items-start flex-1">
                  <h2 className="font-semibold text-sm text-black">{doc.type ? doc.type.toUpperCase() : "Dokumen"}</h2>
                  <h2 className="font-light text-xs text-[#8D8787]">
                    {new Date(doc.created_at).toLocaleDateString("id-ID")}
                  </h2>
                </div>
              </div>
            ))}
          </div>
        );

      case "pendidikan":
        return (
          <div className="flex flex-col gap-2 p-2">
            {state.educations.length === 0 && (
              <div className="text-center text-sm text-gray-500 py-4">Belum ada riwayat pendidikan</div>
            )}
            {state.educations.map((edu: any) => (
              <div
                key={edu.uuid}
                className="border border-[#E8EEFF] flex flex-row items-center w-full bg-[#F5F7FF] py-2.5 px-4 gap-3 rounded-xl cursor-pointer"
                onClick={() => edu.file && handlers.openPreviewModal(edu)}
              >
                <div className="border rounded-xl p-2.5 bg-white">
                  <GiGraduateCap className="text-xl text-[#122C93]" />
                </div>
                <div className="flex flex-col items-start flex-1">
                  <h2 className="font-semibold text-sm text-black">{edu.title}</h2>
                  <h2 className="font-semibold text-xs text-[#122C93]">{edu.issued_year}</h2>
                  {edu.description && (
                    <h2 className="font-light text-xs text-[#8D8787]">
                      {edu.description}
                    </h2>
                  )}
                </div>
              </div>
            ))}
          </div>
        );

      case "penghargaan":
        return (
          <div className="flex flex-col gap-2 p-2">
            {state.recognitions.length === 0 && (
              <div className="text-center text-sm text-gray-500 py-4">Belum ada riwayat penghargaan</div>
            )}
            {state.recognitions.map((rec: any) => (
              <div
                key={rec.uuid}
                className="border border-[#E8EEFF] flex flex-row items-center w-full bg-[#F5F7FF] py-2.5 px-4 gap-3 rounded-xl cursor-pointer"
                onClick={() => rec.file && handlers.openPreviewModal(rec)}
              >
                <div className="border rounded-xl p-2.5 bg-white">
                  <GoTrophy className="text-xl text-[#122C93]" />
                </div>
                <div className="flex flex-col items-start flex-1">
                  <h2 className="font-semibold text-sm text-black">{rec.title}</h2>
                  <h2 className="font-semibold text-xs text-[#122C93]">{rec.issued_year}</h2>
                  {rec.description && (
                    <h2 className="font-light text-xs text-[#8D8787]">
                      {rec.description}
                    </h2>
                  )}
                </div>
              </div>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col gap-2 p-2.5 overflow-hidden">
      {/* Header */}
      <div className="flex flex-row justify-between items-center bg-white p-3 rounded-xl border border-[#E8EEFF]">
        <div className="flex flex-row gap-2.5 items-start">
          <div className="bg-[#DBEAFE] p-2 rounded-lg cursor-pointer" onClick={() => navigate(-1)}>
            <FaArrowLeftLong className="text-base" />
          </div>
          <div className="flex flex-col items-start">
            <h2 className="font-semibold text-sm text-[#122C93]">
              {state.satpam?.nama || "Prasetyo Teguh"}
            </h2>
            <h2 className="text-xs font-light text-[#8D8787]">
              NIP {state.satpam?.nip || "-"} · Pos Utama
            </h2>
          </div>
          <div className="flex flex-row items-center gap-1.5">
            <h2 className={`text-xs px-3 py-0.5 rounded-2xl ${state.satpam?.status === 'active' ? 'bg-[#DCFCE7] text-[#008236]' : 'bg-red-100 text-red-700'}`}>
              {state.satpam?.status === 'active' ? 'Aktif' : state.satpam?.status || "Aktif"}
            </h2>
            <h2 className="bg-[#D9D9D9] text-xs px-3 py-0.5 rounded-2xl text-black">
              {state.satpam?.jabatan || "Anggota"}
            </h2>
          </div>
        </div>
        <div
          className="flex flex-row items-center gap-2 bg-[#122C93] px-3 py-2 rounded-xl cursor-pointer"
          onClick={modals.modalGenerateKartu.onOpen}
        >
          <FaIdCardAlt className="text-white text-base" />
          <h2 className="text-white font-medium text-xs">
            Generate Kartu Anggota
          </h2>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="flex flex-row items-center justify-between gap-2.5">
        <div className="bg-white w-full h-[120px] rounded-xl border border-[#E8EEFF] flex flex-row items-center gap-4 p-4">
          <div className="bg-[#D9D9D9] w-[70px] h-[70px] rounded-full flex-shrink-0">
            {state.satpam?.avatar?.view_url ? (
              <img src={state.satpam.avatar.view_url} className="w-full h-full rounded-full object-cover" alt="Profile" />
            ) : (
              <FaUser className="text-xl" />
            )}
          </div>
          <div className="flex flex-col gap-1">
            <div>
              <h2 className="font-bold text-md">{state.satpam?.nama || "Prasetyo Teguh"}</h2>
              <h2 className="font-light text-xs">
                Bergabung sejak {state.satpam?.created_at ? new Date(state.satpam.created_at).toLocaleDateString("id-ID", { day: 'numeric', month: 'long', year: 'numeric' }) : "-"}
              </h2>
            </div>
            <div>
              <h2 className="font-bold text-md">Tempat Tugas</h2>
              <h2 className="font-light text-xs">{state.satpam?.client || "-"}</h2>
            </div>
          </div>
        </div>
        <div className="bg-white w-full h-[120px] rounded-xl border border-[#E8EEFF] flex flex-col justify-center p-4">
          <h2 className="font-medium text-md text-black">
            Total Jam Kerja Bulan ini
          </h2>
          <h2 className="font-bold text-2xl text-[#122C93] leading-tight">
            {state.workingHours?.this_month?.hours?.toLocaleString("id-ID") || 0}{" "}
            <span className="font-semibold text-[#8D8787] text-sm">Jam</span>
          </h2>
          <h2 className="font-light text-xs text-[#8D8787]">
            Periode {new Date().toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })} · {state.workingHours?.this_month?.shifts || 0} hari kerja
          </h2>
          <h2 className="font-light text-xs text-[#8D8787]">
            {state.satpam?.client ? `di ${state.satpam.client}` : "-"}
          </h2>
        </div>
        <div className="bg-white w-full h-[120px] rounded-xl border border-[#E8EEFF] flex flex-col justify-center p-4">
          <h2 className="font-medium text-md text-black">
            Total Seluruh Jam Kerja
          </h2>
          <h2 className="font-bold text-2xl text-[#122C93] leading-tight">
            {state.workingHours?.all_time?.hours?.toLocaleString("id-ID") || 0}{" "}
            <span className="font-semibold text-[#8D8787] text-sm">Jam</span>
          </h2>
          <h2 className="font-light text-xs text-[#8D8787]">
            Sejak Penempatan · {(state.satpam?.date_assigned || state.workingHours?.all_time?.since || state.workingHours?.since) ? new Date(state.satpam?.date_assigned || state.workingHours?.all_time?.since || state.workingHours?.since).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' }) : "-"}
          </h2>
          <h2 className="font-light text-xs text-[#8D8787]">
            {state.satpam?.client ? `di ${state.satpam.client}` : "-"}
          </h2>
        </div>
      </div>

      {/* Informasi Personal */}
      {state.isLoading ? (
        <div className="flex justify-center p-10"><Spinner /></div>
      ) : state.satpam ? (
        <div className="flex flex-col bg-white p-3 gap-2 rounded-xl border border-[#E8EEFF]">
          <div className="flex flex-row items-center gap-2">
            <FaUserEdit className="text-[#122C93] text-2xl" />
            <h2 className="font-semibold text-[#122C93] text-md">
              Informasi Personal
            </h2>
          </div>
          <div className="flex flex-col flex-wrap gap-x-6 gap-y-4 w-full h-[180px]">
            {[
              ["ASAL DAERAH", state.satpam.asal_daerah || "-"],
              ["NO. HP UTAMA", state.satpam.nomor_hp || state.satpam.no_telp || "-"],
              ["NO. HP KERABAT 1", kerabat1 ? `${kerabat1.kontak} (${kerabat1.nama})` : "-"],
              ["STATUS HUBUNGAN 1", kerabat1 ? (kerabat1.hubungan?.toUpperCase() || "-") : "-"],
              ["NO. HP KERABAT 2", kerabat2 ? `${kerabat2.kontak} (${kerabat2.nama})` : "-"],
              ["STATUS HUBUNGAN 2", kerabat2 ? (kerabat2.hubungan?.toUpperCase() || "-") : "-"],
              ["JENIS KELAMIN", state.satpam.gender === "1" ? "Laki-Laki" : state.satpam.gender === "2" ? "Perempuan" : "-"],
              ["NIP", state.satpam.nip || "-"],
              ["EMAIL", state.satpam.email || "-"],
              ["NRG", state.satpam.nrg || "-"],
            ].map(([label, value], i) => (
              <div key={i} className="flex flex-col">
                <h2 className="font-light text-xs leading-tight">{label}</h2>
                <h2 className="font-light text-sm leading-tight text-[#8D8787] max-w-[200px] truncate" title={String(value)}>
                  {value}
                </h2>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex justify-center p-10">Data tidak ditemukan</div>
      )}

      {/* Tab Section */}
      <div className="flex flex-col items-start bg-white p-3 gap-1 rounded-xl border border-[#E8EEFF]">
        <Tabs
          aria-label="Tabs variants"
          variant="underlined"
          selectedKey={activeTab}
          onSelectionChange={(key) => setActiveTab(key as string)}
          size="sm"
        >
          <Tab key="absensi" title="Riwayat Absensi" />
          <Tab key="pendukung" title="Dokumen Pendukung" />
          <Tab key="pendidikan" title="Riwayat Pendidikan" />
          <Tab key="penghargaan" title="Riwayat Penghargaan" />
        </Tabs>
        <div className="w-full flex flex-col gap-1">{renderTabContent()}</div>
      </div>

      {/* Riwayat Pelanggaran */}
      <div className="flex flex-col gap-2 bg-white p-3 rounded-xl border border-[#E8EEFF]">
        <div className="flex flex-row items-center justify-between">
          <div className="flex flex-row gap-2 items-center">
            <LuOctagonAlert className="text-danger text-xl" />
            <h2 className="font-semibold text-[#122C93] text-sm">
              Riwayat Pelanggaran
            </h2>
          </div>

          <Button
            className="font-semibold text-white text-xs bg-[#122C93] px-3 py-1.5 rounded-lg"
            onPress={handlers.handleTambahPelanggaran}
          >
            + Tambah Pelanggaran
          </Button>
        </div>

        {state.isLoadingViolations ? (
          <div className="flex justify-center py-4"><Spinner size="sm" /></div>
        ) : currentPelanggaran ? (

          <div className="flex flex-row items-center justify-between bg-[#F5F7FF] px-4 py-3 rounded-xl border border-danger">
            <div className="flex flex-row items-center gap-3">
              <div className="bg-[#FFE2E2] p-2.5 rounded-xl">
                <IoIosAlert className="text-[#C10007] text-2xl" />
              </div>
              <div className="flex flex-col items-start">
                <h2 className="text-sm font-semibold">
                  {kategoriPelanggaran.find((k) => k.key === currentPelanggaran.type)?.label || currentPelanggaran.type}
                </h2>
                <h2 className="text-xs font-semibold text-[#F31260]">
                  {currentPelanggaran.created_at ? new Date(currentPelanggaran.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : "-"}
                </h2>
                <h2 className="text-xs text-[#8D8787] font-light">
                  {currentPelanggaran.description}
                </h2>
              </div>
            </div>
            <div className="flex flex-row gap-2.5 items-center">
              <button onClick={(e) => handlers.handleEditViolation(currentPelanggaran, e)} className="p-2 border border-[#C7D2FE] rounded-lg text-[#122C93] hover:bg-white transition-colors">
                <FaRegEdit className="text-base cursor-pointer" />
              </button>
              <button onClick={(e) => handlers.handleDeleteViolation(currentPelanggaran.uuid, e)} className="p-2 border border-[#C7D2FE] rounded-lg text-[#A70202] hover:bg-[#FDEDED] transition-colors">
                <FaRegTrashAlt className="text-base" />
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center text-sm text-gray-500 py-4">Belum ada pelanggaran</div>
        )}

        {(state.violations.length > 0 || state.violCurrentIndex > 0) && (
          <div className="flex w-full justify-center">
            <Pagination
              size="sm"
              showControls
              showShadow
              color="primary"
              page={state.violCurrentIndex + 1}
              total={Math.max(state.violCurrentIndex + 1 + (state.violHasMore ? 1 : 0), 1)}
              onChange={(page) => {
                if (page > state.violCurrentIndex + 1) handlers.handleNextViolation();
                else if (page < state.violCurrentIndex + 1) handlers.handlePrevViolation();
              }}
              classNames={{
                item: "[&:not([data-active=true])]:hidden",
              }}
            />
          </div>
        )}
      </div>

      <SatpamDetailModals state={state} setters={setters} handlers={handlers} modals={modals} dataKartu={dataKartu} />
    </div>
  );
};

export default ClientDetailsSatpam;
