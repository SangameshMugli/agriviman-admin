import React from 'react'
import Header from './Header'
import Sidebar from './Sidebar'
import ContactRequest from './ContactRequest'

export default function RequestPage() {
  return (
    <div className="h-screen overflow-auto bg-dashboard font-para ">
    <div>
      <Header />
    </div>

    <div className="flex">
      <div className="">
        <Sidebar />

      </div>

      <div className='w-full'>
        <ContactRequest />
      </div>
    </div>
  </div>
  )
}
