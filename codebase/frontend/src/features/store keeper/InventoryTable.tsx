import { useMemo, useState } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
} from "material-react-table";
import { Box, Dialog, lighten, Autocomplete, TextField } from "@mui/material";
import { useToast } from "../../context/ToastContext";
import { StoreInventoryType } from "../../_types/store_inventory";
import { useDeleteStoreInventoryMutation } from "../../services/store_inventory_service";
import { ErrorResponseType } from "../../_types/request_reponse_type";
import Warning from "../../component/Warning";

export type InventoryListTableProps = {
  inventoryList: StoreInventoryType[] | undefined;
};

const InventoryListTable = ({ inventoryList }: InventoryListTableProps) => {
  const { setToastData } = useToast();
  const [selectedRowData] = useState<StoreInventoryType | null>(null);
  const [deleteInventory, { isLoading, isSuccess }] =
    useDeleteStoreInventoryMutation();
  const [openEdit] = useState(false);
  const [openReset] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  const handleCloseDelete = () => {
    setOpenDelete(false);
  };

  const handleDeleteInventory = async () => {
    if (selectedRowData?.id != null) {
      try {
        await deleteInventory(selectedRowData.id).unwrap();
        setToastData({
          message: "productCategory deleted successfully",
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
        message: "productCategory not selected is missing",
        success: false,
      });
    }
  };

  // Get unique suggestions from the user data for Autocomplete

  const nameSuggestions =
    inventoryList == undefined ? [] : inventoryList.map((user) => user.id);

  const columns = useMemo<MRT_ColumnDef<StoreInventoryType>[]>(
    () => [
      {
        id: "inventory",
        header: "Inventory",
        columns: [
          {
            accessorFn: (row) => `${row.type}`,
            id: "operation",
            header: "Operation",
            size: 250,
            Cell: ({ cell }) => {
              const operationType = cell.getValue<string>();
              let backgroundColor;

              // Determine background color based on the operation type
              switch (operationType) {
                case "IN":
                  backgroundColor = "#4caf50"; // Green for IN
                  break;
                case "OUT":
                  backgroundColor = "#f44336"; // Red for OUT
                  break;
                case "TRANSFERE":
                  backgroundColor = "#ffc107"; // Yellow for TRANSFERE
                  break;
                default:
                  backgroundColor = "#9e9e9e"; // Grey for unknown types
              }

              return (
                <Box
                  component="span"
                  sx={{
                    backgroundColor: backgroundColor,
                    borderRadius: "0.25rem",
                    color: "#fff",
                    maxWidth: "9ch",
                    p: "0.25rem",
                    display: "inline-block",
                    textAlign: "center",
                  }}
                >
                  {operationType}
                </Box>
              );
            },
            Filter: ({ column }) => (
              <Autocomplete
                options={nameSuggestions}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Filter by Operation"
                    variant="outlined"
                    size="small"
                  />
                )}
                onChange={(_event, value) => column.setFilterValue(value)}
              />
            ),
          },
          {
            accessorFn: (row) => `${row.store.name}`,
            id: "store name",
            header: "store name",
            size: 250,
            Filter: ({ column }) => (
              <Autocomplete
                options={nameSuggestions}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Filter by store"
                    variant="outlined"
                    size="small"
                  />
                )}
                onChange={(_event, value) => column.setFilterValue(value)}
              />
            ),
          },

          {
            accessorFn: (row) => `${row.product.name}`,
            id: "product name",
            header: "product Name",
            size: 250,
            Filter: ({ column }) => (
              <Autocomplete
                options={nameSuggestions}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Filter by product"
                    variant="outlined"
                    size="small"
                  />
                )}
                onChange={(_event, value) => column.setFilterValue(value)}
              />
            ),
          },
          {
            accessorFn: (row) => `${row.currentQuantity}`,
            id: "current quantity",
            header: "current quantity",
            size: 250,
            Filter: ({ column }) => (
              <Autocomplete
                options={nameSuggestions}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Filter by quantity"
                    variant="outlined"
                    size="small"
                  />
                )}
                onChange={(_event, value) => column.setFilterValue(value)}
              />
            ),
          },
          {
            accessorFn: (row) => `${row.createdAt}`,
            id: "createdAt",
            header: "createdAt",
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
        ],
      },
    ],
    [nameSuggestions]
  );

  const table = useMaterialReactTable({
    columns,
    data: inventoryList == undefined ? [] : inventoryList,
    enableColumnFilterModes: true,
    enableColumnOrdering: true,
    enableGrouping: true,
    enableColumnPinning: true,
    enableFacetedValues: true,
    enableRowActions: true,
    enableRowSelection: true,
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
        {/* <UpdateProductCategory
          handleCloseDialog={handleCloseEdit}
          selectedRowData={selectedRowData}
        /> */}
      </Dialog>
      <Dialog open={openReset}></Dialog>
      <Dialog open={openDelete}>
        <Warning
          handleClose={handleCloseDelete}
          handleAction={handleDeleteInventory}
          message={`Are you sure you want to delete product category :  ${selectedRowData?.id}?`}
          isLoading={isLoading}
          isSuccess={isSuccess}
        />
      </Dialog>
    </Box>
  );
};

export default InventoryListTable;
