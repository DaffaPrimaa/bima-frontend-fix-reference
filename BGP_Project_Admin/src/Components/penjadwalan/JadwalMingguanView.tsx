import type { Jadwal } from "../../types/schedule";

const hariSingkatanMingguTable = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

export const getTanggalTableMingguan = (date: Date) => {
  const dayOfWeek = date.getDay();
  const minggu = new Date(date);
  minggu.setDate(date.getDate() - dayOfWeek);

  return hariSingkatanMingguTable.map((hari, i) => {
    const tanggal = new Date(minggu);
    tanggal.setDate(minggu.getDate() + i);

    const year = tanggal.getFullYear();
    const month = String(tanggal.getMonth() + 1).padStart(2, "0");
    const day = String(tanggal.getDate()).padStart(2, "0");

    return {
      hari,
      tanggal: tanggal.getDate(),
      iso: `${year}-${month}-${day}`,
    };
  });
};

interface JadwalMingguanViewProps {
  currentDate: Date;
  allJadwal: Jadwal[];
  listSatpam: any[];
  handleEditJadwalInstance: (item: Jadwal) => void;
  handleOpenAssignForDate: (satpamUuid: string, dateIso: string) => void;
}

const JadwalMingguanView = ({
  currentDate,
  allJadwal,
  listSatpam,
  handleEditJadwalInstance,
  handleOpenAssignForDate,
}: JadwalMingguanViewProps) => {
  const tanggalTable = getTanggalTableMingguan(currentDate);

  return (
    <div className="table-container mt-2 rounded-2xl border border-[#E4E9F7] overflow-hidden overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-[#F1F1F1]">
            <th className="text-left py-4 px-5 font-bold text-base text-black min-w-[220px]">
              Nama
            </th>
            {tanggalTable.map(({ hari, tanggal }) => (
              <th key={hari} className="py-4 px-3 text-center min-w-[110px]">
                <div className="flex flex-col items-center">
                  <span className="text-sm font-normal text-[#8D8787]">{hari}</span>
                  <span className="text-base font-bold text-black">{tanggal}</span>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {listSatpam.length === 0 ? (
            <tr>
              <td
                colSpan={hariSingkatanMingguTable.length + 1}
                className="py-6 text-center text-sm text-[#6B6B6B]"
              >
                Belum ada data satpam
              </td>
            </tr>
          ) : (
            listSatpam.map((satpam) => (
              <tr key={satpam.uuid} className="border-t border-[#E4E9F7]">
                <td className="py-3 px-5">
                  <div className="flex flex-row items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#122C93] text-white flex items-center justify-center text-sm font-semibold flex-shrink-0">
                      {satpam.nama.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex flex-col items-start">
                      <span className="text-sm font-medium text-black">{satpam.nama}</span>
                      <span className="text-xs text-[#8D8787]">NIP · {satpam.nip}</span>
                    </div>
                  </div>
                </td>
                {tanggalTable.map(({ hari, iso }) => {
                  const match = allJadwal.find(
                    (j) =>
                      j.satpam.uuid === satpam.uuid &&
                      j.work_date === iso &&
                      j.status !== "cancelled"
                  );

                  return (
                    <td key={hari} className="py-3 px-3 text-center">
                      {match ? (
                        <button
                          type="button"
                          onClick={() => handleEditJadwalInstance(match)}
                          className="min-h-8 h-8 px-3 rounded-full text-xs font-medium !bg-[#EFF6FF] !text-[#2563EB] border border-[#BFDBFE]"
                        >
                          {match.pattern.nama}
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleOpenAssignForDate(satpam.uuid, iso)}
                          className="w-8 h-8 rounded-full border border-dashed border-[#C4C4C4] text-[#9CA3AF] text-xs data-[hover=true]:bg-[#F5F7FF]"
                        >
                          +
                        </button>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default JadwalMingguanView;
