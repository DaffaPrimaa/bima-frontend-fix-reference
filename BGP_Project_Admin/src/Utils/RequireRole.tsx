import { Navigate, Outlet } from "react-router-dom";
import { getRole } from "./helpers";

/**
 * Gerbang route berdasarkan role — pelengkap PrivateRoute yang cuma mengecek
 * ada-tidaknya token. Dipasang sebagai route pembungkus DI DALAM Mainlayouts
 * supaya sidebar tetap tampil. Kalau role tidak diizinkan, user dilempar ke
 * dashboard miliknya sendiri (bukan ke halaman error) supaya tidak nyangkut.
 *
 * Ini gerbang tampilan, BUKAN pengganti otorisasi BE — BE tetap yang menolak
 * request lintas-role (403).
 */
const RequireRole = ({ allow }: { allow: string[] }) => {
  const role = getRole();
  if (allow.includes(role)) return <Outlet />;
  return <Navigate to={role === "client" ? "/ClientDashboard" : "/AdminDashboard"} replace />;
};

export default RequireRole;
