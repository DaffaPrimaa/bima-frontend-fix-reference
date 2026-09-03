import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Select,
  SelectItem,
  Spinner,
} from "@heroui/react";
import type { useMitraAssignment } from "../../hooks/useMitraAssignment";
import { InfiniteScrollTrigger } from "../common/InfiniteScrollTrigger";

interface MitraAssignmentModalProps {
  assignment: ReturnType<typeof useMitraAssignment>;
}

export const MitraAssignmentModal = ({
  assignment,
}: MitraAssignmentModalProps) => {
  const { isOpen, onClose, mitraData, setFormMitraId, handleAssignMitra } =
    assignment;
  const { mitraOptions, formMitraId, loadingMitra, submitting, hasMoreMitra, loadingMoreMitra, loadMoreMitra } = mitraData;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <ModalContent>
        <ModalHeader className="text-[#122C93]">Penugasan Mitra</ModalHeader>
        <ModalBody>
          {loadingMitra ? (
            <div className="flex justify-center py-4">
              <Spinner label="Memuat opsi..." />
            </div>
          ) : (
            <Select
              label="Pilih Mitra"
              placeholder="Pilih mitra atau lepas tugas"
              variant="underlined"
              labelPlacement="inside"
              size="lg"
              selectedKeys={formMitraId ? [formMitraId] : []}
              onChange={(e) => setFormMitraId(e.target.value)}
              listboxProps={{
                bottomContent: (
                  <InfiniteScrollTrigger
                    hasMore={hasMoreMitra}
                    isLoading={loadingMoreMitra}
                    onLoadMore={loadMoreMitra}
                  />
                ),
              }}
            >
              {[
                { uuid: "unassign", nama: "- Lepas Penugasan -" },
                ...mitraOptions,
              ].map((item) => (
                <SelectItem key={item.uuid} textValue={item.nama}>
                  {item.nama}
                </SelectItem>
              ))}
            </Select>
          )}
        </ModalBody>
        <ModalFooter>
          <Button variant="light" color="danger" onPress={onClose}>
            Batal
          </Button>
          <Button
            className="bg-[#122C93] text-white"
            onPress={handleAssignMitra}
            disabled={submitting || loadingMitra}
          >
            {submitting ? <Spinner size="sm" color="white" /> : "Simpan"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
