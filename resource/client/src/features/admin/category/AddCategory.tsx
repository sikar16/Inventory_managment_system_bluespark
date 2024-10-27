import { useAddNewProductCategoryMutation } from "../../../services/productCategorySerivce";
import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import Button from "@mui/material/Button";

interface AddCategoryProps {
  handleCloseDialog: () => void; // Change to a function type
}

const AddCategory: React.FC<AddCategoryProps> = ({ handleCloseDialog }) => {
  const [customCategory, setCustomCategory] = useState("");
  const [addCategory, { isError, isSuccess, isLoading, error }] =
    useAddNewProductCategoryMutation();

  const handleCustomCategoryChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> // Change to ChangeEvent
  ) => {
    setCustomCategory(event.target.value); // Use event.target.value directly
  };

  const handleAddCategory = async () => {
    const formdata = {
      name: customCategory,
    };
    console.log(formdata);
    await addCategory(formdata);
  };

  if (isSuccess) handleCloseDialog(); // Call the function

  const handleDiscard = () => {
    handleCloseDialog();
  };

  return (
    <div className="mx-10 mb-10 w-[400px]">
      <form className="space-y-2">
        <InputLabel id="category-label">Category</InputLabel>
        {isError && <p className="text-red-500">{error.toString()}</p>}
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
              type="button"
              disabled={isLoading}
              className="bg-[#002a47] py-1 px-3 text-white rounded-md"
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

export default AddCategory;
