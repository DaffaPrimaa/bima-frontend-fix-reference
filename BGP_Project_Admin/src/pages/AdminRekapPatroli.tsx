import { Button, useDisclosure } from "@heroui/react";
import { FaDownload } from "react-icons/fa";
import { usePatroliData } from "../hooks/usePatroliData";
import { usePatroliForm } from "../hooks/usePatroliForm";
import { usePatroliExport } from "../hooks/usePatroliExport";
import { usePatroliImages } from "../hooks/usePatroliImages";
import { PatroliTable } from "../Components/patroli/PatroliTable";
import { PatroliEditModal } from "../Components/patroli/PatroliEditModal";
import { PatroliImageModal } from "../Components/patroli/PatroliImageModal";
import type { Patroli } from "../types/patroli";

const AdminRekapPatroli = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { data, handleNextPage, handlePrevPage, refreshData } = usePatroliData();
  const { isDownloading, handleDownload } = usePatroliExport();
  const {
    imageState,
    handleViewImages,
    onClose: onCloseImages,
  } = usePatroliImages();

  const formHook = usePatroliForm({
    onSuccess: refreshData,
    onClose: () => onOpenChange(),
  });

  const handleOpenEdit = (item: Patroli) => {
    formHook.actions.initForm(item);
    onOpen();
  };

  return (
    <div className="flex flex-col gap-10 p-5">
      <div className="container-content flex flex-col gap-4">
        <div className="header-container flex flex-row items-center justify-between mt-5">
          <h2 className="font-semibold text-[25px] text-[#122C93]">
            Rekap Patroli Satpam
          </h2>
          <Button
            onPress={handleDownload}
            isLoading={isDownloading}
            className="bg-[#122C93] text-white font-semibold h-12 px-6"
            startContent={!isDownloading && <FaDownload />}
          >
            Download
          </Button>
        </div>

        <PatroliTable
          data={data.dataPatroli}
          isLoading={data.isLoading}
          currentPage={data.currentPage}
          hasMore={data.hasMore}
          rowsPerPage={data.rowsPerPage}
          onNextPage={handleNextPage}
          onPrevPage={handlePrevPage}
          onEdit={handleOpenEdit}
          onViewImages={handleViewImages}
        />

        <PatroliEditModal
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          formHook={formHook}
        />

        <PatroliImageModal
          isOpen={imageState.isOpen}
          onClose={onCloseImages}
          images={imageState.previewImages}
        />
      </div>
    </div>
  );
};

export default AdminRekapPatroli;
