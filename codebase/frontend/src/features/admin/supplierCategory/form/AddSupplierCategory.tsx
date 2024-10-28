import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import Button from "@mui/material/Button";
import { useAddNewSupplierCategoryMutation } from "../../../../services/supplierCategoryService";
import { useToast } from "../../../../context/ToastContext";

interface AddSupplierProps {
  handleCloseDialog: () => void;
}

const AddSupplierCategory: React.FC<AddSupplierProps> = ({
  handleCloseDialog,
}) => {
  const [customCategory, setCustomCategory] = useState("");
  const [addCategory, { isSuccess, isLoading }] = useAddNewSupplierCategoryMutation();
  const { setToastData } = useToast()


  const handleCustomCategoryChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setCustomCategory(event.target.value);
  };

  const handleAddCategory = async (event: React.FormEvent) => {
    event.preventDefault(); // Prevent the default form submission

    const formData = {
      name: customCategory,
    };

    console.log(formData);
    try {
      await addCategory({ data: formData }); // Await the mutation call
      setToastData({
        message: "Supplier category added successfully",
        success: true,
      });
    } catch (error) {
      setToastData({
        message: "Supplier category could not add",
        success: false,
      });
      console.log(error)
    }

  };

  if (isSuccess) handleCloseDialog(); // Close dialog on success

  const handleDiscard = () => {
    handleCloseDialog();
  };

  return (
    <div className="mx-10 mb-10 w-[350px]">
      <form className="space-y-2" onSubmit={handleAddCategory}>
        <InputLabel id="category-label">
          <p className="mt-3 text-xl font-bold">Supplier Category</p>
        </InputLabel>
        <TextField
          label="New Category"
          variant="outlined"
          size="small"
          className="w-full mt-2"
          value={customCategory}
          onChange={handleCustomCategoryChange}
        />

        <div className="pt-10">
          <div className="flex justify-between gap-5">
            <Button variant="outlined" color="error" onClick={handleDiscard}>
              Discard
            </Button>
            <button
              type="submit" // Set button type to submit
              className="bg-[#002a47] text-white px-2 rounded-md"
            >
              {isLoading ? "Adding" : "Add Category"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddSupplierCategory;
