import { FaLocationDot, FaRegClock, FaUser } from "react-icons/fa6";
import { FiSearch } from "react-icons/fi";
import { LuRoute } from "react-icons/lu";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";

interface SesiAbsensi {
  uuid: string;
  nama: string;
  nip: string;
  nama_client: string;
  tanggal: string;
  status: "tepat_waktu" | "terlambat";
}

const dummySesiAbsensi: SesiAbsensi[] = [
  {
    uuid: "1",
    nama: "Prasetyo Teguh",
    nip: "1234",
    nama_client: "Nama Client",
    tanggal: "12 Mei 2026",
    status: "tepat_waktu",
  },
  {
    uuid: "2",
    nama: "Prasetyo Teguh",
    nip: "1234",
    nama_client: "Nama Client",
    tanggal: "12 Mei 2026",
    status: "tepat_waktu",
  },
  {
    uuid: "3",
    nama: "Prasetyo Teguh",
    nip: "1234",
    nama_client: "Nama Client",
    tanggal: "12 Mei 2026",
    status: "tepat_waktu",
  },
  {
    uuid: "4",
    nama: "Prasetyo Teguh",
    nip: "1234",
    nama_client: "Nama Client",
    tanggal: "12 Mei 2026",
    status: "tepat_waktu",
  },
  {
    uuid: "5",
    nama: "Prasetyo Teguh",
    nip: "1234",
    nama_client: "Nama Client",
    tanggal: "12 Mei 2026",
    status: "tepat_waktu",
  },
  {
    uuid: "6",
    nama: "Prasetyo Teguh",
    nip: "1234",
    nama_client: "Nama Client",
    tanggal: "12 Mei 2026",
    status: "tepat_waktu",
  },
];

const statusStyles: Record<SesiAbsensi["status"], string> = {
  tepat_waktu: "bg-[#DCFCE7] text-[#008236]",
  terlambat: "bg-[#FEF3C7] text-[#B45309]",
};

const statusLabels: Record<SesiAbsensi["status"], string> = {
  tepat_waktu: "Tepat Waktu",
  terlambat: "Terlambat",
};

const ClientTrackingGps = () => {
  return (
    <div className="flex flex-col gap-2 p-2.5 overflow-hidden">
      {/* Header here */}
      <div className="header-container flex flex-row items-center justify-between mt-2">
        <div className="flex flex-col items-start">
          <h2 className="font-semibold text-2xl text-[#122C93]">
            Tracking GPS Satpam
          </h2>
          <p className="text-md text-black text-sm w-230">
            Lihat rute perjalanan satpam berdasarkan sesi absensi
          </p>
        </div>
      </div>
      {/* end of header */}
      {/* container main start here */}
      <div className="container-main-content h-[40rem] flex flex-row w-full gap-3">
        {/* conatiner for left side */}
        <div className="container-left-side w-1/4 h-full flex flex-col bg-white gap-4 rounded-2xl border border-[#E8EEFF] p-3 overflow-hidden">
          <div className="search-bar flex flex-row items-center gap-2 bg-white border border-[#E4E9F7] rounded-xl px-4 h-11 flex-shrink-0">
            <FiSearch className="text-[#B0B0B0] text-base flex-shrink-0" />
            <input
              type="search"
              placeholder="Cari histori pesan"
              className="bg-transparent text-sm text-gray-700 placeholder:text-[#B0B0B0] outline-none w-full"
            />
          </div>
          <hr className="w-full border-[#E4E9F7] flex-shrink-0" />
          <div className="container-list flex flex-col gap-3 flex-1 min-h-0 overflow-y-auto scrollbar-hide pr-1">
            {dummySesiAbsensi.map((item) => (
              <div
                key={item.uuid}
                className="card-1 border border-[#E4E9F7] rounded-2xl flex flex-col gap-2 p-3 flex-shrink-0"
              >
                <h2 className="font-medium text-sm">{item.nama}</h2>
                <div className="desc-details flex flex-col items-start">
                  <h2 className="text-xs font-light text-[#8D8787]">
                    NIP {item.nip} · {item.nama_client}
                  </h2>
                  <h2 className="text-xs font-light text-[#8D8787]">
                    {item.tanggal}
                  </h2>
                </div>
                <div
                  className={`chip -mt-4 self-end rounded-4xl px-4 py-1 ${statusStyles[item.status]}`}
                >
                  <h2 className="text-xs">{statusLabels[item.status]}</h2>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* end of container left side */}
        {/* container for right side */}
        <div className="container-right-side flex flex-col gap-4 w-3/4">
          {/* top section */}
          <div className="header-name-user flex flex-row w-full items-center justify-between bg-white rounded-2xl border border-[#E4E9F7] p-4">
            <div className="left-side flex flex-row items-center gap-3">
              <div className="user-logo-container p-3 rounded-2xl bg-[#e0e0e0]">
                <FaUser className="text-3xl" />
              </div>
              <div className="name-content flex flex-col items-start">
                <h2 className="text-md font-semibold">Prasetyo Teguh</h2>
                <h2 className="text-xs text-[#8D8787]">
                  NIP 1234 · Nama Client
                </h2>
                <h2 className="text-xs text-[#8D8787]">
                  Masuk: 12 Mei 2026, 08.36 • Keluar: 12 Mei 2026, 11.45
                </h2>
              </div>
            </div>
            <div className="right-side">
              <div className="chip bg-[#DCFCE7] rounded-4xl px-4 py-1">
                <h2 className="text-xs text-[#008236]">Tepat Waktu</h2>
              </div>
            </div>
          </div>
          {/* end of top section */}
          {/* maps section */}
          <div className="maps-section flex-1 flex flex-col w-full gap-3 bg-white rounded-2xl border border-[#E4E9F7] p-4 min-h-0">
            <div className="header-container-user flex flex-col">
              <h2 className="text-md font-semibold text-[#122C93]">
                Statistik Perjalanan
              </h2>
              <h2 className="text-xs text-[#8D8787]">Ringkasan Patroli</h2>
            </div>

            <div className="indicator-container flex flex-row w-full justify-between gap-2">
              <div className="card-1 flex flex-row w-full gap-2 items-center border border-[#E4E9F7] rounded-2xl p-3">
                <div className="logo-content p-3 bg-[#DBEAFE] rounded-xl">
                  <LuRoute className="text-xl text-[#122C93]" />
                </div>
                <div className="desc flex flex-col items-start">
                  <h2 className="text-md font-semibold text-[#122C93]">
                    1,2 Km
                  </h2>
                  <h2 className="text-xs">Total Jarak Tempuh</h2>
                </div>
              </div>
              <div className="card-1 flex flex-row w-full gap-2 items-center border border-[#E4E9F7] rounded-2xl p-3">
                <div className="logo-content p-3 bg-[#DBEAFE] rounded-xl">
                  <FaRegClock className="text-xl text-[#122C93]" />
                </div>
                <div className="desc flex flex-col items-start">
                  <h2 className="text-md font-semibold text-[#122C93]">
                    2j 13m
                  </h2>
                  <h2 className="text-xs">Total Durasi</h2>
                </div>
              </div>
              <div className="card-1 flex flex-row w-full gap-2 items-center border border-[#E4E9F7] rounded-2xl p-3">
                <div className="logo-content p-3 bg-[#DBEAFE] rounded-xl">
                  <FaLocationDot className="text-xl text-[#122C93]" />
                </div>
                <div className="desc flex flex-col items-start">
                  <h2 className="text-md font-semibold text-[#122C93]">6</h2>
                  <h2 className="text-xs">Titik GPS Terekam</h2>
                </div>
              </div>
            </div>

            <div className="flex-1 min-h-0 rounded-xl overflow-hidden">
              <MapContainer
                center={[-6.9147, 107.6098]}
                zoom={13}
                scrollWheelZoom
                style={{ height: "100%", width: "100%" }}
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              </MapContainer>
            </div>
          </div>
          {/* end of map section */}
        </div>
        {/* end of container right side */}
      </div>
      {/* end of container main */}
    </div>
  );
};

export default ClientTrackingGps;
