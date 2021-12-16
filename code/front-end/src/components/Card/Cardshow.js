import React from "react";
import { useState } from "react";
import { useEffect } from "react";

import PropTypes from "prop-types";
import { Card, Input, Select } from "@material-ui/core";
import { Divider } from "@material-ui/core";
import CardBody from "./CardBody";
import CardFooter from "./CardFooter";
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";
import AccessTime from "@material-ui/icons/AccessTime";
import { makeStyles } from "@material-ui/core/styles";

import InputLabel from "@material-ui/core/InputLabel";
import { MenuItem } from "@material-ui/core";
import FormControl from "@material-ui/core/FormControl";

import styles from "assets/jss/material-dashboard-react/components/buttonStyle.js";
import PieChart from "../../components/Charts/PieChart";
import BarChart from "components/Charts/BarChart";
import StackedBarChart from "../../components/Charts/StackedBarChart";

// import axios from "axios";
// const server = "http://122.51.228.166:8000";

const useStyles = makeStyles(styles);

export default function Cardshow(props) {
  console.log(props);
  const classes = useStyles();
  const [charttype, setChart] = useState("");

  useEffect(() => {
    setChart(props.charttype);
  }, String);

  // const address=props.address;
  // let res;

  // async function upload(){
  //     let data={
  //         datatype:datatype,
  //         charttype:charttype,
  //         address:address
  //     }
  //     res = await axios.post(`${server}/checkurl/`, data);
  //     console.log(res);
  // }
  // upload();

  function changechart(event: any) {
    setChart(event.target.value);
  }

  if (charttype == "piechart") {
    return (
      <GridContainer>
        <GridItem xs={5} sm={10} md={7}>
          <Card chart>
            <CardBody>
              {/* <div style={{display:"flex"}}> */}
              <FormControl className={classes.formControl}>
                <InputLabel width={100}>图表类型</InputLabel>
                <Select onChange={changechart} input={<Input />}>
                  <MenuItem value={"stackedbarchart"}>
                    stacked barchart
                  </MenuItem>
                  <MenuItem value={"barchart"}>bar chart</MenuItem>
                  <MenuItem value={"piechart"}>pie chart</MenuItem>
                </Select>
              </FormControl>
              {/* <div style={{ width: "200px"}}></div> */}
              <h3>pie chart</h3>
              {/* </div> */}
              <div style={{ display: "flex" }}>
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
                  {/* <PieChart data={res}/> */}
                </div>
                <div style={{ width: "20px" }}></div>
                <Divider orientation="vertical" flexItem />
                <div style={{ width: "20px" }}></div>
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
                  {/* <PieChart data={res}/> */}
                </div>
              </div>
            </CardBody>
            <CardFooter chart>
              <div className={classes.stats}>
                <AccessTime /> updated 4 minutes ago
              </div>
            </CardFooter>
          </Card>
        </GridItem>
      </GridContainer>
    );
  } else if (charttype == "barchart") {
    return (
      <GridContainer>
        <GridItem xs={4} sm={10} md={4}>
          <Card chart>
            <CardBody>
              <FormControl className={classes.formControl}>
                <InputLabel>图表类型</InputLabel>
                <Select onChange={changechart} input={<Input />}>
                  <MenuItem value={"stackedbarchart"}>
                    stacked barchart
                  </MenuItem>
                  <MenuItem value={"barchart"}>bar chart</MenuItem>
                  <MenuItem value={"piechart"}>piechart</MenuItem>
                </Select>
              </FormControl>
              <h3>bar chart</h3>
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
                    valueData: [
                      1,
                      2,
                      3,
                      4,
                      5,
                      6,
                      7,
                      8,
                      9,
                      1,
                      2,
                      3,
                      4,
                      5,
                      6,
                      7,
                      8,
                      9,
                    ],
                  }}
                />
                {/* <BarChart data={res}/> */}
              </div>
            </CardBody>
            <CardFooter chart>
              <div className={classes.stats}>
                <AccessTime /> updated 4 minutes ago
              </div>
            </CardFooter>
          </Card>
        </GridItem>
      </GridContainer>
    );
  } else {
    return (
      <GridContainer>
        <GridItem xs={4} sm={10} md={4}>
          <Card chart>
            <CardBody>
              <FormControl className={classes.formControl}>
                <InputLabel>图表类型</InputLabel>
                <Select onChange={changechart} input={<Input />}>
                  <MenuItem value={"stackedbarchart"}>
                    stacked barchart
                  </MenuItem>
                  <MenuItem value={"barchart"}>bar chart</MenuItem>
                  <MenuItem value={"piechart"}>piechart</MenuItem>
                </Select>
              </FormControl>
              <h3>stacked barchart</h3>
              <div style={{ width: "350px", height: "300px" }}>
                <StackedBarChart
                  data={{
                    categoryData: [
                      "Mon",
                      "Tue",
                      "Wed",
                      "Thu",
                      "Fri",
                      "Sat",
                      "Sun",
                    ],
                    valueData: [
                      {
                        name: "commit",
                        detailData: [30, 20, 17, 29, 30, 18, 35],
                      },
                      {
                        name: "issue",
                        detailData: [20, 10, 7, 9, 3, 8, 5],
                      },
                      {
                        name: "pull request",
                        detailData: [10, 20, 7, 9, 13, 18, 25],
                      },
                    ],
                  }}
                />
              </div>
            </CardBody>
            <CardFooter chart>
              <div className={classes.stats}>
                <AccessTime /> updated 4 minutes ago
              </div>
            </CardFooter>
          </Card>
        </GridItem>
      </GridContainer>
    );
  }
}

Cardshow.propTypes = {
  datatype: PropTypes.oneOf(["pull request", "issue", "commit"]),
  charttype: PropTypes.oneOf(["stackedbarchart", "barchart", "piechart"]),
  cardheight: PropTypes.any,
  cardwidth: PropTypes.any,
  address: PropTypes.any,
};
