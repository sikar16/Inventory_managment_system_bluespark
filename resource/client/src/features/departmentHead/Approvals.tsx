import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';

interface Column {
    id: string;
    label: string;
    minWidth?: number;
    align?: 'inherit' | 'left' | 'center' | 'right' | 'justify';
}

const columns: Column[] = [
    { id: 'no', label: 'No', minWidth: 50 },
    { id: 'orderId', label: 'Order Id', minWidth: 70 },
    { id: 'requestedEmployee', label: 'Requested Employee', minWidth: 70, align: 'left' },
    { id: 'product', label: 'Product', minWidth: 70, align: 'left' },
    { id: 'quantity', label: 'Quantity', minWidth: 70, align: 'left' },
    { id: 'status', label: 'Status', minWidth: 70, align: 'left' },
    { id: 'dateOfRequest', label: 'Date of Request', minWidth: 70, align: 'left' },
];

interface RowData {
    no: number;
    orderId: string;
    requestedEmployee: string;
    product: string;
    quantity: string;
    status: string;
    dateOfRequest: string;
}

function createData(no: number, orderId: string, requestedEmployee: string, product: string, quantity: string, status: string, dateOfRequest: string) {
    return { no, orderId, requestedEmployee, product, quantity, status, dateOfRequest };
}

const rows = [
    createData(1, "#12345", "Zerubabel", "HP Laptop", "20", "Active", "8-26-2024"),
    createData(2, "#12346", "Alice", "Dell Desktop", "10", "Pending", "8-27-2024"),
    createData(3, "#12347", "Bob", "MacBook Pro", "5", "Completed", "8-28-2024"),
    createData(4, "#12348", "Charlie", "Lenovo ThinkPad", "15", "Active", "8-29-2024"),
    createData(5, "#12349", "David", "Asus ROG", "8", "Active", "8-30-2024"),
];

export default function Approvals() {
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [openDialog, setOpenDialog] = React.useState(false);
    const [selectedProduct, setSelectedProduct] = React.useState<null | RowData>(null);

    const handleChangePage = (_event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>, product: RowData) => {
        setAnchorEl(event.currentTarget);
        setSelectedProduct(product);
    };

    const handleCloseMenu = () => {
        setAnchorEl(null);
    };

    const handleOpenDialog = () => {
        setOpenDialog(true);
        handleCloseMenu();
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedProduct(null);
    };

    return (
        <div className='pt-10 mx-7'>
            <div className='flex justify-between mb-3 mx-2'>
                <p className='text-[#002a47] text-4xl font-medium'>Approval Request</p>
            </div>
            <hr className='w-full text-black bg-black' />
            <div className='my-4'>
                <input type="text" placeholder='Search' className='w-[80%] bg-[#f5f5f5] rounded-2xl py-[5px] px-3' />
            </div>
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
                                <TableCell align="right">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((row) => (
                                    <TableRow hover role="checkbox" tabIndex={-1} key={row.no}>
                                        {columns.map((column) => {
                                            const value = row[column.id as keyof RowData];
                                            return (
                                                <TableCell key={column.id} align={column.align}>
                                                    {value}
                                                </TableCell>
                                            );
                                        })}
                                        <TableCell align="right">
                                            <IconButton
                                                aria-label="more"
                                                aria-controls="long-menu"
                                                aria-haspopup="true"
                                                onClick={(event) => handleClick(event, row)}
                                            >
                                                <MoreVertIcon />
                                            </IconButton>
                                            <Menu
                                                anchorEl={anchorEl}
                                                open={Boolean(anchorEl)}
                                                onClose={handleCloseMenu}
                                            >
                                                <MenuItem onClick={handleOpenDialog}>Edit</MenuItem>
                                                <MenuItem onClick={handleCloseMenu}>Delete</MenuItem>
                                            </Menu>
                                        </TableCell>
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
            <Dialog open={openDialog}
                onClose={handleCloseDialog}
                PaperProps={{
                    style: {
                        width: '70vw',
                        maxWidth: '70vw',
                        height: '90vh'
                    },
                }}
            >
                <DialogTitle>Edit Product</DialogTitle>
                <DialogContent>
                    {selectedProduct && (
                        <div>
                            <p><strong>Order ID:</strong> {selectedProduct.orderId}</p>
                            <p><strong>Requested Employee:</strong> {selectedProduct.requestedEmployee}</p>
                            <p><strong>Product:</strong> {selectedProduct.product}</p>
                            <p><strong>Quantity:</strong> {selectedProduct.quantity}</p>
                            <p><strong>Status:</strong> {selectedProduct.status}</p>
                            <p><strong>Date of Request:</strong> {selectedProduct.dateOfRequest}</p>
                            {/* Add more fields if necessary */}
                        </div>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}