import * as React from "react";
//import { DataGrid } from "@mui/x-data-grid";
import useStyles from "./styles";
import PropTypes from "prop-types";
import Card from "../Card/Card";
import {
  Paper,
  TableCell,
  TableContainer,
  TablePagination,
  TableSortLabel,
} from "@material-ui/core";
import Table from "@material-ui/core/Table";
import TableRow from "@material-ui/core/TableRow";
import TableHead from "@material-ui/core/TableHead";
import TableBody from "@material-ui/core/TableBody";
import RemoveCircleOutlineIcon from "@material-ui/icons/RemoveCircleOutline";
import IconButton from "@material-ui/core/IconButton";

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

function EnhancedTableHead(props) {
  const { classes, order, orderBy, onRequestSort, headCells } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };
  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <IconButton color="secondary" disabled aria-label="remove">
            <RemoveCircleOutlineIcon />
          </IconButton>
        </TableCell>
        {headCells.map((headCell, i) => (
          <TableCell
            key={headCell}
            align="left"
            padding={i === 1 ? "none" : "normal"}
            sortDirection={orderBy === headCell ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell}
              direction={orderBy === headCell ? order : "asc"}
              onClick={createSortHandler(headCell)}
            >
              {headCell}
              {orderBy === headCell ? (
                <span className={classes.visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  headCells: PropTypes.array.isRequired,
};

const TablePro = (props) => {
  const classes = useStyles();
  const { data, removeFunc, jumpFunc } = props;
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("ID");
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleJump = (i) => () => {
    jumpFunc(i);
  };

  const handleRemove = (i) => () => {
    removeFunc(i);
  };

  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, data.rows.length - page * rowsPerPage);
  return (
    <Card className={classes.root}>
      <Paper className={classes.paper}>
        <TableContainer>
          <Table
            className={classes.table}
            aria-labelledby="tableTitle"
            size="medium"
            aria-label="enhanced table"
          >
            <EnhancedTableHead
              classes={classes}
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              headCells={data.columns}
            />
            {
              <TableBody>
                {stableSort(data.rows, getComparator(order, orderBy))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => {
                    const labelId = `enhanced-table-checkbox-${index}`;
                    return (
                      <TableRow hover tabIndex={-1} key={row["ID"]}>
                        <TableCell padding="checkbox">
                          <IconButton
                            color="secondary"
                            onClick={handleRemove(index)}
                            aria-label="remove"
                          >
                            <RemoveCircleOutlineIcon />
                          </IconButton>
                        </TableCell>
                        {data.columns.map((col, i) => (
                          <TableCell
                            to="/admin/dashboard"
                            onClick={handleJump(index)}
                            id={labelId}
                            key={row + col}
                            scope="row"
                            padding={i === 1 ? "none" : "normal"}
                          >
                            {row[col]}
                          </TableCell>
                        ))}
                      </TableRow>
                    );
                  })}
                {emptyRows > 0 && (
                  <TableRow style={{ height: 53 * emptyRows }}>
                    <TableCell colSpan={6} />
                  </TableRow>
                )}
              </TableBody>
            }
          </Table>
        </TableContainer>
        {
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={data.rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onChangePage={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        }
      </Paper>
    </Card>
  );
};

TablePro.propTypes = {
  data: PropTypes.object,
  removeFunc: PropTypes.func,
  jumpFunc: PropTypes.func,
};

export default TablePro;
