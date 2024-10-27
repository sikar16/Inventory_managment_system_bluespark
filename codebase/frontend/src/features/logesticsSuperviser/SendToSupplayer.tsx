import { useState } from "react";
import Select, { MultiValue } from "react-select";
import { useGetAllSupplierQuery } from "../../services/supplier_service";
import { useForm } from "react-hook-form";
import { useSendPurchaseOrderMutation } from "../../services/purchasedOrder_service";
import { PurchasedOrderType } from "../../_types/purchasedOrder_type";
import { useToast } from "../../context/ToastContext";

interface SendToSupplierProps {
  handleCloseDialog: () => void;
  selectedRowData: PurchasedOrderType | null;
}

const SendToSupplier = ({
  handleCloseDialog,
  selectedRowData,
}: SendToSupplierProps) => {
  const { setToastData } = useToast();
  const { data: suppliers } = useGetAllSupplierQuery();
  const selectOptions: { value: number; label: string }[] =
    suppliers === undefined
      ? []
      : suppliers.map((option) => ({
          value: option.id,
          label: option.fullName,
        }));

  const [selectedOptions, setSelectedOptions] = useState<
    MultiValue<{ value: number; label: string }>
  >([]);

  const { handleSubmit } = useForm();

  const [addSupplier, { isLoading }] = useSendPurchaseOrderMutation();

  const handleChange = (
    selected: MultiValue<{ value: number; label: string }>
  ) => {
    setSelectedOptions(selected);
  };

  const onSubmit = async () => {
    if (selectedOptions.length === 0) {
      console.error("Please select at least one supplier.");
      return;
    }
    if (selectedRowData) {
      try {
        const data = {
          suppliers: selectedOptions.map((i) => {
            return {
              supplierId: i.value,
            };
          }),
        };

        const res = await addSupplier({
          body: data,
          param: selectedRowData?.id,
        });
        console.log(res);
        setToastData({
          message: "Template added successfully",
          success: true,
        });
        handleCloseDialog();
      } catch (error: any) {
        setToastData({
          message: error,
          success: false,
        });
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ width: "300px" }}>
      <Select
        options={selectOptions}
        isMulti
        value={selectedOptions}
        onChange={handleChange}
        placeholder="Select suppliers..."
      />
      {selectedOptions.length === 0 && (
        <p className="text-red-500">Please select at least one supplier.</p>
      )}
      <button
        type="submit"
        disabled={isLoading}
        className="bg-[#002a47] py-1 px-3 text-white rounded-md mt-4"
      >
        {isLoading ? "Adding..." : "Send to Supplier"}
      </button>
    </form>
  );
};

export default SendToSupplier;
