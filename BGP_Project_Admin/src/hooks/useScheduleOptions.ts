import { useState, useEffect } from "react";
import { scheduleService } from "../services/scheduleService";
import type { SatpamOption, ShiftOption, PosOption } from "../types/schedule";

export const useScheduleOptions = (shouldFetch: boolean) => {
  const [listSatpam, setListSatpam] = useState<SatpamOption[]>([]);
  const [listShift, setListShift] = useState<ShiftOption[]>([]);
  const [listPos, setListPos] = useState<PosOption[]>([]);

  useEffect(() => {
    if (shouldFetch) {
      const fetchOptions = async () => {
        try {
          const { satpam, shifts, pos } = await scheduleService.getOptions();
          setListSatpam(satpam);
          setListShift(shifts);
          setListPos(pos);
        } catch (error) {
          console.error("Error fetching options:", error);
        }
      };
      fetchOptions();
    }
  }, [shouldFetch]);

  return { listSatpam, listShift, listPos };
};
