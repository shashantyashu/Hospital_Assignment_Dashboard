import React, { useContext, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Context } from "../main";
import axios from "axios";

const Login = () => {
  const [role, setRole] = useState("Admin"); // default to Admin
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { isAuthenticated, setIsAuthenticated } = useContext(Context);

  const navigateTo = useNavigate();

  // const handleLogin = async (e) => {
  //   e.preventDefault();
  //   try {
  //     await axios.post(
  //       "https://hospital-assignment-backend.onrender.com/api/v1/user/login",
  //       { email, password, confirmPassword, role }, // role sent here
  //       {
  //         withCredentials: true,
  //         headers: { "Content-Type": "application/json" },
  //       }
  //     )
  //     .then((res) => {
  //     toast.success(res.data.message);
  //     setIsAuthenticated(true);
  //     navigateTo("/");
  //     setEmail("");
  //     setPassword("");
  //     setConfirmPassword("");
  //   });
  //   } catch (error) {
  //     toast.error(error.response?.data?.message || "Login failed");
  //   }
  // };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "https://hospital-assignment-backend.onrender.com/api/v1/user/login",
        { email, password, confirmPassword, role },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
  
      toast.success(res.data.message);
  
      // Store token based on role
      const token = res.data.token;
      const tokenName = res.data.tokenName; // Get the token name from the response
      localStorage.setItem(tokenName, token);
  
      setIsAuthenticated(true);
      navigateTo("/");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    }
  };
  

  if (isAuthenticated) {
    return <Navigate to={"/"} />;
  }

  return (
    <section className="container form-component">
      <img src="/logo.png" alt="logo" className="logo" />
      <h1 className="form-title">WELCOME TO ZEECARE</h1>
      <p>Only Admins and Doctors Are Allowed To Access These Resources!</p>

      <form onSubmit={handleLogin}>
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="Admin">Admin</option>
          <option value="Doctor">Doctor</option>
        </select>

        <input
          type="text"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <div style={{ justifyContent: "center", alignItems: "center" }}>
          <button type="submit">Login</button>
        </div>
      </form>
    </section>
  );
};

export default Login;
