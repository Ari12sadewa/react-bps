import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

// List navigasi
const navItems = [
  { id: "publications", label: "Daftar Publikasi", path: "/publications" },
  { id: "add", label: "Tambah Publikasi", path: "/publications/add" },
  { id: "logout", label: "Logout", path: "/logout" },
];

function BpsLogo() {
  return (
    <img
      src="https://res.cloudinary.com/djcm0swgo/image/upload/v1751775675/bps-logo_1_ldppzk.png"
      alt="BPS Logo"
      className="h-12 w-auto object-contain"
    />
  );
}

export default function Navbar() {
  const { logoutAction,loading,error } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logoutAction();
      navigate("/login", { replace: true });
    } catch (err) {
      alert("Gagal logout: " + err.message);
    }
  };

  // Jangan tampilkan navbar di halaman login/register
  if (location.pathname === "/login" || location.pathname === "/register") {
    return null;
  }

  if(error)return <div className="text-red-500">Terjadi Kesalahan: Reload Page</div>;

  return (
    <nav className="bg-blue-800 backdrop-blur sticky top-0 z-50 shadow-md font-[Inter]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          <div className="flex items-center gap-4">
            <BpsLogo />
            <span className="text-white text-lg font-semibold tracking-wide hidden sm:block">
              BPS PROVINSI SULAWESI TENGAH
            </span>
          </div>


          <div className="flex items-center gap-4">
            {navItems.map((item) => {
              const isActive =
                location.pathname === item.path ||
                (item.id === "add" && location.pathname.startsWith("/publications/add")) ||
                (item.id === "publications" && location.pathname === "/publications");

              if (item.id === "logout") {
                return (
                  <button
                    key={item.id}
                    onClick={handleLogout}
                    className="relative text-white font-medium text-sm px-2 py-1 hover:scale-90 cursor-pointer focus:scale-80 transition-all duration-500"
                  >
                    {item.label}
                  </button>
                );
              }

              return (
                <Link
                  key={item.id}
                  to={item.path}
                  className="relative group text-white font-medium text-sm px-2 py-1"
                >
                  <span className="relative z-10">{item.label}</span>
                  <span
                    className={`absolute left-0 -bottom-2 h-[3px] transition-all duration-800 ease-in-out ${
                      isActive
                        ? "w-full bg-white"
                        : "w-0 group-hover:w-full bg-white"
                    }`}
                  ></span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
