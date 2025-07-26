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


    if (HREmployeesState.isLoading) {
        return (
            <Loading />
        );
    }

    return (
        <div className="employee-page-content w-full mx-auto my-10 flex flex-col gap-5 h-[94%]">
            <div className="employees-heading flex justify-between items-center md:pe-5">
                <h1 className="min-[250px]:text-xl md:text-4xl font-bold">Employees</h1>
                <div className="employee-crate-button">
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