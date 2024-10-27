import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { useState } from 'react';
const columns = [
    { id: 'no', label: 'No', minWidth: 50 },
    { id: 'suppliersName', label: 'Suppliers Name', minWidth: 70 },
    { id: 'category', label: 'Category', minWidth: 70, align: 'left' },
];

function createData(no: number, suppliersName: string, category: string) {
    return { no, suppliersName, category };
}

const rows = [
    createData(1, "BlueSparks", "Electronics"),
    createData(1, "BlueSparks", "Electronics"),
    createData(1, "BlueSparks", "Electronics"),
    createData(1, "BlueSparks", "Electronics"),
    createData(1, "BlueSparks", "Electronics"),
    createData(1, "BlueSparks", "Electronics"),
    createData(1, "BlueSparks", "Electronics"),

];
function SupplierCategoryTable() {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };
    return (
        <>
            <div className="flex mx-[7%]">
                <Paper sx={{ overflow: 'hidden', maxWidth: 800, width: '100%' }}>
                    <TableContainer sx={{ maxHeight: 440 }}>
                        <Table stickyHeader aria-label="sticky table">
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
                                {rows
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((row) => (
                                        <TableRow hover role="checkbox" tabIndex={-1} key={row.productId}>
                                            {columns.map((column) => {
                                                const value = row[column.id];
                                                return (
                                                    <TableCell key={column.id} align={column.align}>
                                                        {value}
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
            </div>
        </>
    )
}

export default SupplierCategoryTable