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
import { useToast } from "../../context/ToastContext";
import Warning from "../../component/Warning";
import { PurchasedRequest_type } from "../../_types/purchasedReq_type";
import { useDeletePurchasedReqMutation } from "../../services/purchasedReq_service";
import { useAuth } from "../../context/AuthContext";
import ApprovePurchasedReqF from "../finance/ApprovePurchasedReqF";
import { useNavigate } from "react-router-dom";

export type PurchasedRequestListTableProps = {
  purchaseRequestList: PurchasedRequest_type[] | undefined;
};

const PurchasedRequestListTable = ({
  purchaseRequestList,
}: PurchasedRequestListTableProps) => {
  const navigator = useNavigate();
  const { setToastData } = useToast();
  const [selectedRowData, setSelectedRowData] =
    useState<PurchasedRequest_type | null>(null);
  const [deletePurchaseRequest, { isLoading, isSuccess }] =
    useDeletePurchasedReqMutation();

  const [openEdit, setOpenEdit] = useState(false);
  const [openReset] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const { isFinance, isGM, isLS } = useAuth();

  const handleClickOpenEdit = (row: PurchasedRequest_type) => {
    setSelectedRowData(row);
    setOpenEdit(true);
  };

  const handleClickCloseEdit = () => {
    setSelectedRowData(null);
    setOpenEdit(false);
  };
  const handleClickOpenDelete = (row: PurchasedRequest_type) => {
    setSelectedRowData(row);
    setOpenDelete(true);
  };

  const handleCloseDelete = () => {
    setOpenDelete(false);
  };

  const handleDeletePurchaseRequest = async () => {
    if (selectedRowData?.id != null) {
      try {
        await deletePurchaseRequest(selectedRowData?.id.toString()).unwrap();
        setToastData({
          message: "Material request deleted successfully",
          success: true,
        });
        handleCloseDelete();
      } catch (error: any) {
        handleCloseDelete();
        setToastData({
          message: error.toString(),
          success: false,
        });
      }
    } else {
      handleCloseDelete();
      setToastData({
        message: "Material request not selected or missing",
        success: false,
      });
    }
  };
  // Get distinct suggestions for the Autocomplete components
  const statusSuggestions = [
    "REQUESTED",
    "FINANCE_APPROVE",
    "FINANCE_REJECT",
    "GENERAL_MANAGER_APPROVED",
    "GENERAL_MANAGER_REJECT",
  ];

  const departmentHeadSuggestions = [
    ...new Set(
      purchaseRequestList?.map((req) => `${req.user?.department.name} `) || []
    ),
  ];

  const departmentSuggestions = [
    ...new Set(
      purchaseRequestList?.map((req) => req.user?.department.name) || []
    ),
  ];

  const columns = useMemo<MRT_ColumnDef<PurchasedRequest_type>[]>(
    () => [
      {
        id: "Purchase request",
        header: "Purchase request",
        columns: [
          {
            accessorFn: (row) => `${row.status}`,
            id: "status",
            header: "Status",
            size: 250,
            Cell: ({ cell }) => {
              const status = cell.getValue<string>();
              let backgroundColor;
              switch (status) {
                case "REQUESTED":
                  backgroundColor = "#1976d2";
                  break;
                case "FINANCE_APPROVE":
                  backgroundColor = "#4caf50";
                  break;
                case "FINANCE_REJECT":
                  backgroundColor = "#d32f2f";
                  break;
                case "GENERAL_MANAGER_APPROVED":
                  backgroundColor = "#ff9800";
                  break;
                case "GENERAL_MANAGER_REJECT":
                  backgroundColor = "#3f51b5";
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
          {
            accessorFn: (row) =>
              `${row.user?.profile.firstName} ${row.user?.profile.middleName}`,
            id: "logistics supervisor",
            header: "Logistics supervisor",
            size: 250,
            Filter: ({ column }) => (
              <Autocomplete
                options={departmentHeadSuggestions}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Filter by Logistics supervisor"
                    variant="outlined"
                    size="small"
                  />
                )}
                onChange={(_event, value) => column.setFilterValue(value)}
              />
            ),
          },
          {
            accessorFn: (row) => `${row.user?.department.name}`,
            id: "department",
            header: "Department",
            size: 250,
            Filter: ({ column }) => (
              <Autocomplete
                options={departmentSuggestions}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Filter by Department"
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
    [statusSuggestions, departmentHeadSuggestions, departmentSuggestions]
  );

  const table = useMaterialReactTable({
    columns,
    data: purchaseRequestList == undefined ? [] : purchaseRequestList,
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
      showGlobalFilter: true,
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
        key={`view-${row.original.id}`}
        onClick={() => {
          navigator("/purchase-requests-detetail", {
            state: { id: row.original.id },
          });
          closeMenu();
        }}
        sx={{ m: 0 }}
      >
        <ListItemIcon>
          <PersonAddIcon />
        </ListItemIcon>
        View
      </MenuItem>,
      isFinance && (
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
          {row.original.isApproviedByFinance ? "Reject" : "Approve"}
        </MenuItem>
      ),
      isLS && (
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
        </MenuItem>
      ),
      isGM && (
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
          {row.original.isApproviedByGM ? "Reject" : "Approve"}
        </MenuItem>
      ),
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
          options={departmentHeadSuggestions}
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
        <>
          <div className="m-8 p-8">
            {selectedRowData && (
              <ApprovePurchasedReqF
                purchasedReq={selectedRowData}
                handleCloseDialog={handleClickCloseEdit}
              />
            )}
          </div>
        </>
      </Dialog>
      <Dialog open={openReset}></Dialog>
      <Dialog open={openDelete}>
        <Warning
          handleClose={handleCloseDelete}
          handleAction={handleDeletePurchaseRequest}
          message={`Are you sure you want to delete material request: ${selectedRowData?.id}?`}
          isLoading={isLoading}
          isSuccess={isSuccess}
        />
      </Dialog>
    </Box>
  );
};

export default PurchasedRequestListTable;
