import React, { useEffect, useState } from "react";
import axios from "axios";
import EditBox from "./EditBox"; // Assuming you use the same EditBox component for both teachers and students
// import { FaEdit, FaTrash } from "react-icons/fa";
export const URL = import.meta.env.VITE_APP_BACKEND_URL;
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const StudentTable = () => {
  const authType = localStorage.getItem("authType");
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState({
    _id: "",
    name: "",
    email: "",
    classroom: "",
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    getStudents();
  }, [isDialogOpen]);

  const getStudents = async () => {
    try {
      if (authType == "principal") {
        const response = await axios.get(`${URL}/api/admin/fetch/students`, {
          withCredentials: true,
        });
        setStudents(response.data);
  
      } else if (authType == "teacher") {
        const response = await axios.get(`${URL}/api/teacher/fetch/students`, {
          withCredentials: true,
        });
        setStudents(response.data);
  
      } else if (authType == "student") {
        const response = await axios.get(`${URL}/api/student/fetch/students`, {
          withCredentials: true,
        });
        setStudents(response.data);
  
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const handleEdit = (student) => {
    setSelectedStudent(student);
    setIsDialogOpen(true);
  };

  const handleSave = (updatedStudent) => {
    // Implement the logic for saving the updated student details
  };

  const handleDelete = async (id) => {
    try {
      if (authType == "principal") {
        await axios.delete(`${URL}/api/admin/delete/student/${id}`, {
          withCredentials: true,
        });
        getStudents();
      } else if (authType == "teacher") {
        await axios.delete(`${URL}/api/teacher/delete/student/${id}`, {
          withCredentials: true,
        });
        getStudents();
      } else {
        toast.error("Not Authorized!");
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="p-8 bg-[#E4F0F1] min-h-screen">
        {students.length === 0 && (
          <div className="p-4 text-lg">No Students to show</div>
        )}
        {students.length !== 0 && (
          <div>
            <h1 className="text-3xl font-semibold text-[#185859] mb-6">
              Students
            </h1>
            <table className="min-w-full bg-white rounded-lg shadow-lg">
              <thead>
                <tr className="bg-[#4d9fa1] text-white text-left">
                  <th className="p-4">Name</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Classroom</th>
                  {(authType == "principal" || authType == "teacher") && (
                    <th className="p-4">Actions</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student._id} className="border-b border-[#185859]">
                    <td className="p-4">{student.name}</td>
                    <td className="p-4">{student.email}</td>
                    <td className="p-4">{student.className || "N/A"}</td>
                    {(authType == "principal" || authType == "teacher") && (
                      <td className="p-4">
                        <button
                          onClick={() => handleEdit(student)}
                          className="text-[#4d9fa1] hover:text-[#185859] mr-4"
                        >
                          Edit
                          {/* <FaEdit /> */}
                        </button>
                        <button
                          onClick={() => handleDelete(student._id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          Delete
                          {/* <FaTrash /> */}
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <EditBox
          isOpen={isDialogOpen}
          userType={"student"}
          onClose={() => setIsDialogOpen(false)}
          userID={selectedStudent._id}
          onSave={handleSave}
          userName={selectedStudent.name}
          userEmail={selectedStudent.email}
          userClassroom={selectedStudent.className}
          authType={authType}
        />
      </div>
    </>
  );
};

export default StudentTable;
