import * as React from "react";
import { useGetAllMaterialReqByLsQuery } from "../../services/materialReq_service";
import IncomingMaterialRequestListTable from "../departmentHead/IncomingMaterialRequestTable";
import MyRequestsList from "../departmentHead/MyRequestList";

export default function IncomingMaterialRequest() {
  const [selectedTab, setSelectedTab] = React.useState("myRequests");

  // Fetching data using the hook

  const { data: materialReq } = useGetAllMaterialReqByLsQuery();

  return (
    <div className="pt-6">
      <div className="mx-10 pt-6">
        <div className="flex gap-8 text-gray-400 mt-8 mb-1">
          <button
            className={`hover:underline ${
              selectedTab === "myRequests" ? "text-black" : "text-gray-400"
            }`}
            onClick={() => setSelectedTab("myRequests")}
          >
            My requests
          </button>
          <button
            className={`hover:underline ${
              selectedTab === "incomingRequests"
                ? "text-black"
                : "text-gray-400"
            }`}
            onClick={() => setSelectedTab("incomingRequests")}
          >
            Incoming requests
          </button>
        </div>

        <hr className="w-full text-black bg-black" />

        {selectedTab === "myRequests" ? (
          <MyRequestsList />
        ) : (
          <IncomingMaterialRequestListTable materialRequestList={materialReq} />
        )}
      </div>
    </div>
  );
}
