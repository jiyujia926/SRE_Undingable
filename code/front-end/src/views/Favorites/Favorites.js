/*eslint-disable*/
import React from "react";
import cookie from "react-cookies";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Card from "components/Card/Card.js";

import styles from "assets/jss/material-dashboard-react/views/iconsStyle.js";
import TablePro from "../../components/TablePro/TablePro";
import axios from "axios";
axios.defaults.withCredentials = true;
axios.defaults.headers.post["Content-Type"] = "application/json";
//const server = "http://122.51.228.166:8000";
const server = "http://127.0.0.1:8000";

const useStyles = makeStyles(styles);

export default function Favorites() {
  //const classes = useStyles();
  //const [addressList, setAddressList] = React.useState([]);
  React.useEffect(async () => {
    if (cookie.load("username") !== undefined) {
      let data = {
        Email: cookie.load("account"),
      };
      let res = await axios.post(`${server}/returnfavor/`, data);
      alert(res.data);
    }
    //alert(list);
    //setAddressList(list);
    //alert(cookie.load("username"));
  }, []);
  return (
    <GridContainer>
      <GridItem xs={12} sm={12} md={12}>
        <Card>
          <TablePro
            data={{
              columns: [
                { field: "id", headerName: "ID", width: 90 },
                { field: "repoName", headerName: "Repo Name", width: 200 },
                { field: "address", headerName: "Repo Address", width: 200 },
                { field: "favorTime", headerName: "Favor Time", width: 150 },
              ],
              rows: [
                {
                  id: 1,
                  repoName: "JYJ/BaiCaoJian",
                  address: "github/JYJ/BCJ",
                  favorTime: "yy-mm-dd",
                },
                {
                  id: 2,
                  repoName: "JYJ/Clouding",
                  address: "github/JYJ/Clouding",
                  favorTime: "yy-mm-dd",
                },
                {
                  id: 3,
                  repoName: "meta/React",
                  address: "github/meta/React",
                  favorTime: "yy-mm-dd",
                },
                {
                  id: 4,
                  repoName: "meta/Oculus",
                  address: "github/meta/Oculus",
                  favorTime: "yy-mm-dd",
                },
                {
                  id: 5,
                  repoName: "QsTech/zju-icicle",
                  address: "github/QsTech/zju-icicle",
                  favorTime: "yy-mm-dd",
                },
                {
                  id: 6,
                  repoName: "MS/HoloLens",
                  address: "github/MS/HoloLens",
                  favorTime: "yy-mm-dd",
                },
              ],
              pageRows: 5,
              checkBox: true,
            }}
          />
        </Card>
      </GridItem>
    </GridContainer>
  );
}
