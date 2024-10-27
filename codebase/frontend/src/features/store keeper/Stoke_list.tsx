import { Dialog } from "@mui/material";
import Loader from "../../component/Loading";
import { useGetAllStoresInventoryStokeQuery } from "../../services/store_inventory_service";
import { useState } from "react";
import In_And_Out_Form from "./form/In_and_Out_form";
import StokeListTable from "./Stoke_table";

const StokeList = () => {
  const {
    data: productCategory,
    isLoading,
    isError,
    error,
    isFetching,
    isSuccess,
    isUninitialized,
  } = useGetAllStoresInventoryStokeQuery();
  const [open, setOpen] = useState(false);

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
          <StokeListTable stokeList={productCategory} />
          <Dialog open={open} onClose={handleClickClose}>
            <In_And_Out_Form handleCloseDialog={handleClickClose} />
          </Dialog>
        </div>
      </>
    );
};

export default StokeList;
