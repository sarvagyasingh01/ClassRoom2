import axios from "axios";
import React, { useState } from "react";
export const URL = import.meta.env.VITE_APP_BACKEND_URL;
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const RegisterForm = () => {
  const authType = localStorage.getItem('authType');
  const navigate = useNavigate()
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [classrooms, setClassrooms] = useState([]);
  const [selectedClassroom, setSelectedClassroom] = useState();
  const [role, setRole] = useState("");
  const getClassrooms = async () => {
    try {
      if(authType=="principal"){
        const res = await axios.get(`${URL}/api/admin/fetch/classrooms`, {
          withCredentials: true,
        });
        setClassrooms(res.data);
      }
      else if(authType=="teacher"){
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
    getClassrooms();
  }, []);

  const handleRegister = async () => {
    if (!name || !email) {
      toast.error("Fill all the fields");
    }

    try {
      if (authType == "principal") {
        const res = await axios.post(
          `${URL}/api/admin/register/${role}`,
          { name, email, password, classroom: selectedClassroom },
          { withCredentials: true }
        );
        setName("");
        setEmail("");
        setPassword("");
        setRole("");
        setSelectedClassroom("");
        navigate(`/dashboard/${role}s`)
      } else if (authType == "teacher") {
        const res = await axios.post(
          `${URL}/api/teacher/register/${role}`,
          { name, email, password, classroom: selectedClassroom },
          { withCredentials: true }
        );
        setName("");
        setEmail("");
        setPassword("");
        setRole("");
        setSelectedClassroom("");
        navigate(`/dashboard/${role}s`)
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="max-w-md mx-auto mt-8 bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-center text-[#185859] mb-6">
          Register
        </h2>

        <div className="mb-4">
          <label className="block text-[#185859] font-medium mb-2">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 border border-[#4d9fa1] rounded-md focus:outline-none focus:ring-2 focus:ring-[#4d9fa1]"
            placeholder="Enter your name"
          />
        </div>

        <div className="mb-4">
          <label className="block text-[#185859] font-medium mb-2">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-[#4d9fa1] rounded-md focus:outline-none focus:ring-2 focus:ring-[#4d9fa1]"
            placeholder="Enter your email"
          />
        </div>

        <div className="mb-4">
          <label className="block text-[#185859] font-medium mb-2">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-[#4d9fa1] rounded-md focus:outline-none focus:ring-2 focus:ring-[#4d9fa1]"
            placeholder="Enter your password"
          />
        </div>

        <div className="mb-4">
          <label className="block text-[#185859] font-medium mb-2">
            Classroom (optional)
          </label>
          <select
            value={selectedClassroom}
            onChange={(e) => setSelectedClassroom(e.target.value)}
            className="w-full px-4 py-2 border border-[#4d9fa1] rounded-md focus:outline-none focus:ring-2 focus:ring-[#4d9fa1]"
          >
            <option value="">Select a classroom</option>
            {classrooms.map((classroom, index) => (
              <option key={index}>{classroom.name}</option>
            ))}
          </select>
        </div>

        <div className="mb-6">
          <label className="block text-[#185859] font-medium mb-2">Role</label>
          <div className="flex items-center">
            {authType == "principal" && (
              <label className="text-[#185859] mr-4">
                <input
                  type="radio"
                  name="role"
                  value="teacher"
                  onChange={(e) => setRole(e.target.value)}
                  className="mr-2"
                />
                Teacher
              </label>
            )}

            <label className="text-[#185859]">
              <input
                type="radio"
                name="role"
                value="student"
                onChange={(e) => setRole(e.target.value)}
                className="mr-2"
              />
              Student
            </label>
          </div>
        </div>

        <button
          onClick={handleRegister}
          disabled={!name || !email || !password || !role}
          className="w-full py-2 px-4 bg-[#185859] text-white rounded-md hover:bg-[#4d9fa1] transition-colors disabled:opacity-50"
        >
          Register
        </button>
      </div>
    </>
  );
};

export default RegisterForm;
