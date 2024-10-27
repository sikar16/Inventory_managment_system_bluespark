import { Link } from "react-router-dom";
import { useGetAllMyMaterialReqQuery } from "../../services/materialReq_service";

import MaterialRequestListTable from "../employee/MaterialRequestTable";
import Loader from "../../component/Loading";

export default function MyRequestsList() {
  // Fetching data using the hook
  const {
    data: materialReq,
    isLoading,
    isError,
    error,
    isFetching,
    isSuccess,
    isUninitialized,
  } = useGetAllMyMaterialReqQuery();
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
      <div className="mx-10 pt-6">
        <div className="flex justify-between mb-3 mx-2">
          <p className="text-[#002a47] text-4xl font-medium">My Requests</p>
          <Link to="/employee/create-requests">
            <button className="bg-[#002A47] px-3 py-1 text-white rounded-md">
              Create request
            </button>
          </Link>
        </div>

        <hr className="w-full text-black bg-black" />
        <MaterialRequestListTable materialRequestList={materialReq} />
      </div>
    );
}
