import React from "react";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import Button from "@mui/material/Button";
import { useAddNewStoreInventoryMutation } from "../../../services/store_inventory_service";
import { useToast } from "../../../context/ToastContext";
import { ErrorResponseType } from "../../../_types/request_reponse_type";
import { useForm } from "react-hook-form";
import { MenuItem, Select } from "@mui/material";
import { useGetAllProductsQuery } from "../../../services/product_service";
import { useGetAllStoresQuery } from "../../../services/store_service";

interface In_And_Out_FormProps {
  handleCloseDialog: () => void;
}

enum StoreInventoryActionType {
  IN = "IN",
  OUT = "OUT",
}

type FormValues = {
  storId: number;
  productId: number;
  quantity: number;
  type: StoreInventoryActionType;
};

const In_And_Out_Form: React.FC<In_And_Out_FormProps> = ({
  handleCloseDialog,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>();
  const { setToastData } = useToast();
  const [addInventory, { isError, isLoading, error }] =
    useAddNewStoreInventoryMutation();
  const { data: products = [] } = useGetAllProductsQuery();
  const { data: stores = [] } = useGetAllStoresQuery();

  const onSubmit = async (data: FormValues) => {
    try {
      // update the data.quality to number try using parse int
      data.quantity = parseInt(data.quantity.toString());
      const res = await addInventory({ data: data }).unwrap(); // Directly pass data
      if (res.error) {
        setToastData({
          message: res.console.error,
          success: true,
        });
      }
      if (res.data) {
        setToastData({
          message: "Inventory added successfully",
          success: true,
        });
      }

      handleCloseDialog();
    } catch (err: any) {
      const res: ErrorResponseType = err;
      setToastData({
        message: res?.data?.message || "Failed to add inventory",
        success: false,
      });
    }
  };

  const handleDiscard = () => {
    reset(); // Optionally reset the form fields
    handleCloseDialog();
  };

  return (
    <div className="mx-10 mb-10 w-[400px]">
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        {/* Store Selection */}
        <InputLabel id="store-label">Store</InputLabel>
        <Select
          labelId="store-label"
          variant="outlined"
          size="small"
          className="w-full"
          {...register("storId", { required: "Store is required" })}
        >
          {stores.map((store) => (
            <MenuItem key={store.id} value={store.id}>
              {store.name}
            </MenuItem>
          ))}
        </Select>
        {errors.storId && (
          <p className="text-red-500">{errors.storId.message}</p>
        )}

        {/* Product Selection */}
        <InputLabel id="product-label">Product</InputLabel>
        <Select
          labelId="product-label"
          variant="outlined"
          size="small"
          className="w-full"
          {...register("productId", { required: "Product is required" })}
        >
          {products.map((product) => (
            <MenuItem key={product.id} value={product.id}>
              {product.name}
            </MenuItem>
          ))}
        </Select>
        {errors.productId && (
          <p className="text-red-500">{errors.productId.message}</p>
        )}

        {/* Quantity Input */}
        <TextField
          label="Quantity"
          type="number"
          variant="outlined"
          fullWidth
          size="small"
          {...register("quantity", {
            required: "Quantity is required",
            min: { value: 1, message: "Must be at least 1" },
          })}
        />
        {errors.quantity && (
          <p className="text-red-500">{errors.quantity.message}</p>
        )}

        {/* Inventory Action Type */}
        <InputLabel id="type-label">Action Type</InputLabel>
        <Select
          labelId="type-label"
          variant="outlined"
          size="small"
          className="w-full"
          {...register("type", { required: "Action type is required" })}
        >
          <MenuItem value={StoreInventoryActionType.IN}>In</MenuItem>
          <MenuItem value={StoreInventoryActionType.OUT}>Out</MenuItem>
        </Select>
        {errors.type && <p className="text-red-500">{errors.type.message}</p>}

        {/* Error message for failed requests */}
        {isError && <p className="text-red-500">{error?.toString()}</p>}

        {/* Button section */}
        <div className="pt-4 flex justify-between">
          <Button variant="outlined" color="error" onClick={handleDiscard}>
            Discard
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={isLoading}
          >
            {isLoading ? "Adding..." : "Add Inventory"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default In_And_Out_Form;
