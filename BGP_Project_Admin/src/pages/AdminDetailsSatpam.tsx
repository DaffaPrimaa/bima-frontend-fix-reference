import { useLocation, useNavigate } from "react-router-dom";
import { FaArrowLeftLong } from "react-icons/fa6";
import { FaIdCardAlt, FaRegEdit, FaRegTrashAlt } from "react-icons/fa";
import { LuOctagonAlert } from "react-icons/lu";
import { IoIosAlert } from "react-icons/io";
import { Spinner, Button, Pagination } from "@heroui/react";

import { useAdminSatpamDetails } from "../hooks/useAdminSatpamDetails";
import { SatpamDetailTabs } from "../Components/satpam/SatpamDetailTabs";
import { SatpamStatsCards } from "../Components/satpam/SatpamStatsCards";
import { SatpamDetailModals } from "../Components/satpam/Modals/SatpamDetailModals";
import { kategoriPelanggaran } from "../Components/satpam/constants";

const AdminDetailsSatpam = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const uuid = location.state?.uuid;

  const { state, setters, handlers, modals } = useAdminSatpamDetails(uuid);

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

  const currentPelanggaran = state.violations.length > 0 ? state.violations[0] : null;

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
              Detail Satpam
            </h2>
            <h2 className="text-xs font-light text-[#8D8787]">
              Profil Personal
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
      <SatpamStatsCards satpam={state.satpam} workingHours={state.workingHours} />

      {/* Informasi Personal */}
      {state.isLoading ? (
        <div className="flex justify-center p-10"><Spinner /></div>
      ) : state.satpam ? (
      <div className="flex flex-row items-center gap-5 bg-white rounded-xl px-3 py-2 border border-[#E8EEFF]">
        <div className="w-52 h-60 bg-slate-200 rounded-2xl flex-shrink-0 overflow-hidden">
          {state.satpam.avatar?.view_url ? (
            <img src={state.satpam.avatar.view_url} className="w-full h-full object-cover" alt="Profile" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
          )}
        </div>
        <div className="flex flex-col gap-2 w-full">
          <div className="flex flex-col items-start">
            <div className="flex flex-row items-center gap-2">
              <h2 className="font-semibold text-2xl">{state.satpam.nama}</h2>
              <h2 className={`text-sm px-3 py-0.5 rounded-2xl ${state.satpam.status === 'active' ? 'bg-[#DCFCE7] text-[#008236]' : 'bg-red-100 text-red-700'}`}>
                {state.satpam.status === 'active' ? 'Aktif' : state.satpam.status}
              </h2>
            </div>
            <h2 className="text-sm font-light text-[#8D8787]">
              {state.satpam.jabatan || "-"} · Pos Utama
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
                <h2 className="font-light text-sm leading-tight">
                  {label}
                </h2>
                <h2 className="font-light text-base leading-tight text-[#8D8787] max-w-[200px] truncate" title={String(value)}>
                  {value}
                </h2>
              </div>
            ))}
          </div>
        </div>
      </div>
      ) : (
        <div className="flex justify-center p-10">Data tidak ditemukan</div>
      )}

      {/* Tab Section */}
      <SatpamDetailTabs state={state} setters={setters} handlers={handlers} modals={modals} />

      {/* Riwayat Pelanggaran */}
      <div className="flex flex-col gap-2 bg-white p-2 rounded-xl border border-[#E8EEFF]">
        <div className="flex flex-row items-center justify-between">
          <div className="flex flex-row gap-2 items-center">
            <LuOctagonAlert className="text-danger text-xl" />
            <h2 className="font-semibold text-[#122C93] text-sm">
              Riwayat Pelanggaran
            </h2>
          </div>
          <Button
            className="font-semibold text-white text-xs bg-[#122C93] px-3 py-1.5 rounded-lg"
            size="sm"
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
              <h2 className="text-xs text-[#8D8787] font-light mt-1">
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

export default AdminDetailsSatpam;
