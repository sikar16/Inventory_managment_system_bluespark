import { Box } from "@mui/material";

import PurchaseOrderListTable from "../logesticsSuperviser/PurchaseOrderTable";
import { useGetAllPurchasedOrderQuery } from "../../services/purchasedOrder_service";
import Loader from "../../component/Loading";

const PurchaseList = () => {
  const {
    data: purchasedOrder,
    isLoading,
    isError,
    error,
    isFetching,
    isSuccess,
    isUninitialized,
  } = useGetAllPurchasedOrderQuery();
  console.log(purchasedOrder);
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
        <p className="text-2xl font-semibold mb-3">Purchase Order</p>

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
            ></Box>
          </Box>
          <PurchaseOrderListTable purchaseOrderList={purchasedOrder} />
        </div>
      </>
    );
};

export default PurchaseList;
