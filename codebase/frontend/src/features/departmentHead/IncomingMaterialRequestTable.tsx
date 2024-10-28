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
import { MaterialRequest_type } from "../../_types/materialReq_type";
import { useToast } from "../../context/ToastContext";
import { useDeleteMaterialReqMutation } from "../../services/materialReq_service";
import Warning from "../../component/Warning";
import { useNavigate } from "react-router-dom";

export type MaterialRequestListTableProps = {
  materialRequestList: MaterialRequest_type[] | undefined;
};

const IncomingMaterialRequestListTable = ({
  materialRequestList,
}: MaterialRequestListTableProps) => {
  const navigate = useNavigate();

  const { setToastData } = useToast();
  const [selectedRowData, setSelectedRowData] =
    useState<MaterialRequest_type | null>(null);
  const [deleteMaterialRequest, { isLoading, isSuccess }] =
    useDeleteMaterialReqMutation();
  // const [openEdit, setOpenEdit] = useState(false);
  const [openReset] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);


  const handleClickOpenDelete = (row: MaterialRequest_type) => {
    setSelectedRowData(row);
    setOpenDelete(true);
  };

  const handleCloseDelete = () => {
    setOpenDelete(false);
  };

  const handleDeleteMaterialRequest = async () => {
    if (selectedRowData?.id != null) {
      try {
        await deleteMaterialRequest(selectedRowData?.id.toString()).unwrap();
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
    "DEPARTMENT_APPROVED",
    "DEPARTMENT_REJECT",
    "AVAILABLE_IN_STOCK",
    "PURCHASE_REQUESTED",
    "PURCHASE_ORDERED",
    "DELIVERED_STATE",
  ];

  const employeeSuggestions = [
    ...new Set(
      materialRequestList?.map(
        (req) =>
          `${req.employee?.profile.firstName} ${req.employee?.profile.middleName}`
      ) || []
    ),
  ];

  const departmentSuggestions = [
    ...new Set(
      materialRequestList?.map((req) => req.departmentHead?.department.name) ||
      []
    ),
  ];

  const columns = useMemo<MRT_ColumnDef<MaterialRequest_type>[]>(
    () => [
      {
        id: "Material request",
        header: "Material request",
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
                case "DEPARTMENT_APPROVED":
                  backgroundColor = "#4caf50";
                  break;
                case "DEPARTMENT_REJECT":
                  backgroundColor = "#d32f2f";
                  break;
                case "AVAILABLE_IN_STOCK":
                  backgroundColor = "#ff9800";
                  break;
                case "PURCHASE_REQUESTED":
                  backgroundColor = "#3f51b5";
                  break;
                case "PURCHASE_ORDERED":
                  backgroundColor = "#9c27b0";
                  break;
                case "DELIVERED_STATE":
                  backgroundColor = "#f44336";
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
              `${row.employee.profile.firstName} ${row.employee.profile.middleName}`,
            id: "employee",
            header: "Employee",
            size: 250,
            Filter: ({ column }) => (
              <Autocomplete
                options={employeeSuggestions}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Filter by Employee"
                    variant="outlined"
                    size="small"
                  />
                )}
                onChange={(_event, value) => column.setFilterValue(value)}
              />
            ),
          },
          {
            accessorFn: (row) => `${row.departmentHead?.department.name}`,
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
    [statusSuggestions, employeeSuggestions, departmentSuggestions]
  );

  const table = useMaterialReactTable({
    columns,
    data: materialRequestList == undefined ? [] : materialRequestList,
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
          closeMenu();
          navigate("/logestics/requests-Detaile", {
            state: { id: row.original.id },
          });
        }}
        sx={{ m: 0 }}
      >
        <ListItemIcon>
          <PersonAddIcon />
        </ListItemIcon>
        View
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
          options={employeeSuggestions}
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
      {/* <Dialog open={openEdit}>
        <UpdateMaterialRequest
          handleCloseDialog={handleCloseEdit}
          selectedRowData={selectedRowData}
        /> 
      </Dialog>*/}
      <Dialog open={openReset}></Dialog>
      <Dialog open={openDelete}>
        <Warning
          handleClose={handleCloseDelete}
          handleAction={handleDeleteMaterialRequest}
          message={`Are you sure you want to delete material request: ${selectedRowData?.id}?`}
          isLoading={isLoading}
          isSuccess={isSuccess}
        />
      </Dialog>
    </Box>
  );
};

export default IncomingMaterialRequestListTable;
