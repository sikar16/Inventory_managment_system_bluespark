import Loader from "../../component/Loading";
import { useGetAllMaterialReqByDepartmentHeadQuery } from "../../services/materialReq_service";

import IncomingMaterialRequestListTable from "./IncomingMaterialRequestTable";

export default function InComingRequestsList() {
  const {
    data: materialReq,
    isLoading,
    isError,
    error,
    isSuccess,
    isUninitialized,
  } = useGetAllMaterialReqByDepartmentHeadQuery();
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
      <div className="mx-10 pt-6">
        <div className="flex justify-between mb-3 mx-2">
          <p className="text-[#002a47] text-4xl font-medium">
            Incoming requests
          </p>
        </div>

        <hr className="w-full text-black bg-black" />
        <IncomingMaterialRequestListTable materialRequestList={materialReq} />
      </div>
    );
}
