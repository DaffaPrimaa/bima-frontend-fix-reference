import { useState, useEffect, useCallback } from "react";
import { satpamService } from "../services/satpamService";
import { violationService } from "../services/violationService";
import type { Satpam, CardData } from "../types/satpam";
import { useDisclosure } from "@heroui/react";
import { addToast } from "@heroui/react";

export const useAdminSatpamDetails = (uuid: string) => {
  // Basic states
  const [satpam, setSatpam] = useState<Satpam | null>(null);
  const [cardData, setCardData] = useState<CardData | null>(null);
  const [documents, setDocuments] = useState<any[]>([]);
  const [educations, setEducations] = useState<any[]>([]);
  const [recognitions, setRecognitions] = useState<any[]>([]);
  const [emergencyContacts, setEmergencyContacts] = useState<any[]>([]);
  const [workingHours, setWorkingHours] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Document states
  const [dokumenFile, setDokumenFile] = useState<File | null>(null);
  const [selectedTipeDokumen, setSelectedTipeDokumen] = useState<Set<string>>(new Set(["ktp"]));
  const [isUploadingDokumen, setIsUploadingDokumen] = useState(false);
  const [previewDoc, setPreviewDoc] = useState<any>(null);

  // Education states
  const [eduTitle, setEduTitle] = useState("");
  const [eduYear, setEduYear] = useState("");
  const [eduDesc, setEduDesc] = useState("");
  const [eduFile, setEduFile] = useState<File | null>(null);
  const [editEduUuid, setEditEduUuid] = useState<string | null>(null);
  const [isUploadingEdu, setIsUploadingEdu] = useState(false);

  // Recognition states
  const [recTitle, setRecTitle] = useState("");
  const [recYear, setRecYear] = useState("");
  const [recDesc, setRecDesc] = useState("");
  const [recFile, setRecFile] = useState<File | null>(null);
  const [editRecUuid, setEditRecUuid] = useState<string | null>(null);
  const [isUploadingRec, setIsUploadingRec] = useState(false);

  // Violations states
  const [violations, setViolations] = useState<any[]>([]);
  const [violCursorHistory, setViolCursorHistory] = useState<(string | null)[]>([null]);
  const [violCurrentIndex, setViolCurrentIndex] = useState(0);
  const [violHasMore, setViolHasMore] = useState(false);
  const [violNextCursor, setViolNextCursor] = useState<string | null>(null);
  const [isLoadingViolations, setIsLoadingViolations] = useState(false);
  const [violationType, setViolationType] = useState("");
  const [violationDesc, setViolationDesc] = useState("");
  const [editViolationUuid, setEditViolationUuid] = useState<string | null>(null);
  const [isUploadingViolation, setIsUploadingViolation] = useState(false);

  // Modals
  const modalDokumen = useDisclosure();
  const modalPendidikan = useDisclosure();
  const modalPenghargaan = useDisclosure();
  const modalTambahPelanggaran = useDisclosure();
  const modalGenerateKartu = useDisclosure();
  const modalPreviewDokumen = useDisclosure();
  const modalDeleteConfirmation = useDisclosure();

  const [deleteAction, setDeleteAction] = useState<{
    execute: () => Promise<void>;
    message: string;
  } | null>(null);

  const confirmDelete = (execute: () => Promise<void>, message: string) => {
    setDeleteAction({ execute, message });
    modalDeleteConfirmation.onOpen();
  };

  const fetchDetail = useCallback(async () => {
    if (!uuid) return;
    try {
      setIsLoading(true);
      const [detailRes, cardRes, docsRes, eduRes, recRes, ecRes] = await Promise.all([
        satpamService.getById(uuid),
        satpamService.getCardData(uuid),
        satpamService.getDocuments(uuid).catch(() => ({ data: [] })),
        satpamService.getResource(uuid, "educations").catch(() => ({ data: [] })),
        satpamService.getResource(uuid, "recognitions").catch(() => ({ data: [] })),
        satpamService.getResource(uuid, "emergency-contacts").catch(() => ({ data: [] }))
      ]);
      setSatpam(detailRes.data);
      setCardData(cardRes.data);
      setDocuments(docsRes.data || []);
      setEducations(eduRes.data || []);
      setRecognitions(recRes.data || []);
      setEmergencyContacts(ecRes.data || []);
      setWorkingHours(detailRes.data?.working_hours || null);
    } catch (error) {
      console.error("Error fetching detail:", error);
    } finally {
      setIsLoading(false);
    }
  }, [uuid]);

  const fetchViolations = useCallback(async () => {
    if (!uuid) return;
    setIsLoadingViolations(true);
    try {
      const currentCursor = violCursorHistory[violCurrentIndex];
      const violRes = await violationService.getViolations(uuid, 1, currentCursor).catch(() => ({ data: [] }));
      setViolations(violRes.data || []);
      if (violRes.meta) {
        setViolHasMore(violRes.meta.has_more);
        setViolNextCursor(violRes.meta.next_cursor);
      } else {
        setViolHasMore(false);
        setViolNextCursor(null);
      }
    } finally {
      setIsLoadingViolations(false);
    }
  }, [uuid, violCurrentIndex, violCursorHistory]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  useEffect(() => {
    fetchViolations();
  }, [fetchViolations]);

  // Document Handlers
  const handleUploadDokumen = async () => {
    if (!dokumenFile) {
      addToast({ title: "Gagal", description: "Pilih file terlebih dahulu", color: "danger", variant: "flat" });
      return;
    }
    const tipeArray = Array.from(selectedTipeDokumen);
    if (tipeArray.length === 0) {
      addToast({ title: "Gagal", description: "Pilih jenis dokumen", color: "danger", variant: "flat" });
      return;
    }

    setIsUploadingDokumen(true);
    try {
      const ext = dokumenFile.name.split('.').pop()?.toLowerCase() || "jpg";
      const uploadData = await satpamService.getUploadUrl(uuid, ext);
      const { object_uuid, upload_url, fields } = uploadData;

      await satpamService.uploadToGcs(upload_url, fields, dokumenFile);

      await satpamService.createDocument(uuid, {
        type: tipeArray[0],
        object_uuid: object_uuid
      });

      addToast({ title: "Berhasil", description: "Dokumen berhasil diunggah", color: "success", variant: "flat" });
      modalDokumen.onClose();
      fetchDetail();
      
      // Auto refresh after 5 seconds to get the updated view_url from backend processing
      setTimeout(() => {
        window.location.reload();
      }, 5000);
    } catch (error: any) {
      addToast({ title: "Gagal", description: error.message || "Gagal mengunggah dokumen", color: "danger", variant: "flat" });
    } finally {
      setIsUploadingDokumen(false);
    }
  };

  const handleEditDoc = (doc: any, e: React.MouseEvent) => {
    e.stopPropagation();
    setDokumenFile(null);
    setSelectedTipeDokumen(new Set([doc.type]));
    modalDokumen.onOpen();
  };

  const handleDeleteDoc = (docUuid: string, e: React.MouseEvent) => {
    e.stopPropagation();
    confirmDelete(async () => {
      try {
        await satpamService.deleteDocument(uuid, docUuid);
        addToast({ title: "Berhasil", description: "Dokumen dihapus", color: "success", variant: "flat" });
        fetchDetail();
      } catch (error: any) {
        addToast({ title: "Gagal", description: error.message, color: "danger", variant: "flat" });
      }
    }, "Apakah Anda yakin ingin menghapus dokumen ini?");
  };

  const openPreviewModal = (doc: any) => {
    if (!doc?.file?.view_url) return;
    const isPdf = doc.file.view_url.split('?')[0].toLowerCase().endsWith('.pdf');
    if (isPdf) {
      window.open(doc.file.view_url, '_blank', 'noopener,noreferrer');
    } else {
      setPreviewDoc(doc);
      modalPreviewDokumen.onOpen();
    }
  };

  // Education Handlers
  const handleUploadEducation = async () => {
    if (!eduTitle || !eduYear) {
      addToast({ title: "Gagal", description: "Lengkapi judul dan tahun", color: "danger", variant: "flat" });
      return;
    }
    setIsUploadingEdu(true);
    try {
      let objectUuid = "";
      if (eduFile) {
        const ext = eduFile.name.split('.').pop()?.toLowerCase() || "pdf";
        const uploadData = await satpamService.getUploadUrlResource(uuid, "educations", ext);
        await satpamService.uploadToGcs(uploadData.upload_url, uploadData.fields, eduFile);
        objectUuid = uploadData.object_uuid;
      }
      if (editEduUuid) {
        await satpamService.updateResource(uuid, "educations", editEduUuid, {
          title: eduTitle,
          issued_year: eduYear,
          description: eduDesc,
          object_uuid: objectUuid || undefined
        });
      } else {
        await satpamService.createResource(uuid, "educations", {
          title: eduTitle,
          issued_year: eduYear,
          description: eduDesc,
          object_uuid: objectUuid || undefined
        });
      }
      addToast({ title: "Berhasil", description: "Data pendidikan berhasil disimpan", color: "success", variant: "flat" });
      modalPendidikan.onClose();
      fetchDetail();
    } catch (error: any) {
      addToast({ title: "Gagal", description: error.message || "Gagal menyimpan data", color: "danger", variant: "flat" });
    } finally {
      setIsUploadingEdu(false);
    }
  };

  const handleEditEdu = (edu: any, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditEduUuid(edu.uuid);
    setEduTitle(edu.title);
    setEduYear(edu.issued_year);
    setEduDesc(edu.description || "");
    setEduFile(null);
    modalPendidikan.onOpen();
  };

  // Recognition Handlers
  const handleUploadRecognition = async () => {
    if (!recTitle || !recYear) {
      addToast({ title: "Gagal", description: "Lengkapi judul dan tahun", color: "danger", variant: "flat" });
      return;
    }
    setIsUploadingRec(true);
    try {
      let objectUuid = "";
      if (recFile) {
        const ext = recFile.name.split('.').pop()?.toLowerCase() || "pdf";
        const uploadData = await satpamService.getUploadUrlResource(uuid, "recognitions", ext);
        await satpamService.uploadToGcs(uploadData.upload_url, uploadData.fields, recFile);
        objectUuid = uploadData.object_uuid;
      }
      if (editRecUuid) {
        await satpamService.updateResource(uuid, "recognitions", editRecUuid, {
          title: recTitle,
          issued_year: recYear,
          description: recDesc,
          object_uuid: objectUuid || undefined
        });
      } else {
        await satpamService.createResource(uuid, "recognitions", {
          title: recTitle,
          issued_year: recYear,
          description: recDesc,
          object_uuid: objectUuid || undefined
        });
      }
      addToast({ title: "Berhasil", description: "Data penghargaan berhasil disimpan", color: "success", variant: "flat" });
      modalPenghargaan.onClose();
      fetchDetail();
    } catch (error: any) {
      addToast({ title: "Gagal", description: error.message || "Gagal menambahkan data", color: "danger", variant: "flat" });
    } finally {
      setIsUploadingRec(false);
    }
  };

  const handleEditRec = (rec: any, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditRecUuid(rec.uuid);
    setRecTitle(rec.title);
    setRecYear(rec.issued_year);
    setRecDesc(rec.description || "");
    setRecFile(null);
    modalPenghargaan.onOpen();
  };

  const handleDeleteResource = (resType: string, credUuid: string, e: React.MouseEvent) => {
    e.stopPropagation();
    confirmDelete(async () => {
      try {
        await satpamService.deleteResource(uuid, resType, credUuid);
        addToast({ title: "Berhasil", description: "Data dihapus", color: "success", variant: "flat" });
        fetchDetail();
      } catch (error: any) {
        addToast({ title: "Gagal", description: error.message, color: "danger", variant: "flat" });
      }
    }, "Apakah Anda yakin ingin menghapus data ini?");
  };

  // Violation Handlers
  const handleUploadViolation = async () => {
    if (!violationType || !violationDesc) {
      addToast({ title: "Gagal", description: "Lengkapi kategori dan keterangan", color: "danger", variant: "flat" });
      return;
    }
    setIsUploadingViolation(true);
    try {
      if (editViolationUuid) {
        await violationService.updateViolation(editViolationUuid, {
          type: violationType,
          description: violationDesc,
        });
      } else {
        await violationService.createViolation({
          satpam_uuid: uuid,
          type: violationType,
          description: violationDesc,
        });
      }
      addToast({ title: "Berhasil", description: "Data pelanggaran berhasil disimpan", color: "success", variant: "flat" });
      modalTambahPelanggaran.onClose();
      fetchViolations();
    } catch (error: any) {
      addToast({ title: "Gagal", description: error.message || "Gagal menyimpan pelanggaran", color: "danger", variant: "flat" });
    } finally {
      setIsUploadingViolation(false);
    }
  };

  const handleEditViolation = (viol: any, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditViolationUuid(viol.uuid);
    setViolationType(viol.type);
    setViolationDesc(viol.description);
    modalTambahPelanggaran.onOpen();
  };

  const handleDeleteViolation = (violUuid: string, e: React.MouseEvent) => {
    e.stopPropagation();
    confirmDelete(
      async () => {
        try {
          await violationService.deleteViolation(violUuid);
          addToast({ title: "Berhasil", description: "Pelanggaran berhasil dihapus", color: "success", variant: "flat" });
          
          if (violations.length === 1 && violCurrentIndex > 0) {
            setViolCurrentIndex(violCurrentIndex - 1);
          }
          fetchViolations();
        } catch (error: any) {
          addToast({ title: "Gagal", description: error.message || "Gagal menghapus pelanggaran", color: "danger", variant: "flat" });
        }
      },
      "Apakah Anda yakin ingin menghapus pelanggaran ini?"
    );
  };

  const handleNextViolation = () => {
    if (violHasMore && violNextCursor) {
      if (violCurrentIndex === violCursorHistory.length - 1) {
        setViolCursorHistory((prev) => [...prev, violNextCursor]);
      }
      setViolCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrevViolation = () => {
    if (violCurrentIndex > 0) {
      setViolCurrentIndex((prev) => prev - 1);
    }
  };

  const handleTambahPelanggaran = () => {
    setEditViolationUuid(null);
    setViolationType("");
    setViolationDesc("");
    modalTambahPelanggaran.onOpen();
  };

  return {
    state: {
      satpam,
      cardData,
      documents,
      educations,
      recognitions,
      emergencyContacts,
      workingHours,
      isLoading,
      dokumenFile,
      selectedTipeDokumen,
      isUploadingDokumen,
      previewDoc,
      eduTitle,
      eduYear,
      eduDesc,
      eduFile,
      isUploadingEdu,
      recTitle,
      recYear,
      recDesc,
      recFile,
      isUploadingRec,
      violations,
      violCurrentIndex,
      violHasMore,
      isLoadingViolations,
      violationType,
      violationDesc,
      isUploadingViolation,
      deleteAction,
    },
    setters: {
      setDokumenFile,
      setSelectedTipeDokumen,
      setEduTitle,
      setEduYear,
      setEduDesc,
      setEduFile,
      setRecTitle,
      setRecYear,
      setRecDesc,
      setRecFile,
      setViolationType,
      setViolationDesc,
      setEditEduUuid,
      setEditRecUuid,
    },
    handlers: {
      handleUploadDokumen,
      handleEditDoc,
      handleDeleteDoc,
      openPreviewModal,
      handleUploadEducation,
      handleEditEdu,
      handleUploadRecognition,
      handleEditRec,
      handleDeleteResource,
      handleUploadViolation,
      handleEditViolation,
      handleDeleteViolation,
      handleNextViolation,
      handlePrevViolation,
      handleTambahPelanggaran,
    },
    modals: {
      modalDokumen,
      modalPendidikan,
      modalPenghargaan,
      modalTambahPelanggaran,
      modalGenerateKartu,
      modalPreviewDokumen,
      modalDeleteConfirmation,
    }
  };
};
