import React, { useContext, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Context } from "./main";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import Doctors from "./components/Doctors";
import { toast } from "react-toastify";
import AddNewDoctor from "./components/AddNewDoctor";
import AddNewAdmin from "./components/AddNewAdmin";
import Messages from "./components/Messages";

function App() {
  const { isAuthenticated, setIsAuthenticated, admin, setAdmin } =
    useContext(Context);

  useEffect(() => {
  const fetchUser = async () => {
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
        toast.error("Please login first");
        return;
      }

      const response = await axios.get(
        "https://hospital-assignment-backend.onrender.com/api/v1/user/admin/me",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Tokenname: tokenName,
          },
        }
      );

      const user = response.data?.user;
      if (user) {
        setAdmin(user);
        setIsAuthenticated(true);
      } else {
        throw new Error("Invalid user response");
      }
    } catch (error) {
      console.error("User fetch failed:", error);
      localStorage.removeItem("token");
      localStorage.removeItem("adminToken");
      localStorage.removeItem("doctorToken");
      setIsAuthenticated(false);
      setAdmin({});
    }
  };

  fetchUser();
}, []);


  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/doctors" element={<Doctors />} />
          <Route path="/doctor/addnew" element={<AddNewDoctor />} />
          <Route path="/admin/addnew" element={<AddNewAdmin />} />
          <Route path="/messages" element={<Messages />} />
        </Routes>

        <ToastContainer position="top-center" />
      </Router>
    </>
  );
}

export default App;
