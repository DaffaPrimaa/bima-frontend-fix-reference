import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaArrowLeftLong } from "react-icons/fa6";
import { FaUserAlt, FaPhoneAlt, FaRegTrashAlt } from "react-icons/fa";
import { Button, Input, Select, SelectItem, Spinner, addToast } from "@heroui/react";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { satpamService } from "../services/satpamService";

export const enumgender = [
  { key: "1", label: "Laki-Laki" },
  { key: "2", label: "Perempuan" },
];

export const jabatan = [
  { key: "chief", label: "Chief" },
  { key: "danru", label: "Danru" },
  { key: "anggota", label: "Anggota" },
];

export const statuspegawai = [
  { key: "active", label: "Aktif" },
  { key: "inactive", label: "Non Aktif" },
  { key: "resign", label: "Resign" },
];

export const hubunganOptions = [
  { key: "wali", label: "Wali" },
  { key: "pasangan", label: "Pasangan" },
  { key: "anak", label: "Anak" },
  { key: "saudara", label: "Saudara" },
];

interface EmergencyContact {
  id?: string;
  nama: string;
  hubungan: string;
  kontak: string;
}

const AdminEditDetailSatpam = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const uuid = location.state?.uuid;

  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [satpamData, setSatpamData] = useState({
    nama: "",
    asal_daerah: "",
    gender: "",
    jabatan: "",
    nip: "",
    email: "",
    status: "",
  });

  const [kontakUtama, setKontakUtama] = useState("");
  const [nrg, setNrg] = useState("");

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [existingAvatarUrl, setExistingAvatarUrl] = useState<string | null>(null);
  const [uploadedObjectUuid, setUploadedObjectUuid] = useState<string | null>(null);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>([]);

  useEffect(() => {
    if (!uuid) {
      navigate(-1);
      return;
    }

    const loadData = async () => {
      setIsLoading(true);
      try {
        const res = await satpamService.getById(uuid);
        const sat = res.data;
        setSatpamData({
          nama: sat.nama || "",
          asal_daerah: sat.asal_daerah || "",
          gender: sat.gender || "",
          jabatan: sat.jabatan || "",
          nip: sat.nip || "",
          email: sat.email || "",
          status: sat.status || "active",
        });
        setKontakUtama(sat.nomor_hp || sat.no_telp || "");
        setNrg(sat.nrg || "");
        if (sat.avatar?.view_url) {
          setExistingAvatarUrl(sat.avatar.view_url);
        }

        const contactsRes = await satpamService.getResource(uuid, "emergency-contacts");
        setEmergencyContacts(contactsRes.data || []);
      } catch (err: any) {
        addToast({ title: "Gagal", description: "Gagal memuat data satpam", color: "danger", variant: "flat" });
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [uuid, navigate]);

  const handleInputChange = (field: string, value: string) => {
    setSatpamData((prev) => ({ ...prev, [field]: value }));
  };

  const handleContactChange = (index: number, field: string, value: string) => {
    const updated = [...emergencyContacts];
    updated[index] = { ...updated[index], [field]: value };
    setEmergencyContacts(updated);
  };

  const handleAddContact = () => {
    if (emergencyContacts.length < 2) {
      setEmergencyContacts([...emergencyContacts, { nama: "", hubungan: "", kontak: "" }]);
    }
  };

  const handleRemoveContact = (index: number) => {
    const updated = [...emergencyContacts];
    if (!updated[index].id) {
      updated.splice(index, 1);
    } else {
      updated[index].nama = "";
      updated[index].hubungan = "";
      updated[index].kontak = "";
    }
    setEmergencyContacts(updated);
  };

  const handleSave = async () => {
    if (!uuid) return;
    setIsSaving(true);
    try {
      let payload: any = {
        nama: satpamData.nama,
        nip: satpamData.nip,
        gender: satpamData.gender,
        asal_daerah: satpamData.asal_daerah,
        jabatan: satpamData.jabatan,
        email: satpamData.email,
        status: satpamData.status,
        kontak_utama: kontakUtama
      };
      if (uploadedObjectUuid) {
        payload.object_uuid = uploadedObjectUuid;
        let success = false;
        for (let i = 0; i < 15; i++) {
          try {
            await satpamService.update(uuid, payload);
            success = true;
            break;
          } catch (err: any) {
            if (err.message && err.message.includes("not validated yet")) {
              await new Promise(resolve => setTimeout(resolve, 2000));
              continue;
            }
            throw err;
          }
        }
        if (!success) {
          throw new Error("Gagal menyimpan: Avatar masih diproses oleh server, silakan coba simpan lagi.");
        }
      } else {
        await satpamService.update(uuid, payload);
      }

      for (const ec of emergencyContacts) {
        const payload = { nama: ec.nama, hubungan: ec.hubungan, kontak: ec.kontak };
        if (ec.id) {
          if (!ec.nama || !ec.hubungan || !ec.kontak) {
            await satpamService.deleteResource(uuid, "emergency-contacts", ec.id);
          } else {
            await satpamService.updateResource(uuid, "emergency-contacts", ec.id, payload);
          }
        } else {
          if (ec.nama && ec.hubungan && ec.kontak) {
            await satpamService.createResource(uuid, "emergency-contacts", payload);
          }
        }
      }

      addToast({ title: "Berhasil", description: "Data satpam berhasil diperbarui", color: "success", variant: "flat" });
      navigate(-1);
    } catch (err: any) {
      addToast({ title: "Gagal", description: err.message || "Gagal menyimpan perubahan", color: "danger", variant: "flat" });
    } finally {
      setIsSaving(false);
    }
  };

  const visibleContacts = emergencyContacts.filter((c) => c.nama !== "" || c.hubungan !== "" || c.kontak !== "" || !c.id);

  if (isLoading) {
    return <div className="flex justify-center p-10"><Spinner size="lg" /></div>;
  }

  return (
    <div className="flex flex-col gap-2 p-2.5 overflow-hidden h-full">
      {/* header bar */}
      <div className="flex flex-row justify-between items-center bg-white p-2.5 rounded-xl flex-shrink-0">
        <div className="flex flex-row gap-2.5 items-start">
          <div className="bg-[#DBEAFE] p-2 rounded-lg cursor-pointer" onClick={() => navigate(-1)}>
            <FaArrowLeftLong className="text-base" />
          </div>
          <div className="flex flex-col items-start">
            <h2 className="font-semibold text-sm text-[#122C93]">
              Edit Satpam
            </h2>
            <h2 className="text-xs font-light text-[#8D8787]">
              Pastikan data personel sudah sesuai sebelum menyimpan perubahan.
            </h2>
          </div>
        </div>
        <div className="flex flex-row items-center gap-2">
          <Button
            variant="bordered"
            className="border-[#122C93] text-[#122C93] font-semibold text-xs px-4"
            size="sm"
            onPress={() => navigate(-1)}
            isDisabled={isSaving || isUploadingAvatar}
          >
            Batal
          </Button>
          <Button
            className="bg-[#122C93] text-white font-semibold text-xs px-4"
            size="sm"
            onPress={handleSave}
            isLoading={isSaving}
            isDisabled={isUploadingAvatar}
          >
            Simpan Data Satpam
          </Button>
        </div>
      </div>

      {/* main content */}
      <div className="container-main flex flex-row gap-4 items-stretch justify-between flex-1 min-h-0">
        <div className="container-left flex flex-col w-1/2 bg-white rounded-lg gap-3 p-4 overflow-y-auto">
          {/* header */}
          <div className="header-container flex flex-row items-center gap-2">
            <FaUserAlt className="text-lg text-[#122C93]" />
            <h2 className="text-xs font-semibold text-[#122C93]">
              DATA PRIBADI
            </h2>
          </div>

          <Input
            size="sm"
            label="Nama Lengkap"
            labelPlacement="outside-top"
            placeholder="mis. Nur Cahya"
            variant="bordered"
            isRequired
            value={satpamData.nama}
            onChange={(e) => handleInputChange("nama", e.target.value)}
          />
          <Input
            size="sm"
            label="Asal Daerah"
            labelPlacement="outside-top"
            placeholder="mis. Ngawi, Jawa Timur"
            variant="bordered"
            isRequired
            value={satpamData.asal_daerah}
            onChange={(e) => handleInputChange("asal_daerah", e.target.value)}
          />

          <Select
            size="sm"
            isRequired
            className="max-w-full"
            label="Jenis Kelamin"
            labelPlacement="outside-top"
            variant="bordered"
            placeholder="Masukan jenis kelamin"
            selectedKeys={satpamData.gender ? new Set([satpamData.gender]) : new Set()}
            onSelectionChange={(keys) => handleInputChange("gender", Array.from(keys)[0] as string)}
          >
            {enumgender.map((item) => (
              <SelectItem key={item.key}>{item.label}</SelectItem>
            ))}
          </Select>

          <Select
            size="sm"
            isRequired
            className="max-w-full"
            label="Jabatan"
            labelPlacement="outside-top"
            variant="bordered"
            placeholder="Pilih Jabatan"
            selectedKeys={satpamData.jabatan ? new Set([satpamData.jabatan]) : new Set()}
            onSelectionChange={(keys) => handleInputChange("jabatan", Array.from(keys)[0] as string)}
          >
            {jabatan.map((item) => (
              <SelectItem key={item.key}>{item.label}</SelectItem>
            ))}
          </Select>

          <div className="container-input flex flex-row items-center gap-3">
            <Input
              size="sm"
              label="NIP"
              labelPlacement="outside-top"
              placeholder="1301xxx"
              variant="bordered"
              className="w-1/2"
              value={satpamData.nip}
              onChange={(e) => handleInputChange("nip", e.target.value)}
            />
            <Input
              size="sm"
              label="NRG"
              labelPlacement="outside-top"
              placeholder="Otomatis"
              variant="bordered"
              className="w-1/2"
              isDisabled
              value={nrg}
            />
          </div>

          <Input
            size="sm"
            label="Alamat Email"
            labelPlacement="outside-top"
            placeholder="contoh@gmail.com"
            variant="bordered"
            isRequired
            value={satpamData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
          />

          <Select
            size="sm"
            isRequired
            className="max-w-full"
            label="Status Kepegawaian"
            labelPlacement="outside-top"
            variant="bordered"
            placeholder="Pilih Status"
            selectedKeys={satpamData.status ? new Set([satpamData.status]) : new Set()}
            onSelectionChange={(keys) => handleInputChange("status", Array.from(keys)[0] as string)}
          >
            {statuspegawai.map((item) => (
              <SelectItem key={item.key}>{item.label}</SelectItem>
            ))}
          </Select>

          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium">
              Pas Foto
            </span>
            <label
              htmlFor="upload-dokumen"
              className="flex flex-col items-center justify-center w-full h-36 bg-[#F5F7FF] border-2 border-dashed border-[#8D8787] rounded-xl cursor-pointer hover:bg-[#e6ecff] transition-colors relative overflow-hidden"
            >
              {(avatarFile || existingAvatarUrl) ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  {avatarFile ? (
                    <img src={URL.createObjectURL(avatarFile)} className="h-full object-contain" alt="New avatar" />
                  ) : (
                    <img src={existingAvatarUrl!} className="h-full object-contain" alt="Current avatar" />
                  )}
                  {isUploadingAvatar && (
                    <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                      <Spinner color="white" />
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-row items-center gap-2 text-[#9095A0]">
                  <AiOutlineCloudUpload className="text-lg" />
                  <span className="text-xs font-medium text-[#6B7280]">
                    Unggah Dokumen
                  </span>
                  <span className="text-xs text-[#9CA3AF]">PDF, PNG/JPG</span>
                </div>
              )}
              <input
                id="upload-dokumen"
                type="file"
                accept=".png,.jpg,.jpeg"
                className="hidden"
                onChange={async (e) => {
                  if (e.target.files && e.target.files[0]) {
                    const file = e.target.files[0];
                    setAvatarFile(file);
                    setIsUploadingAvatar(true);
                    try {
                      const ext = file.name.split('.').pop()?.toLowerCase() || "jpg";
                      const uploadData = await satpamService.getAvatarUploadUrl(ext);
                      await satpamService.uploadToGcs(uploadData.upload_url, uploadData.fields, file);
                      setUploadedObjectUuid(uploadData.object_uuid);
                      addToast({ title: "Berhasil", description: "Foto berhasil diunggah", color: "success", variant: "flat" });
                    } catch (err: any) {
                      addToast({ title: "Gagal", description: "Gagal mengunggah foto", color: "danger", variant: "flat" });
                      setAvatarFile(null);
                      setUploadedObjectUuid(null);
                    } finally {
                      setIsUploadingAvatar(false);
                    }
                  }
                }}
              />
            </label>
            {(avatarFile || existingAvatarUrl) && (
              <span className="text-[10px] text-gray-500 text-center mt-1">Klik gambar untuk mengganti foto</span>
            )}
          </div>
        </div>

        <div className="container-right flex flex-col w-1/2 bg-white rounded-lg p-4 gap-3 overflow-y-auto">
          {/* header */}
          <div className="header-container flex flex-row items-center gap-2">
            <FaPhoneAlt className="text-lg text-[#122C93]" />
            <h2 className="text-xs font-semibold text-[#122C93]">KONTAK</h2>
          </div>

          <Input
            size="sm"
            label="No. Telp"
            labelPlacement="outside-top"
            placeholder="08xx - xxxx - xxxx"
            variant="bordered"
            isRequired
            value={kontakUtama}
            onChange={(e) => setKontakUtama(e.target.value)}
          />

          <div className="border border-dashed border-[#8D8787] my-2" />

          {/* header */}
          <div className="header-container flex flex-row items-center gap-2">
            <FaPhoneAlt className="text-lg text-[#122C93]" />
            <h2 className="text-xs font-semibold text-[#122C93]">
              KONTAK DARURAT
            </h2>
          </div>

          {visibleContacts.map((contact, index) => (
            <div key={contact.id || index} className="flex flex-col gap-3 border p-3 rounded-lg border-gray-200">
              <Input
                size="sm"
                label="Nama Kerabat / Wali"
                labelPlacement="outside-top"
                placeholder="Nama Lengkap"
                variant="bordered"
                isRequired
                value={contact.nama}
                onChange={(e) => handleContactChange(index, "nama", e.target.value)}
              />

              <div className="container-input flex flex-row items-center gap-3">
                <Select
                  size="sm"
                  label="Hubungan"
                  labelPlacement="outside-top"
                  placeholder="Pilih Hubungan"
                  variant="bordered"
                  className="w-1/2"
                  isRequired
                  selectedKeys={contact.hubungan ? new Set([contact.hubungan]) : new Set()}
                  onSelectionChange={(keys) => handleContactChange(index, "hubungan", Array.from(keys)[0] as string)}
                >
                  {hubunganOptions.map((item) => (
                    <SelectItem key={item.key}>{item.label}</SelectItem>
                  ))}
                </Select>
                <Input
                  size="sm"
                  label="No. Telp"
                  labelPlacement="outside-top"
                  placeholder="08xx - xxxx - xxxx"
                  variant="bordered"
                  className="w-1/2"
                  isRequired
                  value={contact.kontak}
                  onChange={(e) => handleContactChange(index, "kontak", e.target.value)}
                />
              </div>

              <Button
                size="sm"
                className="w-full bg-[#A70202] text-white mt-1"
                onPress={() => handleRemoveContact(index)}
                startContent={<FaRegTrashAlt size={14} />}
              >
                Hapus Kontak
              </Button>
            </div>
          ))}

          {visibleContacts.length < 2 && (
            <Button
              size="sm"
              className="border-[#122C93] text-[#122C93] font-semibold text-sm mt-2 hover:bg-[#122C93] hover:text-white"
              variant="bordered"
              onPress={handleAddContact}
            >
              + Tambahkan Nomor Kedua
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminEditDetailSatpam;
