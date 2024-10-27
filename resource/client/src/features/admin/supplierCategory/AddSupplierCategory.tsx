import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import Button from "@mui/material/Button";
import { useAddNewsupplierCategoryMutation } from "../../../services/supplierCategoryService";

interface AddSupplierProps {
  handleCloseDialog: () => void;
}

const AddSupplierCategory: React.FC<AddSupplierProps> = ({
  handleCloseDialog,
}) => {
  const [customCategory, setCustomCategory] = useState("");
  const [addCategory, { isSuccess }] = useAddNewsupplierCategoryMutation();

  const handleCustomCategoryChange = (
    event: React.ChangeEvent<HTMLInputElement> // Change to ChangeEvent
  ) => {
    setCustomCategory(event.target.value);
  };

  const handleAddCategory = async () => {
    const formdata = {
      name: customCategory,
    };
    console.log(formdata);
    await addCategory(formdata);
  };

  if (isSuccess) handleCloseDialog();

  const handleDiscard = () => {
    handleCloseDialog();
  };

  return (
    <div className="mx-10 mb-10 w-[350px]">
      <form className="space-y-2">
        <InputLabel id="category-label">Category</InputLabel>
        <TextField
          label="New Category"
          variant="outlined"
          size="small"
          className="w-full mt-2"
          value={customCategory}
          onChange={handleCustomCategoryChange} // Correct handler
        />

        <div className="pt-10">
          <div className="flex justify-between gap-5">
            <Button variant="outlined" color="error" onClick={handleDiscard}>
              Discard
            </Button>
            <button
              type="button" // Ensure this is a button to avoid form submission
              className="bg-[#002a47] text-white px-2 rounded-md"
              onClick={handleAddCategory}
            >
              Add Category
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddSupplierCategory;
