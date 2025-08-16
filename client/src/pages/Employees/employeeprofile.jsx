import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { HandlePostEmployees, HandleGetEmployees, fetchEmployeeProfile } from "../../redux/Thunks/EmployeeThunk.js"

// Assuming you have a logout thunk or action.
// You'll need to import it here. For this example, let's call it 'logoutUser'.
import { logoutUser } from '../../redux/Thunks/AuthThunk.js'; // Adjust the path as needed

export const EmployeeProfile = () => {
  const dispatch = useDispatch();
  const { employeeUser, isLoading, error } = useSelector((state) => state.employeeProfile);

  useEffect(() => {
    // Fetch the employee's profile data on component mount
    dispatch(fetchEmployeeProfile());
  }, [dispatch]);

  const handleLogout = () => {
    // Dispatch the logout action
    dispatch(logoutUser());
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
          <h2 className="text-primary mb-0">My Employee Profile</h2>
          <button className="btn btn-danger" onClick={handleLogout}>
            Logout
          </button>
        </div>
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
    </div>
  );
};