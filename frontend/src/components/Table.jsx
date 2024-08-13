import React, { useEffect, useState } from "react";
import axios from "axios";
import EditBox from "./EditBox";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import { FaEdit, FaTrash } from "react-icons/fa";
export const URL = import.meta.env.VITE_APP_BACKEND_URL;

const Table = () => {
  const authType = localStorage.getItem('authType');
  const [teachers, setTeachers] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState({
    _id: "",
    name: "",
    email: "",
    classroom: "",
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    getTeachers();
  }, [isDialogOpen]);

  const getTeachers = async () => {
    try {
      if(authType!="principal"){
        toast.error("Not Authorized")
      }
      const response = await axios.get(`${URL}/api/admin/fetch/teachers`, {
        withCredentials: true,
      });
      setTeachers(response.data);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const handleEdit = (teacher) => {
    setSelectedTeacher(teacher);
    setIsDialogOpen(true);
  };

  useEffect(() => {}, [selectedTeacher]);

  const handleSave = (updatedTeacher) => {};

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${URL}/api/admin/delete/teacher/${id}`, {
        withCredentials: true,
      });
      getTeachers();
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="p-8 bg-[#E4F0F1] min-h-screen">
        <h1 className="text-3xl font-semibold text-[#185859] mb-6">Teachers</h1>
        <table className="min-w-full bg-white rounded-lg shadow-lg">
          <thead>
            <tr className="bg-[#4d9fa1] text-white text-left">
              <th className="p-4">Name</th>
              <th className="p-4">Email</th>
              <th className="p-4">Classroom</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {teachers.map((teacher) => (
              <tr key={teacher._id} className="border-b border-[#185859]">
                <td className="p-4">{teacher.name}</td>
                <td className="p-4">{teacher.email}</td>
                <td className="p-4">{teacher.className || "N/A"}</td>
                <td className="p-4">
                  <button
                    onClick={() => handleEdit(teacher)}
                    className="text-[#4d9fa1] hover:text-[#185859] mr-4"
                  >
                    Edit
                    {/* <FaEdit /> */}
                  </button>
                  <button
                    onClick={() => handleDelete(teacher._id)}
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
        <EditBox
          isOpen={isDialogOpen}
          userType={"teacher"}
          onClose={() => setIsDialogOpen(false)}
          userID={selectedTeacher._id}
          onSave={handleSave}
          userName={selectedTeacher.name}
          userEmail={selectedTeacher.email}
          userClassroom={selectedTeacher.className}
        />
      </div>
    </>
  );
};

export default Table;
