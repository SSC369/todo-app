import React, { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import Cookies from "js-cookie";
import { IoClose } from "react-icons/io5";

const Modal = ({ isOpen, onClose, mutate }) => {
  const [task, setTask] = useState({
    title: "",
    description: "",
  });
  const taskToken = Cookies.get("todoToken");

  const handleChange = (e) => {
    setTask({ ...task, [e.target.name]: e.target.value });
  };

  const handleValidation = () => {
    const { title, description } = task;
    if (title === "" || description === "") {
      toast.error("Data Invalid!", { duration: 1000 });
      return false;
    }
    return true;
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    try {
      if (handleValidation()) {
        const { title, description } = task;
        const url = import.meta.env.VITE_BACKEND_URL + "/tasks/addTask";
        const response = await axios.post(
          url,
          { title, description },
          {
            headers: {
              authorization: taskToken,
            },
          }
        );

        if (response.status === 201) {
          const { data } = response;
          toast.success(data.message, { duration: 1000 });
          mutate();
          setTask({
            title: "",
            description: "",
          });
          setTimeout(() => {
            onClose();
          }, 1000);
        }
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message, { duration: 1000 });
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg w-11/12 max-w-lg mx-4 p-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex justify-between items-center border-b pb-3">
          <h2 className="text-xl font-semibold">Add Task</h2>
          <button
            onClick={onClose}
            className="text-white bg-black p-2 rounded-full"
          >
            <IoClose size={20} />
          </button>
        </header>
        <div className="py-4">
          <form onSubmit={handleAddTask} className="flex flex-col gap-4">
            <input
              type="text"
              name="title"
              value={task.title}
              onChange={handleChange}
              placeholder="Task Title"
              className="w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 p-2"
            />
            <textarea
              name="description"
              value={task.description}
              onChange={handleChange}
              placeholder="Task Description"
              className="w-full p-2 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={4}
            />
            <button
              type="submit"
              className="py-3 px-6 bg-gray-100 text-gray-900 rounded-full hover:bg-gray-900 font-semibold hover:text-white transition-all shadow-lg relative overflow-hidden"
            >
              Save
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Modal;
