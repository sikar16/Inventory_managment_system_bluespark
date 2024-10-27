import { Box, Dialog } from "@mui/material";
import RectangularButton from "../../../component/ui/RectangularButton";
import { useGetAllDepartmentQuery } from "../../../services/department_service";
import DepartmentListTable from "./Department_table";
import { useState } from "react";
import AddDepartment from "./from/AddDepartment";
import Loader from "../../../component/Loading";

const Department_list = () => {
  const {
    data: departments,
    isLoading,
    isError,
    error,
    isFetching,
    isSuccess,
    isUninitialized,
  } = useGetAllDepartmentQuery();
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClickClose = () => {
    setOpen(false);
  };
  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    return <div>{error.toString()}</div>;
  }

  if (isFetching) {
    return <Loader />;
  }

  if (isUninitialized) {
    return <Loader />;
  }

  if (isSuccess)
    return (
      <>
        <p className="text-2xl font-semibold mb-3">Department</p>
        <div className="">
          <Box sx={{ position: "relative" }}>
            <Box
              sx={{
                position: "absolute",
                top: 1,
                right: 1,
                margin: 0,
                padding: 2,
              }}
            >
              <RectangularButton type="primary" onClick={handleClickOpen}>
                <p className="px-5">Add Department</p>
              </RectangularButton>
            </Box>
          </Box>
          <DepartmentListTable departmentList={departments} />
          <Dialog open={open} onClose={handleClickClose}>
            <AddDepartment handleClickClose={handleClickClose} />
          </Dialog>
        </div>
      </>
    );
};

export default Department_list;
