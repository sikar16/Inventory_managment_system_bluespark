import React, { useState, useEffect, useCallback } from "react";
import LogoContainer from "../component/LogoContainer";
import { useParams } from "react-router-dom";
import { useGetSinglePurchasedOrderQuery } from "../services/purchasedOrder_service";
import { useAddNewSupplierOfferApiMutation } from "../services/supplierOffer_service";
import { SupplierOfferRequest } from "../_types/supplierOffer_type";
import { useToast } from "../context/ToastContext";

const SupplierResponse: React.FC = () => {
  const { setToastData } = useToast();
  const { purchasedOrderId, supplierId } = useParams<{
    purchasedOrderId: string;
    supplierId: string;
  }>();

  const { data: supplierOffer } = useGetSinglePurchasedOrderQuery({
    param: {
      purchasedOrderId: parseInt(purchasedOrderId || "0"),
      supplierId: parseInt(supplierId || "0"),
    },
  });
  const [sendOfferResponse, { isLoading }] =
    useAddNewSupplierOfferApiMutation();

  const [unitPrices, setUnitPrices] = useState<number[]>([]);
  const [showAttributes, setShowAttributes] = useState<boolean[]>([]);

  useEffect(() => {
    if (supplierOffer) {
      setUnitPrices(supplierOffer.items.map(() => 0));
      setShowAttributes(new Array(supplierOffer.items.length).fill(false));
    }
  }, [supplierOffer]);

  const handleUnitPriceChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
      setUnitPrices((prevPrices) => {
        const newPrices = [...prevPrices];
        newPrices[index] = Number(e.target.value);
        return newPrices;
      });
    },
    []
  );

  const toggleAttributes = useCallback((index: number) => {
    setShowAttributes((prevAttributes) => {
      const newShowAttributes = [...prevAttributes];
      newShowAttributes[index] = !newShowAttributes[index];
      return newShowAttributes;
    });
  }, []);

  const handleSubmit = async () => {
    if (!supplierOffer) return;

    if (purchasedOrderId && supplierId) {
      const items = supplierOffer.items.map((order, index) => ({
        productId: order.productId,
        quantity: +order.quantityToBePurchased,
        unitPrice: unitPrices[index],
      }));

      const totalPrice = items.reduce(
        (acc, item) => acc + item.unitPrice * item.quantity,
        0
      );

      const outputData: SupplierOfferRequest = {
        purchasedOrderId: supplierOffer.id,
        supplayerId: parseInt(supplierId),
        totalPrice: totalPrice,
        items: items,
      };
      try {
        const res = await sendOfferResponse(outputData);
        console.log();
        if (res.error) {
          setToastData({
            message: res.error.toString() || "An error occurred",
            success: false,
          });
        } else {
          console.log(res);
          setToastData({
            message: "Offer sent successfully!",
            success: true,
          });
          // redirect to home page
          window.location.href = "/";
        }
      } catch (error: any) {
        setToastData({
          message: error.message || "An error occurred",
          success: false,
        });
      }
    }
  };

  return (
    <div className="mx-auto bg-white rounded-lg shadow-lg">
      <div className="w-full bg-[#002a47] py-2 px-4 flex justify-between items-center">
        <LogoContainer />
      </div>
      <h2 className="mt-4 text-2xl font-semibold mx-4">Supplier Information</h2>
      <div className="mx-4 text-lg pt-2">
        <p>
          <strong>From: </strong>
          <span className="text-black">{supplierOffer?.user.email}</span>
        </p>
      </div>
      <h2 className="mt-4 text-2xl font-semibold mx-[2%]">Purchase Orders</h2>
      <table className="min-w-[90%] m-auto border-collapse border border-gray-300 mt-4">
        <thead>
          <tr>
            <th className="border border-gray-300 p-2">No</th>
            <th className="border border-gray-300 p-2">Categories</th>
            <th className="border border-gray-300 p-2">Product</th>
            <th className="border border-gray-300 p-2">Quantity</th>
            <th className="border border-gray-300 p-2">Unit Price</th>
            <th className="border border-gray-300 p-2">Total Price</th>
          </tr>
        </thead>
        <tbody>
          {supplierOffer?.items.map((order: any, index) => (
            <React.Fragment key={order.id}>
              <tr>
                <td className="border border-gray-300 p-2">{order.id}</td>
                <td className="border border-gray-300 p-2">
                  {order.products.subcategory.name}
                </td>
                <td className="border border-gray-300 p-2">
                  {order.products.name}
                </td>
                <td className="border border-gray-300 p-2">
                  {order.quantityToBePurchased}
                </td>
                <td className="border border-gray-300 p-2 flex gap-3">
                  <input
                    type="number"
                    value={unitPrices[index] || 0}
                    onChange={(e) => handleUnitPriceChange(e, index)}
                    className="border border-gray-400 p-1 rounded w-full"
                    aria-label={`Unit price for ${order.products}`}
                  />
                  <span>Birr</span>
                </td>
                <td className="border border-gray-300 p-2">
                  <div className="flex justify-between items-center">
                    {unitPrices[index] * order.quantityToBePurchased}
                    <button
                      onClick={() => toggleAttributes(index)}
                      className="font-semibold rounded px-4 py-2"
                      aria-label={`Toggle attributes for ${order.products}`}
                    >
                      {showAttributes[index] ? <span>-</span> : <span>+</span>}
                    </button>
                  </div>
                </td>
              </tr>
              {showAttributes[index] && (
                <tr>
                  <td colSpan={6} className="border border-gray-300 p-2">
                    <strong>Attributes:</strong>
                    {order.products.productAttributes.map((attr: any) => (
                      <p key={attr.id}>
                        <strong>{attr.templateAttributeId}:</strong>{" "}
                        {attr.value}
                      </p>
                    ))}
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
      <div className="my-10 font-bold flex justify-end me-[10%] text-xl">
        {supplierOffer && (
          <p>
            Total Price:{" "}
            {unitPrices.reduce(
              (acc, price, index) =>
                acc +
                price *
                  parseInt(
                    supplierOffer.items[
                      index
                    ]?.quantityToBePurchased.toString() || "0",
                    10
                  ),
              0
            )}
          </p>
        )}
      </div>
      <button
        onClick={handleSubmit}
        className="bg-[#002a47] text-white px-4 py-2 rounded m-4 transition"
        aria-label="Submit Purchase Orders"
      >
        {isLoading ? "Adding..." : " Submit Purchase Orders"}
      </button>
    </div>
  );
};

export default SupplierResponse;
