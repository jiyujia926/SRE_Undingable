import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import useStyles from "./styles";
import PropTypes from "prop-types";

const TablePro = (props) => {
  const classes = useStyles();
  const { data } = props;

  return (
    <div className={classes.root}>
      <DataGrid
        rows={data.rows}
        columns={data.columns}
        pageSize={data.pageRows}
        checkboxSelection={data.checkBox}
      />
    </div>
  );
};

TablePro.propTypes = {
  data: PropTypes.object,
};

export default TablePro;
