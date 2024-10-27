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
import { StoreType } from "../../../_types/store_type";
import UpdateStore from "./form/UpdateStore";
import { useDeleteStoreMutation } from "../../../services/store_service";

export type StoreListTableProps = {
  stores: StoreType[] | undefined;
};

const StoreListTable = ({ stores }: StoreListTableProps) => {
  const { setToastData } = useToast();
  const [selectedRowData, setSelectedRowData] = useState<StoreType | null>(
    null
  );
  const [deleteStore, { isLoading, isSuccess }] = useDeleteStoreMutation();
  const [openEdit, setOpenEdit] = useState(false);
  const [openReset] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openView, setOpenView] = useState(false);

  const handleClickOpenEdit = (row: StoreType) => {
    setSelectedRowData(row);
    setOpenEdit(true);
  };

  const handleCloseEdit = () => {
    setOpenEdit(false);
  };

  const handleClickOpenView = (row: StoreType) => {
    setSelectedRowData(row);
    setOpenView(true);
  };

  const handleCloseView = () => {
    setOpenView(false);
  };
  const handleClickOpenDelete = (row: StoreType) => {
    setSelectedRowData(row);
    setOpenDelete(true);
  };

  const handleCloseDelete = () => {
    setOpenDelete(false);
  };

  const handleDeleteDepartment = async () => {
    if (selectedRowData?.id != null) {
      try {
        await deleteStore(selectedRowData.id).unwrap();
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

  // Get unique suggestions from the user data for Autocomplete

  const nameSuggestions =
    stores == undefined ? [] : stores.map((user) => user.name);

  const columns = useMemo<MRT_ColumnDef<StoreType>[]>(
    () => [
      {
        id: "department",
        header: "department",
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
        ],
      },
    ],
    [nameSuggestions]
  );

  const table = useMaterialReactTable({
    columns,
    data: stores == undefined ? [] : stores,
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
          handleClickOpenView(row.original);
          closeMenu();
        }}
        sx={{ m: 0 }}
      >
        <ListItemIcon>
          <PersonAddIcon />
        </ListItemIcon>
        View detaile
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
        <UpdateStore
          handleCloseDialog={handleCloseEdit}
          selectedRowData={selectedRowData}
        />
      </Dialog>
      <Dialog open={openReset}></Dialog>
      <Dialog open={openDelete}>
        <Warning
          handleClose={handleCloseDelete}
          handleAction={handleDeleteDepartment}
          message={`Are you sure you want to delete store ${selectedRowData?.id} :  ${selectedRowData?.name}?`}
          isLoading={isLoading}
          isSuccess={isSuccess}
        />
      </Dialog>
      <Dialog open={openView} fullWidth maxWidth="sm">
        <DialogTitle>Store Detail</DialogTitle>
        <DialogContent>
          <div className="flex gap-6">
            <p className="font-bold">Name:</p>
            {selectedRowData?.name}
          </div>
          <div className="flex gap-6">
            <p className="font-bold">Address:</p>
            {selectedRowData?.address.country} {selectedRowData?.address.city}{" "}
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

export default StoreListTable;
