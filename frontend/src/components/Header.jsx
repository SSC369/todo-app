import React from "react";
import toast from "react-hot-toast";
import { CgProfile } from "react-icons/cg";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { FaReact } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";

const Header = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    Cookies.remove("todoToken");
    toast.success("Logout Successful", { duration: 1000 });
    setTimeout(() => {
      navigate("/login");
    }, 1000);
  };

  return (
    <div className="flex items-center justify-between w-full h-16 p-4 bg-gray-900 text-white">
      <h1
        onClick={() => navigate("/")}
        className="flex items-center gap-2 cursor-pointer"
      >
        <FaReact fontSize={24} />
        <p className="text-lg font-medium">Todo</p>
      </h1>

      <div className="flex items-center gap-2">
        <CgProfile
          onClick={() => navigate("/profile")}
          className="ml-2 cursor-pointer text-2xl"
        />
        <FiLogOut
          onClick={handleLogout}
          className="ml-2 cursor-pointer text-2xl"
        />
      </div>
    </div>
  );
};

export default Header;
