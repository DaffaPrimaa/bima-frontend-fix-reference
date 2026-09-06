import { useState, useEffect, useCallback } from "react";
import { satpamService } from "../services/satpamService";
import { shiftPatternService } from "../services/shiftPatternService";
import { posService } from "../services/posService";
import type { SatpamOption, ShiftOption, PosOption } from "../types/schedule";

export const useScheduleOptions = (shouldFetch: boolean) => {
  // Satpam State
  const [listSatpam, setListSatpam] = useState<SatpamOption[]>([]);
  const [hasMoreSatpam, setHasMoreSatpam] = useState(false);
  const [nextCursorSatpam, setNextCursorSatpam] = useState<string | null>(null);
  const [isLoadingSatpam, setIsLoadingSatpam] = useState(false);

  // Shift State
  const [listShift, setListShift] = useState<ShiftOption[]>([]);
  const [hasMoreShift, setHasMoreShift] = useState(false);
  const [nextCursorShift, setNextCursorShift] = useState<string | null>(null);
  const [isLoadingShift, setIsLoadingShift] = useState(false);

  // Pos State
  const [listPos, setListPos] = useState<PosOption[]>([]);
  const [hasMorePos, setHasMorePos] = useState(false);
  const [nextCursorPos, setNextCursorPos] = useState<string | null>(null);
  const [isLoadingPos, setIsLoadingPos] = useState(false);

  // Initial Fetch
  useEffect(() => {
    if (!shouldFetch) return;

    const fetchInitialOptions = async () => {
      // Satpam
      try {
        setIsLoadingSatpam(true);
        const resSatpam = await satpamService.getAll({ limit: 50 });
        if (resSatpam && Array.isArray(resSatpam.data)) {
          setListSatpam(resSatpam.data.map(s => ({ uuid: s.uuid, nama: s.nama, nip: s.nip })));
          if (resSatpam.meta) {
            setHasMoreSatpam(resSatpam.meta.has_more);
            setNextCursorSatpam(resSatpam.meta.next_cursor);
          }
        }
      } catch (e) {
        console.error("Error fetching satpam:", e);
      } finally {
        setIsLoadingSatpam(false);
      }

      // Shift
      try {
        setIsLoadingShift(true);
        const resShift = await shiftPatternService.getAll(50);
        if (resShift && Array.isArray(resShift.data)) {
          setListShift(resShift.data.map(s => ({ uuid: s.uuid, nama: s.nama, mulai: s.start_local, selesai: s.end_local, start_local: s.start_local, end_local: s.end_local })));
          if (resShift.meta) {
            setHasMoreShift(resShift.meta.has_more);
            setNextCursorShift(resShift.meta.next_cursor);
          }
        }
      } catch (e) {
        console.error("Error fetching shifts:", e);
      } finally {
        setIsLoadingShift(false);
      }

      // Pos
      try {
        setIsLoadingPos(true);
        const resPos = await posService.getAll(50, null, "utama");
        if (resPos && Array.isArray(resPos.data)) {
          setListPos(resPos.data.map(p => ({ uuid: p.uuid || "", nama: p.nama })));
          if (resPos.meta) {
            setHasMorePos(resPos.meta.has_more);
            setNextCursorPos(resPos.meta.next_cursor);
          }
        }
      } catch (e) {
        console.error("Error fetching pos:", e);
      } finally {
        setIsLoadingPos(false);
      }
    };

    fetchInitialOptions();
  }, [shouldFetch]);

  // Load More Functions
  const loadMoreSatpam = useCallback(async () => {
    if (!hasMoreSatpam || !nextCursorSatpam || isLoadingSatpam) return;
    setIsLoadingSatpam(true);
    try {
      const res = await satpamService.getAll({ limit: 50, cursor: nextCursorSatpam });
      if (res && Array.isArray(res.data)) {
        setListSatpam(prev => [...prev, ...res.data.map(s => ({ uuid: s.uuid, nama: s.nama, nip: s.nip }))]);
        if (res.meta) {
          setHasMoreSatpam(res.meta.has_more);
          setNextCursorSatpam(res.meta.next_cursor);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoadingSatpam(false);
    }
  }, [hasMoreSatpam, nextCursorSatpam, isLoadingSatpam]);

  const loadMoreShift = useCallback(async () => {
    if (!hasMoreShift || !nextCursorShift || isLoadingShift) return;
    setIsLoadingShift(true);
    try {
      const res = await shiftPatternService.getAll(50, nextCursorShift);
      if (res && Array.isArray(res.data)) {
        setListShift(prev => [...prev, ...res.data.map(s => ({ uuid: s.uuid, nama: s.nama, mulai: s.start_local, selesai: s.end_local, start_local: s.start_local, end_local: s.end_local }))]);
        if (res.meta) {
          setHasMoreShift(res.meta.has_more);
          setNextCursorShift(res.meta.next_cursor);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoadingShift(false);
    }
  }, [hasMoreShift, nextCursorShift, isLoadingShift]);

  const loadMorePos = useCallback(async () => {
    if (!hasMorePos || !nextCursorPos || isLoadingPos) return;
    setIsLoadingPos(true);
    try {
      const res = await posService.getAll(50, nextCursorPos, "utama");
      if (res && Array.isArray(res.data)) {
        setListPos(prev => [...prev, ...res.data.map(p => ({ uuid: p.uuid || "", nama: p.nama }))]);
        if (res.meta) {
          setHasMorePos(res.meta.has_more);
          setNextCursorPos(res.meta.next_cursor);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoadingPos(false);
    }
  }, [hasMorePos, nextCursorPos, isLoadingPos]);

  return {
    listSatpam, hasMoreSatpam, loadMoreSatpam, isLoadingSatpam,
    listShift, hasMoreShift, loadMoreShift, isLoadingShift,
    listPos, hasMorePos, loadMorePos, isLoadingPos
  };
};
