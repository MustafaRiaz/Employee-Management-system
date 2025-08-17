import React, { useEffect, useState } from "react";

export const HRLeaveRequests = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // Fetch all leaves
  const fetchLeaves = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/api/v1/leave/all", {
        method: "GET",
        credentials: "include", // 🔥 send HRtoken cookie
      });

      const data = await res.json();

      if (res.ok) {
        setLeaves(data.leaves || []);
        setError("");
      } else {
        setError(data.message || "Failed to fetch leave requests");
      }
    } catch (err) {
      setError("Error fetching leave requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  // Accept/Reject leave
  const handleUpdateLeave = async (leaveID, status) => {
  try {
    const res = await fetch("http://localhost:5000/api/v1/leave/HR-update-leave", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include", // 🔥 send HRtoken cookie
      body: JSON.stringify({ leaveID, status }), // ✅ Only two fields
    });

    const data = await res.json();

    if (res.ok) {
      setMessage(`Leave ${status} successfully`);
      fetchLeaves(); // refresh
    } else {
      setError(data.message || "Failed to update leave");
    }
  } catch (err) {
    setError("Error updating leave");
  }
};

  if (loading) return <div className="text-center mt-5">Loading leave requests...</div>;

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-primary">Employee Leave Requests</h2>

      {error && <div className="alert alert-danger">{error}</div>}
      {message && <div className="alert alert-success">{message}</div>}

      <div className="table-responsive">
        <table className="table table-bordered table-striped">
          <thead>
            <tr>
              <th>Employee</th>
              <th>Title</th>
              <th>Reason</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Status</th>
              <th>Applied On</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {leaves.length > 0 ? (
              leaves.map((leave) => (
                <tr key={leave._id}>
                  <td>{leave.employee?.firstname} {leave.employee?.lastname}</td>
                  <td>{leave.title}</td>
                  <td>{leave.reason}</td>
                  <td>{new Date(leave.startdate).toLocaleDateString()}</td>
                  <td>{new Date(leave.enddate).toLocaleDateString()}</td>
                  <td>
                    <span
                      className={`badge ${
                        leave.status === "Pending"
                          ? "bg-warning"
                          : leave.status === "Approved"
                          ? "bg-success"
                          : "bg-danger"
                      }`}
                    >
                      {leave.status}
                    </span>
                  </td>
                  <td>{new Date(leave.createdAt).toLocaleString()}</td>
                  <td>
                    {leave.status === "Pending" && (
                      <>
                        <button
                          className="btn btn-success btn-sm me-2"
                          onClick={() => handleUpdateLeave(leave._id, "Approved")}
                        >
                          Accept
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleUpdateLeave(leave._id, "Rejected")}
                        >
                          Reject
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center">
                  No leave requests found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
