import { useEffect, useState } from "react";
import { useToast } from "../../context/ToastContext";
import { PurchasedRequest_type } from "../../_types/purchasedReq_type";
import {
  useApprovePurchasedReqGMMutation,
  useApprovePurchasedReqMutation,
} from "../../services/purchasedReq_service";
import { useAuth } from "../../context/AuthContext";

interface ApproveReqProps {
  purchasedReq: PurchasedRequest_type | undefined;
  handleCloseDialog: () => void;
}

const ApprovePurchasedReqF: React.FC<ApproveReqProps> = ({
  purchasedReq,
  handleCloseDialog,
}) => {
  const { isFinance, isGM } = useAuth();

  const { setToastData } = useToast();
  const [isApproved, setIsApproved] = useState<boolean | undefined>(
    isFinance
      ? purchasedReq?.isApproviedByFinance
      : isGM
      ? purchasedReq?.isApproviedByGM
      : false
  );

  const [approveRequestFinance, { isError, isSuccess, isLoading, error }] =
    useApprovePurchasedReqMutation();
  const [approveRequestGM] = useApprovePurchasedReqGMMutation();
  const handleApprove = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (purchasedReq?.id) {
      try {
        if (isFinance) {
          await approveRequestFinance({
            body: {
              isApproviedByFinance: !isApproved,
            },
            param: purchasedReq.id,
          });
          setIsApproved(!isApproved);
        } else if (isGM) {
          await approveRequestGM({
            body: {
              isApproviedByGM: !isApproved,
            },
            param: purchasedReq.id,
          });
          setIsApproved(!isApproved);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    if (isSuccess) {
      setToastData({ message: "Request Approved Successfully", success: true });
      handleCloseDialog();
    }
    if (isError) {
      setToastData({
        message: `Error: ${error || "Something went wrong"}`,
        success: false,
      });
      console.log(error);
    }
  }, [isSuccess, isError, setToastData, handleCloseDialog, error]);

  return (
    <div>
      {/* Close icon to close the modal */}
      <div className=" cursor-pointer" onClick={handleCloseDialog}>
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M6 18L18 6M6 6l12 12"
          ></path>
        </svg>
      </div>
      <div className="w-[200px]">
        {isApproved ? (
          <label
            htmlFor="isApproved"
            className="block text-sm font-medium text-red-500"
          >
            Reject Request
          </label>
        ) : (
          <label
            htmlFor="isApproved"
            className="block text-sm font-medium text-green-800"
          >
            Approve Request
          </label>
        )}
      </div>

      <div className="flex justify-center mt-2">
        {isLoading ? (
          <div>Approving...</div>
        ) : (
          <button
            type="button"
            onClick={handleApprove}
            className={`${
              isApproved ? "bg-red-500" : "bg-green-800"
            } text-white px-6 py-2 rounded-md`}
            disabled={isLoading}
          >
            {isApproved ? "Reject" : "Approve"}
          </button>
        )}
      </div>
    </div>
  );
};

export default ApprovePurchasedReqF;
