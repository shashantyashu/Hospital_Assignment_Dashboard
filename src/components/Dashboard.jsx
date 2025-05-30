import React, { useContext, useEffect, useState } from "react";
import { Context } from "../main";
import { Navigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { GoCheckCircleFill } from "react-icons/go";
import { AiFillCloseCircle } from "react-icons/ai";
import Navbar from "./Navbar";

const Dashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token =
          localStorage.getItem("adminToken") ||
          localStorage.getItem("doctorToken");

        if (!token) {
          toast.error("No token found");
          return;
        }

        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        const appointmentsResponse = await axios.get(
          "https://hospital-assignment-backend.onrender.com/api/v1/appointment/getall",
          config
        );
        setAppointments(appointmentsResponse.data.appointments);

        const doctorsResponse = await axios.get(
          "https://hospital-assignment-backend.onrender.com/api/v1/user/doctors",
          config
        );
        setDoctors(doctorsResponse.data.doctors);
      } catch (error) {
        setAppointments([]);
        setDoctors([]);
        console.error("Dashboard data fetch error:", error);
      }
    };

    fetchDashboardData();
  }, []);

  const handleMarkAsPresent = async () => {
    try {
      const token =
        localStorage.getItem("adminToken") ||
        localStorage.getItem("doctorToken");
      const tokenName = localStorage.getItem("adminToken")
        ? "adminToken"
        : "doctorToken";

      const { data } = await axios.post(
        "http://localhost:8080/api/v1/attendance/mark-present",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Tokenname: tokenName,
          },
        }
      );
      toast.success(data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to mark attendance");
    }
  };

  const handleUpdateStatus = async (appointmentId, status) => {
    try {
      const token =
        localStorage.getItem("adminToken") ||
        localStorage.getItem("doctorToken");

      let tokenName = localStorage.getItem("adminToken")
        ? "adminToken"
        : "doctorToken";

      const { data } = await axios.put(
        `https://hospital-assignment-backend.onrender.com/api/v1/appointment/update/${appointmentId}`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Tokenname: tokenName,
          },
        }
      );
      setAppointments((prevAppointments) =>
        prevAppointments.map((appointment) =>
          appointment._id === appointmentId
            ? { ...appointment, status }
            : appointment
        )
      );
      toast.success(data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update status");
    }
  };

  const { isAuthenticated, admin } = useContext(Context);
  if (!isAuthenticated) {
    return <Navigate to={"/login"} />;
  }

  console.log(admin);

  const filteredAppointments =
    admin.role === "Admin"
      ? appointments
      : appointments.filter(
          (appointment) => appointment.doctorId === admin._id
        );

  return (
    <>
      <Navbar />
      <section className="p-6">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">
          WELCOME TO NOVACARE HOSPITAL
        </h1>
        <div className="grid gap-6 md:grid-cols-3 bg-white shadow rounded-lg p-6 mb-8">
          <div className="flex items-center space-x-4 col-span-2">
            {admin.role === "Admin" ? (
              <img
                src={admin.avatar?.url || "doc1.webp"}
                alt="docImg"
                style={{ height: "150px" }}
              />
            ) : (
              <img
                src={admin.avatar?.url || "doc1.webp"}
                alt="docImg"
                style={{ height: "150px" }}
              />
            )}
            <div>
              <p className="text-gray-500">Hello,</p>
              <h5 className="text-xl font-bold">
                {admin?.firstName} {admin?.lastName}{" "}
                {admin.role === "Doctor" &&
                  `(${admin.doctorDepartment || "N/A"})`}
              </h5>
              <p className="text-sm text-gray-600">
                Welcome to your dashboard <b>{admin?.role}</b>.
              </p>

              {admin.role === "Doctor" && (
                <button
                  onClick={handleMarkAsPresent}
                  className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                >
                  Present
                </button>
              )}
            </div>
          </div>
          <div className="grid gap-4">
            <div className="bg-blue-100 p-4 rounded text-center">
              <p className="text-sm">Total Appointments</p>
              <h3 className="text-lg font-bold">
                {filteredAppointments.length}
              </h3>
            </div>
            <div className="bg-green-100 p-4 rounded text-center">
              <p className="text-sm">Registered Doctors</p>
              <h3 className="text-lg font-bold">{doctors.length}</h3>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6 overflow-auto">
          <h5 className="text-xl font-semibold mb-4">Appointments</h5>
          <table className="min-w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gray-100 text-left text-sm font-semibold text-gray-700">
                <th className="px-4 py-2 border">Applied By</th>
                <th className="px-4 py-2 border">Patient</th>
                <th className="px-4 py-2 border">Date</th>
                <th className="px-4 py-2 border">Doctor</th>
                <th className="px-4 py-2 border">Department</th>
                <th className="px-4 py-2 border">Status</th>
                <th className="px-4 py-2 border">Visited</th>
                {admin.role === "Doctor" && (
                  <>
                    <th className="px-4 py-2 border">Check In</th>
                    <th className="px-4 py-2 border">Delete</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {filteredAppointments.length > 0 ? (
                filteredAppointments.map((appointment) => (
                  <tr key={appointment._id} className="text-sm border-t">
                    <td className="px-4 py-2">
                      {appointment.firstName} {appointment.lastName}
                    </td>
                    <td className="px-4 py-2">
                      {appointment.patientName} <br />
                    </td>
                    <td className="px-4 py-2">
                      {appointment.appointment_date.substring(0, 16)}
                    </td>
                    <td className="px-4 py-2">
                      {appointment.doctor.firstName}{" "}
                      {appointment.doctor.lastName}
                    </td>
                    <td className="px-4 py-2">{appointment.department}</td>
                    <td className="px-4 py-2">
                      <select
                        className={`rounded px-7 py-1 ${
                          appointment.status === "Pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : appointment.status === "Accepted"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                        value={appointment.status}
                        onChange={(e) =>
                          handleUpdateStatus(appointment._id, e.target.value)
                        }
                      >
                        <option
                          className="bg-yellow-100 text-yellow-700"
                          value="Pending"
                        >
                          Pending
                        </option>
                        <option
                          className="bg-green-100 text-green-700"
                          value="Accepted"
                        >
                          Accepted
                        </option>
                        <option
                          className="bg-red-100 text-red-700"
                          value="Rejected"
                        >
                          Rejected
                        </option>
                      </select>
                    </td>
                    <td className="px-4 py-2">
                      {appointment.hasVisited ? (
                        <GoCheckCircleFill className="text-green-500 text-xl" />
                      ) : (
                        <AiFillCloseCircle className="text-red-500 text-xl" />
                      )}
                    </td>

                    {admin.role === "Doctor" && (
                      <>
                        <td className="px-4 py-2 text-center">
                          <input
                            type="checkbox"
                            className="form-checkbox h-4 w-4"
                            checked={appointment.hasVisited}
                            onChange={async (e) => {
                              try {
                                const newValue = e.target.checked;
                                const token =
                                  localStorage.getItem("adminToken") ||
                                  localStorage.getItem("doctorToken");
                                const tokenName = localStorage.getItem(
                                  "adminToken"
                                )
                                  ? "adminToken"
                                  : "doctorToken";

                                await axios.put(
                                  `https://hospital-assignment-backend.onrender.com/api/v1/appointment/update/${appointment._id}`,
                                  { hasVisited: newValue },
                                  {
                                    headers: {
                                      Authorization: `Bearer ${token}`,
                                      Tokenname: tokenName,
                                    },
                                  }
                                );
                                setAppointments((prev) =>
                                  prev.map((a) =>
                                    a._id === appointment._id
                                      ? { ...a, hasVisited: newValue }
                                      : a
                                  )
                                );
                                toast.success("Status updated");
                              } catch (error) {
                                toast.error(
                                  error.response?.data?.message ||
                                    "Failed to update"
                                );
                              }
                            }}
                          />
                        </td>
                        <td className="px-4 py-2 text-center">
                          <input
                            type="checkbox"
                            className="form-checkbox h-4 w-4"
                            onChange={async () => {
                              try {
                                const token =
                                  localStorage.getItem("adminToken") ||
                                  localStorage.getItem("doctorToken");
                                const tokenName = localStorage.getItem(
                                  "adminToken"
                                )
                                  ? "adminToken"
                                  : "doctorToken";

                                await axios.delete(
                                  `https://hospital-assignment-backend.onrender.com/api/v1/appointment/delete/${appointment._id}`,
                                  {
                                    headers: {
                                      Authorization: `Bearer ${token}`,
                                      Tokenname: tokenName,
                                    },
                                  }
                                );

                                setAppointments((prev) =>
                                  prev.filter((a) => a._id !== appointment._id)
                                );

                                toast.success(
                                  "Appointment deleted successfully!"
                                );
                              } catch (error) {
                                toast.error(
                                  error.response?.data?.message ||
                                    "Failed to delete appointment"
                                );
                              }
                            }}
                          />
                        </td>
                      </>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={admin.role === "Doctor" ? 8 : 6}
                    className="text-center py-4 text-gray-500"
                  >
                    No Appointments Found!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
};

export default Dashboard;
