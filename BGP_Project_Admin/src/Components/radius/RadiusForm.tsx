import { Input, Button, Spinner } from "@heroui/react";
import type { useRadiusSettings } from "../../hooks/useRadiusSettings";

interface RadiusFormProps {
  settingsHook: ReturnType<typeof useRadiusSettings>;
}

export const RadiusForm = ({ settingsHook }: RadiusFormProps) => {
  const { state, setters, actions } = settingsHook;
  const { loadingData, saving, radiusUtama, radiusPatroli, errors } = state;
  const { setRadiusUtama, setRadiusPatroli, setErrors } = setters;

  if (loadingData) {
    return (
      <div className="flex justify-center py-10">
        <Spinner label="Memuat pengaturan..." />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <label className="font-semibold text-[#122C93]">
          Radius Maksimum Pos Utama
        </label>
        <Input
          type="number"
          variant="bordered"
          size="lg"
          placeholder="Contoh: 100"
          maxLength={1001}
          minLength={20}
          value={radiusUtama}
          isInvalid={!!errors.radiusUtama}
          errorMessage={errors.radiusUtama}
          onChange={(e) => {
            setRadiusUtama(e.target.value);
            if (errors.radiusUtama)
              setErrors({ ...errors, radiusUtama: undefined });
          }}
          endContent={
            <div className="pointer-events-none flex items-center">
              <span className="text-default-400 text-small">meter</span>
            </div>
          }
          description="Jarak toleransi GPS untuk absen di Pos Utama (Min 20m, Max 1000m)."
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="font-semibold text-[#122C93]">
          Radius Maksimum Pos Patroli
        </label>
        <Input
          type="number"
          variant="bordered"
          size="lg"
          maxLength={1001}
          minLength={20}
          placeholder="Contoh: 50"
          value={radiusPatroli}
          isInvalid={!!errors.radiusPatroli}
          errorMessage={errors.radiusPatroli}
          onChange={(e) => {
            setRadiusPatroli(e.target.value);
            if (errors.radiusPatroli)
              setErrors({ ...errors, radiusPatroli: undefined });
          }}
          endContent={
            <div className="pointer-events-none flex items-center">
              <span className="text-default-400 text-small">meter</span>
            </div>
          }
          description="Jarak toleransi GPS untuk absen keliling di Pos Patroli (Min 20m, Max 1000m)."
        />
      </div>

      <div className="flex justify-end mt-4">
        <Button
          isLoading={saving}
          variant="solid"
          onPress={actions.handleUpdate}
          className="bg-[#122C93] text-white font-semibold w-40 h-12 text-[16px] rounded-lg"
        >
          Update Radius
        </Button>
      </div>
    </div>
  );
};
