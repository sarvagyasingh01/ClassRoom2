import axios from "axios";
import React, { useState } from "react";
export const URL = import.meta.env.VITE_APP_BACKEND_URL;
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from "react-router-dom";

const RegisterClassroom = () => {
    const authType = localStorage.getItem('authType');
    const navigate = useNavigate()
  const [name, setName] = useState("");
  const [startHour, setStartHour] = useState("12");
  const [startMinute, setStartMinute] = useState("00");
  const [startPeriod, setStartPeriod] = useState("AM");
  const [endHour, setEndHour] = useState("12");
  const [endMinute, setEndMinute] = useState("00");
  const [endPeriod, setEndPeriod] = useState("AM");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const startTime = `${startHour}:${startMinute} ${startPeriod}`;
    const endTime = `${endHour}:${endMinute} ${endPeriod}`;
    const classroomData = { name, startTime, endTime };
    if (startTime === endTime) {
      toast.error("Start and End time cannot be the same");
    }
    if(authType!="principal"){
        toast.error("Not Authorized")
    }
    try {
      const res = await axios.post(
        `${URL}/api/admin/create/classroom`,
        { name, startTime, endTime },
        { withCredentials: true }
      );
      setName("");
      setStartHour("12");
      setStartMinute("00");
      setStartPeriod("AM");
      setEndHour("12");
      setEndMinute("00");
      setEndPeriod("AM");
      navigate('/dashboard/classrooms')
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <>
      <ToastContainer/>
      <div className="max-w-md mx-auto mt-10 p-6 bg-[#E4F0F1] rounded shadow-md">
        <h2 className="text-3xl font-semibold text-[#185859] mb-6">
          Register Classroom
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-[#4d9fa1] mb-2">Classroom Name</label>
            <input
              type="text"
              className="w-full p-2 border border-[#185859] rounded"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-[#4d9fa1] mb-2">Starting Time</label>
            <div className="flex space-x-2">
              <select
                value={startHour}
                onChange={(e) => setStartHour(e.target.value)}
                className="p-2 border border-[#185859] rounded"
              >
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i + 1} value={String(i + 1).padStart(2, "0")}>
                    {String(i + 1).padStart(2, "0")}
                  </option>
                ))}
              </select>
              <select
                value={startMinute}
                onChange={(e) => setStartMinute(e.target.value)}
                className="p-2 border border-[#185859] rounded"
              >
                {["00", "15", "30", "45"].map((minute) => (
                  <option key={minute} value={minute}>
                    {minute}
                  </option>
                ))}
              </select>
              <select
                value={startPeriod}
                onChange={(e) => setStartPeriod(e.target.value)}
                className="p-2 border border-[#185859] rounded"
              >
                <option value="AM">AM</option>
                <option value="PM">PM</option>
              </select>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-[#4d9fa1] mb-2">Ending Time</label>
            <div className="flex space-x-2">
              <select
                value={endHour}
                onChange={(e) => setEndHour(e.target.value)}
                className="p-2 border border-[#185859] rounded"
              >
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i + 1} value={String(i + 1).padStart(2, "0")}>
                    {String(i + 1).padStart(2, "0")}
                  </option>
                ))}
              </select>
              <select
                value={endMinute}
                onChange={(e) => setEndMinute(e.target.value)}
                className="p-2 border border-[#185859] rounded"
              >
                {["00", "15", "30", "45"].map((minute) => (
                  <option key={minute} value={minute}>
                    {minute}
                  </option>
                ))}
              </select>
              <select
                value={endPeriod}
                onChange={(e) => setEndPeriod(e.target.value)}
                className="p-2 border border-[#185859] rounded"
              >
                <option value="AM">AM</option>
                <option value="PM">PM</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="w-full p-2 bg-[#185859] text-white rounded hover:bg-[#4d9fa1]"
          >
            Register Classroom
          </button>
        </form>
      </div>
    </>
  );
};

export default RegisterClassroom;
