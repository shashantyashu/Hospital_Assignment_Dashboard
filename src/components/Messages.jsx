import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Context } from "../main";
import { Navigate } from "react-router-dom";
import Navbar from "./Navbar";

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const { isAuthenticated } = useContext(Context);

  useEffect(() => {
    const fetchMessages = async () => {
      const token =
        localStorage.getItem("adminToken") || localStorage.getItem("doctorToken");

      if (!token) {
        toast.error("No token found. Please login again.");
        return;
      }

      try {
        let tokenName = "";
        if (localStorage.getItem("adminToken")) {
          tokenName = "adminToken";
        } else if (localStorage.getItem("doctorToken")) {
          tokenName = "doctorToken";
        } else {
          toast.error("No token found");
          return;
        }

        const { data } = await axios.get(
          "https://hospital-assignment-backend.onrender.com/api/v1/message/getall",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Tokenname: tokenName,
            },
          }
        );
        setMessages(data.messages);
      } catch (error) {
        console.log(error.response?.data?.message || "Error fetching messages");
      }
    };

    fetchMessages();
  }, []);

  if (!isAuthenticated) {
    return <Navigate to={"/login"} />;
  }

  return (
    <>
    <Navbar />
    <section className="min-h-screen p-4 bg-gray-50">
      <h1 className="text-3xl font-bold text-center mb-8 text-blue-700">Messages</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {messages && messages.length > 0 ? (
          messages.map((element) => (
            <div
              key={element._id}
              className="bg-white rounded-lg shadow-md p-6 border border-gray-200"
            >
              <div className="space-y-2 text-gray-700">
                <p>
                  <span className="font-semibold">First Name:</span>{" "}
                  {element.firstName}
                </p>
                <p>
                  <span className="font-semibold">Last Name:</span>{" "}
                  {element.lastName}
                </p>
                <p>
                  <span className="font-semibold">Email:</span> {element.email}
                </p>
                <p>
                  <span className="font-semibold">Phone:</span> {element.phone}
                </p>
                <p>
                  <span className="font-semibold">Message:</span>{" "}
                  {element.message}
                </p>
              </div>
            </div>
          ))
        ) : (
          <h2 className="text-center text-lg text-gray-600 col-span-full">
            No Messages!
          </h2>
        )}
      </div>
    </section>
    </>
  );
};

export default Messages;
