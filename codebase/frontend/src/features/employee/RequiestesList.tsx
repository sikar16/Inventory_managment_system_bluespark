import { Link } from "react-router-dom";
import { useGetAllMyMaterialReqQuery } from "../../services/materialReq_service";
import MaterialRequestListTable from "./MaterialRequestTable";
import { useState } from "react";
import Loader from "../../component/Loading";

export default function RequestsList() {
  // Fetching data using the hook
  const {
    data: materialReq,
    isLoading,
    isError,
    error,
    isSuccess,
    isUninitialized,
  } = useGetAllMyMaterialReqQuery();
  const [selectedStatus, setSelectedStatus] = useState("REQUESTED");

  // Function to categorize statuses
  const getStatusCategory = (status: string) => {
    if (
      [
        "HEPARTMENT_APPROVED",
        "PURCHASE_REQUESTED",
        "PURCHASE_ORDERED",
      ].includes(status)
    ) {
      return "PENDING";
    } else if (["DELIVERD_STATE", "AVALILABLE_INSTOKE"].includes(status)) {
      return "AVAILABLE";
    } else if (status === "HEPARTMENT_REJECT") {
      return "REJECTED";
    } else {
      return "REQUESTED"; // Default category
    }
  };

  // Filter materialReq list based on the selected status
  const filteredMaterialReq = materialReq?.filter((req) => {
    if (selectedStatus === "ALL") return true;
    return getStatusCategory(req.status) === selectedStatus;
  });
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
          <p className="text-[#002a47] text-4xl font-medium">Requests</p>
          <Link to="/employee/create-requests">
            <button className="bg-[#002A47] px-3 py-1 text-white rounded-md">
              Create request
            </button>
          </Link>
        </div>

        <div className="flex gap-8 text-gray-400 mt-8 mb-1">
          <button
            className={`hover:underline hover:text-black ${selectedStatus === "ALL" ? "underline text-black" : ""
              }`}
            onClick={() => setSelectedStatus("ALL")}
          >
            All requests
          </button>
          <button
            className={`hover:underline hover:text-black ${selectedStatus === "REQUESTED" ? "underline text-black" : ""
              }`}
            onClick={() => setSelectedStatus("REQUESTED")}
          >
            Requested
          </button>
          <button
            className={`hover:underline hover:text-black ${selectedStatus === "PENDING" ? "underline text-black" : ""
              }`}
            onClick={() => setSelectedStatus("PENDING")}
          >
            Pending
          </button>
          <button
            className={`hover:underline hover:text-black ${selectedStatus === "REJECTED" ? "underline text-black" : ""
              }`}
            onClick={() => setSelectedStatus("REJECTED")}
          >
            Rejected
          </button>
          <button
            className={`hover:underline hover:text-black ${selectedStatus === "AVAILABLE" ? "underline text-black" : ""
              }`}
            onClick={() => setSelectedStatus("AVAILABLE")}
          >
            Available
          </button>
        </div>

        <hr className="w-full text-black bg-black" />

        <MaterialRequestListTable materialRequestList={filteredMaterialReq} />
      </div>
    );
}
