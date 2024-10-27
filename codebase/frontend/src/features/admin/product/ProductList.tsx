import { Box, Dialog } from "@mui/material";
import RectangularButton from "../../../component/ui/RectangularButton";

import { useState } from "react";

import { useGetAllProductsQuery } from "../../../services/product_service";
import AddProduct from "./form/AddProduct";
import ProductListTable from "./ProductTable";
import Loader from "../../../component/Loading";

const ProductList = () => {
  const {
    data: products,
    isLoading,
    isError,
    error,
    isFetching,
    isSuccess,
    isUninitialized,
  } = useGetAllProductsQuery();
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
        <p className="text-2xl font-semibold mb-3">Product</p>

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
                <p className="px-2">Add Product</p>
              </RectangularButton>
            </Box>
          </Box>
          <ProductListTable productList={products} />
          <Dialog open={open} onClose={handleClickClose}>
            <div className="m-4 p-4">
              <AddProduct handleCloseDialog={handleClickClose} />
            </div>
          </Dialog>
        </div>
      </>
    );
};

export default ProductList;
