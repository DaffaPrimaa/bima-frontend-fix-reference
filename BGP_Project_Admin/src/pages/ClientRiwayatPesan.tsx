import { useState, useEffect, useCallback } from "react";
import {
  DateRangePicker,
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Select,
  SelectItem,
  Textarea,
  Input,
  addToast,
} from "@heroui/react";
import { FiSearch, FiPlus } from "react-icons/fi";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Pagination,
  Spinner,
} from "@heroui/react";
import { messageService } from "../services/messageService";
import { satpamService } from "../services/satpamService";
import { formatDateTimeZone } from "../Utils/helpers";
import type { Message } from "../types/message";
import type { Satpam } from "../types/satpam";

const COLUMNS = [
  { name: "No", uid: "no" },
  { name: "Nama", uid: "nama" },
  { name: "NIP", uid: "nip" },
  { name: "Isi Pesan", uid: "isi_pesan" },
  { name: "Tanggal dikirim", uid: "tanggal_dikirim" },
];

const ClientRiwayatPesan = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [dateRange, setDateRange] = useState<{ start?: any; end?: any }>({});

  const [cursorHistory, setCursorHistory] = useState<(string | null)[]>([null]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const limit = 10;

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [satpamOptions, setSatpamOptions] = useState<Satpam[]>([]);
  const [selectedSatpam, setSelectedSatpam] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(handler);
  }, [search]);

  const from = dateRange.start ? dateRange.start.toString() : undefined;
  const to = dateRange.end ? dateRange.end.toString() : undefined;

  const fetchMessages = useCallback(async () => {
    setLoading(true);
    try {
      const cursor = cursorHistory[currentIndex];
      const res = await messageService.getAll({ limit, cursor, search: debouncedSearch, from, to });
      setMessages(res.data || []);
      setHasMore(res.meta?.has_more ?? false);
      setNextCursor(res.meta?.next_cursor ?? null);
    } catch (error) {
      console.error("Fetch messages error:", error);
      setMessages([]);
      setHasMore(false);
      setNextCursor(null);
    } finally {
      setLoading(false);
    }
  }, [cursorHistory, currentIndex, debouncedSearch, from, to]);

  useEffect(() => {
    setCursorHistory([null]);
    setCurrentIndex(0);
  }, [debouncedSearch, from, to]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const handleNextPage = () => {
    if (hasMore && nextCursor) {
      setCursorHistory([...cursorHistory.slice(0, currentIndex + 1), nextCursor]);
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };

  const openSendModal = async () => {
    onOpen();
    try {
      const res = await satpamService.getAll({ limit: 50 });
      setSatpamOptions(res.data || []);
    } catch (error) {
      console.error("Fetch satpam options error:", error);
      setSatpamOptions([]);
    }
  };

  const resetForm = () => {
    setSelectedSatpam("");
    setTitle("");
    setContent("");
  };

  const handleSend = async () => {
    if (!selectedSatpam || !title.trim() || !content.trim()) {
      addToast({ title: "Gagal", description: "Satpam, judul, dan isi pesan wajib diisi", color: "danger", variant: "flat" });
      return;
    }
    setSending(true);
    try {
      await messageService.create({ satpam_uuid: selectedSatpam, title: title.trim(), content: content.trim() });
      addToast({ title: "Berhasil", description: "Pesan berhasil dikirim", color: "success", variant: "flat" });
      resetForm();
      onClose();
      setCursorHistory([null]);
      setCurrentIndex(0);
      fetchMessages();
    } catch (err: any) {
      addToast({ title: "Gagal", description: err.message, color: "danger", variant: "flat" });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex flex-col gap-2 p-2.5 overflow-hidden">
      <div className="header-container flex flex-row items-center justify-between mt-2">
        <div className="flex flex-col items-start">
          <h2 className="font-semibold text-2xl text-[#122C93]">
            Riwayat Pesan
          </h2>
          <p className="text-md text-black text-sm w-230">
            Semua pesan yang pernah dikirim ke satpam.
          </p>
        </div>
        <Button
          className="bg-[#122C93] text-white font-semibold"
          startContent={<FiPlus />}
          onPress={openSendModal}
        >
          Kirim Pesan
        </Button>
      </div>

      <div className="container-search rounded-2xl flex flex-row gap-3 items-center bg-[#FFFFFF] p-3 border border-[#E4E9F7]">
        <div className="flex flex-row items-center gap-2 bg-white border border-[#E4E9F7] rounded-xl px-4 h-11 flex-1">
          <FiSearch className="text-[#B0B0B0] text-base flex-shrink-0" />
          <input
            type="search"
            placeholder="Cari histori pesan"
            className="bg-transparent text-sm text-gray-700 placeholder:text-[#B0B0B0] outline-none w-full h-full"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <DateRangePicker
          size="sm"
          className="w-72"
          label="Filter Tanggal"
          variant="bordered"
          onChange={(value) => setDateRange(value || {})}
          classNames={{
            label: "!text-xs !font-light !text-[#122C93]",
          }}
        />
      </div>

      <div className="table-container">
        <Table
          aria-label="Tabel Riwayat Pesan"
          shadow="none"
          isStriped
          className="rounded-xl border border-[#E8EEFF]"
          bottomContent={
            <div className="flex w-full justify-center pb-1">
              <Pagination
                size="sm"
                showControls
                showShadow
                color="primary"
                page={currentIndex + 1}
                total={Math.max(currentIndex + 1 + (hasMore ? 1 : 0), 1)}
                onChange={(page) => {
                  if (page > currentIndex + 1) handleNextPage();
                  else if (page < currentIndex + 1) handlePrevPage();
                }}
                classNames={{ item: "[&:not([data-active=true])]:hidden" }}
              />
            </div>
          }
        >
          <TableHeader columns={COLUMNS}>
            {(column) => (
              <TableColumn
                key={column.uid}
                className="text-sm font-medium bg-[#E8E8E8] text-black"
              >
                {column.name}
              </TableColumn>
            )}
          </TableHeader>

          <TableBody items={messages} emptyContent={loading ? <Spinner size="lg" /> : "Tidak ada data"}>
            {(item) => (
              <TableRow key={item.uuid}>
                {(columnKey) => {
                  switch (columnKey) {
                    case "no":
                      return (
                        <TableCell className="text-sm text-black">
                          {currentIndex * limit + messages.indexOf(item) + 1}
                        </TableCell>
                      );
                    case "nama":
                      return (
                        <TableCell className="text-sm text-black">
                          {item.satpam?.nama || "-"}
                        </TableCell>
                      );
                    case "nip":
                      return (
                        <TableCell className="text-sm text-black">
                          {item.satpam?.nip || "-"}
                        </TableCell>
                      );
                    case "isi_pesan":
                      return (
                        <TableCell className="text-sm text-black">
                          <span className="font-medium">{item.title}</span> — {item.content}
                        </TableCell>
                      );
                    case "tanggal_dikirim":
                      return (
                        <TableCell>
                          <span className="bg-[#E8EEFF] text-[#122C93] text-xs font-medium px-3 py-1.5 rounded-lg whitespace-nowrap">
                            {formatDateTimeZone(item.created_at)}
                          </span>
                        </TableCell>
                      );
                    default:
                      return <TableCell>-</TableCell>;
                  }
                }}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Modal isOpen={isOpen} onClose={() => { resetForm(); onClose(); }} size="lg">
        <ModalContent>
          {(close) => (
            <>
              <ModalHeader>Kirim Pesan Baru</ModalHeader>
              <ModalBody className="flex flex-col gap-4">
                <Select
                  label="Satpam Tujuan"
                  placeholder="Pilih satpam"
                  selectedKeys={selectedSatpam ? [selectedSatpam] : []}
                  onChange={(e) => setSelectedSatpam(e.target.value)}
                >
                  {satpamOptions.map((s) => (
                    <SelectItem key={s.uuid} textValue={`${s.nama} (${s.nip})`}>
                      {s.nama} ({s.nip})
                    </SelectItem>
                  ))}
                </Select>
                <Input
                  label="Judul"
                  placeholder="Judul pesan"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                <Textarea
                  label="Isi Pesan"
                  placeholder="Tulis pesan..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
              </ModalBody>
              <ModalFooter>
                <Button variant="light" onPress={() => { resetForm(); close(); }}>
                  Batal
                </Button>
                <Button
                  className="bg-[#122C93] text-white"
                  isLoading={sending}
                  onPress={handleSend}
                >
                  Kirim
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default ClientRiwayatPesan;
