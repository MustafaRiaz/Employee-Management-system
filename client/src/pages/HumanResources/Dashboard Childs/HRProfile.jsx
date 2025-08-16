import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchHRProfile } from "../../../redux/Thunks/HRThunk.js";; // Adjust the path

const HRProfile = () => {
  const dispatch = useDispatch();
  const { hrUser, isLoading, error } = useSelector((state) => state.hrProfile);

  useEffect(() => {
    // Fetch the HR user's profile data on component mount
    dispatch(fetchHRProfile());
  }, [dispatch]);

  if (isLoading) {
    return <div className="text-center mt-5">Loading profile...</div>;
  }

  if (error) {
    return <div className="alert alert-danger text-center mt-5">Error: {error.message || 'Failed to fetch HR profile'}</div>;
  }

  if (!hrUser) {
    return <div className="text-center mt-5">No HR profile data available.</div>;
  }

  return (
    <div className="container mt-5">
      <div className="card shadow-lg p-4">
        <h2 className="text-primary mb-4">My HR Profile</h2>
        <div className="row">
          <div className="col-md-6">
            <p><strong>First Name:</strong> {hrUser.firstname}</p>
            <p><strong>Last Name:</strong> {hrUser.lastname}</p>
            <p><strong>Email:</strong> {hrUser.email}</p>
            <p><strong>Contact Number:</strong> {hrUser.contactnumber}</p>
            <p><strong>Role:</strong> {hrUser.role}</p>
          </div>
          <div className="col-md-6">
            <p><strong>Department:</strong> {hrUser.department?.name || 'N/A'}</p>
            <p><strong>Last Login:</strong> {hrUser.lastlogin ? new Date(hrUser.lastlogin).toLocaleString() : 'N/A'}</p>
            <p><strong>Account Verified:</strong> {hrUser.isverified ? 'Yes' : 'No'}</p>
            <p><strong>Organization ID:</strong> {hrUser.organizationID}</p>
            <p><strong>HR User ID:</strong> {hrUser._id}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HRProfile;