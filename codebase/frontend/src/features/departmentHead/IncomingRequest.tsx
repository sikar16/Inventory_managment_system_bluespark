import { useState } from "react";
import MyRequestsList from "./MyRequestList";
import InComingRequestsList from "./IncomingRequestList";

export default function IncomingRequest() {
  const [selectedTab, setSelectedTab] = useState("myRequests"); // Set default tab

  return (
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
            selectedTab === "incomingRequests" ? "text-black" : "text-gray-400"
          }`}
          onClick={() => setSelectedTab("incomingRequests")}
        >
          Incoming requests
        </button>
      </div>

      <hr className="w-full text-black bg-black" />

      {/* Conditionally render the component based on selectedTab */}
      {selectedTab === "myRequests" ? (
        <MyRequestsList />
      ) : (
        <InComingRequestsList />
      )}
    </div>
  );
}
