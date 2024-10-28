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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { DeleteForever } from "@mui/icons-material";
import { useToast } from "../../../context/ToastContext";
import Warning from "../../../component/Warning";

import {
  TemplateResponseType,
  useDeleteTemplateMutation,
} from "../../../services/template_service";
import UpdateTemplate from "./form/UpdateTemplate";

export type TemplateListTableProps = {
  templateList: TemplateResponseType[] | undefined;
};

const TemplateListTable = ({
  templateList: templateList,
}: TemplateListTableProps) => {
  const { setToastData } = useToast();
  const [selectedRowData, setSelectedRowData] =
    useState<TemplateResponseType | null>(null);
  const [deleteTemplate, { isLoading, isSuccess }] =
    useDeleteTemplateMutation();
  const [openEdit, setOpenEdit] = useState(false);
  const [openReset] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openView, setOpenView] = useState(false);

  const handleClickOpenView = (row: TemplateResponseType) => {
    setSelectedRowData(row);
    setOpenView(true);
  };

  const handleClickOpenEdit = (row: TemplateResponseType) => {
    setSelectedRowData(row);
    setOpenEdit(true);
  };

  const handleCloseEdit = () => {
    setOpenEdit(false);
  };

  const handleCloseView = () => {
    setOpenView(false);
  };
  const handleClickOpenDelete = (row: TemplateResponseType) => {
    setSelectedRowData(row);
    setOpenDelete(true);
  };

  const handleCloseDelete = () => {
    setOpenDelete(false);
  };

  const handleDeleteDepartment = async () => {
    if (selectedRowData?.id != null) {
      try {
        await deleteTemplate(selectedRowData.id).unwrap();
        setToastData({
          message: "Template deleted successfully",
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
        message: "Template not selected is missing",
        success: false,
      });
    }
  };

  // Get unique suggestions from the user data for Autocomplete

  const nameSuggestions =
    templateList == undefined ? [] : templateList.map((user) => user.name);

  const columns = useMemo<MRT_ColumnDef<TemplateResponseType>[]>(
    () => [
      {
        id: "template",
        header: "Template",
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
    data: templateList == undefined ? [] : templateList,
    enableColumnFilterModes: true,
    enableColumnOrdering: true,
    enableGrouping: true,
    enableColumnPinning: true,
    enableFacetedValues: true,
    enableRowActions: true,
    enableRowSelection: false,
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
        View Detail
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
        <UpdateTemplate
          handleCloseDialog={handleCloseEdit}
          template={selectedRowData}
        />
      </Dialog>
      <Dialog open={openReset}></Dialog>
      <Dialog open={openDelete}>
        <Warning
          handleClose={handleCloseDelete}
          handleAction={handleDeleteDepartment}
          message={`Are you sure you want to delete template ${selectedRowData?.id} :  ${selectedRowData?.name}?`}
          isLoading={isLoading}
          isSuccess={isSuccess}
        />
      </Dialog>
      <Dialog open={openView} fullWidth maxWidth="sm">
        <DialogTitle>Template Detail</DialogTitle>
        <DialogContent>
          {selectedRowData && (
            <>
              <div className="flex gap-5 items-center p-4 border-b border-gray-300">
                <p className="font-bold text-lg text-gray-700">
                  Template Name:
                </p>
                <p className="text-lg text-gray-900">{selectedRowData.name}</p>
              </div>
              <TableContainer component={Paper} sx={{ mb: 2 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell className="font-bold">
                        <strong>Attribute Name</strong>
                      </TableCell>
                      <TableCell className="font-bold">
                        <strong>Data Type</strong>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {Object.entries(selectedRowData.attributes || {}).map(
                      ([key, value]) => (
                        <TableRow key={key}>
                          <TableCell>
                            {typeof value === "object" && value !== null ? (
                              <>
                                <p>{value.name || "N/A"}</p>
                              </>
                            ) : (
                              typeof value
                            )}
                          </TableCell>
                          <TableCell>
                            {typeof value === "object" && value !== null
                              ? value.dataType || "N/A"
                              : typeof value}
                          </TableCell>
                        </TableRow>
                      )
                    )}
                  </TableBody>
                </Table>
              </TableContainer>{" "}
              <button
                type="submit"
                className="bg-[#002a47] py-1 px-3 text-white rounded-md mt-4"
                onClick={handleCloseView}
              >
                Close
              </button>
            </>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default TemplateListTable;
