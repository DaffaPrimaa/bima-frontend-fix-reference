import { Button, Spinner } from "@heroui/react";
import { MdDelete, MdEditCalendar } from "react-icons/md";
import type { Jadwal } from "../../types/schedule";

interface ShiftPatternLike {
  uuid: string;
  nama: string;
  mulai?: string;
  selesai?: string;
}

interface JadwalHarianViewProps {
  currentDateIso: string;
  isJadwalLoading: boolean;
  shiftData: ShiftPatternLike[];
  allJadwal: Jadwal[];
  handleOpenAssign: (shiftUuid: string) => void;
  handleEditJadwalInstance: (item: Jadwal) => void;
  confirmDeleteJadwal: (item: Jadwal) => void;
}

const JadwalHarianView = ({
  currentDateIso,
  isJadwalLoading,
  shiftData,
  allJadwal,
  handleOpenAssign,
  handleEditJadwalInstance,
  confirmDeleteJadwal,
}: JadwalHarianViewProps) => {
  return (
    <div className="card-jadwal-container grid grid-cols-3 content-start gap-1 w-full h-152 overflow-y-auto">
      {isJadwalLoading ? (
        <div className="col-span-3 flex justify-center py-10">
          <Spinner />
        </div>
      ) : shiftData?.length === 0 ? (
        <div className="col-span-3 text-center text-sm text-[#6B6B6B] py-10">
          Belum ada konfigurasi shift. Tambahkan di tab "Atur Shift".
        </div>
      ) : (
        (shiftData || []).map((shift) => {
          const satpamForShift = allJadwal.filter(
            (j) =>
              j.pattern.uuid === shift.uuid &&
              j.work_date === currentDateIso &&
              j.status !== "cancelled",
          );

          return (
            <div
              key={shift.uuid}
              className="card-shift flex flex-col bg-white border border-[#E4E9F7] p-3 rounded-2xl h-[300px]"
            >
              <div className="card-header flex flex-row items-center justify-between flex-shrink-0">
                <div className="jadwal flex flex-col items-start">
                  <h2 className="font-semibold">{shift.nama}</h2>
                  <h2 className="text-light text-sm text-[#6B6B6B]">
                    {shift.mulai?.slice(0, 5)} - {shift.selesai?.slice(0, 5)}
                  </h2>
                </div>
                <Button
                  variant="bordered"
                  className="rounded-2xl"
                  onPress={() => handleOpenAssign(shift.uuid)}
                >
                  Assign +
                </Button>
              </div>
              <hr className="w-full mt-4 border-[#E4E9F7] flex-shrink-0" />

              <div className="flex flex-col gap-3 mt-4 flex-1 min-h-0 overflow-y-auto pr-1">
                {satpamForShift.length === 0 ? (
                  <p className="text-xs text-[#9CA3AF] text-center mt-4">
                    Belum ada satpam yang ditugaskan
                  </p>
                ) : (
                  satpamForShift.map((item) => (
                    <div
                      key={item.uuid}
                      className="list-satpam flex flex-row justify-between items-center flex-shrink-0"
                    >
                      <div className="left-side flex flex-row items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#122C93] text-white flex items-center justify-center text-sm font-semibold flex-shrink-0">
                          {item.satpam.nama.charAt(0).toUpperCase()}
                        </div>
                        <div className="container-details-satpam flex flex-col gap-1 items-start">
                          <h2 className="text-sm">{item.satpam.nama}</h2>
                          <h2 className="text-xs text-[#6B6B6B]">
                            {item.pos.nama} · {item.satpam.nip}
                          </h2>
                        </div>
                      </div>
                      <div className="right-side flex flex-row items-center gap-2">
                        <button
                          type="button"
                          className="border border-[#C7D2FE] text-[#122C93] rounded-lg p-2 hover:bg-[#F5F7FF] cursor-pointer transition-colors"
                          onClick={() => handleEditJadwalInstance(item)}
                        >
                          <MdEditCalendar className="text-base" />
                        </button>
                        <button
                          type="button"
                          className="border border-[#C7D2FE] text-[#A70202] rounded-lg p-2 hover:bg-[#FDEDED] cursor-pointer transition-colors"
                          onClick={() => confirmDeleteJadwal(item)}
                        >
                          <MdDelete className="text-base" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default JadwalHarianView;
