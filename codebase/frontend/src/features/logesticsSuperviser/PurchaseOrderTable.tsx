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
import { DeleteForever } from "@mui/icons-material";
import { PurchasedOrderType } from "../../_types/purchasedOrder_type";
import { useToast } from "../../context/ToastContext";
import { useDeletePurchasedOrderMutation } from "../../services/purchasedOrder_service";
import { ErrorResponseType } from "../../_types/request_reponse_type";
import Warning from "../../component/Warning";
import SendToSupplayer from "./SendToSupplayer";
import { useNavigate } from "react-router-dom";

export type PurchaseOrderListTableProps = {
  purchaseOrderList: PurchasedOrderType[] | undefined;
};

const PurchaseOrderListTable = ({
  purchaseOrderList,
}: PurchaseOrderListTableProps) => {
  const navigator = useNavigate();
  const { setToastData } = useToast();
  const [selectedRowData, setSelectedRowData] =
    useState<PurchasedOrderType | null>(null);
  const [deleteProductOrder, { isLoading, isSuccess }] =
    useDeletePurchasedOrderMutation();
  const [openEdit, setOpenEdit] = useState(false);
  const [openReset] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  const handleClickOpenEdit = (row: PurchasedOrderType) => {
    setSelectedRowData(row);
    setOpenEdit(true);
  };

  const handleCloseEdit = () => {
    setOpenEdit(false);
  };

  const handleClickOpenDelete = (row: PurchasedOrderType) => {
    setSelectedRowData(row);
    setOpenDelete(true);
  };

  const handleCloseDelete = () => {
    setOpenDelete(false);
  };

  const handleDeleteproductOrder = async () => {
    if (selectedRowData?.id != null) {
      try {
        const res = await deleteProductOrder(
          selectedRowData.id.toString()
        ).unwrap();
        console.log(res);
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
  const statusSuggestions = ["ORDERED", "CLOSED"];
  const nameSuggestions =
    purchaseOrderList == undefined
      ? []
      : purchaseOrderList.map((user) => user.id);

  const columns = useMemo<MRT_ColumnDef<PurchasedOrderType>[]>(
    () => [
      {
        id: "purchase order",
        header: "Purchase Order",
        columns: [
          {
            accessorFn: (row) =>
              `${row.user.profile.firstName} ${row.user.profile.lastName}`,
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
            accessorFn: (row) => `${row.status}`,
            id: "status",
            header: "Status",
            size: 250,
            Cell: ({ cell }) => {
              const status = cell.getValue<string>();
              let backgroundColor;
              switch (status) {
                case "ORDERED":
                  backgroundColor = "#1976d2";
                  break;
                case "CLOSED":
                  backgroundColor = "#4caf50";
                  break;
                default:
                  backgroundColor = "#9e9e9e";
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
                  }}
                >
                  {status}
                </Box>
              );
            },
            Filter: ({ column }) => (
              <Autocomplete
                options={statusSuggestions}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Filter by Status"
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
    data: purchaseOrderList == undefined ? [] : purchaseOrderList,
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
        Send to supplayer
      </MenuItem>,
      <MenuItem
        key={`offer-${row.original.id}`}
        onClick={() => {
          navigator(`/logestics/supplier-offer/po/${row.original.id}`, {
            state: { purchasedOrderId: row.original.id },
          });
          closeMenu();
        }}
        sx={{ m: 0 }}
      >
        <ListItemIcon>
          <PersonAddIcon />
        </ListItemIcon>
        view supplier offer
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
        <div className="m-5 p-6">
          <SendToSupplayer
            handleCloseDialog={handleCloseEdit}
            selectedRowData={selectedRowData}
          />
        </div>
      </Dialog>
      <Dialog open={openReset}></Dialog>
      <Dialog open={openDelete}>
        <Warning
          handleClose={handleCloseDelete}
          handleAction={handleDeleteproductOrder}
          message={`Are you sure you want to delete product category :  ${selectedRowData?.id}?`}
          isLoading={isLoading}
          isSuccess={isSuccess}
        />
      </Dialog>
    </Box>
  );
};

export default PurchaseOrderListTable;
