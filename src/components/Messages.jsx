// import axios from "axios";
// import React, { useContext, useEffect, useState } from "react";
// import { toast } from "react-toastify";
// import { Context } from "../main";
// import { Navigate } from "react-router-dom";

// const Messages = () => {
//   const [messages, setMessages] = useState([]);
//   const { isAuthenticated } = useContext(Context);
//   useEffect(() => {
//     const fetchMessages = async () => {
//       try {
//         const { data } = await axios.get(
//           "https://hospital-assignment-backend.onrender.com/api/v1/message/getall",
//           { withCredentials: true }
//         );
//         setMessages(data.messages);
//       } catch (error) {
//         console.log(error.response.data.message);
//       }
//     };
//     fetchMessages();
//   }, []);

//   if (!isAuthenticated) {
//     return <Navigate to={"/login"} />;
//   }

//   return (
//     <section className="page messages">
//       <h1>MESSAGE</h1>
//       <div className="banner">
//         {messages && messages.length > 0 ? (
//           messages.map((element) => {
//             return (
//               <div className="card" key={element._id}>
//                 <div className="details">
//                   <p>
//                     First Name: <span>{element.firstName}</span>
//                   </p>
//                   <p>
//                     Last Name: <span>{element.lastName}</span>
//                   </p>
//                   <p>
//                     Email: <span>{element.email}</span>
//                   </p>
//                   <p>
//                     Phone: <span>{element.phone}</span>
//                   </p>
//                   <p>
//                     Message: <span>{element.message}</span>
//                   </p>
//                 </div>
//               </div>
//             );
//           })
//         ) : (
//           <h1>No Messages!</h1>
//         )}
//       </div>
//     </section>
//   );
// };

// export default Messages;

import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Context } from "../main";
import { Navigate } from "react-router-dom";

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
    <section className="page messages">
      <h1>MESSAGE</h1>
      <div className="banner">
        {messages && messages.length > 0 ? (
          messages.map((element) => {
            return (
              <div className="card" key={element._id}>
                <div className="details">
                  <p>
                    First Name: <span>{element.firstName}</span>
                  </p>
                  <p>
                    Last Name: <span>{element.lastName}</span>
                  </p>
                  <p>
                    Email: <span>{element.email}</span>
                  </p>
                  <p>
                    Phone: <span>{element.phone}</span>
                  </p>
                  <p>
                    Message: <span>{element.message}</span>
                  </p>
                </div>
              </div>
            );
          })
        ) : (
          <h1>No Messages!</h1>
        )}
      </div>
    </section>
  );
};

export default Messages;

