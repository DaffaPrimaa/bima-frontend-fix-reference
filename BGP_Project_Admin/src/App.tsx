import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "leaflet/dist/leaflet.css";
import Mainlayouts from "./Layout/Mainlayouts";
import Login from "./Auth/Login";

import PrivateRoute from "./Utils/PrivateRoute";
import ScrollToTop from "./Utils/ScrollToTop";

import AdminManageUsers from "./pages/AdminManageUsers";
import AdminManageSatpam from "./pages/AdminManageSatpam";
import AdminDashboard from "./pages/AdminDashboard";
import AdminManagePos from "./pages/AdminManagePos";
import AdminManagePosUtama from "./pages/AdminManagePosUtama";
import AdminRekapAbsensi from "./pages/AdminRekapAbsensi";
import AdminRekapPatroli from "./pages/AdminRekapPatroli";
import ClientManageRadius from "./pages/ClientManageRadius";
import AdminManageWaktuJadwal from "./pages/AdminManageWaktuJadwal";
import NotFoundPage from "./pages/NotFoundPage";
import ClientDashboard from "./pages/ClientDashboard";
import ClientDetailsSatpam from "./pages/ClientDetailsSatpam";
import AdminDetailsSatpam from "./pages/AdminDetailsSatpam";
import AdminEditDetailSatpam from "./pages/AdminEditDetailSatpam";
import ClientActivityLog from "./pages/ClientActivityLog";
import AdminManagePengumuman from "./pages/AdminManagePengumuman";
import AdminRepositoriDokumen from "./pages/AdminRepositoriDokumen";
import AdminLaporanKejadian from "./pages/AdminLaporanKejadian";
import AdminManagePengajuan from "./pages/AdminManagePengajuan";
import AdminAprovalAkun from "./pages/AdminAprovalAkun";
import AdminActivityLog from "./pages/AdminActivityLog";
import AdminPanicAlert from "./pages/AdminPanicAlert";
import ClientRiwayatPesan from "./pages/ClientRiwayatPesan";
import ClientTrackingGps from "./pages/ClientTrackingGps";
import ClientPenjadwalanSatpam from "./pages/ClientPenjadwalanSatpam";
import LandingPage from "./pages/LandingPage";
import SystemPage from "./pages/SystemPage";
function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        {/* ga ada sidebar sama navbarnya */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/sistem" element={<SystemPage />} />
        <Route path="/auth-login" element={<Login />} />

        <Route element={<PrivateRoute />}>
          {/* ada side bar sama navbarnya */}
          <Route element={<Mainlayouts />}>
            <Route path="/AdminDashboard" element={<AdminDashboard />} />
            <Route path="/ClientDashboard" element={<ClientDashboard />} />
            <Route path="/AdminManageSatpam" element={<AdminManageSatpam />} />
            <Route
              path="/AdminEditDetailSatpam"
              element={<AdminEditDetailSatpam />}
            />
            <Route
              path="/ClientDetailSatpam"
              element={<ClientDetailsSatpam />}
            />
            <Route
              path="/ClientPenjadwalanSatpam"
              element={<ClientPenjadwalanSatpam />}
            />
            <Route path="/ClientActivityLog" element={<ClientActivityLog />} />
            <Route
              path="/ClientRiwayatPesan"
              element={<ClientRiwayatPesan />}
            />
            <Route path="/ClientGpsTracking" element={<ClientTrackingGps />} />
            <Route path="/AdminActivityLog" element={<AdminActivityLog />} />
            <Route path="/AdminPanicAlert" element={<AdminPanicAlert />} />

            <Route path="/AdminDetailSatpam" element={<AdminDetailsSatpam />} />
            <Route
              path="/AdminRepositoriDokumen"
              element={<AdminRepositoriDokumen />}
            />
            <Route
              path="/AdminLaporanKejadian"
              element={<AdminLaporanKejadian />}
            />
            <Route
              path="/AdminManagePengumuman"
              element={<AdminManagePengumuman />}
            />
            <Route
              path="/AdminManagePengajuan"
              element={<AdminManagePengajuan />}
            />
            <Route path="/AdminAprovalAkun" element={<AdminAprovalAkun />} />
            <Route path="/AdminManageUsers" element={<AdminManageUsers />} />
            <Route path="/AdminManagePos" element={<AdminManagePos />} />
            <Route
              path="/AdminManagePosUtama"
              element={<AdminManagePosUtama />}
            />
            <Route path="/AdminRekapAbsensi" element={<AdminRekapAbsensi />} />
            <Route path="/AdminRekapPatroli" element={<AdminRekapPatroli />} />
            <Route path="/ClientManageRadius" element={<ClientManageRadius />} />
            <Route
              path="/AdminManageWaktu"
              element={<AdminManageWaktuJadwal />}
            />
            {/* Buat selanjutnya ya */}
          </Route>
          {/* Error Page Handler */}
          <Route path="*" element={<NotFoundPage />} />
          {/* ada side bar sama navbarnya */}
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
