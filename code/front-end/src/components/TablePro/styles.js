import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles(() => ({
  root: {
    width: "100%",
  },
  title: {
    flex: "1 1 100%",
  },
  paper: {
    width: "auto",
    padding: "5px 15px 3px",
  },
  table: {
    minWidth: 750,
  },
  visuallyHidden: {
    border: 0,
    clip: "rect(0 0 0 0)",
    height: 1,
    margin: -1,
    overflow: "hidden",
    padding: 0,
    position: "absolute",
    top: 20,
    width: 1,
  },
  button: {
    marginRight: "5px",
  },
}));

export default useStyles;
