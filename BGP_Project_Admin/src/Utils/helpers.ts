export const getToken = (): string | undefined => {
  return document.cookie
    .split("; ")
    .find((row) => row.startsWith("token="))
    ?.split("=")[1];
};

export const getRole = (): string | undefined => {
  const role = document.cookie
    .split("; ")
    .find((row) => row.startsWith("role="))
    ?.split("=")[1];
  return role || localStorage.getItem("role") || "";
};

export const formatTanggal = (dateString?: string): string => {
  if (!dateString) return "-";
  const safeDateString = dateString.endsWith("Z")
    ? dateString
    : `${dateString}Z`;

  try {
    const date = new Date(safeDateString);
    if (isNaN(date.getTime())) return "-";
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = String(date.getFullYear());
    return `${day}/${month}/${year}`;
  } catch (error) {
    return "-";
  }
};

export const formatTanggalIndo = (dateString?: string): string => {
  if (!dateString) return "-";
  const safeDateString = dateString.endsWith("Z")
    ? dateString
    : `${dateString}Z`;

  try {
    const date = new Date(safeDateString);
    if (isNaN(date.getTime())) return "-";
    return new Intl.DateTimeFormat("id-ID", {
      year: "numeric",
      month: "short",
      day: "2-digit",
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone || "Asia/Jakarta",
    }).format(date);
  } catch (error) {
    return "-";
  }
};

export const getDeviceTimezone = (): string => {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch (e) {
    return "Asia/Jakarta";
  }
};

export const formatDateTimeZone = (isoString: string | null): string => {
  if (!isoString) return "-";
  const safeDateString = isoString.endsWith("Z") ? isoString : `${isoString}Z`;

  try {
    const date = new Date(safeDateString);
    if (isNaN(date.getTime())) return isoString;
    return new Intl.DateTimeFormat("id-ID", {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone:
        Intl.DateTimeFormat().resolvedOptions().timeZone || "Asia/Jakarta",
    }).format(date);
  } catch (error) {
    return isoString;
  }
};

export const getHari = (dateString: string) => {
  const days = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
  return days[new Date(dateString).getDay()];
};

export const toDateTimeLocal = (dateString: string | null): string => {
  if (!dateString) return "";
  const safeDateString = dateString.includes("T")
    ? dateString.endsWith("Z")
      ? dateString
      : `${dateString}Z`
    : `${dateString.replace(" ", "T")}Z`;

  try {
    const date = new Date(safeDateString);
    if (isNaN(date.getTime())) return "";
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  } catch (error) {
    return "";
  }
};
