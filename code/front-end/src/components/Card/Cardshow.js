import React from "react";
import { useState } from "react";
import { useEffect } from "react";

import PropTypes from "prop-types";
import { Card, Input, Select } from "@material-ui/core";
import { Divider } from "@material-ui/core";
import CardBody from "./CardBody";
//import CardFooter from "./CardFooter";
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";
//import AccessTime from "@material-ui/icons/AccessTime";
//import { makeStyles } from "@material-ui/core/styles";

import InputLabel from "@material-ui/core/InputLabel";
import { MenuItem } from "@material-ui/core";
import FormControl from "@material-ui/core/FormControl";

//import styles from "assets/jss/material-dashboard-react/components/buttonStyle.js";
import PieChart from "../../components/Charts/PieChart";
import BarChart from "components/Charts/BarChart";
import StackedBarChart from "../../components/Charts/StackedBarChart";
import LineChart from "components/Charts/LineChart";

//现在为直接写数据版本，如果要传输数据，就把注释着{固定数据}的部分注释掉，把注释着{传输}部分的注释取消
//以及虽然现在有四个图表选项，但折线图的选项暂时是假的

//传输
import axios from "axios";
const server = "http://122.51.228.166:8000";

//const useStyles = makeStyles(styles);

export default function Cardshow(props) {
  console.log(props);
  //const classes = useStyles();
  const [charttype, setChart] = useState(props.charttype);

  useEffect(() => {
    setChart(props.charttype);
  }, String);

  //传输
  const datatype = props.datatype;
  const address = props.address;
  let res;

  async function upload() {
    let data = {
      datatype: datatype,
      charttype: charttype,
      address: address,
    };
    res = await axios.post(`${server}/get_data/`, data);
    console.log(res);
  }
  upload();

  function changechart(event: any) {
    setChart(event.target.value);
  }

  if (charttype == "piechart") {
    return (
      <GridContainer>
        <GridItem xs={5} sm={10} md={7}>
          <Card chart>
            <CardBody>
              <div style={{ display: "flex" }}>
                <div style={{ width: "330px" }} />
                <div>
                  <h3>{datatype}</h3>
                </div>
              </div>
              <div style={{ width: "150px" }}>
                <FormControl fullWidth>
                  <InputLabel>图表类型</InputLabel>
                  <Select
                    onChange={changechart}
                    input={<Input />}
                    label="图表类型"
                  >
                    <MenuItem value={"stackedbarchart"}>
                      stacked barchart
                    </MenuItem>
                    <MenuItem value={"barchart"}>bar chart</MenuItem>
                    <MenuItem value={"piechart"}>pie chart</MenuItem>
                    <MenuItem value={"linechart"}>line chart</MenuItem>
                  </Select>
                </FormControl>
              </div>
              <div style={{ height: "30px" }} />
              <div style={{ display: "flex" }}>
                <div style={{ width: "350px", height: "300px" }}>
                  {/* 固定数据 */}

                  {/* 饼图还不能正常连后端数据进行处理，因为不知道多个仓库的数据包内容 */}
                  {/* <PieChart
                    data={[
                      { value: 300, name: "Fine" },
                      { value: 1300, name: "Goodgood" },
                      { value: 800, name: "Kathleen" },
                      { value: 300, name: "Rainy" },
                      { value: 500, name: "Kathbaby" },
                    ]}
                  /> */}
                  {/* 固定数据 */}
                  <PieChart data={res} />
                </div>
                <div style={{ width: "35px" }}></div>
                <Divider orientation="vertical" flexItem />
                <div style={{ width: "35px" }}></div>
                <div style={{ width: "350px", height: "300px" }}>
                  {/* 固定数据 */}
                  {/* <PieChart
                    data={[
                      { value: 300, name: "Fine" },
                      { value: 1300, name: "Goodgood" },
                      { value: 800, name: "Kathleen" },
                      { value: 300, name: "Rainy" },
                      { value: 500, name: "Kathbaby" },
                    ]}
                  /> */}
                  {/* 固定数据 */}
                  <PieChart data={res} />
                </div>
              </div>
            </CardBody>
            <div style={{ height: "30px" }} />
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
              <div style={{ display: "flex" }}>
                <div style={{ width: "150px" }} />
                <div>
                  <h3>{datatype}</h3>
                </div>
              </div>
              <div style={{ width: "150px" }}>
                <FormControl fullWidth>
                  <InputLabel>图表类型</InputLabel>
                  <Select
                    onChange={changechart}
                    input={<Input />}
                    label="图表类型"
                  >
                    <MenuItem value={"stackedbarchart"}>
                      stacked barchart
                    </MenuItem>
                    <MenuItem value={"barchart"}>bar chart</MenuItem>
                    <MenuItem value={"piechart"}>pie chart</MenuItem>
                    <MenuItem value={"linechart"}>line chart</MenuItem>
                  </Select>
                </FormControl>
              </div>
              <div style={{ height: "30px" }} />
              <div style={{ display: "flex" }}>
                <div style={{ width: "40px" }} />
                <div style={{ width: "350px", height: "300px" }}>
                  {/* 固定数据 */}
                  {/* <BarChart
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
                  /> */}
                  {/* 固定数据 */}
                  <BarChart data={res} />
                </div>
              </div>
            </CardBody>
            <div style={{ height: "40px" }} />
          </Card>
        </GridItem>
      </GridContainer>
    );
  } else if (charttype == "stackedbarchart") {
    return (
      <GridContainer>
        <GridItem xs={4} sm={10} md={4}>
          <Card chart>
            <CardBody>
              <div style={{ display: "flex" }}>
                <div style={{ width: "100px" }} />
                <div>
                  <h3>{datatype}</h3>
                </div>
              </div>
              <div style={{ width: "150px" }}>
                <FormControl fullWidth>
                  <InputLabel>图表类型</InputLabel>
                  <Select
                    onChange={changechart}
                    input={<Input />}
                    label="图表类型"
                  >
                    <MenuItem value={"stackedbarchart"}>
                      stacked barchart
                    </MenuItem>
                    <MenuItem value={"barchart"}>bar chart</MenuItem>
                    <MenuItem value={"piechart"}>pie chart</MenuItem>
                    <MenuItem value={"linechart"}>line chart</MenuItem>
                  </Select>
                </FormControl>
              </div>
              <div style={{ height: "30px" }} />
              <div style={{ display: "flex" }}>
                <div style={{ width: "40px" }} />
                <div style={{ width: "350px", height: "300px" }}>
                  {/* 固定数据 */}
                  {/* <StackedBarChart
                    data={{
                      categoryData: [
                        "Mon",
                        "Tue",
                        "Wed",
                        "Thu",
                        "Fri",
                        6,
                        "Sun",
                      ],
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
                  /> */}
                  {/* 固定数据 */}
                  <StackedBarChart data={res} />
                </div>
              </div>
            </CardBody>
            <div style={{ height: "40px" }} />
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
              <div style={{ display: "flex" }}>
                <div style={{ width: "100px" }} />
                <div>
                  <h3>{datatype}</h3>
                </div>
              </div>
              <div style={{ width: "150px" }}>
                <FormControl fullWidth>
                  <InputLabel>图表类型</InputLabel>
                  <Select
                    onChange={changechart}
                    input={<Input />}
                    label="图表类型"
                  >
                    <MenuItem value={"stackedbarchart"}>
                      stacked barchart
                    </MenuItem>
                    <MenuItem value={"barchart"}>bar chart</MenuItem>
                    <MenuItem value={"piechart"}>pie chart</MenuItem>
                    <MenuItem value={"linechart"}>line chart</MenuItem>
                  </Select>
                </FormControl>
              </div>
              <div style={{ height: "30px" }} />
              <div style={{ display: "flex" }}>
                <div style={{ width: "40px" }} />
                <div style={{ width: "350px", height: "300px" }}>
                  {/* 固定数据 */}
                  {/* <LineChart
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
                  /> */}
                  {/* 固定数据 */}
                  <LineChart data={res} />
                </div>
              </div>
            </CardBody>
            <div style={{ height: "40px" }} />
          </Card>
        </GridItem>
      </GridContainer>
    );
  }
}

Cardshow.propTypes = {
  datatype: PropTypes.oneOf(["pull request", "issue", "commit"]),
  charttype: PropTypes.oneOf([
    "stackedbarchart",
    "barchart",
    "piechart",
    "linechart",
  ]),
  cardheight: PropTypes.any,
  cardwidth: PropTypes.any,
  address: PropTypes.any,
};
