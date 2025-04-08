import React, { useContext, useState } from "react";
import { TiHome } from "react-icons/ti";
import { RiLogoutBoxFill } from "react-icons/ri";
import { AiFillMessage } from "react-icons/ai";
import { GiHamburgerMenu } from "react-icons/gi";
import { FaUserDoctor } from "react-icons/fa6";
import { MdAddModerator } from "react-icons/md";
import { IoPersonAddSharp } from "react-icons/io5";
import axios from "axios";
import { toast } from "react-toastify";
import { Context } from "../main";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const [show, setShow] = useState(false);

  const { isAuthenticated, setIsAuthenticated, admin } = useContext(Context);

  // const handleLogout = async () => {
  //   await axios
  //     .get("https://hospital-assignment-backend.onrender.com/api/v1/user/admin/logout", {
  //       withCredentials: true,
  //     })
  //     .then((res) => {
  //       toast.success(res.data.message);
  //       setIsAuthenticated(false);
  //     })
  //     .catch((err) => {
  //       toast.error(err.response.data.message);
  //     });
  // };

  const handleLogout = async () => {
    try {
      const token =
        localStorage.getItem("adminToken") || localStorage.getItem("doctorToken");

        let tokenName = "";
        if(localStorage.getItem("adminToken")){
           tokenName = "adminToken";
        }else if(localStorage.getItem("doctorToken")){
           tokenName = "doctorToken";
        }else{
          toast.error("No token found");
          return; 
        }
        console.log(token);
  
      await axios.get(
        "https://hospital-assignment-backend.onrender.com/api/v1/user/admin/logout",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Tokenname: tokenName,
          },
        }
      );
  
      // Clear token from localStorage
      localStorage.removeItem("adminToken");
      localStorage.removeItem("doctorToken");
  
      toast.success("Logged out successfully!");
      setIsAuthenticated(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "Logout failed");
    }
  };
  

  const navigateTo = useNavigate();

  const gotoHomePage = () => {
    navigateTo("/");
    setShow(!show);
  };
  const gotoDoctorsPage = () => {
    navigateTo("/doctors");
    setShow(!show);
  };
  const gotoMessagesPage = () => {
    navigateTo("/messages");
    setShow(!show);
  };
  const gotoAddNewDoctor = () => {
    navigateTo("/doctor/addnew");
    setShow(!show);
  };
  const gotoAddNewAdmin = () => {
    navigateTo("/admin/addnew");
    setShow(!show);
  };

  return (
    <>
      <nav
        style={!isAuthenticated ? { display: "none" } : { display: "flex" }}
        className={show ? "show sidebar" : "sidebar"}
      >
        <div className="links">
          <TiHome onClick={gotoHomePage} />
          <FaUserDoctor onClick={gotoDoctorsPage} />
          {admin.role === "Admin" && (
            <>
              <MdAddModerator onClick={gotoAddNewAdmin} />
              <IoPersonAddSharp onClick={gotoAddNewDoctor} />
            </>
          )}
          <AiFillMessage onClick={gotoMessagesPage} />
          <RiLogoutBoxFill onClick={handleLogout} />
        </div>
      </nav>
      <div
        className="wrapper"
        style={!isAuthenticated ? { display: "none" } : { display: "flex" }}
      >
        <GiHamburgerMenu className="hamburger" onClick={() => setShow(!show)} />
      </div>
    </>
  );
};

export default Sidebar;
