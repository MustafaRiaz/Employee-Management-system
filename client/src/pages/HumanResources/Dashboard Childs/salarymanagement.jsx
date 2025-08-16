import React, { useEffect, useState, useMemo, useCallback } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { HandleGetHREmployees } from "../../../redux/Thunks/HREmployeesThunk.js";

// It's a good practice to define constants outside the component for clarity.
const API_SALARY_URL = "http://localhost:5000/api/salaries";

// Helper function to format dates
const formatDate = (dateString) => {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleDateString();
};

const SalaryManagement = () => {
  const dispatch = useDispatch();

  // Redux state for employees
  const { data: employees, isLoading: employeeLoading, error: employeeReduxError } = useSelector(
    (state) => state.HREmployeesPageReducer
  );

  // Component state for salary data and UI
  const [componentState, setComponentState] = useState({
    salaries: [],
    loadingSalaries: true,
    localError: null,
    isSubmitting: false,
    isUpdatingStatus: {},
  });

  // State for form data - CORRECTED: changed employeeId to employee
  const [formData, setFormData] = useState({
    employee: "", // Changed from employeeId to employee
    bonuses: 0,
    deductions: 0,
    currency: "PKR",
    duedate: "",
  });

  // State for user feedback messages (e.g., success/error banners)
  const [feedback, setFeedback] = useState({ message: "", type: "" });

  // Function to clear feedback messages after a delay
  const clearFeedback = useCallback(() => {
    const timer = setTimeout(() => {
      setFeedback({ message: "", type: "" });
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  // Fetch all salaries from the backend
  const fetchSalaries = useCallback(async () => {
    try {
      setComponentState((prev) => ({ ...prev, loadingSalaries: true, localError: null }));
      // 🐛 DEBUG LOG: Log the API call for fetching salaries.
      console.log(`Fetching salaries from: ${API_SALARY_URL}/all`);
      // This is where your backend is likely populating the 'employee' field.
      const res = await axios.get(`${API_SALARY_URL}/all`); 
      // 🐛 DEBUG LOG: Log the number of salaries received.
      console.log(`Successfully fetched ${res.data.length} salaries.`);
      setComponentState((prev) => ({ ...prev, salaries: res.data }));
    } catch (err) {
      // 🐛 DEBUG LOG: Log detailed error from the API response.
      console.error("Error fetching salaries:", err.response?.data || err.message || err);
      setComponentState((prev) => ({
        ...prev,
        localError: "Failed to fetch salary data. Please try again.",
      }));
    } finally {
      setComponentState((prev) => ({ ...prev, loadingSalaries: false }));
    }
  }, []);

  // Fetch employees via Redux and salaries on initial component mount
  useEffect(() => {
    // 🐛 DEBUG LOG: Log when initial fetching is starting.
    console.log("Starting initial data fetch...");
    dispatch(HandleGetHREmployees({ apiroute: "GETALL" }));
    fetchSalaries();
  }, [dispatch, fetchSalaries]);

  // Effect to clear feedback messages when they appear
  useEffect(() => {
    if (feedback.message) {
      clearFeedback();
    }
  }, [feedback.message, clearFeedback]);

  // Helper to find employee name from Redux state (memoized for performance)
  // UPDATED LOGIC: This function now handles cases where 'employee' is a populated object or a simple ID string.
  const getEmployeeName = useMemo(() => {
    return (employeeData) => {
      if (!employeeData) {
        return "N/A";
      }

      // If the backend populated the field, employeeData is an object
      if (typeof employeeData === 'object' && employeeData.firstname) {
        return `${employeeData.firstname} ${employeeData.lastname}`;
      }

      // If the backend did not populate the field, employeeData is just the ID string
      if (typeof employeeData === 'string' && employees) {
        const employee = employees.find((emp) => emp._id === employeeData);
        return employee ? `${employee.firstname} ${employee.lastname}` : "N/A";
      }

      return "N/A";
    };
  }, [employees]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    // 🐛 DEBUG LOG: Log each form input change.
    console.log(`Form input changed: ${name} -> ${value}`);
    setFormData((prev) => ({
      ...prev,
      [name]: ["bonuses", "deductions"].includes(name) ? Number(value) : value,
    }));
  };

  // Handle form submission to create a new salary record - CORRECTED: checking formData.employee
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFeedback({ message: "", type: "" });

    // 🐛 DEBUG LOG: Log the form data just before validation.
    console.log("handleSubmit triggered. Current form data:", formData);

    // CORRECTED: check formData.employee
    if (!formData.employee || !formData.duedate) {
      // 🐛 DEBUG LOG: Log if validation fails.
      console.warn("Validation failed: Employee or Due Date is missing.", { employee: formData.employee, duedate: formData.duedate });
      setFeedback({ message: "Please select an employee and a due date.", type: "error" });
      return;
    }

    // ⭐ NEW LOGIC: Check for 30-day gap
    const employeeSalaries = salaries.filter(s => s.employee._id === formData.employee);
    
    if (employeeSalaries.length > 0) {
      // Sort salaries by duedate in descending order to get the most recent one
      const sortedSalaries = employeeSalaries.sort((a, b) => new Date(b.duedate) - new Date(a.duedate));
      const lastSalary = sortedSalaries[0];
      const lastSalaryDate = new Date(lastSalary.duedate);
      const newSalaryDate = new Date(formData.duedate);

      const timeDifference = newSalaryDate.getTime() - lastSalaryDate.getTime();
      const dayDifference = timeDifference / (1000 * 3600 * 24);

      console.log("🐛 [DEBUG] Days since last salary:", dayDifference);

      if (dayDifference < 30) {
        setFeedback({ message: "A new salary can only be created after a minimum of 30 days from the last one.", type: "error" });
        setComponentState((prev) => ({ ...prev, isSubmitting: false }));
        return;
      }
    }

    setComponentState((prev) => ({ ...prev, isSubmitting: true }));

    try {
      // 🐛 DEBUG LOG: Log the data being sent to the API.
      console.log("Submitting form data to API:", formData);
      await axios.post(`${API_SALARY_URL}/create`, formData);
      // 🐛 DEBUG LOG: Log API success.
      console.log("API call successful! Salary record created.");
      setFeedback({ message: "Salary record created successfully!", type: "success" });

      // CORRECTED: reset formData.employee
      setFormData({
        employee: "", // Changed from employeeId to employee
        bonuses: 0,
        deductions: 0,
        currency: "PKR",
        duedate: "",
      });
      
      // The key fix: refetch both salaries and employees to keep data in sync
      console.log("New salary created. Refetching data...");
      await fetchSalaries();
      await dispatch(HandleGetHREmployees({ apiroute: "GETALL" }));
      console.log("Data refetched. UI should update now.");

    } catch (err) {
      // 🐛 DEBUG LOG: Log detailed error from the API response.
      console.error("Error creating salary record:", err.response?.data || err.message || err);
      setFeedback({ message: "Failed to create salary. Please check your data.", type: "error" });
    } finally {
      // 🐛 DEBUG LOG: Log the final submission status.
      console.log("Submission process finished. isSubmitting set to false.");
      setComponentState((prev) => ({ ...prev, isSubmitting: false }));
    }
  };

  const markAsPaid = async (salaryId) => {
    setFeedback({ message: "", type: "" });

    setComponentState((prev) => ({
      ...prev,
      isUpdatingStatus: { ...prev.isUpdatingStatus, [salaryId]: true },
    }));

    try {
      // 🐛 DEBUG LOG: Log the salary ID being updated.
      console.log(`Marking salary ID ${salaryId} as paid.`);
      await axios.put(`${API_SALARY_URL}/pay/${salaryId}`);
      // 🐛 DEBUG LOG: Log success.
      console.log(`Successfully updated salary ID ${salaryId}. Refetching salaries.`);
      setFeedback({ message: "Salary marked as paid!", type: "success" });
      fetchSalaries();
    } catch (err) {
      // 🐛 DEBUG LOG: Log detailed error.
      console.error(`Error marking salary ID ${salaryId} as paid:`, err.response?.data || err.message || err);
      setFeedback({ message: "Failed to update salary status.", type: "error" });
    } finally {
      setComponentState((prev) => ({
        ...prev,
        isUpdatingStatus: { ...prev.isUpdatingStatus, [salaryId]: false },
      }));
    }
  };

  const { salaries, loadingSalaries, localError, isSubmitting, isUpdatingStatus } = componentState;
  const currentError = localError || (employeeReduxError?.message || (typeof employeeReduxError === 'string' ? employeeReduxError : null));

  if (employeeLoading || loadingSalaries) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2 ms-2 text-muted">Loading data...</p>
      </div>
    );
  }

  if (currentError) {
    return (
      <div className="container py-4">
        <div className="alert alert-danger text-center" role="alert">
          <strong>Error:</strong> {currentError}
        </div>
      </div>
    );
  }
  
  return (
    <div className="container py-4">
      {/* 🐛 DEBUG SECTION: Add this to the UI to quickly see the current state */}
      {/* <div className="alert alert-info border-info" role="alert">
        <h5 className="alert-heading">🕵️ Debugging Info</h5>
        <hr />
        <p className="mb-0">
          **Form State:** <code>{JSON.stringify(formData)}</code><br/>
          **Employee Data:** <code>{employees ? `Loaded ${employees.length} employees.` : 'Loading...'}</code><br/>
          **Salaries Data:** <code>{salaries ? `Loaded ${salaries.length} salaries.` : 'Loading...'}</code><br/>
        </p>
      </div> */}
      
      <h2 className="mb-4 text-primary fw-bold">💰 Salary Management</h2>

      {feedback.message && (
        <div className={`alert alert-${feedback.type === "success" ? "success" : "danger"} alert-dismissible fade show`} role="alert">
          {feedback.message}
          <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close" onClick={() => setFeedback({ message: "", type: "" })}></button>
        </div>
      )}

      {/* Salary Creation Form */}
      <div className="card shadow-lg mb-5 border-0 rounded-3">
        <div className="card-header bg-primary text-white rounded-top-3">
          <h4 className="card-title mb-0">Add New Salary Record</h4>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-4">
                <label htmlFor="employee" className="form-label"> {/* CORRECTED: htmlFor to "employee" */}
                  Employee <span className="text-danger">*</span>
                </label>
                <select
                  id="employee" // CORRECTED: id to "employee"
                  name="employee" // CORRECTED: name to "employee"
                  className="form-select rounded-pill"
                  onChange={handleChange}
                  value={formData.employee} // CORRECTED: value to formData.employee
                  required
                >
                  <option value="" disabled>
                    -- Select Employee --
                  </option>
                  {employees?.map((emp) => (
                    <option key={emp._id} value={emp._id}>
                      {emp.firstname} {emp.lastname}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-2">
                <label htmlFor="bonuses" className="form-label">
                  Bonuses
                </label>
                <input
                  type="number"
                  id="bonuses"
                  name="bonuses"
                  className="form-control rounded-pill"
                  value={formData.bonuses}
                  onChange={handleChange}
                  min="0"
                />
              </div>
              <div className="col-md-2">
                <label htmlFor="deductions" className="form-label">
                  Deductions
                </label>
                <input
                  type="number"
                  id="deductions"
                  name="deductions"
                  className="form-control rounded-pill"
                  value={formData.deductions}
                  onChange={handleChange}
                  min="0"
                />
              </div>
              <div className="col-md-2">
                <label htmlFor="currency" className="form-label">
                  Currency
                </label>
                <input
                  type="text"
                  id="currency"
                  name="currency"
                  className="form-control rounded-pill"
                  value={formData.currency}
                  onChange={handleChange}
                  maxLength="5"
                />
              </div>
              <div className="col-md-2">
                <label htmlFor="duedate" className="form-label">
                  Due Date <span className="text-danger">*</span>
                </label>
                <input
                  type="date"
                  id="duedate"
                  name="duedate"
                  className="form-control rounded-pill"
                  value={formData.duedate}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="mt-4 text-center">
              <button
                type="submit"
                className="btn btn-primary btn-lg rounded-pill shadow-sm px-5"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Adding...
                  </>
                ) : (
                  <>
                    <i className="bi bi-plus-circle me-2"></i>Add Salary
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Salary Records Table */}
      <h4 className="mb-3 text-primary fw-bold">All Salary Records</h4>
      <div className="table-responsive shadow-lg rounded-3 overflow-hidden">
        <table className="table table-hover table-striped table-bordered mb-0">
          <thead className="table-dark">
            <tr>
              <th>Employee Name</th>
              <th>Employee ID (Value & Type)</th>
              <th>Basic Pay</th>
              <th>Bonuses</th>
              <th>Deductions</th>
              <th>Net Pay</th>
              <th>Status</th>
              <th>Due Date</th>
              <th>Payment Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {salaries.length > 0 ? (
              salaries.map((s) => {
                const netPay = s.basicpay + s.bonuses - s.deductions;
                const isPaid = s.status === "Paid";
                const isUpdating = isUpdatingStatus[s._id];

                return (
                  <tr key={s._id}>
                    <td>{getEmployeeName(s.employee)}</td>
                    <td>
                      {/* CORRECTED: We now access the _id property of the employee object */}
                      <span className="text-danger fw-bold">{s.employee?._id || 'N/A'}</span><br/>
                      <small className="text-muted fst-italic">Type: {typeof s.employee}</small>
                    </td>
                    <td>{s.basicpay}</td>
                    <td>{s.bonuses}</td>
                    <td>{s.deductions}</td>
                    <td className="fw-bold text-success">{netPay}</td>
                    <td>
                      <span className={`badge ${isPaid ? "bg-success" : "bg-warning text-dark"} px-2 py-1`}>
                        {s.status}
                      </span>
                    </td>
                    <td>{formatDate(s.duedate)}</td>
                    <td>{formatDate(s.paymentdate)}</td>
                    <td>
                      {!isPaid && (
                        <button
                          className="btn btn-success btn-sm rounded-pill px-3"
                          onClick={() => markAsPaid(s._id)}
                          disabled={isUpdating}
                          aria-label={`Mark salary for ${getEmployeeName(s.employee)} as paid`}
                        >
                          {isUpdating ? (
                            <>
                              <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                              Updating...
                            </>
                          ) : (
                            <>
                              <i className="bi bi-check-circle me-1"></i>Mark as Paid
                            </>
                          )}
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="10" className="text-center text-muted py-4">
                  No salary records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SalaryManagement;