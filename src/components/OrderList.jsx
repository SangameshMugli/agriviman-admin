import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import read from "../images/readmore.png";
import deleteImg from "../images/bin.png";
import { Tooltip as ReactTooltip } from "react-tooltip";
import { useNavigate } from "react-router-dom";
import { jsPDF } from "jspdf";

function OrderList() {
  const [orders, setOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const navigate = useNavigate(); // Use useNavigate for redirection

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get("http://localhost:5001/api/fetchorder", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setOrders(response.data);
    } catch (error) {
      handleApiError(error);
    }
  };

  const handleDelete = async (order_id) => {
    try {
      await axios.delete(`http://localhost:5001/api/deleteorder/${order_id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setOrders(orders.filter((order) => order.order_id !== order_id));
      toast.success("Order deleted successfully");
    } catch (err) {
      handleApiError(err);
    }
  };

  const handleStatusChange = async (order_id, newStatus) => {
    try {
      await axios.put(
        `http://localhost:5001/api/updateorder/${order_id}`,
        { status: newStatus },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.order_id === order_id ? { ...order, status: newStatus } : order
        )
      );
      toast.success("Order status updated successfully");
    } catch (err) {
      handleApiError(err);
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filterOrders = orders.filter((order) => {
    const orderIdString = order.order_id.toString();
    return orderIdString.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const handleReadMore = (order) => {
    setSelectedOrder(order);
  };

  const closePopup = () => {
    setSelectedOrder(null);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const handleApiError = (error) => {
    if (error.response?.status === 401) {
      toast.error("Session expired. Please log in again.");
      localStorage.removeItem("token");
      navigate("/login"); // Redirect to login page
    } else {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  const downloadPDF = () => {
    if (!selectedOrder) return;

    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    const text = "Order Details";
    const textWidth = doc.getTextWidth(text);
    const x = (doc.internal.pageSize.getWidth() - textWidth) / 2;
    doc.text(text, x, 20);

    const details = [
      { key: "Order Id", value: selectedOrder.order_id },
      { key: "Part Id", value: selectedOrder.part_id },
      { key: "Part Name", value: selectedOrder.part_name },
      { key: "Request Id", value: selectedOrder.request_id },
      { key: "Customer Name", value: selectedOrder.name },
      { key: "Quantity", value: selectedOrder.quantity },
      { key: "Status", value: selectedOrder.status },
      { key: "Total Price", value: `Rs ${selectedOrder.total_price}` },
      { key: "Date", value: formatDate(selectedOrder.ordered_date) },
    ];

    details.forEach((detail, index) => {
      // Set key to bold
      
      doc.setFont("helvetica", "bold");
      doc.text(`${detail.key}:`, 30, 30 + index * 10);

      // Set value to normal
      doc.setFont("helvetica", "normal");
      doc.text(detail.value.toString(), 80, 30 + index * 10); // Adjust position for value
    });

    doc.save(`order_${selectedOrder.order_id}.pdf`);
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
                placeholder="Search by order ID..."
                className="border p-2 rounded-lg w-1/2"
              />
            </div>
            <div className="py-4">
              {filterOrders.length > 0 ? (
                <table className="min-w-full text-left glass3">
                  <thead className="text-lg text-white bg-slate-900">
                    <tr>
                      <th className="py-2 px-4 border-b">Order ID</th>
                      <th className="py-2 px-4 border-b">Part Name</th>
                      <th className="py-2 px-4 border-b">Customer Name</th>
                      <th className="py-2 px-4 border-b">Quantity</th>
                      <th className="py-2 px-4 border-b">Total Price</th>
                      <th className="py-2 px-4 border-b">Status</th>
                      <th className="py-2 px-4 border-b">Action</th>
                    </tr>
                  </thead>
                  <tbody className="font-para1 text-md">
                    {filterOrders.map((order) => (
                      <tr key={order.order_id}>
                        <td className="py-3 px-4 border-b">{order.order_id}</td>
                        <td className="py-3 px-4 border-b">
                          {order.part_name}
                        </td>
                        <td className="py-3 px-4 border-b">{order.name}</td>
                        <td className="py-3 px-4 border-b">{order.quantity}</td>
                        <td className="py-3 px-4 border-b">
                          ₹{order.total_price}
                        </td>
                        <td className="py-3 px-4 border-b">
                          <select
                            value={order.status}
                            onChange={(e) =>
                              handleStatusChange(order.order_id, e.target.value)
                            }
                            className="border p-2 rounded-lg"
                          >
                            <option value="In Transit">In Transit</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>
                        <td>
                          <button
                            className="mx-4 text-lg transform transition-transform duration-200 hover:scale-105 hover:cursor-pointer"
                            onClick={() => handleDelete(order.order_id)}
                            id={`delete_${order.order_id}`}
                          >
                            <img src={deleteImg} alt="" className="h-8 w-8" />
                            <ReactTooltip
                              anchorId={`delete_${order.order_id}`}
                              place="bottom"
                              effect="solid"
                              content="Delete"
                              variant="error"
                            />
                          </button>

                          <button
                            className="transform transition-transform duration-200 hover:scale-105 hover:cursor-pointer"
                            onClick={() => handleReadMore(order)}
                            id={`read_${order.order_id}`}
                          >
                            <ReactTooltip
                              anchorId={`read_${order.order_id}`}
                              place="bottom"
                              effect="solid"
                              content="Read More"
                              variant="info"
                            />
                            <img src={read} alt="" className="h-10 w-10" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>No orders available</p>
              )}
            </div>
          </div>
        </div>
      </div>
      {selectedOrder && (
        <div className="fixed inset-0 flex items-center text-center justify-center glass3">
          <div className="bg-white p-6 rounded-xl border-4 border-slate-500 shadow-lg w-[500px] flex">
            <div className="flex-1">
              <h2 className="text-3xl font-extrabold mb-4">Order Details</h2>
              <p className="text-left text-[18px]">
                <strong>Order Id:</strong> {selectedOrder.order_id}
              </p>
              <p className="text-left text-[18px]">
                <strong>Part Id:</strong> {selectedOrder.part_id}
              </p>
              <p className="text-left text-[18px]">
                <strong>Part Name:</strong> {selectedOrder.part_name}
              </p>
              <p className="text-left text-[18px]">
                <strong>Request Id:</strong> {selectedOrder.request_id}
              </p>
              <p className="text-left text-[18px]">
                <strong>Customer Name:</strong> {selectedOrder.name}
              </p>
              <p className="text-left text-[18px]">
                <strong> Email:</strong> {selectedOrder.email}
              </p>
              <p className="text-left text-[18px]">
                <strong>Quantity:</strong> {selectedOrder.quantity}
              </p>
              <p className="text-left text-[18px]">
                <strong>Status:</strong> {selectedOrder.status}
              </p>
              <p className="text-left text-[18px]">
                <strong>Total Price:</strong> {selectedOrder.total_price}
              </p>
              <p className="text-left text-[18px]">
                <strong>Date :</strong> {formatDate(selectedOrder.ordered_date)}
              </p>
              <div className="flex justify-between">
                <button
                  className="mt-4 bg-red-600 p-2 rounded-xl  text-white text-lg transform transition-transform duration-200 hover:scale-105 hover:cursor-pointer"
                  onClick={closePopup}
                >
                  Close
                </button>

                <button
                  className="mt-4  bg-blue p-2 rounded-xl text-white text-lg transform transition-transform duration-200 hover:scale-105 hover:cursor-pointer"
                  onClick={downloadPDF}
                >
                  Download
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <ToastContainer />
    </div>
  );
}

export default OrderList;
