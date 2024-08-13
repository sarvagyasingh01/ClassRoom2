import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const URL = import.meta.env.VITE_APP_BACKEND_URL;

const ClassroomTable = () => {
  const [classrooms, setClassrooms] = useState([]);
  const authType = localStorage.getItem('authType');

  useEffect(() => {
    getClassrooms();
  }, []);

  const getClassrooms = async () => {
    try {
      if (authType == "principal") {
        const response = await axios.get(`${URL}/api/admin/fetch/classrooms`, {
          withCredentials: true,
        });
        setClassrooms(response.data);
      } else if (authType == "student") {
        const response = await axios.get(`${URL}/api/student/fetch/classrooms`, {
          withCredentials: true,
        });
        setClassrooms(response.data);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${URL}/api/admin/delete/classroom/${id}`, {
        withCredentials: true,
      });
      getClassrooms();
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="p-8 bg-[#E4F0F1] min-h-screen">
        {classrooms.length === 0 && (
          <div className="p-4 text-lg">No Classrooms to show</div>
        )}
        {classrooms.length !== 0 && (
          <div>
            <h1 className="text-3xl font-semibold text-[#185859] mb-6">
              Classrooms
            </h1>
            <table className="min-w-full bg-white rounded-lg shadow-lg">
              <thead>
                <tr className="bg-[#4d9fa1] text-white text-left">
                  <th className="p-4">Name</th>
                  <th className="p-4">Start Time</th>
                  <th className="p-4">End Time</th>
                  <th className="p-4">Teacher</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {classrooms.map((classroom) => (
                  <tr key={classroom._id} className="border-b border-[#185859]">
                    <td className="p-4">{classroom.name}</td>
                    <td className="p-4">{classroom.startTime}</td>
                    <td className="p-4">{classroom.endTime}</td>
                    <td className="p-4">{classroom.teacherName || "N/A"}</td>
                    <td className="p-4">
                      <button
                        onClick={() => handleDelete(classroom._id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Delete
                        {/* <FaTrash /> */}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
};

export default ClassroomTable;
