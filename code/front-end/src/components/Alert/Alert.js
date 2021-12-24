import React from "react";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import useStyles from "./styles";
import PropTypes from "prop-types";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default function CustomizedSnackbars(props) {
  const classes = useStyles();
  const { name, message, type, open, close } = props;

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    close(name);
  };

  return (
    <Snackbar
      open={open}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
      autoHideDuration={2400}
      onClose={handleClose}
      className={classes.root}
    >
      <Alert onClose={handleClose} severity={type} className={classes.alert}>
        {message}
      </Alert>
    </Snackbar>
  );
}

CustomizedSnackbars.propTypes = {
  name: PropTypes.string,
  message: PropTypes.string,
  type: PropTypes.string,
  open: PropTypes.bool,
  close: PropTypes.func,
};
