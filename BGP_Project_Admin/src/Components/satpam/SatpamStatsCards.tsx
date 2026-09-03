import React from "react";
import type { Satpam } from "../../types/satpam";

interface SatpamStatsCardsProps {
  satpam: Satpam | null;
  workingHours: any;
}

export const SatpamStatsCards: React.FC<SatpamStatsCardsProps> = ({
  satpam,
  workingHours,
}) => {
  return (
    <div className="flex flex-row items-center justify-between gap-2.5">
      <div className="bg-white w-full h-[120px] rounded-xl border border-[#E8EEFF] flex flex-col justify-center p-5 ">
        <h2 className="font-medium text-md text-black">
          Total Jam Kerja Bulan ini
        </h2>
        <h2 className="font-bold text-2xl text-[#122C93] leading-tight">
          {workingHours?.this_month?.hours?.toLocaleString("id-ID") || 0}{" "}
          <span className="font-semibold text-[#8D8787] text-sm">Jam</span>
        </h2>
        <h2 className="font-light text-xs text-[#8D8787]">
          Periode {new Date().toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })} · {workingHours?.this_month?.shifts || 0} hari kerja
        </h2>
        <h2 className="text-xs font-medium text-[#122C93]">{satpam?.client ? `di ${satpam.client}` : "-"}</h2>
      </div>
      <div className="bg-white w-full h-[120px] rounded-xl border border-[#E8EEFF] flex flex-col justify-center p-5">
        <h2 className="font-medium text-md text-black">
          Total Jam Kerja Keseluruhan
        </h2>
        <h2 className="font-bold text-2xl text-[#122C93] leading-tight">
          {workingHours?.all_time?.hours?.toLocaleString("id-ID") || 0}{" "}
          <span className="font-semibold text-[#8D8787] text-sm">Jam</span>
        </h2>
        <h2 className="font-light text-xs text-[#8D8787]">
          Sejak Penempatan · {(satpam?.date_assigned || workingHours?.all_time?.since || workingHours?.since) ? new Date(satpam?.date_assigned || workingHours?.all_time?.since || workingHours?.since).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' }) : "Januari 2025"} - sekarang
        </h2>
        <h2 className="text-xs font-medium text-[#122C93]">
          {satpam?.client ? `di ${satpam.client}` : "-"}
        </h2>
      </div>
    </div>
  );
};
