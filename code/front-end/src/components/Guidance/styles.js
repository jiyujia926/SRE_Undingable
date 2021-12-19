import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles(() => ({
  root: {
    margin: "50px 0 0 0",
  },
  cardCategoryWhite: {
    color: "#FFFFFF",
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none",
  },
  body: {
    display: "flex",
  },
  image: {
    maxWidth: "140px",
    maxHeight: "140px",
  },
  text: {
    padding: "0 0 0 40px",
  },
}));

export default useStyles;
