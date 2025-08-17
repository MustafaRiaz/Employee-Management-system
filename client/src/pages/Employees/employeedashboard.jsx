import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchEmployeeProfile } from "../../redux/Thunks/EmployeeThunk.js";

export const EmployeeDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { employeeUser, isLoading, error } = useSelector((state) => state.employeeProfile);

  // State for the leave application form
  const [leaveData, setLeaveData] = useState({
    startdate: '',
    enddate: '',
    title: '',
    reason: ''
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [leaveMessage, setLeaveMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    dispatch(fetchEmployeeProfile());
  }, [dispatch]);

  const handleLogout = async () => {
    try {
      // Ask backend to clear HttpOnly cookie
      await fetch("http://localhost:5000/api/auth/employee/logout", {
        method: "POST",
        credentials: "include", // ensures cookies are included
      });
    } catch (err) {
      console.error("Logout failed:", err);
    }

    // 🔹 Clear local/session storage
    localStorage.clear();
    sessionStorage.clear();

    // 🔹 Redirect to home/login
    window.location.href = "/";
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLeaveData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleApplyLeave = async (e) => {
    e.preventDefault();
    setLeaveMessage({ type: '', text: '' });

    if (!leaveData.startdate || !leaveData.enddate || !leaveData.title || !leaveData.reason) {
      setLeaveMessage({ type: 'danger', text: 'All fields are required.' });
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/v1/leave/create-leave", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include", // 🔥 Send EMtoken cookie
        body: JSON.stringify({
          employeeID: employeeUser._id,
          ...leaveData
        })
      });

      const data = await response.json();

      if (response.ok) {
        setLeaveMessage({ type: 'success', text: data.message });
        setIsModalOpen(false); // Close the form on success
        setLeaveData({ startdate: '', enddate: '', title: '', reason: '' }); // Reset form
      } else {
        setLeaveMessage({ type: 'danger', text: data.message || "Failed to apply for leave." });
      }
    } catch (error) {
      setLeaveMessage({ type: 'danger', text: "An error occurred. Please try again." });
    }
  };

  if (isLoading) {
    return <div className="text-center mt-5">Loading profile...</div>;
  }

  if (error) {
    return <div className="alert alert-danger text-center mt-5">Error: {error.message || 'Failed to fetch employee profile'}</div>;
  }

  if (!employeeUser) {
    return <div className="text-center mt-5">No employee profile data available.</div>;
  }

  return (
    <div className="container mt-5">
      <div className="card shadow-lg p-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="text-primary">My Employee Profile</h2>
          <div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="btn btn-success me-2"
            >
              Apply for Leave
            </button>
            <button
              onClick={handleLogout}
              className="btn btn-danger"
            >
              Logout
            </button>
          </div>
        </div>
        {leaveMessage.text && (
          <div className={`alert alert-${leaveMessage.type}`} role="alert">
            {leaveMessage.text}
          </div>
        )}
        <div className="row">
          <div className="col-md-6">
            <p><strong>First Name:</strong> {employeeUser.firstname}</p>
            <p><strong>Last Name:</strong> {employeeUser.lastname}</p>
            <p><strong>Email:</strong> {employeeUser.email}</p>
            <p><strong>Contact Number:</strong> {employeeUser.contactnumber}</p>
            <p><strong>Role:</strong> {employeeUser.role}</p>
            <p><strong>Employee ID:</strong> {employeeUser._id}</p>
          </div>
          <div className="col-md-6">
            <p><strong>Department:</strong> {employeeUser.department?.name || 'N/A'}</p>
            <p><strong>Salary:</strong> {employeeUser.salary}</p>
            <p><strong>Last Login:</strong> {employeeUser.lastlogin ? new Date(employeeUser.lastlogin).toLocaleString() : 'N/A'}</p>
            <p><strong>Account Verified:</strong> {employeeUser.isverified ? 'Yes' : 'No'}</p>
            <p><strong>Organization ID:</strong> {employeeUser.organizationID}</p>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="modal" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Apply for Leave</h5>
                <button type="button" className="btn-close" onClick={() => setIsModalOpen(false)}></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleApplyLeave}>
                  <div className="mb-3">
                    <label className="form-label">Start Date</label>
                    <input
                      type="date"
                      className="form-control"
                      name="startdate"
                      value={leaveData.startdate}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">End Date</label>
                    <input
                      type="date"
                      className="form-control"
                      name="enddate"
                      value={leaveData.enddate}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Title</label>
                    <input
                      type="text"
                      className="form-control"
                      name="title"
                      value={leaveData.title}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Reason</label>
                    <textarea
                      className="form-control"
                      name="reason"
                      value={leaveData.reason}
                      onChange={handleInputChange}
                      required
                    ></textarea>
                  </div>
                  <button type="submit" className="btn btn-primary">Submit Leave Request</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
