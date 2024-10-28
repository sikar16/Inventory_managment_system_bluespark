import { Box, Dialog } from "@mui/material";
import RectangularButton from "../../../component/ui/RectangularButton";

import { useState } from "react";
import { useGetAllProductSubCategoryQuery } from "../../../services/productSubcategory_service";
import ProductSubCategoryListTable from "./SubCategoryTable";
import AddProductCategory from "./form/AddSubCategory";
import Loader from "../../../component/Loading";

const SubCategoryList = () => {
  const {
    data: productSubCategory,
    isLoading,
    isError,
    error,
    isSuccess,
    isUninitialized,
  } = useGetAllProductSubCategoryQuery();
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
        <p className="text-2xl font-semibold mb-3">Sub category</p>

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
                <p className="px-3">Add Sub-Category</p>
              </RectangularButton>
            </Box>
          </Box>
          <ProductSubCategoryListTable
            productCategoryList={productSubCategory}
          />
          <Dialog open={open} onClose={handleClickClose}>
            <AddProductCategory handleCloseDialog={handleClickClose} />
          </Dialog>
        </div>
      </>
    );
};

export default SubCategoryList;
