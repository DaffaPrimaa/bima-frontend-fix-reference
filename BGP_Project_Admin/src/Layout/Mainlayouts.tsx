import Navbar from "../Components/Navbar";
import Sidebar from "../Components/Sidebar";
import { Outlet } from "react-router-dom";

const Mainlayouts = () => {
  return (
    <div className="page-container flex flex-row min-h-screen bg-[#F5F7FF] gap-2">
      <Sidebar />
      <div className="sidebar-container flex flex-col w-full">
        <Navbar />

        <Outlet />
      </div>
    </div>
  );
};

export default Mainlayouts;
