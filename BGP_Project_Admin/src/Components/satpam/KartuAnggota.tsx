import { createPortal } from "react-dom";
import logo from "../../assets/images/logo.webp";

export interface KartuAnggotaProps {
  nama?: string;
  jabatan?: string;
  nip?: string;
  nrg?: string;
  mitra?: string;
  disahkanOleh?: string;
  avatar_url?: string;
}

const Barcode = ({ value }: { value?: string | null }) => {
  const safeValue = value || "0000000000";
  const bars = safeValue.split("").map((char, i) => {
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
        {safeValue}
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
  avatar_url,
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
        <div className="w-24 h-28 bg-[#E7E9F5] rounded-md flex items-center justify-center mt-2 overflow-hidden">
          {avatar_url ? (
            <img src={avatar_url} className="w-full h-full object-cover" alt="Pas Foto" />
          ) : (
            <span className="text-[#9096B8] text-[9px]">PAS FOTO</span>
          )}
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
  nip = "123xxx",
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
            <Barcode value={nip} />
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
            /* 1. Mencegah root app dan elemen body lain menimpa portal */
            body > *:not(.print-portal-container) {
              display: none !important;
            }
            
            /* 2. Menetralkan CSS Modal yang mengunci scroll body (overflow: hidden) */
            html, body {
              height: auto !important;
              min-height: 100% !important;
              overflow: visible !important;
              position: static !important;
              margin: 0;
              padding: 0;
              background-color: white !important;
            }
            
            /* 3. Menampilkan wrapper print */
            .print-portal-container {
              display: flex !important;
              visibility: visible !important;
            }
            
            /* 4. Memaksa browser mencetak seluruh warna dan background gradient */
            * {
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            
            /* Aturan area kertas (opsional, disesuaikan) */
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
