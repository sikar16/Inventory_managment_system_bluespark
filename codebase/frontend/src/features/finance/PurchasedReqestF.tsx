import Loader from "../../component/Loading";
import { useGetAllPurchasedReqQuery } from "../../services/purchasedReq_service";

import PurchasedRequestListTable from "../logesticsSuperviser/PurchasedRequestTable";

const PurchasedRequestF = () => {
  const {
    data: purchasedReq,
    isLoading,
    isError,
    error,
    isFetching,
    isSuccess,
    isUninitialized,
  } = useGetAllPurchasedReqQuery();
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
        <div>
          <PurchasedRequestListTable purchaseRequestList={purchasedReq} />
        </div>
      </>
    );
};

export default PurchasedRequestF;
