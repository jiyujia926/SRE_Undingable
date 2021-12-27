import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles(() => ({
  cardroot: {
    height: "400px",
  },
  card: {
    height: "100%",
  },
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
    flex: "1",
  },
  body: {
    display: "flex",
    padding: "0 0 30px 30px",
    alignItems: "center",
  },
  gdBody: {
    padding: "0px 30px 30px",
  },
  button: {
    color: "#fff",
  },
  head: {
    display: "flex",
  },
  image: {
    maxWidth: "140px",
    maxHeight: "140px",
    marginRight: "5%",
    //margin: "30px 0 0 15px",
  },
  text: {
    //padding: "12px 0 0 40px",
  },
}));

export default useStyles;
