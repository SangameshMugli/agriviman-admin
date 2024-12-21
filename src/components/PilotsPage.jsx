import React from 'react'
import Pilot from './Pilot'
import Header from './Header'
import Sidebar from './Sidebar'

export default function PilotsPage() {
  return (
    <div className="h-screen overflow-y-hidden bg-dashboard font-para ">
    <div>
      <Header />
    </div>

    <div className="flex">
      <div className="">
        <Sidebar />

      </div>

      <div className='w-full'>
        <Pilot />
      </div>
    </div>
  </div>
  )
}
