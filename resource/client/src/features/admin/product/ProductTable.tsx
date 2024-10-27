import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useState } from "react";
import { ProductType } from "../../../_types/product_type";
import { useDeleteProductMutation } from "../../../services/product_service";
import { IconButton } from "@mui/material";

type ColumnType = {
  id: string;
  label: string;
  minWidth: number;
  align?: "left" | "center" | "right" | "inherit" | "justify";
};

const columns: ColumnType[] = [
  { id: "no", label: "No", minWidth: 50 },
  { id: "productId", label: "Product Id", minWidth: 70 },
  { id: "product", label: "Product", minWidth: 70, align: "left" },
  { id: "category", label: "Category", minWidth: 70, align: "left" },
  { id: "subCategory", label: "Sub Category", minWidth: 70, align: "left" },
];

function createData(
  no: number,
  productId: string,
  product: string,
  category: string,
  subCategory: string
) {
  return { no, productId, product, category, subCategory };
}

interface ProductProps {
  productList: ProductType[];
  anchorEl: null | HTMLElement;
  setAnchorEl: (value: null | HTMLElement) => void;
  setSelectedProduct: (product: ProductType) => void;
  setOpenDetails: (open: boolean) => void;
  selectedProduct: ProductType | null;
}

const ProductTable: React.FC<ProductProps> = ({
  productList,
  anchorEl,
  setAnchorEl,
  setSelectedProduct,
  setOpenDetails,
}) => {
  const rows = productList.map((i, index) =>
    createData(
      index + 1,
      `${i.id}`,
      `${i.name}`,
      `${i.subcategory.category.name}`,
      `${i.subcategory?.name || ""}`
    )
  );

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleClick = (
    event: React.MouseEvent<HTMLButtonElement>,
    product: ProductType
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedProduct(product);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleViewDetails = () => {
    setOpenDetails(true);
    handleCloseMenu();
  };

  const [deleteProduct] = useDeleteProductMutation();

  const handleDelete = async (id: string) => {
    try {
      await deleteProduct(id).unwrap();
      console.log("Product deleted successfully");
    } catch (error) {
      console.error("Failed to delete product:", error);
    }
  };

  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align || "left"}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row, index) => {
                const product = productList[index]; // Get the product corresponding to the row index
                return (
                  <TableRow
                    hover
                    role="checkbox"
                    tabIndex={-1}
                    key={row.productId}
                  >
                    {columns.map((column) => {
                      const value = row[column.id as keyof typeof row];
                      return (
                        <TableCell
                          key={column.id}
                          align={column.align || "left"}
                        >
                          {value}
                        </TableCell>
                      );
                    })}
                    <TableCell>
                      <IconButton
                        aria-label="more"
                        aria-controls="long-menu"
                        aria-haspopup="true"
                        onClick={(event) => handleClick(event, product)} // Pass the full product object
                      >
                        <MoreVertIcon />
                      </IconButton>
                      <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleCloseMenu}
                      >
                        <MenuItem onClick={handleViewDetails}>
                          View Details
                        </MenuItem>
                        <MenuItem onClick={handleCloseMenu}>Edit</MenuItem>
                        <MenuItem onClick={() => handleDelete(row.productId)}>
                          Delete
                        </MenuItem>
                      </Menu>
                    </TableCell>
                  </TableRow>
                );
              })}
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

export default ProductTable;
