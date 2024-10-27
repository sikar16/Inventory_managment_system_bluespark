import * as React from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import {
  TemplateAttributeType,
  TemplateType,
} from "../../../_types/template_type";

interface Column {
  id: keyof RowData;
  label: string;
  minWidth: number;
  align?: "left" | "right" | "center";
}

interface RowData {
  no: number;
  templateId: string;
  template: string;
  attributes: TemplateAttributeType[];
}

const columns: Column[] = [
  { id: "no", label: "No", minWidth: 50 },
  { id: "templateId", label: "Template Id", minWidth: 70 },
  { id: "template", label: "Template", minWidth: 70, align: "left" },
];

const createData = (
  no: number,
  templateId: string,
  template: string,
  attributes: TemplateAttributeType[]
): RowData => {
  return { no, templateId, template, attributes };
};

interface TemplateProps {
  templateList: TemplateType[];
}

const TemplateTable: React.FC<TemplateProps> = ({ templateList }) => {
  const rows: RowData[] = templateList.map((template, index) =>
    createData(index + 1, `${template.id}`, template.name, template.attributes)
  );

  const [page, setPage] = React.useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = React.useState<number>(5);
  const [openFaqIndex, setOpenFaqIndex] = React.useState<number | null>(null);

  const handleToggle = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <div className="flex mx-[7%]">
      <Paper sx={{ overflow: "hidden", maxWidth: 800, width: "100%" }}>
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
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => (
                  <React.Fragment key={row.templateId}>
                    <TableRow hover role="checkbox" tabIndex={-1}>
                      {columns.map((column) => {
                        const value = row[column.id as keyof RowData];

                        return (
                          <TableCell key={column.id} align={column.align}>
                            {Array.isArray(value)
                              ? value.map((item, itemIndex) => (
                                <p key={itemIndex}>{item.name}</p>
                              ))
                              : value}
                          </TableCell>
                        );
                      })}
                      <TableCell>
                        <button
                          className="flex items-center"
                          onClick={() => handleToggle(index)}
                        >
                          <div className="mr-5 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/5 text-primary dark:bg-white/5">
                            {openFaqIndex === index ? (
                              <ExpandLessIcon />
                            ) : (
                              <ExpandMoreIcon />
                            )}
                          </div>
                        </button>
                      </TableCell>
                    </TableRow>
                    {openFaqIndex === index && (
                      <TableRow>
                        <TableCell colSpan={columns.length + 1}>
                          <div
                            id={`faq-content-${index}`}
                            className="pl-[62px] bg-gray-100 h-[150px]"
                          >
                            <div className="grid grid-cols-2 gap-4">
                              <p className="text-md">Template Attributes</p>
                              <div className="grid grid-cols-2 w-full text-sm gap-2 mt-2">
                                {row.attributes.map((attribute, attrIndex) => (
                                  <p key={attrIndex} className="ms-3">
                                    {attribute.name}
                                  </p>
                                ))}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
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
  );
};

export default TemplateTable;