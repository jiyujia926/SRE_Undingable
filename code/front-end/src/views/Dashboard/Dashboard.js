import React from "react";
// react plugin for creating charts
// @material-ui/core
import { makeStyles } from "@material-ui/core/styles";
// @material-ui/icons
//import ArrowUpward from "@material-ui/icons/ArrowUpward";
//import AccessTime from "@material-ui/icons/AccessTime";
import Typography from "@material-ui/core/Typography";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Card from "components/Card/Card.js";
//import CardBody from "components/Card/CardBody.js";
//import CardFooter from "components/Card/CardFooter.js";
import CheckBoxSet from "../../components/CheckBoxSet/CheckBoxSet";
import ListBox from "../../components/ListBox/ListBox";
import styles from "assets/jss/material-dashboard-react/views/dashboardStyle.js";
import { Fab } from "@material-ui/core";
import Cardshow from "../../components/Card/Cardshow";
import cookie from "react-cookies";
//import Cardtext from "../../components/Card/Cardtext";
//import PieChart from "../../components/Charts/PieChart";
//import BarChart from "../../components/Charts/BarChart";
//import StackedBarChart from "../../components/Charts/StackedBarChart";
// import axios from "axios";
// axios.defaults.withCredentials = true;
// axios.defaults.headers.post["Content-Type"] = "application/json";
// const server = "http://122.51.228.166:8000";
// const server = "http://127.0.0.1:8000";

const useStyles = makeStyles(styles);
//let newChartsData = [];
export default function Dashboard() {
  const classes = useStyles();
  const [address, setAddress] = React.useState([]);
  const defaultDashboard = [
    {
      Position: 0,
      DataType: "contributor",
      ChartType: "table",
      DataScale: "day",
      CheckBox: "",
      Visible: true,
    },
    {
      Position: 1,
      DataType: "contributor",
      ChartType: "piechart",
      DataScale: "day",
      CheckBox: "",
      Visible: true,
    },
    {
      Position: 2,
      DataType: "commit",
      ChartType: "stackedbarchart",
      DataScale: "day",
      CheckBox: "",
      Visible: true,
    },
    {
      Position: 3,
      DataType: "commit",
      ChartType: "stackedbarchart",
      DataScale: "day",
      CheckBox: "add-change-remove",
      Visible: true,
    },
    {
      Position: 4,
      DataType: "issue",
      ChartType: "stackedbarchart",
      DataScale: "day",
      CheckBox: "open-closed",
      Visible: true,
    },
    {
      Position: 5,
      DataType: "issue",
      ChartType: "piechart",
      DataScale: "day",
      CheckBox: "",
      Visible: true,
    },
    {
      Position: 6,
      DataType: "pullrequest",
      ChartType: "stackedbarchart",
      DataScale: "day",
      CheckBox: "open-closed-merged",
      Visible: true,
    },
    {
      Position: 7,
      DataType: "pullrequest",
      ChartType: "piechart",
      DataScale: "day",
      CheckBox: "",
      Visible: true,
    },
  ];
  const [dashboard, setDashboard] = React.useState(
    cookie.load("dashboard") ? cookie.load("dashboard") : defaultDashboard
  );
  function changeDashboard(position, dataScale, checkBox) {
    let tmpDashboard = dashboard.map((current) => {
      if (current.Position === position) {
        return {
          ...current,
          DataScale: dataScale,
          CheckBox: checkBox,
        };
      } else {
        return current;
      }
    });
    setDashboard(tmpDashboard);
    cookie.save("dashboard", tmpDashboard, {
      maxAge: 3600,
    });
  }
  const handleSetDataTypeSet = (data) => {
    if (address.length > 0) {
      let tmpDashboard = dashboard.map((current) => {
        return {
          ...current,
          Visible: data[Math.floor(current.Position / 2)],
        };
      });
      setDashboard(tmpDashboard);
      cookie.save("dashboard", tmpDashboard, {
        maxAge: 3600,
      });
    } else {
      alert("请选择项目！");
    }
  };
  return (
    <div>
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <ListBox showFunc={setAddress} para={address} />
        </GridItem>
        <GridItem xs={12} sm={12} md={6}>
          <Card className={classes.infoCard}>
            <Typography variant="h5" gutterBottom>
              项目基本信息
            </Typography>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={12} md={6}>
          <CheckBoxSet
            check={dashboard
              .filter((current, i) => i % 2 === 0)
              .map((current) => current.Visible)}
            setFunc={handleSetDataTypeSet}
          />
        </GridItem>
        {address.length > 0 &&
          dashboard.map(
            (current, index) =>
              current.Visible && (
                <div key={index}>
                  {current.Position % 2 === 0 && (
                    <div onClick={changeDashboard}>1</div>
                    //<Cardtext datatype={current.DataType} address={address} />
                  )}
                  {/*
                    <Cardshow
                      position={current.Position}
                      datatype={current.DataType}
                      charttype={current.ChartType}
                      datascale={current.DataScale}
                      checkbox={current.CheckBox}
                      func={changeDashboard}
                      address={address}
                    />
                  */}
                </div>
              )
          )}
        {address[0] && (
          <GridItem xs={12} sm={12} md={12}>
            <Cardshow
              datatype="commit"
              charttype="barchart"
              address={address[0]}
            />
          </GridItem>
        )}
      </GridContainer>
      <div className={classes.fabSet}>
        <Fab variant="extended" color="secondary" className={classes.fab}>
          Apply
        </Fab>
        <Fab variant="extended" color="secondary" className={classes.fab}>
          Customization
        </Fab>
      </div>
      {/*
      <GridContainer>
        <GridItem xs={12} sm={12} md={4}>
          <Card chart>
            <CardBody>
              <h4 className={classes.cardTitle}>Daily Sales</h4>
              <p className={classes.cardCategory}>
                <span className={classes.successText}>
                  <ArrowUpward className={classes.upArrowCardCategory} /> 55%
                </span>{" "}
                increase in today sales.
              </p>
            </CardBody>
            <CardFooter chart>
              <div className={classes.stats}>
                <AccessTime /> updated 4 minutes ago
              </div>
            </CardFooter>
          </Card>
        </GridItem>
      </GridContainer>
      <div style={{ width: "350px", height: "300px" }}>
        <PieChart
          data={[
            { value: 300, name: "Fine" },
            { value: 1300, name: "Goodgood" },
            { value: 800, name: "Kathleen" },
            { value: 300, name: "Rainy" },
            { value: 500, name: "Kathbaby" },
          ]}
        />
      </div>
      <div style={{ width: "350px", height: "300px" }}>
        <BarChart
          data={{
            categoryData: [
              "2021-09-08",
              "2021-10-09",
              "2021-11-10",
              "2021-12-11",
              "2021-12-12",
              "2021-12-31",
              "2022-01-01",
              "2021-02-02",
              "2022-03-03",
              "2022-04-04",
              "2022-05-05",
              "2022-06-06",
              "2022-07-07",
              "2022-08-08",
              "2022-09-09",
              "2022-10-10",
              "2022-11-11",
              "2022-12-12",
            ],
            valueData: [1, 2, 3, 4, 5, 6, 7, 8, 9, 1, 2, 3, 4, 5, 6, 7, 8, 9],
          }}
        />
      </div>
      <div style={{ width: "350px", height: "300px" }}>
        <LineChart
          data={{
            categoryData: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
            valueData: [
              {
                repo: "BCJ",
                name: "commit",
                detailData: [10, 20, 7, 9, 13, 18, 25],
              },
              {
                repo: "Clouding",
                name: "commit",
                detailData: [9, 12, 24, 12, 8, 9, 10],
              },
            ],
            smoothOrNot: true,
          }}
        />
      </div>
      <div style={{ width: "350px", height: "300px" }}>
        <StackedBarChart
          data={{
            categoryData: ["Mon", "Tue", "Wed", "Thu", "Fri", 6, "Sun"],
            valueData: [
              {
                repo: "BaiCaoJian",
                name: "commit",
                detailData: [20, 30, 4, 19, 20, 40, 25],
              },
              {
                repo: "BaiCaoJian",
                name: "issue",
                detailData: [2, 1, 8, 5, 5, 8, 9],
              },
              {
                repo: "BaiCaoJian",
                name: "pull request",
                detailData: [16, 10, 3, 6, 7, 9, 15],
              },
              {
                repo: "Clouding",
                name: "commit",
                detailData: [30, 20, 17, 29, 30, 18, 35],
              },
              {
                repo: "Clouding",
                name: "issue",
                detailData: [20, 10, 7, 9, 3, 8, 5],
              },
              {
                repo: "Clouding",
                name: "pull request",
                detailData: [10, 20, 7, 9, 13, 18, 25],
              },
            ],
          }}
        />
      </div> */}
    </div>
  );
}
