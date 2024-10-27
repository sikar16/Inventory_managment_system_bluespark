import React, { useState, useEffect } from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import IconButton from "@mui/material/IconButton";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { UserType } from "../../../_types/user_type";

interface Column {
  id: keyof RowData;
  label: string;
  minWidth?: number;
  maxWidth?: number;
  align?: 'inherit' | 'left' | 'center' | 'right' | 'justify';
}

const columns: Column[] = [
  { id: "no", label: "No", maxWidth: 10 },
  { id: "fullName", label: "Full name", minWidth: 200 },
  { id: "department", label: "Department", minWidth: 180, align: "left" },
  { id: "email", label: "Email", minWidth: 80, align: "left" },
  { id: "phone", label: "Phone", minWidth: 80, align: "left" },
  { id: "gender", label: "Gender", minWidth: 50, align: "left" },
  { id: "address", label: "Address", minWidth: 180, align: "left" },
  { id: "actions", label: "Actions", minWidth: 30, align: "left" },
];

function createData(
  no: number,
  fullName: string,
  department: string,
  email: string,
  phone: string,
  gender: string,
  address: string,
  actions: boolean
): RowData {
  return { no, fullName, department, email, phone, gender, address, actions };
}

interface UsersTableProps {
  userList: UserType[];
}

interface RowData {
  no: number;
  fullName: string;
  department: string;
  email: string;
  phone: string;
  gender: string;
  address: string;
  actions: boolean;
}

const UsersTable: React.FC<UsersTableProps> = ({ userList }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [rows, setRows] = useState<RowData[]>([]);

  useEffect(() => {
    const newRows = userList.map((i) =>
      createData(
        i.id,
        `${i.profile.firstName} ${i.profile.middleName} ${i.profile.lastName}`,
        `${i.department.name}`,
        `${i.email}`,
        `${i.profile.phone}`,
        `${i.profile.gender}`,
        `${i.profile.address.city} ${i.profile.address.subCity}`,
        true
      )
    );
    setRows(newRows);
  }, [userList]);

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };


  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setMenuAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setMenuAnchorEl(null);
  };

  const handleDelete = async (id: number) => {
    try {
      await fetch(`http://localhost:8888/api/user/${id}`, {
        method: "DELETE",
      });
      console.log(`User with id ${id} deleted`);

      setRows((prevRows) => prevRows.filter((row) => row.no !== id));
      setMenuAnchorEl(null);
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const activeStatus = (id: number) => {
    setRows((prevRows) =>
      prevRows.map((row) =>
        row.no === id ? { ...row, actions: !row.actions } : row
      )
    );
    setMenuAnchorEl(null);
  };

  return (
    <Paper sx={{ width: "100%", overflow: "hidden", padding: "30px" }}>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
              <TableRow hover role="checkbox" tabIndex={-1} key={row.no}>
                {columns.map((column) => {
                  const value = row[column.id];
                  return (
                    <TableCell key={column.id} align={column.align}>
                      {column.id === "actions" ? (
                        <>
                          <IconButton
                            aria-label="more"
                            aria-controls="long-menu"
                            aria-haspopup="true"
                            onClick={(event) => handleMenuClick(event)}
                          >
                            <MoreVertIcon />
                          </IconButton>
                          <Menu anchorEl={menuAnchorEl} open={Boolean(menuAnchorEl)} onClose={handleCloseMenu}>
                            <MenuItem>Edit</MenuItem>
                            <MenuItem onClick={() => handleDelete(row.no)}>Delete</MenuItem>
                            {row.actions ? (
                              <MenuItem onClick={() => activeStatus(row.no)}>
                                <button className="text-red-600">Deactivate</button>
                              </MenuItem>
                            ) : (
                              <MenuItem onClick={() => activeStatus(row.no)}>
                                <button className="text-green-600">Activate</button>
                              </MenuItem>
                            )}
                          </Menu>
                        </>
                      ) : (
                        value
                      )}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 15]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}

      />
    </Paper>
  );
};

export default UsersTable;