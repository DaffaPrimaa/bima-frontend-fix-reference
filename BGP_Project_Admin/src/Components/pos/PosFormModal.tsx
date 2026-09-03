import {
  Modal,
  ModalContent,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Spinner,
} from "@heroui/react";
import { MapContainer, TileLayer } from "react-leaflet";
import { LocationMarker } from "./LocationMarker";
import type { usePosForm } from "../../hooks/usePosForm";

interface PosFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  formHook: ReturnType<typeof usePosForm>;
}

export const PosFormModal = ({
  isOpen,
  onClose,
  formHook,
}: PosFormModalProps) => {
  const { formState, setters, actions } = formHook;
  const { formData, selectedPosition, loading } = formState;

  return (
    <Modal backdrop="opaque" isOpen={isOpen} onClose={onClose} size="4xl">
      <ModalContent>
        <ModalBody>
          <div className="form-input flex flex-col gap-8 p-3">
            <div className="grid grid-cols-2 gap-x-8 gap-y-6">
              <Input
                label="Nama Pos"
                placeholder="Masukan nama"
                variant="underlined"
                maxLength={101}
                min={4}
                size="lg"
                value={formData.nama}
                onChange={(e) =>
                  setters.setFormData({ ...formData, nama: e.target.value })
                }
              />
              <Input
                label="Kode Pos"
                placeholder="Masukan Kode Pos"
                variant="underlined"
                maxLength={21}
                minLength={1}
                size="lg"
                value={formData.kode}
                onChange={(e) =>
                  setters.setFormData({ ...formData, kode: e.target.value })
                }
              />
              <Input
                label="Latitude"
                placeholder="-6.xxxxx"
                variant="underlined"
                size="lg"
                value={formData.lat}
                onChange={(e) =>
                  setters.handleManualCoordChange("lat", e.target.value)
                }
              />
              <Input
                label="Longitude"
                placeholder="107.xxxxx"
                variant="underlined"
                size="lg"
                value={formData.lng}
                onChange={(e) =>
                  setters.handleManualCoordChange("lng", e.target.value)
                }
              />
            </div>
            <div className="flex flex-col items-start w-full gap-2">
              <h2 className="text-lg font-semibold">Titik Koordinat Maps</h2>
              <p className="text-sm text-gray-500">
                Klik di peta untuk memilih lokasi, drag marker, atau isi
                Latitude/Longitude manual.
              </p>
              <div className="w-full h-[400px] rounded-lg overflow-hidden z-10">
                <MapContainer
                  center={
                    selectedPosition
                      ? [selectedPosition.lat, selectedPosition.lng]
                      : [-6.9175, 107.6191]
                  }
                  zoom={13}
                  style={{ height: "100%", width: "100%" }}
                >
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  <LocationMarker
                    position={selectedPosition}
                    setPosition={setters.updateCoordinates}
                  />
                </MapContainer>
              </div>
            </div>
          </div>
        </ModalBody>
        <ModalFooter className="flex justify-center gap-5">
          <Button color="danger" variant="light" onPress={onClose}>
            Batal
          </Button>
          <Button
            className="bg-[#122C93] text-white font-semibold"
            onPress={actions.handleSave}
            disabled={loading}
          >
            {loading ? (
              <Spinner classNames={{ label: "text-white ml-2" }} />
            ) : (
              "Simpan"
            )}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
