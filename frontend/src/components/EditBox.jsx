import axios from "axios";
import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
export const URL = import.meta.env.VITE_APP_BACKEND_URL;
import "react-toastify/dist/ReactToastify.css";

const EditBox = ({
  isOpen,
  onClose,
  userType,
  userID,
  onSave,
  userName,
  userEmail,
  userClassroom,
}) => {
  const authType = localStorage.getItem("authType");
  const [name, setName] = useState(userName);
  const [email, setEmail] = useState(userEmail);
  const [classroom, setClassroom] = useState(userClassroom);
  const [classrooms, setClassrooms] = useState([]);
  const getClassrooms = async () => {
    try {
      if (authType == "principal") {
        const res = await axios.get(`${URL}/api/admin/fetch/classrooms`, {
          withCredentials: true,
        });
        setClassrooms(res.data);
      } else if (authType == "teacher") {
        const res = await axios.get(`${URL}/api/teacher/fetch/classrooms`, {
          withCredentials: true,
        });
        setClassrooms(res.data);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };
  useEffect(() => {
    setName(userName);
    setEmail(userEmail);
    setClassroom(userClassroom);
    getClassrooms();
  }, [userName, userEmail, userClassroom]);
  if (!isOpen) return null;

  const handleSave = async () => {
    if (!email || !name) {
      toast.error("Please fill in all fields");
    }
    try {
      if (authType == "principal") {
        const res = await axios.put(
          `${URL}/api/admin/update/${userType}/${userID}`,
          { name, email, classroom },
          { withCredentials: true }
        );
        setClassroom("");
        onClose();
      } else if (authType == "teacher") {
        const res = await axios.put(
          `${URL}/api/teacher/update/${userType}/${userID}`,
          { name, email, classroom },
          { withCredentials: true }
        );
        setClassroom("");
        onClose();
      } else {
        toast.error("Not Authorized");
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <h2 className="text-2xl font-semibold text-[#185859] mb-4">Edit </h2>
          <div className="mb-4">
            <label className="block text-[#4d9fa1] mb-2">Name</label>
            <input
              type="text"
              className="w-full p-2 border border-[#185859] rounded"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-[#4d9fa1] mb-2">Email</label>
            <input
              type="email"
              className="w-full p-2 border border-[#185859] rounded"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-[#4d9fa1] mb-2">Classroom</label>
            <select
              className="w-full p-2 border border-[#185859] rounded"
              value={classroom}
              onChange={(e) => setClassroom(e.target.value)}
            >
              <option value="">{classroom}</option>
              {classrooms.map((room) => (
                <option key={room._id} value={room.name}>
                  {room.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="bg-[#185859] text-white px-4 py-2 rounded mr-2 hover:bg-[#4d9fa1]"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="bg-[#4d9fa1] text-white px-4 py-2 rounded hover:bg-[#185859]"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditBox;
