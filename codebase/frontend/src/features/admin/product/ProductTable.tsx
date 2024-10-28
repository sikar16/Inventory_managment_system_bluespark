import { useMemo, useState } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
} from "material-react-table";

import {
  Box,
  Dialog,
  ListItemIcon,
  MenuItem,
  lighten,
  Autocomplete,
  TextField,
  DialogTitle,
  DialogContent,
} from "@mui/material";

import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { DeleteForever } from "@mui/icons-material";
import { useToast } from "../../../context/ToastContext";
import Warning from "../../../component/Warning";
import { ErrorResponseType } from "../../../_types/request_reponse_type";

import { ProductType } from "../../../_types/product_type";
import { useDeleteProductMutation } from "../../../services/product_service";
import UpdateProduct from "./form/UpdateProduct";

export type ProductListTableProps = {
  productList: ProductType[] | undefined;
};

const ProductListTable = ({ productList }: ProductListTableProps) => {
  const { setToastData } = useToast();
  const [selectedRowData, setSelectedRowData] = useState<ProductType | null>(
    null
  );
  const [deleteProductCategory, { isLoading, isSuccess }] =
    useDeleteProductMutation();
  const [openEdit, setOpenEdit] = useState(false);
  const [openReset] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openView, setOpenView] = useState(false);

  const handleClickOpenEdit = (row: ProductType) => {
    setSelectedRowData(row);
    setOpenEdit(true);
  };

  const handleCloseEdit = () => {
    setOpenEdit(false);
  };

  const handleClickOpenView = (row: ProductType) => {
    setSelectedRowData(row);
    setOpenView(true);
  };

  const handleCloseView = () => {
    setOpenView(false);
  };
  const handleClickOpenDelete = (row: ProductType) => {
    setSelectedRowData(row);
    setOpenDelete(true);
  };

  const handleCloseDelete = () => {
    setOpenDelete(false);
  };

  const handleDeleteDepartment = async () => {
    if (selectedRowData?.id != null) {
      try {
        await deleteProductCategory(selectedRowData.id).unwrap();
        setToastData({
          message: "Product deleted successfully",
          success: true,
        });
        handleCloseDelete();
      } catch (error: any) {
        handleCloseDelete();
        const res: ErrorResponseType = error;
        setToastData({
          message: res.data.message,
          success: false,
        });
      }
    } else {
      handleCloseDelete();
      setToastData({
        message: "Product not selected is missing",
        success: false,
      });
    }
  };

  // Get unique suggestions from the user data for Autocomplete

  const nameSuggestions =
    productList == undefined ? [] : productList.map((user) => user.name);

  const categorySuggestions =
    productList == undefined
      ? []
      : Array.from(
        new Set(productList.map((user) => user.subcategory.category.name))
      );

  const subcategorySuggestions =
    productList == undefined
      ? []
      : Array.from(new Set(productList.map((user) => user.subcategory.name)));

  const columns = useMemo<MRT_ColumnDef<ProductType>[]>(
    () => [
      {
        id: "product",
        header: "Product",
        columns: [
          {
            accessorFn: (row) => `${row.name}`,
            id: "name",
            header: "Name",
            size: 250,
            Filter: ({ column }) => (
              <Autocomplete
                options={nameSuggestions}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Filter by Name"
                    variant="outlined"
                    size="small"
                  />
                )}
                onChange={(_event, value) => column.setFilterValue(value)}
              />
            ),
          },
          {
            accessorFn: (row) => `${row.subcategory.name}`,
            id: "subcategory",
            header: "subcategory",
            size: 250,
            Filter: ({ column }) => (
              <Autocomplete
                options={subcategorySuggestions}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Filter by Name"
                    variant="outlined"
                    size="small"
                  />
                )}
                onChange={(_event, value) => column.setFilterValue(value)}
              />
            ),
          },
          {
            accessorFn: (row) => `${row.subcategory.category.name}`,
            id: "category",
            header: "category",
            size: 250,
            Filter: ({ column }) => (
              <Autocomplete
                options={categorySuggestions}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Filter by Name"
                    variant="outlined"
                    size="small"
                  />
                )}
                onChange={(_event, value) => column.setFilterValue(value)}
              />
            ),
          },

          {
            accessorFn: (row) => new Date(row.createdAt),
            id: "createdAt",
            header: "Created At",
            size: 250,
            Cell: ({ cell }) => {
              const date = cell.getValue<Date>();
              return date.toLocaleDateString("en-US"); // Format date to MM/DD/YYYY
            },
            Filter: ({ column }) => (
              <Autocomplete
                options={nameSuggestions}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Filter by Name"
                    variant="outlined"
                    size="small"
                  />
                )}
                onChange={(_event, value) => column.setFilterValue(value)}
              />
            ),
          },
        ],
      },
    ],
    [nameSuggestions]
  );

  const table = useMaterialReactTable({
    columns,
    data: productList == undefined ? [] : productList,
    enableColumnFilterModes: true,
    enableColumnOrdering: true,
    enableGrouping: true,
    enableColumnPinning: true,
    enableFacetedValues: true,
    enableRowActions: true,
    enableRowSelection: false,
    initialState: {
      pagination: {
        pageSize: 20,
        pageIndex: 0,
      },
      showGlobalFilter: true, // This should be true
      columnPinning: {
        left: ["mrt-row-expand", "mrt-row-select"],
        right: ["mrt-row-actions"],
      },
    },
    paginationDisplayMode: "pages",
    positionToolbarAlertBanner: "bottom",
    muiSearchTextFieldProps: {
      size: "small",
      variant: "outlined",
    },
    muiPaginationProps: {
      color: "secondary",
      rowsPerPageOptions: [5, 10, 20, 30],
      shape: "rounded",
      variant: "outlined",
    },
    renderRowActionMenuItems: ({ row, closeMenu }) => [
      <MenuItem
        key={`edit-${row.original.id}`}
        onClick={() => {
          handleClickOpenView(row.original);
          closeMenu();
        }}
        sx={{ m: 0 }}
      >
        <ListItemIcon>
          <PersonAddIcon />
        </ListItemIcon>
        View detail
      </MenuItem>,

      <MenuItem
        key={`edit-${row.original.id}`}
        onClick={() => {
          handleClickOpenEdit(row.original);
          closeMenu();
        }}
        sx={{ m: 0 }}
      >
        <ListItemIcon>
          <PersonAddIcon />
        </ListItemIcon>
        Edit
      </MenuItem>,

      <MenuItem
        key={`delete-${row.original.id}`}
        onClick={() => {
          handleClickOpenDelete(row.original);
          closeMenu();
        }}
        sx={{ m: 0 }}
      >
        <ListItemIcon>
          <DeleteForever />
        </ListItemIcon>
        Delete
      </MenuItem>,
    ],

    renderTopToolbar: () => (
      <Box
        sx={(theme) => ({
          backgroundColor: lighten(theme.palette.background.default, 0.05),
          display: "flex",
          gap: "0.5rem",
          p: "8px",
          justifyContent: "space-between",
        })}
      >
        <Autocomplete
          options={nameSuggestions}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Search..."
              variant="outlined"
              size="small"
              sx={{ width: "300px" }} // Adjust the width as needed
            />
          )}
          onChange={(_event, value) => {
            // Set global filter based on the selected suggestion
            table.setGlobalFilter(value);
          }}
        />
      </Box>
    ),
  });

  return (
    <Box>
      <MaterialReactTable table={table} />
      <Dialog open={openEdit}>
        <UpdateProduct
          handleCloseDialog={handleCloseEdit}
          product={selectedRowData}
        />
      </Dialog>
      <Dialog open={openReset}></Dialog>
      <Dialog open={openDelete}>
        <Warning
          handleClose={handleCloseDelete}
          handleAction={handleDeleteDepartment}
          message={`Are you sure you want to delete product  :  ${selectedRowData?.name}?`}
          isLoading={isLoading}
          isSuccess={isSuccess}
        />
      </Dialog>
      <Dialog open={openView} fullWidth maxWidth="sm">
        <DialogTitle>Product Detail</DialogTitle>
        <DialogContent>
          {selectedRowData && (
            <div className="flex flex-col gap-4 p-4">
              <div className="flex items-center">
                <p className="font-bold text-lg text-gray-700">Product:</p>
                <p className="text-lg text-gray-900 ml-2">
                  {selectedRowData.name}
                </p>
              </div>
              <div className="flex items-center">
                <p className="font-bold text-lg text-gray-700">Category:</p>
                <p className="text-lg text-gray-900 ml-2">
                  {selectedRowData.subcategory.category.name}
                </p>
              </div>
              <div className="flex items-center">
                <p className="font-bold text-lg text-gray-700">Subcategory:</p>
                <p className="text-lg text-gray-900 ml-2">
                  {selectedRowData.subcategory.name}
                </p>
              </div>
              <div className="flex items-center">
                <p className="font-bold text-lg text-gray-700">Template:</p>
                <div className="ml-2 flex flex-col">
                  {selectedRowData.templateAttributeType &&
                    selectedRowData.templateAttributeType.map(
                      (attribute, index) => (
                        <p key={index} className="text-lg text-gray-900">
                          {attribute.name}
                        </p>
                      )
                    )}
                </div>
              </div>
              <div className="items-center">
                <p className="font-bold text-lg text-gray-700">
                  Template attributes:
                </p>
                <div className="flex gap-8">
                  <div>
                    {selectedRowData.productAttributes?.length > 0 ? (
                      selectedRowData.productAttributes.map(
                        (attribute, index) => (
                          <p key={index} className="font-bold">
                            {attribute.templateAttribute?.name}
                          </p> // Ensure templateAttribute exists
                        )
                      )
                    ) : (
                      <p className="text-gray-400">
                        No product attributes available
                      </p>
                    )}
                  </div>
                  <div className="ml-2 flex flex-col">
                    {selectedRowData.productAttributes?.length > 0 ? (
                      selectedRowData.productAttributes.map(
                        (attribute, index) => (
                          <p key={index} className=" text-gray-900">
                            {attribute.value}
                          </p>
                        )
                      )
                    ) : (
                      <p className="text-gray-400">
                        No product attributes available
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          <button
            type="submit"
            className="bg-[#002a47] py-1 px-3 text-white rounded-md mt-4"
            onClick={handleCloseView}
          >
            Close
          </button>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default ProductListTable;
