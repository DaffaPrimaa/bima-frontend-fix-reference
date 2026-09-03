import { Card, CardBody } from "@heroui/react";
import { useRadiusSettings } from "../hooks/useRadiusSettings";
import { RadiusForm } from "../Components/radius/RadiusForm";

const ClientManageRadius = () => {
  const settingsHook = useRadiusSettings();

  return (
    <div className="flex flex-col p-5">
      <div className="container-content flex flex-col gap-6">
        <div className="header-container mt-5">
          <h2 className="font-semibold text-[25px] text-[#122C93]">
            Konfigurasi Radius Absensi & Patroli
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Atur jarak maksimal yang diizinkan untuk melakukan absensi dan
            patroli (dalam satuan meter).
          </p>
        </div>

        <Card className="max-w-2xl border border-gray-200 shadow-none rounded-xl">
          <CardBody className="p-8 gap-8">
            <RadiusForm settingsHook={settingsHook} />
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default ClientManageRadius;
