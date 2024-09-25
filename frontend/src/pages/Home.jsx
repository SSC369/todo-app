import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import useSWR from "swr";
import Cookies from "js-cookie";
import Loader from "../components/Loader";
import Modal from "../components/Modal";
import { IoIosAddCircleOutline } from "react-icons/io";
import { MdDelete } from "react-icons/md";
import { TbBrandNextjs } from "react-icons/tb";
import { FiLogOut } from "react-icons/fi";
import { TbEdit } from "react-icons/tb";
import { IoCheckmarkCircle } from "react-icons/io5";
import emptyImage from "../assets/empty.jpg";
import { CgProfile } from "react-icons/cg";
import EditModal from "../components/EditModal";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [modal, setModal] = useState(false);
  const [editModal, setEditModal] = useState("");
  const navigate = useNavigate();

  const taskToken = Cookies.get("todoToken");

  const fetcher = async (url) => {
    try {
      const { data } = await axios.get(url, {
        headers: {
          authorization: taskToken,
        },
      });
      return data.tasks;
    } catch (error) {
      const { response } = error;
      toast.error(response.data.message, { duration: 1000 });
    }
  };
  const url = import.meta.env.VITE_BACKEND_URL + "/tasks";
  const { data: tasks, isLoading, mutate, error } = useSWR(url, fetcher);

  const handleDelete = async (id) => {
    try {
      const url = import.meta.env.VITE_BACKEND_URL + "/tasks/" + id;
      const res = await axios.delete(url);
      const { data } = res;
      if (res.status === 200) {
        toast.success(data.message, { duration: 1000 });
        mutate();
      }
    } catch (error) {
      toast.error(error.message, { duration: 1000 });
    }
  };

  const handleCheckboxChange = async (taskId, completed) => {
    try {
      const url = import.meta.env.VITE_BACKEND_URL + "/task/status";
      const res = await axios.put(url, { completed, taskId });
      if (res.status === 200) {
        toast.success(res.data.message, { duration: 1000 });
        mutate();
      }
    } catch (error) {
      toast.error(error.message, { duration: 1000 });
    }
  };

  const renderEmptyView = () => {
    return (
      <div className="flex flex-col items-center justify-center w-full">
        <img alt="tasks empty" quality={100} width={500} src={emptyImage} />
        <h1 className="text-2xl font-medium sm:text-3xl">Tasks empty</h1>
      </div>
    );
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="relative marker:flex flex-col min-h-[100dvh] bg-white min-w-[300px]">
      <div
        className="flex items-center gap-2 cursor-pointer absolute right-4 top-3 bg-black text-white p-2 rounded-lg"
        onClick={() => setModal(true)}
      >
        <p className="text-sm sm:text-base">Add Task</p>
        <IoIosAddCircleOutline className="text-2xl cursor-pointer" />
      </div>
      <div className="flex flex-col items-center w-[80%] max-w-[1200px] p-4 mx-auto">
        {tasks?.length === 0 ? (
          renderEmptyView()
        ) : (
          <>
            <h1 className="text-center text-3xl font-bold mb-5">Your Tasks</h1>
            <ul className="flex flex-col gap-5 items-center w-full sm:flex-row sm:flex-wrap sm:justify-center">
              {tasks?.map((t) => {
                const { name, description, _id, completed } = t;

                return (
                  <li
                    key={_id}
                    className={`flex flex-col gap-2 p-4 bg-white shadow-md rounded-md  max-w-[500px] w-fit min-w-[200px] ${
                      completed ? "opacity-60" : ""
                    }`}
                  >
                    <div className="flex justify-between items-center gap-5">
                      <div className="flex items-center gap-2">
                        <h2 className="text-sm sm:text-lg break-words max-w-[300px]">
                          {name}
                        </h2>
                        {completed && (
                          <IoCheckmarkCircle
                            fontSize={20}
                            className="text-green-400"
                          />
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <MdDelete
                          onClick={() => handleDelete(_id)}
                          className="cursor-pointer hover:text-red-500"
                          fontSize={16}
                        />
                        <TbEdit
                          onClick={() => setEditModal(_id)}
                          className="cursor-pointer"
                          fontSize={16}
                        />
                        <input
                          type="checkbox"
                          className="w-4 h-4 cursor-pointer"
                          checked={completed}
                          onChange={() => handleCheckboxChange(_id, !completed)}
                        />
                      </div>
                    </div>
                    <p className="p-2 text-xs bg-gray-200 rounded-md sm:text-sm">
                      {description}
                    </p>
                  </li>
                );
              })}
            </ul>
          </>
        )}
      </div>
      {editModal && (
        <EditModal
          taskId={editModal}
          isOpen={editModal !== ""}
          onClose={() => setEditModal("")}
          mutate={mutate}
        />
      )}
      {modal && (
        <Modal isOpen={modal} onClose={() => setModal(false)} mutate={mutate} />
      )}
    </div>
  );
};

export default Home;
