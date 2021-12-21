//图表规则
// commit——bar，line，可改时间
// subcommit——bar，line，可改时间
// issue——bar，line，pie
// pullrequest——bar，line，pie
// contributor——table（另写），pie

//pie图要求的数据格式
// {
//   first: [
//     { value: 300, name: "Fine" },
//     { value: 1300, name: "Goodgood" },
//     { value: 800, name: "Kathleen" },
//     { value: 300, name: "Rainy" },
//     { value: 500, name: "Kathbaby" },
//   ],
////如果有第二个的话
//   second: [
//     { value: 300, name: "Fine" },
//     { value: 1300, name: "Goodgood" },
//     { value: 800, name: "Kathleen" },
//     { value: 300, name: "Rainy" },
//     { value: 500, name: "Kathbaby" },
//   ],
// };

import React from "react";
import { useState } from "react";
import { useEffect } from "react";

import PropTypes from "prop-types";
import { Card, Grid, Input, Select } from "@material-ui/core";
import { Divider } from "@material-ui/core";
import CardBody from "./CardBody";
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";
import { makeStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import InputLabel from "@material-ui/core/InputLabel";
import { MenuItem } from "@material-ui/core";
import FormControl from "@material-ui/core/FormControl";
import { FormControlLabel } from "@material-ui/core";
import { FormGroup } from "@material-ui/core";
import { Checkbox } from "@material-ui/core";
import styles from "assets/jss/material-dashboard-react/components/cardShowStyle.js";

//图表
import PieChart from "../../components/Charts/PieChart";
import StackedBarChart from "../../components/Charts/StackedBarChart";
import LineChart from "components/Charts/LineChart";

//传输
import axios from "axios";
axios.defaults.withCredentials = true;
axios.defaults.headers.post["Content-Type"] = "application/json";
const server = "http://122.51.228.166:8000";
// const server = "http://127.0.0.1:8000";

const useStyles = makeStyles(styles);

//不同类型的check，固定不变
const c = {
  commit: "",
  subcommit: "add-change-remove",
  issue: "open-closed",
  pullrequest: "open-closed-merged",
  contributor: "",
};

export default function Cardshow(props) {
  console.log(props);
  //原有的checkboxlabel
  const [c1, setc1] = useState("");
  const [c2, setc2] = useState("");
  const [c3, setc3] = useState("");
  const classes = useStyles();
  const [charttype, setChart] = useState(props.charttype);
  const [loading, setloading] = useState(true);
  // const d = {
  //   day: {
  //     categoryData: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  //     valueData: [
  //       {
  //         repo: "BaiCaoJian",
  //         name: "add",
  //         detailData: [20, 30, 4, 19, 20, 40, 25],
  //       },
  //       {
  //         repo: "BaiCaoJian",
  //         name: "remove",
  //         detailData: [2, 1, 8, 5, 5, 8, 9],
  //       },
  //       {
  //         repo: "BaiCaoJian",
  //         name: "change",
  //         detailData: [16, 10, 3, 6, 7, 9, 15],
  //       },
  //       {
  //         repo: "Clouding",
  //         name: "add",
  //         detailData: [30, 20, 17, 29, 30, 18, 35],
  //       },
  //       {
  //         repo: "Clouding",
  //         name: "remove",
  //         detailData: [20, 10, 7, 9, 3, 8, 5],
  //       },
  //       {
  //         repo: "Clouding",
  //         name: "change",
  //         detailData: [10, 20, 7, 9, 13, 18, 25],
  //       },
  //     ],
  //   },
  // };
  const [res, setChartdata] = useState({});
  //console.log(d);
  console.log(res);
  const [time, setTime] = useState(props.time);
  const checkbox = props.checkbox;
  const datatype = props.datatype;
  const address = props.address;
  const changeDashboard: Function = props.func;
  const position = props.position;

  //首次渲染的时候，分字符串
  useEffect(() => {
    upload();
    if (c[datatype] != "") {
      //分解字符串
      var s: String = c[datatype];
      let a = s.indexOf("-");
      let b = s.indexOf("-", a + 1);
      if (b == -1) {
        let tmp: String = s.slice(0, a);
        setc1(tmp);
        tmp = s.slice(a + 1);
        setc2(tmp);
      } else {
        let tmp: String = s.slice(0, a);
        setc1(tmp);
        tmp = s.slice(a + 1, b);
        setc2(tmp);
        tmp = s.slice(b + 1);
        setc3(tmp);
      }
    }
    console.log(c1);
    console.log(c2);
    console.log(c3);
    console.log(
      res[time].valueData.filter(
        (current) => checkbox.search(current.name) != -1
      )
    );
  }, []);

  //传输
  async function upload() {
    let data = {
      Datatype: datatype,
      Charttype: charttype,
      Address: address,
      Time: time,
    };
    let res1 = await axios.post(`${server}/get_data/`, data);
    console.log(res1.data);
    setChartdata(res1.data);
    setloading(false);
    //空数据判断
    if (res.length === 0) {
      alert("无数据，请换数据类型！");
    }
  }

  //每次更改checkbox，调用此函数，返回值给父组件
  function changecheck(event) {
    let tmp: String = "";
    if (event.target.name == c1) {
      if (checkbox.search(c1) == -1) {
        tmp = tmp + c1 + "-";
      }
      if (checkbox.search(c2) != -1) {
        tmp = tmp + c2 + "-";
      }
      if (checkbox.search(c3) != -1 && c3 != "") {
        tmp = tmp + c3 + "-";
      }
    } else if (event.target.name == c2) {
      if (checkbox.search(c1) != -1) {
        tmp = tmp + c1 + "-";
      }
      if (checkbox.search(c2) == -1) {
        tmp = tmp + c2 + "-";
      }
      if (checkbox.search(c3) != -1) {
        tmp = tmp + c3 + "-";
      }
    } else {
      if (checkbox.search(c1) != -1) {
        tmp = tmp + c1 + "-";
      }
      if (checkbox.search(c2) != -1) {
        tmp = tmp + c2 + "-";
      }
      if (checkbox.search(c3) == -1) {
        tmp = tmp + c3 + "-";
      }
    }
    tmp = tmp.slice(0, tmp.length - 1);
    console.log("para" + charttype + position + time + tmp);
    changeDashboard(charttype, position, time, tmp);
  }

  //更改图表类型，重新渲染
  function changechart(event) {
    setChart(event.target.value);
    changeDashboard(event.target.value, position, time, checkbox);
  }
  //更改时间需要重新获取数据
  function changetime(event) {
    setTime(event.target.value);
    console.log(event.target.value);
    changeDashboard(charttype, position, event.target.value, checkbox);
  }

  if (charttype === "piechart") {
    if (datatype === "commit" || datatype === "subcommit") {
      return (
        <GridContainer>
          <GridItem xs={4} sm={10} md={4}>
            <Card chart>
              <CardBody>
                <h3 className={classes.head}>错误的图表类型！</h3>
              </CardBody>
            </Card>
          </GridItem>
        </GridContainer>
      );
    } else if (res.length === 1) {
      return (
        <GridContainer>
          <GridItem xs={4} sm={10} md={4}>
            <Card chart>
              <CardBody>
                <h3 className={classes.head}>{datatype}</h3>
                <Grid className={classes.chart}>
                  {loading ? (
                    <CircularProgress className={classes.itemProgress} />
                  ) : (
                    // <PieChart data={res.1} />//双图去注释
                    <PieChart data={res.first} /> //双图加注释
                  )}
                </Grid>
              </CardBody>
            </Card>
          </GridItem>
        </GridContainer>
      );
    } else {
      return (
        <GridContainer>
          <GridItem xs={6} sm={13} md={6}>
            <Card chart>
              <CardBody>
                <h3 className={classes.head}>{datatype}</h3>
                <Grid className={classes.piegrid}>
                  <Grid className={classes.piechart}>
                    {loading ? (
                      <CircularProgress
                        color="primary"
                        className={classes.itemProgress}
                      />
                    ) : (
                      <PieChart data={res.first} /> //双图去注释
                      // <PieChart data={res} /> //双图加注释
                    )}
                  </Grid>
                  <Divider orientation="vertical" flexItem />
                  <Grid className={classes.piechart}>
                    {loading ? (
                      <CircularProgress
                        color="primary"
                        className={classes.itemProgress}
                      />
                    ) : (
                      <PieChart data={res.second} /> //双图去注释
                      // <PieChart data={res} /> //双图加注释
                    )}
                  </Grid>
                </Grid>
              </CardBody>
            </Card>
          </GridItem>
        </GridContainer>
      );
    }
  } else if (charttype === "stackedbarchart") {
    //bar图
    if (datatype === "contributor") {
      return (
        <GridContainer>
          <GridItem xs={4} sm={10} md={4}>
            <Card chart>
              <CardBody>
                <h3 className={classes.head}>错误的图表类型！</h3>
              </CardBody>
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
                <h3 className={classes.head}>{datatype}</h3>
                <FormControl className={classes.select}>
                  <InputLabel>图表类型</InputLabel>
                  <Select
                    onChange={changechart}
                    input={<Input />}
                    label="图表类型"
                    defaultValue={"stackedbarchart"}
                  >
                    <MenuItem value={"stackedbarchart"}>
                      stacked barchart
                    </MenuItem>
                    <MenuItem value={"linechart"}>line chart</MenuItem>
                  </Select>
                </FormControl>
                {datatype === "commit" || datatype === "subcommit" ? (
                  <FormControl className={classes.select}>
                    <InputLabel>时间刻度</InputLabel>
                    <Select
                      onChange={(e) => changetime(e)}
                      input={<Input />}
                      label="时间刻度"
                      defaultValue={time}
                    >
                      <MenuItem value={"day"}>day</MenuItem>
                      <MenuItem value={"month"}>month</MenuItem>
                      <MenuItem value={"year"}>year</MenuItem>
                    </Select>
                  </FormControl>
                ) : (
                  <></>
                )}
                {datatype != "commit" ? (
                  <FormGroup className={classes.checkbox}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={checkbox.search(c1) != -1}
                          name={c1}
                          onChange={(e) => changecheck(e)}
                        />
                      }
                      label={c1}
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={checkbox.search(c2) != -1}
                          name={c2}
                          onChange={(e) => changecheck(e)}
                        />
                      }
                      label={c2}
                    />
                    {datatype != "issue" ? (
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={checkbox.search(c3) != -1}
                            name={c3}
                            onChange={(e) => changecheck(e)}
                          />
                        }
                        label={c3}
                      />
                    ) : (
                      <></>
                    )}
                  </FormGroup>
                ) : (
                  <></>
                )}
                <Grid className={classes.chart}>
                  {loading ? (
                    <CircularProgress className={classes.itemProgress} />
                  ) : (
                    <StackedBarChart
                      data={{
                        categoryData: res[time].categoryData,
                        valueData: res[time].valueData.filter(
                          (current) =>
                            checkbox.search(current.name) != -1 ||
                            checkbox == ""
                        ),
                      }}
                    />
                  )}
                </Grid>
              </CardBody>
            </Card>
          </GridItem>
        </GridContainer>
      );
    }
  } else {
    //line图
    if (datatype === "contributor") {
      alert("错误的图表类型！");
    } else {
      return (
        <GridContainer>
          <GridItem xs={4} sm={10} md={4}>
            <Card chart>
              <CardBody>
                <h3 className={classes.head}>{datatype}</h3>
                <FormControl className={classes.select}>
                  <InputLabel>图表类型</InputLabel>
                  <Select
                    onChange={changechart}
                    input={<Input />}
                    label="图表类型"
                    defaultValue={"linechart"}
                  >
                    <MenuItem value={"stackedbarchart"}>
                      stacked barchart
                    </MenuItem>
                    <MenuItem value={"linechart"}>line chart</MenuItem>
                  </Select>
                </FormControl>
                {datatype === "commit" || datatype === "subcommit" ? (
                  <FormControl className={classes.select}>
                    <InputLabel>时间刻度</InputLabel>
                    <Select
                      onChange={() => changetime()}
                      input={<Input />}
                      label="时间刻度"
                      defaultValue={time}
                    >
                      <MenuItem value={"day"}>day</MenuItem>
                      <MenuItem value={"month"}>month</MenuItem>
                      <MenuItem value={"year"}>year</MenuItem>
                    </Select>
                  </FormControl>
                ) : (
                  <></>
                )}
                <Grid className={classes.chart}>
                  {/* <LineChart data={res[time]} /> */}
                  {loading ? (
                    <CircularProgress
                      color="primary"
                      className={classes.itemProgress}
                    />
                  ) : (
                    <LineChart
                      data={{
                        categoryData: res[time].categoryData,
                        valueData: res[time].valueData.filter(
                          (current) =>
                            checkbox.search(current.name) != -1 ||
                            checkbox == ""
                        ),
                      }}
                    />
                  )}
                </Grid>
              </CardBody>
            </Card>
          </GridItem>
        </GridContainer>
      );
    }
  }
}

Cardshow.propTypes = {
  datatype: PropTypes.oneOf(["pullrequest", "issue", "commit", "contributor"]),
  charttype: PropTypes.oneOf(["stackedbarchart", "piechart", "linechart"]),
  address: PropTypes.String,
  time: PropTypes.String,
  checkbox: PropTypes.String,
  func: PropTypes.any,
  position: PropTypes.any,
};
