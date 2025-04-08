import React, { useContext, useEffect, useState } from "react";
import { Context } from "../main";
import { Navigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { GoCheckCircleFill } from "react-icons/go";
import { AiFillCloseCircle } from "react-icons/ai";

const Dashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);

  // useEffect(() => {
  //   const fetchDashboardData = async () => {
  //     try {
  //       const appointmentsResponse = await axios.get(
  //         "https://hospital-assignment-backend.onrender.com/api/v1/appointment/getall",
  //         { withCredentials: true }
  //       );
  //       setAppointments(appointmentsResponse.data.appointments);

  //       const doctorsResponse = await axios.get(
  //         "https://hospital-assignment-backend.onrender.com/api/v1/user/doctors",
  //         { withCredentials: true }
  //       );
  //       setDoctors(doctorsResponse.data.doctors);

  //       // console.log("Doctors:", doctorsResponse.data.doctors);
  //     } catch (error) {
  //       setAppointments([]);
  //       setDoctors([]);
  //       console.error("Dashboard data fetch error:", error);
  //     }
  //   };

  //   fetchDashboardData();
  // }, []);

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

  const handleUpdateStatus = async (appointmentId, status) => {
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
      toast.error(error.response.data.message);
    }
  };

  const { isAuthenticated, admin } = useContext(Context);
  if (!isAuthenticated) {
    return <Navigate to={"/login"} />;
  }

  // // 🔍 Filter appointments only for the logged-in doctor
  // const filteredAppointments = appointments.filter(
  //   (appointment) => appointment.doctorId === admin._id
  // );

  // 🔍 Filter appointments:
  // - If the logged-in user is an Admin, show all appointments
  // - If the logged-in user is a Doctor, show only their appointments
  const filteredAppointments =
    admin.role === "Admin"
      ? appointments
      : appointments.filter(
          (appointment) => appointment.doctorId === admin._id
        );

  return (
    <>
      <section className="dashboard page">
        <div className="banner">
          <div className="firstBox">
            <img src="/doc.png" alt="docImg" />
            <div className="content">
              <div>
                <p>Hello ,</p>
                <h5>{admin && `${admin.firstName} ${admin.lastName}`}</h5>
              </div>
              <p>
                <u>({admin && admin.role})</u> &nbsp; &nbsp; Welcome to your
                dashboard. You can manage and review your appointments here.
              </p>
            </div>
          </div>
          <div className="secondBox">
            <p>Total Appointments</p>
            <h3>{filteredAppointments.length}</h3>
          </div>
          <div className="thirdBox">
            <p>Registered Doctors</p>
            <h3>{doctors.length}</h3>
          </div>
        </div>

        <div className="banner">
          <h5>Appointments</h5>
          <table>
            <thead>
              <tr>
                <th>Patient</th>
                <th>Date</th>
                <th>Doctor</th>
                <th>Department</th>
                <th>Status</th>
                <th>Visited</th>
                {admin.role === "Doctor" && <th>Check In</th>}{" "}
                {admin.role === "Doctor" && <th>Delete</th>}{" "}
                {/* ✅ Only for doctors */}
              </tr>
            </thead>
            <tbody>
              {filteredAppointments.length > 0 ? (
                filteredAppointments.map((appointment) => (
                  <tr key={appointment._id}>
                    <td>{`${appointment.firstName} ${appointment.lastName}`}</td>
                    <td>{appointment.appointment_date.substring(0, 16)}</td>
                    <td>{`${appointment.doctor.firstName} ${appointment.doctor.lastName}`}</td>
                    <td>{appointment.department}</td>
                    <td>
                      <select
                        className={
                          appointment.status === "Pending"
                            ? "value-pending"
                            : appointment.status === "Accepted"
                            ? "value-accepted"
                            : "value-rejected"
                        }
                        value={appointment.status}
                        onChange={(e) =>
                          handleUpdateStatus(appointment._id, e.target.value)
                        }
                      >
                        <option value="Pending" className="value-pending">
                          Pending
                        </option>
                        <option value="Accepted" className="value-accepted">
                          Accepted
                        </option>
                        <option value="Rejected" className="value-rejected">
                          Rejected
                        </option>
                      </select>
                    </td>
                    <td>
                      {appointment.hasVisited ? (
                        <GoCheckCircleFill className="green" />
                      ) : (
                        <AiFillCloseCircle className="red" />
                      )}
                    </td>

                    {/* ✅ Only show Check In checkbox for Doctors */}
                    {admin.role === "Doctor" && (
                      <td>
                        <div class="form-check">
                          <input
                            style={{ marginLeft: "20px" }}
                            type="checkbox"
                            class="form-check-input"
                            id="checkDefault"
                            checked={appointment.hasVisited}
                            onChange={async (e) => {
                              try {
                                const token =
                                  localStorage.getItem("adminToken") ||
                                  localStorage.getItem("doctorToken");

                                  let tokenName = "";
                                if (localStorage.getItem("adminToken")) {
                                  tokenName = "adminToken";
                                } else if (
                                  localStorage.getItem("doctorToken")
                                ) {
                                  tokenName = "doctorToken";
                                } else {
                                  toast.error("No token found");
                                  return;
                                }

                                await axios.put(
                                  `https://hospital-assignment-backend.onrender.com/api/v1/appointment/update/${appointmentId}`,
                                  {
                                    headers: {
                                      Authorization: `Bearer ${token}`,
                                      Tokenname: tokenName,
                                    },
                                  }
                                );
                                setAppointments((prev) =>
                                  prev.map((a) =>
                                    a._id === appointmentId ? { ...a } : a
                                  )
                                );
                                toast.success("Status updated");
                              } catch (error) {
                                toast.error(
                                  error.response?.data?.message ||
                                    "Failed to update status"
                                );
                              }
                            }}
                          />
                          <label
                            class="form-check-label"
                            for="checkDefault"
                          ></label>
                        </div>
                      </td>
                    )}
                    {/* ✅ Only show Delete button for Admins */}
                    {admin.role === "Doctor" && (
                      <td>
                        <div class="form-check">
                          <input
                            style={{ marginLeft: "20px" }}
                            type="checkbox"
                            class="form-check-input"
                            id="checkDefault"
                            checked={appointment.hasVisited}
                            onChange={async (e) => {
                              try {
                                const token =
                                  localStorage.getItem("adminToken") ||
                                  localStorage.getItem("doctorToken");

                                let tokenName = "";
                                if (localStorage.getItem("adminToken")) {
                                  tokenName = "adminToken";
                                } else if (
                                  localStorage.getItem("doctorToken")
                                ) {
                                  tokenName = "doctorToken";
                                } else {
                                  toast.error("No token found");
                                  return;
                                }

                                await axios.put(
                                  `https://hospital-assignment-backend.onrender.com/api/v1/appointment/delete/${appointmentId}`,
                                  {
                                    headers: {
                                      Authorization: `Bearer ${token}`,
                                      Tokenname: tokenName,
                                    },
                                  }
                                );
                                setAppointments((prev) =>
                                  prev.map((a) =>
                                    a._id === appointmentId ? { ...a } : a
                                  )
                                );
                                toast.success("Status updated");
                              } catch (error) {
                                toast.error(
                                  error.response?.data?.message ||
                                    "Failed to update status"
                                );
                              }
                            }}
                          />
                          <label
                            class="form-check-label"
                            for="checkDefault"
                          ></label>
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={admin.role === "Doctor" ? 7 : 6}>
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
