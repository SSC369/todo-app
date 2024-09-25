import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import Cookies from "js-cookie";
import { IoClose } from "react-icons/io5";

const EditModal = ({ isOpen, onClose, taskId, mutate }) => {
  const [task, setTask] = useState({
    title: "",
    description: "",
    completed: false,
  });

  const taskToken = Cookies.get("todoToken");

  const fetchTask = async () => {
    try {
      const url = import.meta.env.VITE_BACKEND_URL + "/tasks/" + taskId;
      const res = await axios.get(url);
      const { data } = res;
      if (res.status === 200) {
        const { name, description, completed } = data?.task;
        setTask({
          title: name,
          description,
          completed,
        });
      }
    } catch (error) {
      toast.error(error.message, { duration: 1000 });
    }
  };

  useEffect(() => {
    fetchTask();
  }, []);

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

  const handleEditTask = async (e) => {
    e.preventDefault();
    try {
      if (handleValidation()) {
        const { title, description, completed } = task;
        const url = import.meta.env.VITE_BACKEND_URL + "/tasks/editTask";

        const response = await axios.put(
          url,
          { title, description, completed, taskId },
          {
            headers: {
              authorization: taskToken,
            },
          }
        );

        if (response.status === 200) {
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
      className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg w-11/12 max-w-lg p-6 m-4 flex flex-col min-w-[300px]"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex justify-between items-center border-b border-gray-300 pb-3 mb-4">
          <h2 className="text-lg font-medium">Edit Task</h2>
          <button
            className="text-white bg-gray-800 p-2 rounded-full"
            onClick={onClose}
          >
            <IoClose className="text-white" size={20} />
          </button>
        </header>
        <div>
          <form onSubmit={handleEditTask} className="flex flex-col gap-4">
            <input
              type="text"
              name="title"
              value={task.title}
              onChange={handleChange}
              placeholder="Task Title"
              className="p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            />
            <textarea
              name="description"
              value={task.description}
              onChange={handleChange}
              placeholder="Task Description"
              className="p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 resize-vertical min-h-[100px]"
            />
            <button
              type="submit"
              className="py-3 px-6 bg-gray-100 text-gray-900 rounded-full hover:bg-gray-900 hover:text-white font-semibold transition-all shadow-lg relative overflow-hidden"
            >
              Save
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditModal;
