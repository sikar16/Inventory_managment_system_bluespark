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
import { SupplierType } from "../../../_types/supplier_type";
import { useDeleteSupplierMutation } from "../../../services/supplier_service";
import UpdateSuppliers from "./form/UpdateSuppliers";

export type SupplayerListTableProps = {
  supplayerList: SupplierType[] | undefined;
};

const SupplayerListTable = ({ supplayerList }: SupplayerListTableProps) => {
  const { setToastData } = useToast();
  const [selectedRowData, setSelectedRowData] = useState<SupplierType | null>(
    null
  );
  const [deleteProductCategory, { isLoading, isSuccess }] =
    useDeleteSupplierMutation();
  const [openEdit, setOpenEdit] = useState(false);
  const [openReset] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openView, setOpenView] = useState(false);

  const handleClickOpenEdit = (row: SupplierType) => {
    setSelectedRowData(row);
    setOpenEdit(true);
  };

  const handleCloseEdit = () => {
    setOpenEdit(false);
  };

  const handleClickOpenView = (row: SupplierType) => {
    setSelectedRowData(row);
    setOpenView(true);
  };

  const handleCloseView = () => {
    setOpenView(false);
  };

  const handleClickOpenDelete = (row: SupplierType) => {
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
          message: "Department deleted successfully",
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
        message: "Department not selected is missing",
        success: false,
      });
    }
  };

  const nameSuggestions =
    supplayerList == undefined
      ? []
      : supplayerList.map((user) => user.fullName);

  const columns = useMemo<MRT_ColumnDef<SupplierType>[]>(
    () => [
      {
        id: "sub category",
        header: "Sub Category",
        columns: [
          {
            accessorFn: (row) => `${row.fullName}`,
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
            accessorFn: (row) => `${row.category.name}`,
            id: "category",
            header: "Category",
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
    data: supplayerList == undefined ? [] : supplayerList,
    enableColumnFilterModes: true,
    enableColumnOrdering: true,
    enableGrouping: true,
    enableColumnPinning: true,
    enableFacetedValues: true,
    enableRowActions: true,
    enableRowSelection: true,
    initialState: {
      pagination: {
        pageSize: 5,
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
        View Details
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
        <UpdateSuppliers
          handleCloseDialog={handleCloseEdit}
          selectedRowData={selectedRowData}
        />
      </Dialog>
      <Dialog open={openReset}></Dialog>
      <Dialog open={openDelete}>
        <Warning
          handleClose={handleCloseDelete}
          handleAction={handleDeleteDepartment}
          message={`Are you sure you want to delete product category ${selectedRowData?.id} :  ${selectedRowData?.fullName}?`}
          isLoading={isLoading}
          isSuccess={isSuccess}
        />
      </Dialog>
      <Dialog open={openView} fullWidth maxWidth="sm">
        <DialogTitle>Suppliers Detail</DialogTitle>
        <DialogContent>
          <div className="flex gap-6">
            <p className="font-bold">Name:</p>
            <p>{selectedRowData?.fullName}</p>
          </div>
          <div className="flex gap-6">
            <p className="font-bold">Phone:</p>
            <p>{selectedRowData?.phone}</p>
          </div>
          <div className="flex gap-6">
            <p className="font-bold">Email:</p>
            <p>{selectedRowData?.email}</p>
          </div>
          <div className="flex gap-6">
            <p className="font-bold">Category:</p>
            <p>{selectedRowData?.category.name}</p>
          </div>
          <div className="flex gap-6">
            <p className="font-bold">Address:</p>
            <p>
              {selectedRowData?.address.country},{" "}
              {selectedRowData?.address.city} {selectedRowData?.address.subCity}{" "}
              {selectedRowData?.address.wereda}
            </p>{" "}
          </div>
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

export default SupplayerListTable;
