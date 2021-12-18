import React from "react";
import cookie from "react-cookies";
// @material-ui/core components
//import { makeStyles } from "@material-ui/core/styles";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";

//import styles from "assets/jss/material-dashboard-react/views/iconsStyle.js";
import TablePro from "../../components/TablePro/TablePro";
/*import axios from "axios";
axios.defaults.withCredentials = true;
axios.defaults.headers.post["Content-Type"] = "application/json";
//const server = "http://122.51.228.166:8000";
const server = "http://127.0.0.1:8000";*/

//const useStyles = makeStyles(styles);

export default function Favorites() {
  //const classes = useStyles();
  const col = ["ID", "Template Name", "Template Info", "Description", "Date"];
  const [templateList, setTemplateList] = React.useState([]);
  React.useEffect(async () => {
    if (cookie.load("username") !== undefined) {
      // let data = {
      //   Email: cookie.load("account"),
      // };
      //let res = await axios.post(`${server}/returnfavor/`, data);
      //let list = res.data;
      let list = ["1", "2", "3", "4"];
      if (list.length > 0) {
        setTemplateList(
          list.map((current, index) => {
            return {
              ID: index + 1,
              "Template Name": current,
              "Template Info": "none",
              Description: "none",
              Date: "today",
            };
          })
        );
      }
    }
  }, []);
  return (
    <GridContainer>
      <GridItem xs={12} sm={12} md={12}>
        {templateList !== [] && (
          <TablePro
            data={{
              columns: col,
              rows: templateList,
            }}
          />
        )}
      </GridItem>
    </GridContainer>
  );
}
