import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Context } from "../main";
import { Navigate } from "react-router-dom";
import Navbar from "./Navbar";

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const { isAuthenticated, admin } = useContext(Context);

  // inside Doctors component
  const handleDelete = async (id) => {
    try {
      const token =
        localStorage.getItem("adminToken") ||
        localStorage.getItem("doctorToken");

      const tokenName = localStorage.getItem("adminToken")
        ? "adminToken"
        : "doctorToken";

      if (!token) {
        toast.error("No token found");
        return;
      }

      await axios.delete(`https://hospital-assignment-backend.onrender.com/api/v1/user/doctor/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Tokenname: tokenName,
        },
        withCredentials: true,
      });

      toast.success("Doctor deleted successfully");
      setDoctors((prev) => prev.filter((doc) => doc._id !== id));
    } catch (error) {
      toast.error(error.response?.data?.message || "Delete failed");
    }
  };

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const { data } = await axios.get(
          "https://hospital-assignment-backend.onrender.com/api/v1/user/doctors",
          { withCredentials: true }
        );
        setDoctors(data.doctors);
      } catch (error) {
        toast.error(error.response.data.message);
      }
    };
    fetchDoctors();
  }, []);

  if (!isAuthenticated) {
    return <Navigate to={"/login"} />;
  }

  return (
    <>
      <Navbar />
      <section className="min-h-screen bg-gray-100 py-10 px-4">
        <h1 className="text-3xl font-bold text-center text-blue-600 mb-10">
          Registered Doctors
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {doctors && doctors.length > 0 ? (
            doctors.map((element, index) => (
              <>
                <div
                  key={index}
                  className="bg-white shadow-md rounded-lg overflow-hidden p-4 flex flex-col items-center"
                >
                  <img
                    src={element.avatar && element.avatar.url}
                    alt=""
                    className="w-32 h-32 object-cover rounded-full border-2 border-blue-500 mb-4"
                  />
                  <h4 className="text-xl font-semibold text-gray-800 mb-2">
                    {`${element.firstName} ${element.lastName}`}
                  </h4>
                  <div className="text-sm text-gray-700 space-y-1 text-center">
                    <p>
                      <strong>Email:</strong> {element.email}
                    </p>
                    <p>
                      <strong>Phone:</strong> {element.phone}
                    </p>
                    <p>
                      <strong>DOB:</strong> {element.dob.substring(0, 10)}
                    </p>
                    <p>
                      <strong>Department:</strong> {element.doctorDepartment}
                    </p>
                    <p>
                      <strong>NIC:</strong> {element.nic}
                    </p>
                    <p>
                      <strong>Gender:</strong> {element.gender}
                    </p>
                  </div>
                  {admin.role === "Admin" && (
                    <button
                      onClick={() => handleDelete(element._id)}
                      className="mt-4 px-4 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </>
            ))
          ) : (
            <h2 className="text-center text-lg text-red-500 col-span-full">
              No Registered Doctors Found!
            </h2>
          )}
        </div>
      </section>
    </>
  );
};

export default Doctors;
