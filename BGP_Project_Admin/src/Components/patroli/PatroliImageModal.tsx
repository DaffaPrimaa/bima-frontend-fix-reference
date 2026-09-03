import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@heroui/react";

interface PatroliImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  images: string[];
}

export const PatroliImageModal = ({
  isOpen,
  onClose,
  images,
}: PatroliImageModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl" scrollBehavior="inside">
      <ModalContent>
        <ModalHeader className="text-[#122C93]">
          Dokumentasi Patroli
        </ModalHeader>
        <ModalBody>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-2">
            {images.map((url, index) => (
              <div key={index} className="flex flex-col gap-2">
                <div className="rounded-lg overflow-hidden border border-gray-200 shadow-sm h-64">
                  <img
                    src={url}
                    alt={`Patroli-${index}`}
                    className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform"
                    onClick={() => window.open(url, "_blank")}
                  />
                </div>
                <span className="text-xs text-center text-gray-500">
                  Gambar {index + 1}
                </span>
              </div>
            ))}
          </div>
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
