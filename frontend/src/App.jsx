import { useEffect, useState } from "react";
import "./App.css";
import Header from "./components/Header";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import Sidebar from "./components/Sidebar";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import RegisterForm from "./components/RegisterForm";
import Table from "./components/Table";
import StudentTable from "./components/StudentTable";
import Layout from "./components/Layout";
import RegisterClassroom from "./components/RegisterClassroom";
import ClassroomTable from "./components/ClassroomTable";
import axios from "axios";
export const URL = import.meta.env.VITE_APP_BACKEND_URL;

function App() {
  const isAuth = localStorage.getItem("isAuth");
  const [auth, setAuth] = useState(false)
  const [authType, setAuthType] = useState("")

  useEffect(() => {
    axios.get(`${URL}/api/auth/`, { withCredentials: true })
      .then(res => {
        setAuthType(res.data.type)
        localStorage.setItem('authType', authType);
        localStorage.setItem('isAuth', auth);
      }).catch(() => {
        setAuthType("")
      });
      if(authType!="principal" && authType!="teacher" && authType!="student"){
        setAuth(false)
      }
      else{
        setAuth(true)
      }
  }, [auth, authType]);
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={isAuth ? <Navigate to='/dashboard' /> : <Login />} />
        <Route path="/logout" element={ <Login />} />

        <Route path="/dashboard" element={ isAuth ? <Layout authType={authType} auth={auth}/> : <Navigate to='/' />}>
          <Route path="/dashboard/register" element={ isAuth ?  <RegisterForm authType={authType} /> : <Navigate to='/' /> } />
          <Route path="/dashboard/teachers" element={ isAuth ?  <Table authType={authType} /> : <Navigate to='/' /> } />
          <Route path="/dashboard/students" element={ isAuth ?  <StudentTable authType={authType} /> : <Navigate to='/' /> } />
          <Route path="/dashboard/classrooms" element={ isAuth ?  <ClassroomTable authType={authType} /> : <Navigate to='/' /> } />
          <Route path="/dashboard/add/classroom" element={ isAuth ?  <RegisterClassroom authType={authType} /> : <Navigate to='/' /> }/>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
