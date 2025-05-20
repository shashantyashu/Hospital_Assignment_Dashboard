import React, { useContext, useState } from "react";
import { Menu, X } from "lucide-react"; 
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { Context } from "../main";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, setIsAuthenticated, admin } = useContext(Context);

  const handleLogout = async () => {
    try {
      const token =
        localStorage.getItem("adminToken") ||
        localStorage.getItem("doctorToken");

      let tokenName = "";
      if (localStorage.getItem("adminToken")) {
        tokenName = "adminToken";
      } else if (localStorage.getItem("doctorToken")) {
        tokenName = "doctorToken";
      } else {
        toast.error("No token found");
        return;
      }
      console.log(token);

      await axios.get("https://hospital-assignment-backend.onrender.com/api/v1/user/admin/logout", {
        headers: {
          Authorization: `Bearer ${token}`,
          Tokenname: tokenName,
        },
      });

      // Clear token from localStorage
      localStorage.removeItem("adminToken");
      localStorage.removeItem("doctorToken");

      toast.success("Logged out successfully!");
      setIsAuthenticated(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "Logout failed");
    }
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="text-xl font-bold text-blue-600">
            <img
              src="/Hos_logo.png"
              alt="logo"
              className="h-10 mx-auto mb-0 "
            />
          </div>
          {/* Hamburger */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-800 focus:outline-none"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Desktop links */}
          <div className="hidden md:flex space-x-6">
            <Link to="/" className="text-gray-700 hover:text-blue-600">
              Home
            </Link>
            <Link to="/doctors" className="text-gray-700 hover:text-blue-600">
              Doctors
            </Link>
            {admin.role === "Admin" && (
              <>
                <Link
                  to="/doctor/addnew"
                  className="text-gray-700 hover:text-blue-600"
                >
                  Add Doctor
                </Link>
                <Link
                  to="/admin/addnew"
                  className="text-gray-700 hover:text-blue-600"
                >
                  Add Admin
                </Link>
              </>
            )}
            <Link to="/messages" className="text-gray-700 hover:text-blue-600">
              Messages
            </Link>
            <button
              onClick={handleLogout}
              // className="text-gray-700 hover:text-red-600 transition"
              className="px-2 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden flex flex-col mt-2 space-y-2 pb-4">
            <Link to="/" className="text-gray-700 hover:text-blue-600">
              Home
            </Link>
            <Link to="/doctors" className="text-gray-700 hover:text-blue-600">
              Doctors
            </Link>
            {admin.role === "Admin" && (
              <>
                <Link
                  to="/doctor/addnew"
                  className="text-gray-700 hover:text-blue-600"
                >
                  Add Doctor
                </Link>
                <Link
                  to="/admin/addnew"
                  className="text-gray-700 hover:text-blue-600"
                >
                  Add Admin
                </Link>
              </>
            )}
            <Link to="/messages" className="text-gray-700 hover:text-blue-600">
              Messages
            </Link>
            <button
              onClick={handleLogout}
              // className="text-gray-700 hover:text-red-600 transition"
              className="px-2 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
