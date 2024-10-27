import { Box } from "@mui/material";

import { useGetAllPurchasedOrderQuery } from "../../services/purchasedOrder_service";
import PurchaseOrderListTable from "./PurchaseOrderTable";
const PurchaseList = () => {
  const { data: purchasedOrder } = useGetAllPurchasedOrderQuery();

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
