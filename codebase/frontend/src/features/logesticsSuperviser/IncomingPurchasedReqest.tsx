import { useGetAllPurchasedReqQuery } from "../../services/purchasedReq_service";
import PurchasedRequestListTable from "./PurchasedRequestTable";

export default function IncomingPurchasedRequest() {
  // Fetching data using the hook
  const { data: purchasedReq } = useGetAllPurchasedReqQuery();

  // Handle view request details

  return (
    <div className="pt-6">
      <div className="flex gap-8 text-gray-400 mt-8 mb-1"></div>

      <hr className="w-full text-black bg-black" />

      <div className="my-4"></div>
      <PurchasedRequestListTable purchaseRequestList={purchasedReq} />
    </div>
  );
}
