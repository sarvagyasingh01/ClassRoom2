import React from 'react'
import Sidebar from './Sidebar'
import RegisterForm from './RegisterForm'
import Table from './Table'
import StudentTable from './StudentTable'

const Dashboard = () => {
  return (
  <div className="">
   
    <div className='w-full'>
      <StudentTable/>
      {/* <RegisterForm/> */}
    </div>
  </div>
  )
}

export default Dashboard