import { useState, useContext } from "react";
import { Menu, X, ClipboardList, Stethoscope, UserCog } from "lucide-react";
import { Context } from "../main";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const [showSidebar, setShowSidebar] = useState(false); // sidebar toggle

  const { isAuthenticated } = useContext(Context);
  const navigate = useNavigate();
  const goto = (path) => {
    navigate(path);
    setShowSidebar(false);
  };

  return (
    <>
      {/* Sidebar hamburger (only visible when authenticated) */}

      {isAuthenticated && (
        <div className="block fixed top-[70px] left-4 z-50">
          <button
            onClick={() => setShowSidebar(!showSidebar)}
            className="text-gray-700 focus:outline-none"
          >
            {showSidebar ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      )}

      {/* Sidebar */}
      {isAuthenticated && showSidebar && (
        <>
          <div className="fixed top-[70px] left-0 h-[calc(100%-70px)] w-16 bg-white shadow-lg flex flex-col items-center py-4 space-y-2 z-40">
            <hr className="w-full border-t border-gray-200 my-2" />

            <div
              className="flex flex-col items-center group cursor-pointer"
              onClick={() => goto("/doctors")}
            >
              <Stethoscope
                className="text-gray-700 group-hover:text-blue-400"
                size={24}
              />
              <p className="text-xs text-gray-500 mt-1 group-hover:text-blue-500">
                Doctors
              </p>
            </div>

            <hr className="w-full border-t border-gray-200 my-2" />

            <div
              className="flex flex-col items-center group cursor-pointer"
              onClick={() => goto("/admins")}
            >
              <UserCog
                className="text-gray-700 group-hover:text-blue-400"
                size={24}
              />
              <p className="text-xs text-gray-500 mt-1 group-hover:text-blue-500">
                Admin
              </p>
            </div>

            <hr className="w-full border-t border-gray-200 my-2" />

            <div
              className="flex flex-col items-center group cursor-pointer"
              onClick={() => goto("/attendance")}
            >
              <ClipboardList
                className="text-gray-700 group-hover:text-blue-400"
                size={24}
              />
              <p className="text-xs text-gray-500 mt-1 group-hover:text-blue-500">
                Attendance
              </p>
            </div>

            <hr className="w-full border-t border-gray-200 my-2" />
          </div>
        </>
      )}
    </>
  );
};

export default Navbar;
