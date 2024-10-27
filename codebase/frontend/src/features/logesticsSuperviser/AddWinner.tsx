import { Box, Button } from "@mui/material";
import React from "react";
import { useAddNewWinnerMutation } from "../../services/winner_service";
import { ErrorResponseType } from "../../_types/request_reponse_type";
import { useToast } from "../../context/ToastContext";
interface AddWinnerProps {
  handleDiscard: () => void;
  supplayerId: number | undefined;
  purchasedOrderId: number | undefined;
}

const AddWinner: React.FC<AddWinnerProps> = ({
  handleDiscard,
  supplayerId,
  purchasedOrderId,
}) => {
  const { setToastData } = useToast();
  const [addWinner, { isError, isLoading, error }] = useAddNewWinnerMutation();
  const handleAddWinner = async () => {
    if (supplayerId && purchasedOrderId) {
      try {
        const res = await addWinner({
          data: { supplayerId, purchasedOrderId },
        });
        if (res.error) {
          setToastData({
            message: res.error.toString(),
            success: false,
          });
        }
        if (res.data) {
          setToastData({
            message: "Winner Added Successfully",
            success: true,
          });
          handleDiscard;
        }
      } catch (error: any) {
        // Error handling for the failed request
        const res: ErrorResponseType = error;
        setToastData({
          message: res?.data?.message || "Failed to add category",
          success: false,
        });
      }
    }
  };

  return (
    <>
      <Box>
        <div className="pt-10">
          <div className="flex justify-between gap-5">
            {/* Discard button */}
            <Button variant="outlined" color="error" onClick={handleDiscard}>
              Discard
            </Button>

            {/* Submit button */}
            <button
              type="button" // Use button type instead of submit to manually handle submission
              disabled={isLoading}
              className="bg-[#002a47] py-1 px-3 text-white rounded-md mt-4"
              onClick={handleAddWinner}
            >
              {isLoading ? "Adding..." : "Add Category"}
            </button>
          </div>
          {isError && <p className="text-red-500">{error.toString()}</p>}
        </div>
      </Box>
    </>
  );
};

export default AddWinner;
