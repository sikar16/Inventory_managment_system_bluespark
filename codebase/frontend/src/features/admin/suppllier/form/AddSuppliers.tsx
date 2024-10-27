import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useToast } from "../../../../context/ToastContext";
import { useGetAllSupplierCategoryQuery } from "../../../../services/supplierCategoryService";
import { useAddNewSupplierMutation } from "../../../../services/supplier_service";
import { supplierCategoryType } from "../../../../_types/supplierCategory_type";
import { TextField, MenuItem, Select, InputLabel } from "@mui/material";

interface AddSuppliersProps {
  handleCloseDialog: () => void;
}

interface RegisterSupplierFormType {
  fullName: string;
  email: string;
  phone: string;
  categoryId: string;
  country: string;
  city: string;
  subCity: string;
  wereda: string;
}

const AddSuppliers: React.FC<AddSuppliersProps> = ({ handleCloseDialog }) => {
  const { setToastData } = useToast();
  const { isSuccess, data } = useGetAllSupplierCategoryQuery();
  const [addSupplier, { isLoading }] = useAddNewSupplierMutation();

  const categories: supplierCategoryType[] = isSuccess ? data : [];

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterSupplierFormType>();

  const onSubmit: SubmitHandler<RegisterSupplierFormType> = async (data) => {
    try {
      await addSupplier(data as any).unwrap();
      setToastData({
        message: "Supplier added successfully!",
        success: true,
      });
      handleCloseDialog();
    } catch (error: any) {
      console.error("Failed to add supplier:", error);
      setToastData({
        message:
          error?.data?.message || "Failed to add supplier. Please try again.",
        success: false,
      });
    }
  };

  return (
    <div className="w-full">
      {/* Close icon to close the modal */}
      <div className="w-full max-w-md px-6 shadow-md rounded-lg my-2 m-auto">
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          {" "}
          <InputLabel id="category-label">
            <p className="m-3 text-xl font-bold">Supplier </p>
          </InputLabel>
          <TextField
            label="Full Name"
            variant="outlined"
            size="small"
            className="w-full mt-2 mb-5"
            {...register("fullName", { required: "Full name is required" })}
            error={!!errors.fullName}
            helperText={errors.fullName ? errors.fullName.message : ""}
          />
          <TextField
            label="Email"
            type="email"
            variant="outlined"
            size="small"
            className="w-full mt-2"
            {...register("email", { required: "Email is required" })}
            error={!!errors.email}
            helperText={errors.email ? errors.email.message : ""}
          />
          <TextField
            label="Phone"
            type="tel"
            variant="outlined"
            size="small"
            className="w-full mt-2"
            {...register("phone", { required: "Phone number is required" })}
            error={!!errors.phone}
            helperText={errors.phone ? errors.phone.message : ""}
          />
          <p id="category-label" className="mt-2">
            Category
          </p>
          <Select
            labelId="category-label"
            variant="outlined"
            placeholder="category type"
            size="small"
            className="w-full mt-2"
            {...register("categoryId", { required: "Category is required" })}
            error={!!errors.categoryId}
          >
            {categories.map((cat) => (
              <MenuItem key={cat.id} value={cat.id}>
                {cat.name}
              </MenuItem>
            ))}
          </Select>
          {errors.categoryId && (
            <span className="text-red-500 text-sm">
              {errors.categoryId.message}
            </span>
          )}
          <TextField
            label="Country"
            variant="outlined"
            size="small"
            className="w-full mt-2"
            {...register("country", { required: "Country is required" })}
            error={!!errors.country}
            helperText={errors.country ? errors.country.message : ""}
          />
          <TextField
            label="City"
            variant="outlined"
            size="small"
            className="w-full mt-2"
            {...register("city", { required: "City is required" })}
            error={!!errors.city}
            helperText={errors.city ? errors.city.message : ""}
          />
          <TextField
            label="Sub-city"
            variant="outlined"
            size="small"
            className="w-full mt-2"
            {...register("subCity", { required: "Sub-city is required" })}
            error={!!errors.subCity}
            helperText={errors.subCity ? errors.subCity.message : ""}
          />
          <TextField
            label="Wereda"
            variant="outlined"
            size="small"
            className="w-full mt-2"
            {...register("wereda", { required: "Wereda is required" })}
            error={!!errors.wereda}
            helperText={errors.wereda ? errors.wereda.message : ""}
          />
          <button
            type="submit"
            disabled={isLoading}
            className="bg-[#002a47] py-1 px-3 text-white rounded-md mt-4"
          >
            {isLoading ? "Adding..." : "Add Supplier"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddSuppliers;
