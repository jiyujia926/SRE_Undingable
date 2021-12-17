/*eslint-disable*/
import React from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import Hidden from "@material-ui/core/Hidden";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";

import styles from "assets/jss/material-dashboard-react/views/iconsStyle.js";
import TablePro from "../../components/TablePro/TablePro";

const useStyles = makeStyles(styles);

export default function Favorites() {
  const classes = useStyles();
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
