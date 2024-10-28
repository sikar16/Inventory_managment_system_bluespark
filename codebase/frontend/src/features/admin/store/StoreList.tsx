import { Box, Dialog } from "@mui/material";
import RectangularButton from "../../../component/ui/RectangularButton";

import { useState } from "react";
import { useGetAllStoresQuery } from "../../../services/store_service";
import AddStore from "./form/AddStore";
import StoreListTable from "./StoreTable";
import Loader from "../../../component/Loading";

const StoreList = () => {
  const {
    data: stores,
    isLoading,
    isError,
    error,
    isSuccess,
    isUninitialized,
  } = useGetAllStoresQuery();
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



  if (isUninitialized) {
    return <Loader />;
  }

  if (isSuccess)
    return (
      <>
        <p className="text-2xl font-semibold mb-3">Store</p>
        <div>
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
                <p className="px-2">Add Store</p>
              </RectangularButton>
            </Box>
          </Box>
          <StoreListTable stores={stores} />
          <Dialog open={open} onClose={handleClickClose}>
            <AddStore handleCloseDialog={handleClickClose} />
          </Dialog>
        </div>
      </>
    );
};

export default StoreList;
