import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Context } from "../main";
import { Navigate } from "react-router-dom";
import Navbar from "./Navbar";

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const { isAuthenticated, admin } = useContext(Context);

  useEffect(() => {
    const fetchMessages = async () => {
      const token =
        localStorage.getItem("adminToken") ||
        localStorage.getItem("doctorToken");

      if (!token) {
        toast.error("No token found. Please login again.");
        return;
      }

      try {
        let tokenName = localStorage.getItem("adminToken")
          ? "adminToken"
          : "doctorToken";

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

  const handleDelete = async (id) => {
    const token =
      localStorage.getItem("adminToken") || localStorage.getItem("doctorToken");

    if (!token) {
      toast.error("No token found. Please login again.");
      return;
    }

    let tokenName = "";
    if (localStorage.getItem("adminToken")) {
      tokenName = "adminToken";
    } else if (localStorage.getItem("doctorToken")) {
      tokenName = "doctorToken";
    }

    try {
      await axios.delete(`https://hospital-assignment-backend.onrender.com/api/v1/message/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Tokenname: tokenName,
        },
      });

      toast.success("Message deleted successfully!");
      // Remove deleted message from UI
      setMessages((prev) => prev.filter((msg) => msg._id !== id));
    } catch (error) {
      console.log(error.response?.data?.message || "Error deleting message");
      toast.error("Failed to delete message");
    }
  };

  const handleToggleRead = async (id) => {
  const token =
    localStorage.getItem("adminToken") || localStorage.getItem("doctorToken");
  const tokenName = localStorage.getItem("adminToken") ? "adminToken" : "doctorToken";

  try {
    const { data } = await axios.put(
      `https://hospital-assignment-backend.onrender.com/api/v1/message/mark-read-toggle/${id}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Tokenname: tokenName,
        },
      }
    );

    setMessages((prev) =>
      prev.map((msg) =>
        msg._id === id ? { ...msg, isRead: data.isRead } : msg
      )
    );

    toast.success(
      `Marked as ${data.isRead ? "Read" : "Unread"} successfully`
    );
  } catch (error) {
    toast.error("Failed to toggle read status");
  }
};

  if (!isAuthenticated) {
    return <Navigate to={"/login"} />;
  }

  return (
    <>
      <Navbar />
      <section className="min-h-screen p-4 bg-gray-50">
        <h1 className="text-3xl font-bold text-center mb-8 text-blue-700">
          Messages
        </h1>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

          {messages && messages.length > 0 ? (
            messages.map((element) => (
              <div
                key={element._id}
                className={`relative rounded-lg shadow-md p-6 border border-gray-200 ${
                  element.isRead ? "bg-white" : "bg-green-100"
                }`}
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
                    <span className="font-semibold">Email:</span>{" "}
                    {element.email}
                  </p>
                  <p>
                    <span className="font-semibold">Phone:</span>{" "}
                    {element.phone}
                  </p>
                  <p className="break-words whitespace-pre-wrap">
                    <span className="font-semibold">Message:</span>{" "}
                    {element.message}
                  </p>
                </div>

                {admin.role === "Admin" && (
                  <div className="absolute top-2 right-2 flex space-x-2">
                    <button
                      onClick={() => handleToggleRead(element._id)}
                      className="px-2 py-1 bg-yellow-500 text-white text-sm rounded hover:bg-yellow-600 transition"
                    >
                      Mark
                    </button>
                    <button
                      onClick={() => handleDelete(element._id)}
                      className="px-2 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition"
                    >
                      Delete
                    </button>
                  </div>
                )}
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
