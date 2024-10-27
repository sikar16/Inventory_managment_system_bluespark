import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useState } from 'react';
import { SupplierType } from '../../../_types/supplier_type';

interface Column {
    id: string;
    label: string;
    minWidth: number;
    align?: 'left' | 'center' | 'right'; // Optional alignment property
}

const columns: Column[] = [
    { id: 'no', label: 'No', minWidth: 50 },
    { id: 'supplierId', label: 'SupplierId', minWidth: 50 },
    { id: 'supplierName', label: 'Supplier Name', minWidth: 200 },
    { id: 'category', label: 'Category', minWidth: 200, align: 'left' },
    { id: 'address', label: 'Address', minWidth: 200, align: 'left' },
    { id: 'actions', label: 'Actions', minWidth: 100, align: 'center' },
];
interface RowType {
    no: number;
    supplierId: string;
    supplierName: string;
    category: string;
    address: string;
}

function createData(no: number, supplierId: string, supplierName: string, category: string, address: string): RowType {
    return { no, supplierId, supplierName, category, address };
}

interface SuppliersTableProps {
    supplierslist: SupplierType[];
}

const SupplierTable: React.FC<SuppliersTableProps> = ({ supplierslist }) => {
    const rows = supplierslist.map((i) =>
        createData(
            i.id,
            `${i.id}`,
            `${i.fullName}`,
            `${i.category?.name}`,
            // `${i.profile.address.city} ${i.profile.address.subCity}`
            `${i.address?.country}, ${i.address?.city}, ${i.address?.subCity}, ${i.address?.wereda}`.trim().replace(/, +$/, '') // Combine and clean up address
        )
    );

    console.log(rows)
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const handleChangePage = (_event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

    const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget); // No need for type assertion now
    };


    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    return (
        <>
            <div>
                <Paper sx={{ width: '100%', overflow: 'hidden' }}>
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
                                {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => (
                                    <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                                        {columns.map((column) => {
                                            const value = row[column.id as keyof RowType];
                                            return (
                                                <TableCell key={column.id} align={column.align}>
                                                    {column.id === 'actions' ? (
                                                        <div>
                                                            <IconButton
                                                                aria-label="more"
                                                                aria-controls="long-menu"
                                                                aria-haspopup="true"
                                                                onClick={(event) => handleMenuClick(event)}
                                                            >
                                                                <MoreVertIcon />
                                                            </IconButton>
                                                            <Menu
                                                                id="long-menu"
                                                                anchorEl={anchorEl}
                                                                keepMounted
                                                                open={Boolean(anchorEl)}
                                                                onClose={handleMenuClose}
                                                            >
                                                                <MenuItem>Update</MenuItem>
                                                                <MenuItem>Delete</MenuItem>
                                                            </Menu>
                                                        </div>
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
            </div>
        </>
    );
};

export default SupplierTable;
