import { ListWrapper } from "../../../components/common/Dashboard/ListDesigns";
import { HeadingBar } from "../../../components/common/Dashboard/ListDesigns";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { HandleGetHREmployees } from "../../../redux/Thunks/HREmployeesThunk.js";
import { Loading } from "../../../components/common/loading.jsx";
import { ListItems } from "../../../components/common/Dashboard/ListDesigns";
import { ListContainer } from "../../../components/common/Dashboard/ListDesigns";
import { AddEmployeesDialogBox } from "../../../components/common/Dashboard/dialogboxes.jsx";

export const HREmployeesPage = () => {
    const dispatch = useDispatch();
    const HREmployeesState = useSelector((state) => state.HREmployeesPageReducer);
    const table_headings = ["Full Name", "Email", "Department", "Contact Number", "Modify Employee"];

    // Fetch employees on initial component mount
    // and whenever 'dispatch' changes (though dispatch is stable)
    useEffect(() => {
        dispatch(HandleGetHREmployees({ apiroute: "GETALL" }));
    }, [dispatch]);

    // This useEffect will specifically handle cases where HREmployeesState.fetchData becomes true,
    // indicating a need to refetch (e.g., after adding/editing an employee).
    // Ensure that your Redux reducer for HREmployeesPageReducer sets fetchData to true
    // when a refetch is needed and then potentially false after the fetch is complete.
    useEffect(() => {
        if (HREmployeesState.fetchData) {
            dispatch(HandleGetHREmployees({ apiroute: "GETALL" }));
            // IMPORTANT: If fetchData is a one-time trigger for a refetch,
            // you should dispatch an action here to set fetchData back to false
            // to prevent infinite loops if the reducer doesn't handle it.
            // Example: dispatch(setHREmployeesFetchDataFalse());
        }
    }, [HREmployeesState.fetchData, dispatch]);

    // Function to handle printing the report
    const handlePrintReport = async () => {
        try {
            // Make an API call to your backend endpoint for generating the PDF
            // Ensure this URL matches the new route you defined in employeeRoutes.js
            // If your API base path is /api, then the full path would be /api/employees/report-pdf
            const response = await fetch('/api/employees/report-pdf'); 

            if (!response.ok) {
                // If the response is not ok, read the error message from the backend if available
                const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
                throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.message || 'Server error'}`);
            }

            // Get the blob data (binary data of the PDF file) from the response
            const blob = await response.blob();

            // Create a temporary URL for the blob
            const url = window.URL.createObjectURL(blob);

            // Create a temporary anchor (<a>) element
            const a = document.createElement('a');
            a.href = url;
            a.download = 'employee_report.pdf'; // Suggested filename for the downloaded file
            document.body.appendChild(a); // Append the link to the document body (can be hidden)

            a.click(); // Programmatically click the link to trigger the download

            // Clean up: remove the link element and revoke the object URL
            a.remove();
            window.URL.revokeObjectURL(url);

        } catch (error) {
            console.error("Error downloading employee report:", error);
            alert(`Failed to download employee report: ${error.message}. Please try again.`);
        }
    };


    if (HREmployeesState.isLoading) {
        return (
            <Loading />
        );
    }

    return (
        <div className="employee-page-content w-full mx-auto my-10 flex flex-col gap-5 h-[94%]">
            <div className="employees-heading flex justify-between items-center md:pe-5">
                <h1 className="min-[250px]:text-xl md:text-4xl font-bold">Employees</h1>
                {/* Updated div to hold both buttons */}
                <div className="employee-actions flex gap-3 items-center"> 
                    <button
                        onClick={handlePrintReport}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-200"
                    >
                        Print Report
                    </button>
                    <AddEmployeesDialogBox />
                </div>
            </div>
            <div className="employees-data flex flex-col gap-4 md:pe-5 overflow-auto">
                <ListWrapper>
                    <HeadingBar table_layout={"grid-cols-5"} table_headings={table_headings} />
                </ListWrapper>
                <ListContainer>
                    <ListItems TargetedState={HREmployeesState} />
                </ListContainer>
            </div>
        </div>
    );
};