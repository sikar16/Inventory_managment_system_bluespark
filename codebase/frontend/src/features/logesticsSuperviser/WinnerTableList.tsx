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
import { DeleteForever } from "@mui/icons-material";
import { useToast } from "../../context/ToastContext";
import { ErrorResponseType } from "../../_types/request_reponse_type";
import Warning from "../../component/Warning";
import { WinnerType } from "../../_types/winner_type";
import { useDeleteWinnerMutation } from "../../services/winner_service";

export type WinnerListTableProps = {
  winnerList: WinnerType[] | undefined;
};

const WinnerListTable = ({ winnerList }: WinnerListTableProps) => {
  const { setToastData } = useToast();
  const [selectedRowData, setSelectedRowData] = useState<WinnerType | null>(
    null
  );
  const [deleteWinner, { isLoading, isSuccess }] = useDeleteWinnerMutation();
  const [openEdit] = useState(false);
  const [openReset] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  const handleClickOpenDelete = (row: WinnerType) => {
    setSelectedRowData(row);
    setOpenDelete(true);
  };

  const handleCloseDelete = () => {
    setOpenDelete(false);
  };

  const handleDeleteWinnerOrder = async () => {
    if (selectedRowData?.id != null) {
      try {
        const res = await deleteWinner(selectedRowData.id).unwrap();
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

  const nameSuggestions =
    winnerList == undefined ? [] : winnerList.map((user) => user.id);

  const columns = useMemo<MRT_ColumnDef<WinnerType>[]>(
    () => [
      {
        id: "Winners",
        header: "Winners",
        columns: [
          {
            accessorFn: (row) => `${row.supplayer.fullName}`,
            id: "supplayer",
            header: "supplayer",
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
            accessorFn: (row) => `${row.supplayer.phone}`,
            id: "supplayer phone",
            header: "supplayer phone",
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
            accessorFn: (row) => `${row.purchasedOrderId}`,
            id: "purchasedOrderId",
            header: "purchasedOrderId",
            size: 250,
            Filter: ({ column }) => (
              <Autocomplete
                options={nameSuggestions}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Filter by purchasedOrderId"
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
                    label="Filter by createdAt"
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
    data: winnerList == undefined ? [] : winnerList,
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
          {/* <SendToSupplayer
            handleCloseDialog={handleCloseEdit}
            selectedRowData={selectedRowData}
          /> */}
        </div>
      </Dialog>
      <Dialog open={openReset}></Dialog>
      <Dialog open={openDelete}>
        <Warning
          handleClose={handleCloseDelete}
          handleAction={handleDeleteWinnerOrder}
          message={`Are you sure you want to delete product category :  ${selectedRowData?.id}?`}
          isLoading={isLoading}
          isSuccess={isSuccess}
        />
      </Dialog>
    </Box>
  );
};

export default WinnerListTable;
