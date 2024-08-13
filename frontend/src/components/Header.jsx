import axios from "axios";
import React from "react";
export const URL = import.meta.env.VITE_APP_BACKEND_URL;
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate()
  const logOut = async () => {
    try {
      await axios.get(`${URL}/api/logout`, {
        withCredentials: true,
      });
      localStorage.removeItem('authType')
      localStorage.removeItem('isAuth')
      navigate('/logout')
    } catch (error) {
      toast.error(error);
    }
  };
  return (
    <>
      <ToastContainer />
      <header className="text-white bg-[#185859] ">
        <div className="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
          <a className="flex  items-center mb-4 md:mb-0">
            <span className="font-serif ml-3 text-xl">Class Room</span>
          </a>
          <nav className="md:ml-auto flex flex-wrap items-center text-base justify-center"></nav>
          <button
            onClick={logOut}
            className="inline-flex items-center bg-[#185859]-100 border-0 py-1 px-3 focus:outline-none hover:bg-[#0d3a3b] rounded text-base mt-4 md:mt-0"
          >
            Log Out
          </button>
        </div>
      </header>
    </>
  );
};

export default Header;
