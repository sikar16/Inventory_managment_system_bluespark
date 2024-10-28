import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { useGetSinglePurchasedReqQuery } from "../../services/purchasedReq_service";
import Loader from "../../component/Loading";
import { useAuth } from "../../context/AuthContext";
import ApprovePurchasedReqF from "./ApprovePurchasedReqM";
import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import { useAddNewpurchasedOrderMutation } from "../../services/purchasedOrder_service";
import { useToast } from "../../context/ToastContext";

// Define columns for the table
interface Column {
  id: string;
  label: string;
  minWidth: number;
  align?: "left" | "right" | "center";
}

const columns: Column[] = [
  { id: "no", label: "No", minWidth: 50 },
  { id: "product", label: "Product", minWidth: 70, align: "left" },
  { id: "subCategory", label: "Sub-Category", minWidth: 70 },
  { id: "category", label: "Category", minWidth: 70 },
  { id: "quantity", label: "Quantity", minWidth: 70, align: "left" },
  { id: "remark", label: "Remark", minWidth: 70, align: "left" },
];

const PurchasedRequestDetailM: React.FC = () => {
  const [orderPo] = useAddNewpurchasedOrderMutation();
  const location = useLocation();
  const { id } = location.state || {};
  const { isGM, isLS } = useAuth();
  const { setToastData } = useToast();

  const [expandedRow, setExpandedRow] = useState<number | null>(null);
  const [openDialog, setOpenDialog] = useState(false); // Dialog state for approval
  const [openDialog2, setOpenDialog2] = useState(false); // Dialog state for approval

  const handleCloseDialog = () => setOpenDialog(false);
  const handleCloseDialog2 = () => setOpenDialog2(false);
  const handleOpenDialog2 = () => setOpenDialog2(true);
  const handleApprove = async () => {
    if (purchasedReq) {
      setOpenDialog(true);
    }
  };

  const handleToggleDetails = (no: number) => {
    setExpandedRow(expandedRow === no ? null : no);
  };

  const {
    data: purchasedReq,
    isError,
    error,
    isLoading,
  } = useGetSinglePurchasedReqQuery(id);
  const handlePoSubmit = async () => {
    if (purchasedReq) {
      const data = {
        purchasedRequestId: purchasedReq.id,
        items: purchasedReq.items.map((i) => {
          return {
            productId: i.products.id,
            quantityToBePurchased: i.purchasedRequestId,
            remark: i.remark,
          };
        }),
      };
      console.log(data);
      try {
        await orderPo({
          body: data,
        });
        setToastData({
          message: "po createdSuccessfully",
          success: true,
        });
        handleCloseDialog2();
      } catch (error: any) {
        setToastData({
          message: error,
          success: false,
        });
      }
    }
  };

  if (isError) {
    return <p>{`${error}` || "An error occurred"}</p>;
  }

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="bg-white text-[#002A47] dark:bg-zinc-950 dark:text-white">
      <h2 className="px-2 rounded-e-full mb-5 text-2xl">
        Purchase Request Overview
      </h2>

      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-[#002A47] text-white dark:bg-white dark:text-[#002A47]">
            {columns.map((column) => (
              <td
                key={column.id}
                className="p-2 font-medium"
                style={{ minWidth: column.minWidth }}
              >
                {column.label}
              </td>
            ))}
            <th className="p-2"></th>
          </tr>
        </thead>
        <tbody>
          {purchasedReq?.items.map((row, rowIndex) => (
            <React.Fragment key={row.id}>
              <tr>
                {columns.map((column) => (
                  <td
                    key={column.id}
                    className="p-2"
                    style={{ textAlign: column.align }}
                  >
                    {column.id === "no"
                      ? rowIndex + 1
                      : column.id === "product"
                        ? row.products.name
                        : column.id === "subCategory"
                          ? row.products.subcategoryId
                          : column.id === "quantity"
                            ? row.quantityToBePurchased
                            : column.id === "remark"
                              ? row.remark
                              : ""}
                  </td>
                ))}
                <td className="p-2">
                  <button onClick={() => handleToggleDetails(row.id)}>
                    {expandedRow === row.id ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width={24}
                        height={24}
                        viewBox="0 0 256 256"
                      >
                        <path
                          fill="#002A47"
                          d="M210.83 162.83a4 4 0 0 1-5.66 0L128 85.66l-77.17 77.17a4 4 0 0 1-5.66-5.66l80-80a4 4 0 0 1 5.66 0l80 80a4 4 0 0 1 0 5.66"
                        />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width={24}
                        height={24}
                        viewBox="0 0 256 256"
                      >
                        <path
                          fill="#002A47"
                          d="m210.83 98.83-80 80a4 4 0 0 1-5.66 0l-80-80a4 4 0 0 1 5.66-5.66L128 170.34l77.17-77.17a4 4 0 1 1 5.66 5.66"
                        />
                      </svg>
                    )}
                  </button>
                </td>
              </tr>

              {expandedRow === row.id && (
                <tr className="bg-white text-[#002A47] dark:bg-zinc-950 dark:text-white">
                  <td
                    colSpan={columns.length + 1}
                    className="p-4 border-t border-gray-200 shadow-lg"
                  >
                    <div className="space-y-4 w-[85%] justify-center m-auto p-5">
                      <div className="flex gap-4">
                        <p>
                          <strong>Category:</strong>{" "}
                          {row.products.subcategoryId}
                        </p>
                        <p>
                          <strong>Sub-Category:</strong> {row.products.id}
                        </p>
                        <p>
                          <strong>Product Name:</strong> {row.products.name}
                        </p>
                      </div>
                      <p>
                        <strong>Quantity:</strong> {row.quantityToBePurchased}
                      </p>

                      {row.products.productAttributes.length > 0 && (
                        <div className="grid grid-cols-2 gap-10 p-1 rounded-lg">
                          <div>
                            <p className="text-lg font-semibold">Key</p>
                            <ul className="list-disc list-inside">
                              {row.products.productAttributes.map((attr) => (
                                <li key={attr.id}>
                                  {attr.templateAttributeId}{" "}
                                  {/* or use attr.name if available */}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <p className="text-lg font-semibold">Value</p>
                            <ul className="list-disc list-inside">
                              {row.products.productAttributes.map((attr) => (
                                <li key={attr.id}>{attr.value}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>

      {isGM && (
        <div className="p-6">
          <button
            className={`px-5 py-2 text-white rounded-lg ${purchasedReq?.isApproviedByGM ? "bg-red-500" : "bg-green-400"
              }`}
            onClick={handleApprove}
          >
            {purchasedReq?.isApproviedByGM ? "Reject" : "Approve"}
          </button>
        </div>
      )}
      {isLS ?
        <div>
          <div className="flex justify-center mt-2">
            {isLoading ? (
              <div>Approving...</div>
            ) : (
              <button
                type="button"
                onClick={handleOpenDialog2}
                className={`${"bg-green-800"} text-white px-6 py-2 rounded-md`}
                disabled={isLoading}
              >
                convert to Po
              </button>
            )}
          </div>
        </div> : ""
      }
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Approve Request</DialogTitle>
        <DialogContent>
          <ApprovePurchasedReqF
            purchasedReq={purchasedReq}
            handleCloseDialog={handleCloseDialog}
          />
        </DialogContent>
      </Dialog>
      {/* second */}
      <Dialog
        open={openDialog2}
        onClose={handleCloseDialog2}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle className="text-xl font-semibold text-center text-[#002A47] dark:text-white">
          Prepare Purchase Order
        </DialogTitle>
        <DialogContent>
          <div className="p-6 text-center space-y-6 bg-[#f9fafb] dark:bg-zinc-900 rounded-lg">
            <p className="text-gray-600 dark:text-gray-300">
              The purchase order is ready to be created.
            </p>
            <button
              onClick={() => handlePoSubmit()}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded-md transition duration-200"
            >
              Place Order
            </button>
            <p
              onClick={handleCloseDialog2}
              className="text-sm cursor-pointer text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            >
              Close
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PurchasedRequestDetailM;
