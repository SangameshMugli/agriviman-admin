import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import edit from "../images/edit.png";
import delte from "../images/bin.png";
import read from "../images/readmore.png";
import { Tooltip as ReactTooltip } from 'react-tooltip';

function Tasks() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTask, setSelectedTask] = useState(null);

  useEffect(() => {
    // Get token from local storage
    const token = localStorage.getItem('token');

    if (!token) {
      navigate('/login'); // Redirect to login if no token
      return;
    }

    axios
      .get("http://localhost:5001/api/fetchtasks", {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then((response) => {
        const data = response.data;
        if (Array.isArray(data)) {
          setTasks(data);
        } else {
          setTasks([data]);
        }
      })
      .catch((error) => {
        console.error("There was an error fetching the tasks!", error);
        toast.error("Failed to fetch tasks");
      });
  }, [navigate]);

  const handleDelete = async (service_id) => {
    const token = localStorage.getItem('token');

    if (!token) {
      toast.error("Unauthorized action");
      navigate('/login'); // Redirect to login if no token
      return;
    }

    try {
      await axios.delete(`http://localhost:5001/api/deletetask/${service_id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTasks(tasks.filter((task) => task.service_id !== service_id));
      toast.success("Task deleted successfully");
    } catch (err) {
      console.log(err);
      toast.error("Something went wrong");
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filterTasks = tasks.filter((task) => {
    return task.pilot_name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
  };

  const handleReadMore = (task) => {
    setSelectedTask(task);
  };

  const closePopup = () => {
    setSelectedTask(null);
  };

  return (
    <div className="bg-dashboard font-para">
      <Header />
      <div className="flex">
        <div className="h-screen">
          <Sidebar />
        </div>
        <div className="w-full">
          <div className="p-10">
            <div className="flex justify-between items-center mb-4">
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search by field type..."
                className="border p-2 rounded-lg w-1/2"
              />
              <Link to="/addTask">
                <button className="bg-light-green p-2 rounded-xl font-button text-white text-lg transform transition-transform duration-200 hover:scale-105 hover:cursor-pointer">
                  Add Task +
                </button>
              </Link>
            </div>
            <div className="py-4">
              {filterTasks.length > 0 ? (
                <table className="min-w-full text-left glass3">
                  <thead className="text-lg text-white bg-slate-900">
                    <tr>
                      <th className="py-2 px-4 border-b">Task Id</th>
                      <th className="py-2 px-4 border-b">Service</th>
                      <th className="py-2 px-4 border-b">Pilot Name</th>
                      <th className="py-2 px-4 border-b">Customer Name</th>
                      <th className="py-2 px-4 border-b">Status</th>
                      <th className="py-2 px-4 border-b">Action</th>
                    </tr>
                  </thead>
                  <tbody className="font-para1 text-md">
                    {filterTasks.map((task) => (
                      <tr key={task.service_id}>
                        <td className="py-4 px-4 border-b">{task.service_id}</td>
                        <td className="py-4 px-4 border-b">{task.service}</td>
                        <td className="py-4 px-4 border-b">{task.pilot_name}</td>
                        <td className="py-4 px-4 border-b">{task.name}</td>
                        <td className="py-4 px-4 border-b">{task.status}</td>
                        <td>
                          <Link to={`/task/update/${task.service_id}`}>
                            <button className="px-4 transform transition-transform duration-200 hover:scale-105 hover:cursor-pointer"
                            id={`edit${task.service_id}`}>
                            <img src={edit} alt="" className="h-8 w-8" />
                            <ReactTooltip anchorId={`edit${task.service_id}`} place="bottom" effect="solid" content="Edit" variant="info"/>
                            </button>
                          </Link>
                          <button
                            className=" transform transition-transform duration-200 hover:scale-105 hover:cursor-pointer"
                            onClick={() => handleDelete(task.service_id)}
                            id={`delete_${task.service_id}`} 
                          >
                            <img src={delte} alt="" className="h-8 w-8" />
                            <ReactTooltip anchorId={`delete_${task.service_id}`} place="bottom" effect="solid" content="Delete" variant="error" />
                          </button>
                          <button
                            className="p-2 mx-2 transform transition-transform duration-200 hover:scale-105 hover:cursor-pointer"
                            onClick={() => handleReadMore(task)}
                            id={`read_${task.service_id}`}
                          >
                            <img src={read} alt="" className="h-10 w-10" />
                            <ReactTooltip anchorId={`read_${task.service_id}`} place="bottom" effect="solid" content="Read more" variant="info"/>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>No tasks available</p>
              )}
            </div>
          </div>
        </div>
      </div>
      {selectedTask && (
        <div className="fixed inset-0 flex items-center justify-center glass3">
          <div className="bg-white p-6 rounded-xl border-4 border-slate-500 shadow-lg w-1/4 flex">
            <div className="flex-1">
              <h2 className="text-3xl font-extrabold text-center mb-4">Task Details</h2>
              <p><strong className="text-left text-[18px]">Task Id:</strong> {selectedTask.service_id}</p>
              <p><strong className="text-left">Field Type:</strong> {selectedTask.field_type}</p>
              <p><strong className="text-left">Service:</strong> {selectedTask.service}</p>
              <p><strong className="text-left">Pilot Id:</strong> {selectedTask.assigned_to_pilot_id}</p>
              <p><strong className="text-left">Pilot Name:</strong> {selectedTask.pilot_name}</p>
              <p><strong className="text-left">Request Id:</strong> {selectedTask.contact_request_id}</p>
              <p><strong className="text-left">Customer Name:</strong> {selectedTask.name}</p>
              <p><strong className="text-left">Status:</strong> {selectedTask.status}</p>
              <p><strong className="text-left">Assigned Date:</strong> {formatDate(selectedTask.assigned_date)}</p>
              <button
                className="mt-4 bg-red-600 p-2 rounded-xl font-button text-white text-lg transform transition-transform duration-200 hover:scale-105 hover:cursor-pointer"
                onClick={closePopup}
              >
                Close
              </button>
            </div>
            
          </div>
        </div>
      )}
      <ToastContainer />
    </div>
  );
}

export default Tasks;
