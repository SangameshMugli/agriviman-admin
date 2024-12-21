import "./App.css";
import React, { Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import 'react-tooltip/dist/react-tooltip.css'

const AdminLanding = React.lazy(() => import("./components/AdminLanding"));
const AdminLogin = React.lazy(() => import("./components/AdminLogin"));
const AdminPage = React.lazy(() => import("./components/AdminPage"));
const PilotsPage=React.lazy(()=> import("./components/PilotsPage"))
const RequestPage=React.lazy(()=>import("./components/RequestPage"))


const ContactRequest=React.lazy(()=>import("./components/ContactRequest"))
const DroneParts=React.lazy(()=>import("./components/DroneParts"))
const OrderList=React.lazy(()=>import("./components/OrderList"))
const Pilot=React.lazy(()=>import("./components/Pilot"))
const Tasks=React.lazy(()=>import("./components/Tasks"))
const AddPilot=React.lazy(()=>import("./components/AddPilot"))
const UpdatePilot=React.lazy(()=>import("./components/UpdatePilot"))
const AddPart=React.lazy(()=>import("./components/AddPart"))
const UpdatePart=React.lazy(()=>import("./components/UpdatePart"))
const AddTask=React.lazy(()=>import("./components/AddTask"))
const UpdateTask=React.lazy(()=>import("./components/UpdateTask"))

const AddOrder=React.lazy(()=>import("./components/AddOrder"))
const Header=React.lazy(()=>import("./components/Header"))
const Sidebar=React.lazy(()=>import("./components/Sidebar"))
const Dashboard=React.lazy(()=>import("./components/Dashboard"))

function App() {
  return (
    <div>
      <BrowserRouter>
        <Suspense fallback={<div>Please wait, Loading.....</div>}>
          <Routes>
            <Route path="/" element={<AdminLanding />} />
            <Route path="/login" element={<AdminLogin />} />
            <Route path="/page" element={<AdminPage />} />
            <Route path="/pilotpage" element={<PilotsPage />} />
            <Route path="/requestpage" element={<RequestPage />} />

            <Route path="/request" element={<ContactRequest />} />
            <Route path="/pilot" element={<Pilot />} />
            <Route path="/drone" element={<DroneParts />} />
            <Route path="/task" element={<Tasks />} />
            <Route path="/orders" element={<OrderList />} />
            <Route path="/addPilot" element={<AddPilot />} />
            <Route path="/pilot/update/:pilot_id" element={<UpdatePilot />} />
            <Route path="/addDronePart" element={<AddPart />} />
            <Route path="/drone/updatepart/:part_id" element={<UpdatePart />} />
            <Route path="/addtask" element={<AddTask/>} />
            <Route path="/task/update/:service_id" element={<UpdateTask/>} />

            <Route path="/addorder/:part_id" element={<AddOrder/>} />
            <Route path="/header" element={<Header />} />
            <Route path="/sidebar" element={<Sidebar />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </div>
  );
}

export default App;
