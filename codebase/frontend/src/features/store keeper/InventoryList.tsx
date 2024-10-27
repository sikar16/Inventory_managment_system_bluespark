import { Box, Dialog } from "@mui/material";
import Loader from "../../component/Loading";
import RectangularButton from "../../component/ui/RectangularButton";
import { useGetAllStoresInventoryQuery } from "../../services/store_inventory_service";
import { useState } from "react";
import InventoryListTable from "./InventoryTable";
import In_And_Out_Form from "./form/In_and_Out_form";

const CategoryList = () => {
  const {
    data: productCategory,
    isLoading,
    isError,
    error,
    isFetching,
    isSuccess,
    isUninitialized,
  } = useGetAllStoresInventoryQuery();
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
        <p className="text-2xl font-semibold mb-3">Inventory</p>

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
                <p className="px-3">inventory</p>
              </RectangularButton>
            </Box>
          </Box>
          <InventoryListTable inventoryList={productCategory} />
          <Dialog open={open} onClose={handleClickClose}>
            <In_And_Out_Form handleCloseDialog={handleClickClose} />
          </Dialog>
        </div>
      </>
    );
};

export default CategoryList;
