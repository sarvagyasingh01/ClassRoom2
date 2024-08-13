import React, { useEffect } from "react";
import { Link } from "react-router-dom";

const Sidebar = ({authType}) => {

  return (
    <div className="h-screen w-64 bg-[#4d9fa1] text-white flex flex-col">
      <nav className="flex-1 mt-4">
        <ul>
          {(authType == "principal" || authType == "teacher") && (
            <li className="hover:bg-[#336a6b]">
              <Link to="/dashboard/register" className="block py-3 px-6">
                Register
              </Link>
            </li>
          )}

          {authType == "principal" && (
            <li className="hover:bg-[#336a6b]">
              <Link to="/dashboard/teachers" className="block py-3 px-6">
                Teachers
              </Link>
            </li>
          )}
          {(authType == "principal" || authType == "teacher" || authType=="student") && (
            <li className="hover:bg-[#336a6b]">
              <Link to="/dashboard/students" className="block py-3 px-6">
                Students
              </Link>
            </li>
          )}
          {authType == "principal" && (
            <li className="hover:bg-[#336a6b]">
              <Link to="/dashboard/classrooms" className="block py-3 px-6">
                Classrooms
              </Link>
            </li>
          )}
          {authType == "principal" && (
            <li className="hover:bg-[#336a6b]">
              <Link to="/dashboard/add/classroom" className="block py-3 px-6">
                Add Classroom
              </Link>
            </li>
          )}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
