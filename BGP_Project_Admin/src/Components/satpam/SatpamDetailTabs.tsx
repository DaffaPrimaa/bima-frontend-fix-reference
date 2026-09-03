import React, { useState } from "react";
import { Tabs, Tab, Button, Pagination } from "@heroui/react";
import { FaIdCard, FaRegEdit, FaRegTrashAlt } from "react-icons/fa";
import { GiGraduateCap } from "react-icons/gi";
import { GoTrophy } from "react-icons/go";

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

interface SatpamDetailTabsProps {
  state: any;
  setters: any;
  handlers: any;
  modals: any;
  readOnly?: boolean;
}

export const SatpamDetailTabs: React.FC<SatpamDetailTabsProps> = ({
  state,
  setters,
  handlers,
  modals,
  readOnly = false,
}) => {
  const [activeTab, setActiveTab] = useState("absensi");
  const [page, setPage] = useState(1);
  const totalPages = 10;

  const handleTambahTab = () => {
    if (activeTab === "pendukung") {
      setters.setDokumenFile(null);
      setters.setSelectedTipeDokumen(new Set(["ktp"]));
      modals.modalDokumen.onOpen();
    }
    if (activeTab === "pendidikan") {
      setters.setEditEduUuid(null);
      setters.setEduTitle("");
      setters.setEduYear("");
      setters.setEduDesc("");
      setters.setEduFile(null);
      modals.modalPendidikan.onOpen();
    }
    if (activeTab === "penghargaan") {
      setters.setEditRecUuid(null);
      setters.setRecTitle("");
      setters.setRecYear("");
      setters.setRecDesc("");
      setters.setRecFile(null);
      modals.modalPenghargaan.onOpen();
    }
  };

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
                className="border border-[#E8EEFF] flex flex-row items-center w-full bg-[#F5F7FF] py-2.5 px-4 gap-3 rounded-xl cursor-pointer hover:bg-[#e6ecff] transition-colors"
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
                {!readOnly && (
                  <div className="ml-auto flex flex-row gap-2">
                    <button onClick={(e) => handlers.handleEditDoc(doc, e)} className="p-2 border border-[#C7D2FE] rounded-lg text-[#122C93] hover:bg-white transition-colors">
                      <FaRegEdit className="text-base" />
                    </button>
                    <button onClick={(e) => handlers.handleDeleteDoc(doc.uuid, e)} className="p-2 border border-[#C7D2FE] rounded-lg text-[#A70202] hover:bg-[#FDEDED] transition-colors">
                      <FaRegTrashAlt className="text-base" />
                    </button>
                  </div>
                )}
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
                className="border border-[#E8EEFF] flex flex-row items-center w-full bg-[#F5F7FF] py-2.5 px-4 gap-3 rounded-xl cursor-pointer hover:bg-[#e6ecff] transition-colors"
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
                {!readOnly && (
                  <div className="ml-auto flex flex-row gap-2">
                    <button onClick={(e) => handlers.handleEditEdu(edu, e)} className="p-2 border border-[#C7D2FE] rounded-lg text-[#122C93] hover:bg-white transition-colors">
                      <FaRegEdit className="text-base" />
                    </button>
                    <button onClick={(e) => handlers.handleDeleteResource("educations", edu.uuid, e)} className="p-2 border border-[#C7D2FE] rounded-lg text-[#A70202] hover:bg-[#FDEDED] transition-colors">
                      <FaRegTrashAlt className="text-base" />
                    </button>
                  </div>
                )}
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
                className="border border-[#E8EEFF] flex flex-row items-center w-full bg-[#F5F7FF] py-2.5 px-4 gap-3 rounded-xl cursor-pointer hover:bg-[#e6ecff] transition-colors"
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
                {!readOnly && (
                  <div className="ml-auto flex flex-row gap-2">
                    <button onClick={(e) => handlers.handleEditRec(rec, e)} className="p-2 border border-[#C7D2FE] rounded-lg text-[#122C93] hover:bg-white transition-colors">
                      <FaRegEdit className="text-base" />
                    </button>
                    <button onClick={(e) => handlers.handleDeleteResource("recognitions", rec.uuid, e)} className="p-2 border border-[#C7D2FE] rounded-lg text-[#A70202] hover:bg-[#FDEDED] transition-colors">
                      <FaRegTrashAlt className="text-base" />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col items-start bg-white p-3 gap-1 rounded-xl border border-[#E8EEFF]">
      <div className="flex flex-row justify-between items-center w-full">
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
        {activeTab !== "absensi" && !readOnly && (
          <Button
            className="font-semibold text-white text-xs bg-[#122C93] px-3 py-2 rounded-lg"
            size="sm"
            onPress={handleTambahTab}
          >
            + Tambah
          </Button>
        )}
      </div>
      <div className="w-full flex flex-col gap-1">{renderTabContent()}</div>
    </div>
  );
};
