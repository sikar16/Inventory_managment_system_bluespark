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
} from "@mui/material";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { useToast } from "../../context/ToastContext";
import Warning from "../../component/Warning";
import { useDeleteSupplierOfferApiMutation } from "../../services/supplierOffer_service";
import { ErrorResponseType } from "../../_types/request_reponse_type";
import { SupplierOffer } from "../../_types/supplierOffer_type";
import AddWinner from "./AddWinner";
// Main interface for Supplier Offer

export type SupplierOfferProps = {
  supplierOfferList: SupplierOffer[] | undefined;
};

const SupplierOfferListTable = ({ supplierOfferList }: SupplierOfferProps) => {
  const { setToastData } = useToast();
  const [selectedRowData, setSelectedRowData] = useState<SupplierOffer | null>(
    null
  );
  const [deleteSupplierOffer, { isLoading, isSuccess }] =
    useDeleteSupplierOfferApiMutation();
  const [openEdit, setOpenEdit] = useState(false);
  const [openReset] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  const handleClickOpenEdit = (row: SupplierOffer) => {
    setSelectedRowData(row);
    setOpenEdit(true);
  };

  const handleCloseEdit = () => {
    setOpenEdit(false);
  };

  const handleCloseDelete = () => {
    setOpenDelete(false);
  };

  const handleDeleteSupplierOffer = async () => {
    if (selectedRowData?.id != null) {
      try {
        const res: any = await deleteSupplierOffer(selectedRowData.id).unwrap();
        if (res.error) {
          setToastData({
            message: res.error,
            success: false,
          });
        }
        if (res.data) {
          setToastData({
            message: "productCategory deleted successfully",
            success: true,
          });
          handleCloseDelete();
        }
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
    supplierOfferList == undefined
      ? []
      : supplierOfferList.map((user) => user.id);

  const columns = useMemo<MRT_ColumnDef<SupplierOffer>[]>(
    () => [
      {
        id: "supplier offer",
        header: "supplier offer",
        columns: [
          {
            accessorFn: (row) => `${row.totalPrice}`,
            id: "total price",
            header: "total price",
            size: 250,
            Filter: ({ column }) => (
              <Autocomplete
                options={nameSuggestions}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Filter by total price"
                    variant="outlined"
                    size="small"
                  />
                )}
                onChange={(_event, value) => column.setFilterValue(value)}
              />
            ),
          },
          {
            accessorFn: (row) => `${row.supplayer.fullName}`,
            id: "supplier name",
            header: "supplier name",
            size: 250,
            Filter: ({ column }) => (
              <Autocomplete
                options={nameSuggestions}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Filter by supplier name"
                    variant="outlined"
                    size="small"
                  />
                )}
                onChange={(_event, value) => column.setFilterValue(value)}
              />
            ),
          },
          {
            accessorFn: (row) => `${row.purchasedOrderId}`,
            id: "purchase order id",
            header: "purchase order id",
            size: 250,
            Filter: ({ column }) => (
              <Autocomplete
                options={nameSuggestions}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Filter by purchase order id"
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
            id: "created at",
            header: "created at",
            size: 250,
            Filter: ({ column }) => (
              <Autocomplete
                options={nameSuggestions}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Filter by  created at"
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
    data: supplierOfferList == undefined ? [] : supplierOfferList,
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
    renderRowActionMenuItems: ({ row, closeMenu }) => [
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
        Make winner
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
        <AddWinner
          purchasedOrderId={selectedRowData?.purchasedOrderId}
          supplayerId={selectedRowData?.supplayerId}
          handleDiscard={handleCloseEdit}
        />
      </Dialog>
      <Dialog open={openReset}></Dialog>
      <Dialog open={openDelete}>
        <Warning
          handleClose={handleCloseDelete}
          handleAction={handleDeleteSupplierOffer}
          message={`Are you sure you want to delete product category :  ${selectedRowData?.totalPrice}?`}
          isLoading={isLoading}
          isSuccess={isSuccess}
        />
      </Dialog>
    </Box>
  );
};

export default SupplierOfferListTable;
