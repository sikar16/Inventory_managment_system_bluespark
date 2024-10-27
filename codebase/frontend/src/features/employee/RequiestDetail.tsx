import React, { useState } from "react";
import {
  useApproveReqMutation,
  useGetSingleMaterialReqQuery,
} from "../../services/materialReq_service";
import { useLocation } from "react-router-dom";
import Loader from "../../component/Loading";
import { useAuth } from "../../context/AuthContext";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { useGetAllUsersQuery } from "../../services/user_service";
import { useToast } from "../../context/ToastContext";
import { useForm } from "react-hook-form";
import { MaterialRequestItem } from "../../_types/materialReq_type";
import TableDetail from "./DetailTable";
import { useAddNewpurchasedReqMutation } from "../../services/purchasedReq_service";

const RequestDetail: React.FC = () => {
  const { setToastData } = useToast();
  const [openEdit, setOpenEdit] = useState(false);
  const location = useLocation();
  const { id } = location.state || {};
  const { isEmployee, isLS, isDH } = useAuth();

  const [expandedRow, setExpandedRow] = useState<number | null>(null);
  const [openDialog, setOpenDialog] = React.useState(false);
  const [openDialog2, setOpenDialog2] = React.useState(false);
  const [selectedProducts, setSelectedProducts] = useState<
    { product: MaterialRequestItem; quantity: number; unitPrice: number }[]
  >([]);

  interface FormValues {
    isApproviedByDH: boolean;
    logisticSuperViserId: number;
  }
  const handleToggleDetails = (no: number) => {
    setExpandedRow(expandedRow === no ? null : no);
  };

  const {
    data: materialReq,
    isError,
    error,
    isLoading,
    isSuccess,
  } = useGetSingleMaterialReqQuery(id);
  const [addPR] = useAddNewpurchasedReqMutation();
  const [approveReject] = useApproveReqMutation();
  const { data: users } = useGetAllUsersQuery();
  const { register, handleSubmit } = useForm<FormValues>();

  const handleClickOpenEdit = () => {
    setOpenEdit(true);
  };

  const handleClickCloseEdit = () => {
    setOpenEdit(false);
  };
  const rows = isSuccess
    ? materialReq.items.map((item, index) =>
        createData(
          index + 1,
          item.product.name,
          item.product.subcategory.name,
          item.product.subcategory.category.name,
          parseInt(item.quantityRequested),
          item.remark
        )
      )
    : [];

  const handleConvertToPR = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleCloseDialog2 = () => {
    setOpenDialog2(false);
  };

  const handleCheckboxChange = (productName: MaterialRequestItem) => {
    setSelectedProducts((prevSelected) => {
      const existingProduct = prevSelected.find(
        (item) => item.product.id === productName.id
      );
      if (existingProduct) {
        return prevSelected.filter(
          (item) => item.product.id !== productName.id
        );
      } else {
        return [
          ...prevSelected,
          { product: productName, quantity: 0, unitPrice: 0 },
        ];
      }
    });
  };

  const handleConfirmToPR = () => {
    setOpenDialog(false); // Close the first dialog
    setOpenDialog2(true); // Open the second dialog
  };
  const handleApproveReject = handleSubmit(async (formData) => {
    const logisticSuperViserId = formData.logisticSuperViserId;

    if (materialReq) {
      try {
        await approveReject({
          body: {
            isApproviedByDH: !materialReq.isApproviedByDH,
            logisticSuperViserId: logisticSuperViserId,
          },
          param: materialReq.id,
        });
        setToastData({
          message: "Material request approved successfully!",
          success: true,
        });
        handleClickCloseEdit();
      } catch (error: any) {
        setToastData({
          message: error,
          success: false,
        });
      }
    }
  });
  const handlePRSubmit = async () => {
    const quantities = selectedProducts.map((item) => ({
      productId: item.product.product.id,
      quantityToBePurchased: item.quantity,
      unitPrice: item.unitPrice,
    }));
    console.log(quantities);

    if (materialReq) {
      try {
        const res = await addPR({
          body: {
            materialRequestId: materialReq.id,
            items: quantities,
          },
        });
        console.log(res);
        setToastData({
          message: "Po created successfully ",
          success: true,
        });

        handleCloseDialog2();
      } catch (error: any) {
        console.error(error);
        setToastData({
          message: error,
          success: false,
        });
      }
    }
  };

  if (isError) {
    return <p> `${error.toString()}` </p>;
  }

  if (isLoading) {
    return <Loader />;
  }
  if (isSuccess) {
    return (
      <>
        <div className="bg-white text-[#002A47] dark:bg-zinc-950 dark:text-white ">
          <header className="text-2xl py-1 px-2 rounded-e-full">
            {!isEmployee && <h2>Employee Information</h2>}
          </header>
          {isDH && !isEmployee && (
            <div className="p-3 text-sm">
              <p>
                <strong>Name: </strong>
                {materialReq.employee.profile.firstName}{" "}
                {materialReq.employee.profile.lastName}{" "}
                {materialReq.employee.profile.middleName}
              </p>
              <p>
                <strong>Role:</strong>
                {materialReq.employee.role}
              </p>
              <p>
                <strong> Department:</strong>
                {materialReq.employee.department.name}
              </p>
              <p>
                {" "}
                <strong>Email:</strong>
                {materialReq.employee.email}
              </p>
              <p>
                <strong>Phone:</strong>
                {materialReq.employee.profile.phone}
              </p>
            </div>
          )}
          {isLS && !isEmployee && (
            <>
              <p>
                <strong>Role:</strong>
                {materialReq.departmentHead?.role}
              </p>
              <p>
                <strong> Department:</strong>
                {materialReq.departmentHead?.department.name}
              </p>
              <p>
                {" "}
                <strong>Email:</strong>
                {materialReq.departmentHead?.email}
              </p>
              <p>
                <strong>Phone:</strong>
                {materialReq.departmentHead?.profile.phone}
              </p>
            </>
          )}
          <h2 className=" px-2 rounded-e-full mb-5 text-2xl">
            Material Request Overview
          </h2>
          <TableDetail
            rows={rows}
            expandedRow={expandedRow}
            handleToggleDetails={handleToggleDetails}
            materialReq={materialReq}
          />

          <div>
            {isDH && (
              <button
                className={`px-4 py-2 text-white rounded-md transition duration-300 
                  
                ${
                  materialReq.isApproviedByDH
                    ? "bg-red-600 hover:bg-red-500 dark:bg-red-800 hover:dark:bg-red-700"
                    : "bg-green-600 hover:bg-green-500 dark:bg-green-800 hover:dark:bg-green-700"
                }`}
                onClick={handleClickOpenEdit}
              >
                {materialReq.isApproviedByDH ? (
                  <p>Reject by department</p>
                ) : (
                  <p>Approve by department</p>
                )}
              </button>
            )}
          </div>

          <div>
            {isLS && (
              <button
                className="text-white bg-[#002a47] text-sm px-5 py-1 rounded-md mt-[5%]"
                onClick={handleConvertToPR}
              >
                Convert to PR 33
              </button>
            )}
          </div>
        </div>
        <div>
          {/* First Dialog: Material Request */}
          <Dialog open={openDialog} onClose={handleCloseDialog}>
            <div className="flex justify-between items-center p-4 border-b">
              <DialogTitle className="text-lg font-semibold">
                Purchased Request
              </DialogTitle>
              <DialogActions>
                <svg
                  onClick={handleCloseDialog}
                  xmlns="http://www.w3.org/2000/svg"
                  width={30}
                  height={30}
                  viewBox="0 0 24 24"
                  className="cursor-pointer"
                >
                  <path
                    fill="none"
                    stroke="black"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M6.758 17.243L12.001 12m5.243-5.243L12 12m0 0L6.758 6.757M12.001 12l5.243 5.243"
                  />
                </svg>
              </DialogActions>
            </div>

            <DialogContent className="p-4">
              <div>
                <ul className="list-disc pl-5">
                  {materialReq.items.map((i, index) => (
                    <li key={index} className="flex items-center py-2">
                      <input
                        type="checkbox"
                        id={`checkbox-${index}`}
                        className="mr-2"
                        onChange={() => handleCheckboxChange(i)}
                      />
                      <label
                        htmlFor={`checkbox-${index}`}
                        className="text-gray-800"
                      >
                        {i.product.name}
                      </label>
                    </li>
                  ))}
                </ul>
                {materialReq.items.length === 0 && (
                  <p className="text-center text-gray-600">
                    No items available.
                  </p>
                )}
              </div>
            </DialogContent>

            <DialogActions className="p-4">
              <button
                onClick={handleConfirmToPR}
                className="bg-blue-600 text-white rounded-md px-4 py-2 hover:bg-blue-700 transition duration-200"
              >
                Confirm
              </button>
            </DialogActions>
          </Dialog>

          {/* Second Dialog: Add Quantity for Selected Products */}
          <Dialog open={openDialog2} onClose={handleCloseDialog2}>
            <div className="flex justify-between items-center p-4 border-b">
              <DialogTitle className="text-lg font-semibold">
                Add Quantity
              </DialogTitle>
              <DialogActions>
                <svg
                  onClick={handleCloseDialog2}
                  xmlns="http://www.w3.org/2000/svg"
                  width={30}
                  height={30}
                  viewBox="0 0 24 24"
                  className="cursor-pointer"
                >
                  <path
                    fill="none"
                    stroke="black"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M6.758 17.243L12.001 12m5.243-5.243L12 12m0 0L6.758 6.757M12.001 12l5.243 5.243"
                  />
                </svg>
              </DialogActions>
            </div>
            <DialogContent className="p-4">
              <div>
                {selectedProducts.length > 0 ? (
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-200 text-left">
                        <th className="py-2 px-3">#</th>
                        <th className="py-2 px-3">Product</th>
                        <th className="py-2 px-3">Quantity</th>
                        <th className="py-2 px-3">Unit Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedProducts.map((item, index) => (
                        <tr
                          key={item.product.id}
                          className="border-b hover:bg-gray-100"
                        >
                          <td className="py-2 px-3">{index + 1}</td>
                          <td className="py-2 px-3">
                            {item.product.product.name}
                          </td>
                          <td className="py-2 px-3">
                            <input
                              type="number"
                              className="border border-gray-300 rounded w-full px-2"
                              value={item.quantity}
                              onChange={(e) => {
                                const value = parseInt(e.target.value) || 0;
                                setSelectedProducts((prevSelected) =>
                                  prevSelected.map((p) =>
                                    p.product.id === item.product.id
                                      ? { ...p, quantity: value }
                                      : p
                                  )
                                );
                              }}
                            />
                          </td>
                          <td className="py-2 px-3">
                            <input
                              type="number"
                              className="border border-gray-300 rounded w-full px-2"
                              value={item.unitPrice}
                              onChange={(e) => {
                                const value = parseFloat(e.target.value) || 0;
                                setSelectedProducts((prevSelected) =>
                                  prevSelected.map((p) =>
                                    p.product.id === item.product.id
                                      ? { ...p, unitPrice: value }
                                      : p
                                  )
                                );
                              }}
                              placeholder="Unit Price"
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p className="text-center text-gray-600">
                    No products selected.
                  </p>
                )}
              </div>
            </DialogContent>
            {selectedProducts.length > 0 && (
              <DialogActions className="p-4">
                <button
                  onClick={handlePRSubmit}
                  className="bg-blue-600 text-white rounded-md px-4 py-2 hover:bg-blue-700 transition duration-200"
                >
                  Submit
                </button>
              </DialogActions>
            )}
          </Dialog>
        </div>
        {/* Approve form */}
        <Dialog open={openEdit}>
          <div className="m-5 p=5">
            <div className=" cursor-pointer" onClick={handleClickCloseEdit}>
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
            <div className="w-full md:w-[45%] my-5">
              <label
                htmlFor="logisticSupervisorId"
                className="block text-sm font-medium text-gray-700"
              >
                Logistic Supervisor
              </label>
              <select
                id="logisticSuperViserId"
                {...register("logisticSuperViserId", {
                  required: "logistic Supervise is required",
                })}
                className="focus:outline-none bg-slate-100 w-full py-2 rounded-md"
              >
                <option value="">Select Logistics Supervisor</option>
                {users
                  ?.filter((i) => i.role === "LOGESTIC_SUPERVISER")
                  ?.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.profile.firstName}
                    </option>
                  ))}
              </select>
              <p className="text-red-600 text-[13px] mt-1">{error}</p>
            </div>
            <div className="flex justify-center mt-2">
              {isLoading ? (
                <div>Assigning</div>
              ) : (
                <button
                  type="button"
                  onClick={handleApproveReject}
                  className="bg-[#002A47] text-white px-6 py-2 rounded-md "
                  disabled={isLoading}
                >
                  Submit
                </button>
              )}
            </div>
          </div>
        </Dialog>
      </>
    );
  }
};

export default RequestDetail;

interface Data {
  no: number;
  product: string;
  subCategory: string;
  category: string;
  quantity: number;
  remark: string;
}

function createData(
  no: number,
  product: string,
  subCategory: string,
  category: string,
  quantity: number,
  remark: string
): Data {
  return { no, product, subCategory, category, quantity, remark };
}
