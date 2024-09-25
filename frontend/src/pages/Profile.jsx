import axios from "axios";
import React, { useEffect } from "react";
import toast from "react-hot-toast";
import useSWR from "swr";
import Loader from "../components/Loader";
import Cookies from "js-cookie";
import { IoMdMail } from "react-icons/io";
import { RiLock2Line } from "react-icons/ri";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { useState } from "react";
import { FaRegCircleUser } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { TailSpin } from "react-loader-spinner";
import { CgProfile } from "react-icons/cg";

const Profile = () => {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const todoToken = Cookies.get("todoToken");

  const profileFetcher = async (url) => {
    try {
      const res = await axios.get(url, {
        headers: {
          authorization: todoToken,
        },
      });
      if (res.status === 200) {
        return res.data.user;
      }
    } catch (error) {
      toast.error(error.response.data.message, { duration: 1000 });
    }
  };

  const url = import.meta.env.VITE_BACKEND_URL + "/api/auth/profile";
  const { data, isLoading, mutate } = useSWR(url, profileFetcher);

  useEffect(() => {
    if (!isLoading && data) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        username: data.username || "",
        email: data.email || "",
      }));
    }
  }, [isLoading, data]);

  const handleValidation = () => {
    const { password, confirmPassword, email, username } = formData;
    if (password !== confirmPassword) {
      toast.error("Password and confirm password should be same.", {
        duration: 1000,
      });
      return false;
    } else if (password.length < 5) {
      toast.error("Password is too short.", { duration: 1000 });
      return false;
    } else if (email === "") {
      toast.error("Email is required!", { duration: 1000 });
      return false;
    } else if (username === "") {
      toast.error("Username is required!", { duration: 1000 });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { username, email, password } = formData;
      if (handleValidation()) {
        const url = import.meta.env.VITE_BACKEND_URL + "/api/auth/edit-profile";

        const res = await axios.put(
          url,
          {
            username,
            email,
            password,
          },
          {
            headers: {
              authorization: todoToken,
            },
          }
        );

        if (res.status === 201) {
          toast.success(res.data.message, { duration: 1000 });
          Cookies.set("todoToken", res.data.jwtToken);
          mutate();
        }
      }
    } catch (error) {
      toast.error(error.response.data.message, { duration: 1000 });
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="flex flex-col items-center justify-center bg-white min-w-[300px] min-h-dvh">
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-2 bg-white p-8 w-4/5 max-w-md min-w-[300px] rounded-2xl text-sm shadow-2xl"
          >
            <h1 className="text-black font-bold text-2xl md:text-3xl flex items-center gap-2 mb-3">
              <CgProfile />
              <p>Profile</p>
            </h1>

            <label className="text-black font-semibold">Username</label>

            <div className="flex items-center border-2 border-gray-300 rounded-lg h-12 pl-2 transition focus-within:border-blue-500">
              <FaRegCircleUser className="mr-2" size={20} />
              <input
                onChange={handleChange}
                name="username"
                value={formData.username || ""}
                type="text"
                className="ml-2 border-none h-full focus:outline-none w-[80%]"
                placeholder="Enter username"
              />
            </div>

            <label className="text-black font-semibold">Email</label>

            <div className="flex items-center border-2 border-gray-300 rounded-lg h-12 pl-2 transition focus-within:border-blue-500">
              <IoMdMail className="mr-2" size={20} />
              <input
                onChange={handleChange}
                value={formData.email || ""}
                name="email"
                type="text"
                className="ml-2 border-none h-full focus:outline-none w-[80%]"
                placeholder="Enter your Email"
              />
            </div>

            <label className="text-black font-semibold">Password</label>

            <div className="flex items-center border-2 border-gray-300 rounded-lg h-12 pl-2 transition focus-within:border-blue-500">
              <RiLock2Line className="mr-2" size={20} />
              <input
                onChange={handleChange}
                value={formData.password}
                name="password"
                type={showPassword ? "text" : "password"}
                className="ml-2 border-none w-full h-full focus:outline-none"
                placeholder="Enter new password"
              />
              {showPassword ? (
                <AiOutlineEyeInvisible
                  onClick={() => setShowPassword(!showPassword)}
                  className="mr-2 cursor-pointer"
                  size={20}
                />
              ) : (
                <AiOutlineEye
                  onClick={() => setShowPassword(!showPassword)}
                  className="mr-2 cursor-pointer"
                  size={20}
                />
              )}
            </div>

            <label className="text-black font-semibold">Confirm Password</label>

            <div className="flex items-center border-2 border-gray-300 rounded-lg h-12 pl-2 transition focus-within:border-blue-500">
              <RiLock2Line className="mr-2" size={20} />
              <input
                onChange={handleChange}
                value={formData.confirmPassword}
                name="confirmPassword"
                type={showPassword ? "text" : "password"}
                className="ml-2 border-none w-full h-full focus:outline-none"
                placeholder="Confirm new Password"
              />
              {showPassword ? (
                <AiOutlineEyeInvisible
                  onClick={() => setShowPassword(!showPassword)}
                  className="mr-2 cursor-pointer"
                  size={20}
                />
              ) : (
                <AiOutlineEye
                  onClick={() => setShowPassword(!showPassword)}
                  className="mr-2 cursor-pointer"
                  size={20}
                />
              )}
            </div>

            <button
              type="submit"
              className="flex justify-center items-center mt-5 mb-2 bg-slate-950 text-white font-medium text-sm rounded-2xl h-12 w-full transition hover:bg-slate-900"
            >
              {loading ? (
                <TailSpin
                  visible={true}
                  height="30"
                  width="30"
                  color="white"
                  ariaLabel="tail-spin-loading"
                  radius="1"
                />
              ) : (
                "Save"
              )}
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default Profile;
