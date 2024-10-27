import { Box } from "@mui/material";

import { useGetAllSupplierOfferApiQuery } from "../../services/supplierOffer_service";
import Loader from "../../component/Loading";
import SupplierOfferListTable from "./SupplierOfferListTable";

const SupplierOfferList = () => {
  const {
    data: supplierOfferList,
    isLoading,
    isError,
    error,
    isFetching,
    isSuccess,
    isUninitialized,
  } = useGetAllSupplierOfferApiQuery();

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
        <p className="text-2xl font-semibold mb-3">Supplier offer</p>

        <div>
          <Box sx={{ position: "relative" }}></Box>
          <SupplierOfferListTable supplierOfferList={supplierOfferList} />
        </div>
      </>
    );
};

export default SupplierOfferList;
