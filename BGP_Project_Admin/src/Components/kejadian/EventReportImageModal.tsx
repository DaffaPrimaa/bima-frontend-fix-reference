import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@heroui/react";
import type { Photo } from "../../types/eventReport";

interface EventReportImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  photos: Photo[];
}

export const EventReportImageModal = ({
  isOpen,
  onClose,
  photos,
}: EventReportImageModalProps) => {
  const validPhotos = photos.filter((p) => p.view_url);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl" scrollBehavior="inside">
      <ModalContent>
        <ModalHeader className="text-[#122C93]">
          Dokumentasi Laporan Kejadian
        </ModalHeader>
        <ModalBody>
          {validPhotos.length === 0 ? (
            <div className="flex justify-center items-center h-40 text-gray-500">
              Tidak ada dokumentasi foto.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-2">
              {validPhotos.slice(0, 4).map((photo, index) => (
                <div key={photo.uuid} className="flex flex-col gap-2">
                  <div className="rounded-lg overflow-hidden border border-gray-200 shadow-sm h-64 bg-gray-50">
                    <img
                      src={photo.view_url!}
                      alt={`Dokumentasi-${index}`}
                      className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform"
                      onClick={() => window.open(photo.view_url!, "_blank")}
                    />
                  </div>
                  <span className="text-xs text-center text-gray-500">
                    Foto {index + 1}
                  </span>
                </div>
              ))}
            </div>
          )}
        </ModalBody>
        <ModalFooter>
          <Button className="bg-[#122C93] text-white" onPress={onClose}>
            Tutup
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
