import React, { useContext, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Context } from "../main";
import axios from "axios";
import Navbar from "./Navbar";

const AddNewDoctor = () => {
  const { isAuthenticated, setIsAuthenticated } = useContext(Context);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [nic, setNic] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [password, setPassword] = useState("");
  const [doctorDepartment, setDoctorDepartment] = useState("");
  const [avatar, setAvatar] = useState("");
  const [avatarPreview, setAvatarPreview] = useState("");

  const navigateTo = useNavigate();

  const departmentsArray = [
    "Pediatrics",
    "Orthopedics",
    "Cardiology",
    "Neurology",
    "Oncology",
    "Radiology",
    "Physical Therapy",
    "Dermatology",
    "ENT",
  ];

  const handleAvatar = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setAvatarPreview(reader.result);
      setAvatar(file);
    };
  };

  const handleAddNewDoctor = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("adminToken");

      let tokenName = "";
      if (localStorage.getItem("adminToken")) {
        tokenName = "adminToken";
      } else if (localStorage.getItem("doctorToken")) {
        tokenName = "doctorToken";
      } else {
        toast.error("No token found");
        return;
      }

      if (!token) {
        toast.error("No authentication token found!");
        return;
      }

      const formData = new FormData();
      formData.append("firstName", firstName);
      formData.append("lastName", lastName);
      formData.append("email", email);
      formData.append("phone", phone);
      formData.append("password", password);
      formData.append("nic", nic);
      formData.append("dob", dob);
      formData.append("gender", gender);
      formData.append("doctorDepartment", doctorDepartment);
      formData.append("avatar", avatar); // changed from docAvatar to avatar

      const { data } = await axios.post(
        "https://hospital-assignment-backend.onrender.com/api/v1/user/doctor/addnew",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
            Tokenname: tokenName,
          },
        }
      );

      toast.success(data.message);
      setIsAuthenticated(true);
      navigateTo("/");

      // Reset form
      setFirstName("");
      setLastName("");
      setEmail("");
      setPhone("");
      setNic("");
      setDob("");
      setGender("");
      setPassword("");
      setDoctorDepartment("");
      setAvatar("");
      setAvatarPreview("");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to register doctor");
    }
  };

  if (!isAuthenticated) {
    return <Navigate to={"/login"} />;
  }

  return (
    <>
      <Navbar />
      <section className="min-h-screen bg-gray-100 flex flex-col items-center py-10 px-4">
        <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-3xl">
          <div className="flex flex-col items-center mb-6">
            <img src="/Hos_logo.png" alt="logo" className="h-16 mb-2" />
            <h1 className="text-2xl font-bold text-gray-800">
              REGISTER A NEW DOCTOR
            </h1>
          </div>
          <form
            onSubmit={handleAddNewDoctor}
            className="grid md:grid-cols-2 gap-6"
          >
            <div className="flex flex-col items-center gap-4">
              <p>Avatar</p>
              <img
                src={avatarPreview ? `${avatarPreview}` : "/docHolder.jpg"}
                alt=""
                className="w-32 h-32 object-cover rounded-full border-2 border-blue-500"
              />
              <input
                type="file"
                onChange={handleAvatar}
                className="text-sm text-gray-600"
              />
            </div>

            <div className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="border rounded px-3 py-2"
              />
              <input
                type="text"
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="border rounded px-3 py-2"
              />
              <input
                type="text"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border rounded px-3 py-2"
              />
              <input
                type="number"
                placeholder="Mobile Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="border rounded px-3 py-2"
              />
              <input
                type="number"
                placeholder="NIC"
                value={nic}
                onChange={(e) => setNic(e.target.value)}
                className="border rounded px-3 py-2"
              />
              <input
                type="date"
                placeholder="Date of Birth"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="border rounded px-3 py-2"
              />
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="border rounded px-3 py-2"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border rounded px-3 py-2"
              />
              <select
                value={doctorDepartment}
                onChange={(e) => setDoctorDepartment(e.target.value)}
                className="border rounded px-3 py-2"
              >
                <option value="">Select Department</option>
                {departmentsArray.map((depart, index) => (
                  <option value={depart} key={index}>
                    {depart}
                  </option>
                ))}
              </select>
              <button
                type="submit"
                className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
              >
                Register New Doctor
              </button>
            </div>
          </form>
        </div>
      </section>
    </>
  );
};

export default AddNewDoctor;
