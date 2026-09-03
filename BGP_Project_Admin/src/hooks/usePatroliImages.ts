import { useState } from "react";
import { useDisclosure } from "@heroui/react";

export const usePatroliImages = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [previewImages, setPreviewImages] = useState<string[]>([]);

  const handleViewImages = (images: string[]) => {
    setPreviewImages(images);
    onOpen();
  };

  return {
    imageState: { isOpen, previewImages },
    handleViewImages,
    onClose,
  };
};
