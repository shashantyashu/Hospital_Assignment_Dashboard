import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Context } from "../main";
import { Navigate } from "react-router-dom";
import Navbar from "./Navbar";

const DoctorAttendanceSheet = () => {
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const { isAuthenticated } = useContext(Context);

  const today = new Date();
  const month = today.toLocaleString("default", { month: "long" });
  const year = today.getFullYear();
  const days = Array.from({ length: 30 }, (_, i) => (i + 1).toString());

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const { data } = await axios.get(
          "https://hospital-assignment-backend.onrender.com/api/v1/attendance",
          { withCredentials: true }
        );
        setAttendanceRecords(data); // Expected: [{ doctor: { _id, firstName, lastName }, month, days }]
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Failed to fetch attendance"
        );
      }
    };
    fetchAttendance();
  }, []);

  const handleToggle = async (record, day, currentStatus) => {
    const newStatus = currentStatus === "A" ? "P" : "A";

    try {
      await axios.put(
        `https://hospital-assignment-backend.onrender.com/api/v1/attendance/update`,
        {
          doctorId: record.doctor._id,
          month,
          day,
          status: newStatus,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`, // or doctorToken if used
            tokenname: "adminToken", // or "doctorToken"
          },
          withCredentials: true,
        }
      );

      setAttendanceRecords((prev) =>
        prev.map((r) => {
          if (r._id === record._id) {
            const updatedDays = r.days.map((d) =>
              d.day === day ? { ...d, status: newStatus } : d
            );
            if (!updatedDays.find((d) => d.day === day)) {
              updatedDays.push({ day, status: newStatus });
            }
            return { ...r, days: updatedDays };
          }
          return r;
        })
      );
    } catch (error) {
      toast.error("Failed to update attendance");
    }
  };

  if (!isAuthenticated) {
    return <Navigate to={"/login"} />;
  }

  return (
    <>
      <Navbar />
      <section className="min-h-screen bg-gray-100 py-10 px-4 overflow-x-auto">
        <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">
          Attendance Sheet - {month} {year}
        </h1>
        <table className="min-w-full border border-gray-400 bg-white text-sm">
          <thead className="bg-gray-200">
            <tr>
              <th className="border border-gray-400 px-3 py-2 text-left">
                Doctor Name
              </th>
              {days.map((day) => (
                <th
                  key={day}
                  className="border border-gray-400 px-2 py-2 text-center"
                >
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {attendanceRecords.length > 0 ? (
              attendanceRecords.map((record) => (
                <tr key={record._id}>
                  <td className="border border-gray-400 px-3 py-2 whitespace-nowrap font-medium">
                    {record.doctor?.firstName} {record.doctor?.lastName}
                  </td>
                  {days.map((day) => {
                    const entry = record.days.find((d) => d.day === day);
                    const status = entry ? entry.status : "A";
                    return (
                      <td
                        key={day}
                        onClick={() => handleToggle(record, day, status)}
                        className={`cursor-pointer border text-center px-1 py-1 ${
                          status === "P" ? "bg-green-100" : "bg-red-100"
                        }`}
                      >
                        {status}
                      </td>
                    );
                  })}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={31} className="text-center py-4 text-red-500">
                  No Attendance Data Found!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </>
  );
};

export default DoctorAttendanceSheet;
