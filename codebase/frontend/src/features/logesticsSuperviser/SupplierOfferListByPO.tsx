// useGetAllSupplierOfferApiByPoQuery;
import { Box } from "@mui/material";

import { useGetAllSupplierOfferApiByPoQuery } from "../../services/supplierOffer_service";
import Loader from "../../component/Loading";
import SupplierOfferListTable from "./SupplierOfferListTable";
import { useParams } from "react-router-dom";

const SupplierOfferListByPO = () => {
  const { purchasedOrderId } = useParams<{
    purchasedOrderId: string;
  }>();
  console.log(purchasedOrderId);
  const {
    data: supplierOfferList,
    isLoading,
    isError,
    error,
    isFetching,
    isSuccess,
    isUninitialized,
  } = useGetAllSupplierOfferApiByPoQuery({
    params: {
      purchasedOrderId:
        purchasedOrderId != undefined ? parseInt(purchasedOrderId) : 1,
    },
  });

  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    return <div className="text-red-600">{error.toString()}</div>;
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
        <p className="text-2xl font-semibold mb-3">
          Supplier offer of PO {purchasedOrderId}
        </p>

        <div>
          <Box sx={{ position: "relative" }}></Box>
          <SupplierOfferListTable supplierOfferList={supplierOfferList} />
        </div>
      </>
    );
};

export default SupplierOfferListByPO;
