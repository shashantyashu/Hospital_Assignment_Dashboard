import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Context } from "../main";
import { Navigate } from "react-router-dom";
import Navbar from "./Navbar";

const Admin = () => {
  const [admins, setAdmins] = useState([]);
  const { isAuthenticated , admin} = useContext(Context);

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const { data } = await axios.get(
          "https://hospital-assignment-backend.onrender.com/api/v1/user/admins",
          { withCredentials: true }
        );
        setAdmins(data.admins);
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to fetch admins");
      }
    };

    fetchAdmins();
  }, []);

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("adminToken");

      if (!token) {
        toast.error("No token found");
        return;
      }

      await axios.delete(`https://hospital-assignment-backend.onrender.com/api/v1/user/admin/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Tokenname: "adminToken",
        },
        withCredentials: true,
      });

      toast.success("Admin deleted successfully");
      setAdmins((prev) => prev.filter((admin) => admin._id !== id));
    } catch (error) {
      toast.error(error.response?.data?.message || "Delete failed");
    }
  };

  if (!isAuthenticated) {
    return <Navigate to={"/login"} />;
  }

  return (
    <>
      <Navbar />
      <section className="min-h-screen bg-gray-100 py-10 px-4">
        <h1 className="text-3xl font-bold text-center text-blue-600 mb-10">
          Registered Admins
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {admins && admins.length > 0 ? (
            admins.map((Admin, index) => (
              <div
                key={index}
                className="bg-white shadow-md rounded-lg overflow-hidden p-4 flex flex-col items-center"
              >
                <img
                  src={Admin.avatar?.url || "/docHolder.jpg"}
                  alt=""
                  className="w-32 h-32 object-cover rounded-full border-2 border-blue-500 mb-4"
                />
                <h4 className="text-xl font-semibold text-gray-800 mb-2">
                  {`${Admin.firstName} ${Admin.lastName}`}
                </h4>
                <div className="text-sm text-gray-700 space-y-1 text-center">
                  <p>
                    <strong>Email:</strong> {Admin.email}
                  </p>
                  <p>
                    <strong>Phone:</strong> {Admin.phone}
                  </p>
                  <p>
                    <strong>DOB:</strong> {Admin.dob?.substring(0, 10)}
                  </p>
                  {Admin.nic != 123123444 && (
                    <p>
                      <strong>NIC:</strong> {Admin.nic}
                    </p>
                  )}
                  <p>
                    <strong>Gender:</strong> {Admin.gender}
                  </p>
                </div>
                {Admin.nic != 123123444 && admin.role == "Admin" && (
                  <button
                    onClick={() => handleDelete(Admin._id)}
                    className="mt-4 px-4 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                )}
              </div>
            ))
          ) : (
            <h2 className="text-center text-lg text-red-500 col-span-full">
              No Registered Admins Found!
            </h2>
          )}
        </div>
      </section>
    </>
  );
};

export default Admin;
