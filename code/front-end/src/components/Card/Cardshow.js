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
import styles from "assets/jss/material-dashboard-react/components/cardShowStyle.js";

//图表
//import PieChart from "../../components/Charts/PieChart";
//import BarChart from "components/Charts/BarChart";
import StackedBarChart from "../../components/Charts/StackedBarChart";
import LineChart from "components/Charts/LineChart";

//传输
import axios from "axios";
import PieChart from "../../components/Charts/PieChart";
axios.defaults.withCredentials = true;
axios.defaults.headers.post["Content-Type"] = "application/json";
// const server = "http://122.51.228.166:8000";
const server = "http://127.0.0.1:8000";

const useStyles = makeStyles(styles);

//图表规则
// commit——bar，line，可改时间
// subcommit——bar，line，可改时间
// issue——bar，line，pie
// pullrequest——bar，line，pie
// contributor——table（另写），pie

export default function Cardshow(props) {
  console.log(props);
  const classes = useStyles();
  const [charttype, setChart] = useState(props.charttype);
  const [loading, setloading] = useState(true);
  const [res, setChartdata] = useState({});
  const [time, setTime] = useState(props.datatype);
  //const ismiddle = props.ismiddle;
  const datatype = props.datatype;
  const address = props.address;

  useEffect(() => {
    setChart(props.charttype);
    upload();
    console.log(res);
  }, String);

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
    if (res.length == 0) {
      alert("无数据，请换数据类型！");
    }
  }

  function changechart(event) {
    setChart(event.target.value);
  }

  function changetime(event) {
    setTime(event.target.value);
    upload();
  }

  if (charttype == "piechart") {
    if (datatype == "commit" || datatype == "subcommit") {
      alert("错误的图表类型！");
    } else if (res.length == 1) {
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
                    <PieChart data={res} /> //双图加注释
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
                      // <PieChart data={res.1} />//双图去注释
                      <PieChart data={res} /> //双图加注释
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
                      // <PieChart data={res.2} />//双图去注释
                      <PieChart data={res} /> //双图加注释
                    )}
                  </Grid>
                </Grid>
              </CardBody>
            </Card>
          </GridItem>
        </GridContainer>
      );
    }
  } else if (charttype == "barchart") {
    //bar图
    if (datatype == "contributor") {
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
                    defaultValue={"stackedbarchart"}
                  >
                    <MenuItem value={"stackedbarchart"}>
                      stacked barchart
                    </MenuItem>
                    <MenuItem value={"linechart"}>line chart</MenuItem>
                  </Select>
                </FormControl>
                {datatype == "commit" || datatype == "subcommit" ? (
                  <FormControl className={classes.select}>
                    <InputLabel>时间刻度</InputLabel>
                    <Select
                      onChange={changetime}
                      input={<Input />}
                      label="时间刻度"
                      defaultValue={"day"}
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
                  {loading ? (
                    <CircularProgress className={classes.itemProgress} />
                  ) : (
                    <StackedBarChart data={res} />
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
    if (datatype == "contributor") {
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
                {datatype == "commit" || datatype == "subcommit" ? (
                  <FormControl className={classes.select}>
                    <InputLabel>时间刻度</InputLabel>
                    <Select
                      onChange={changetime}
                      input={<Input />}
                      label="时间刻度"
                      defaultValue={"day"}
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
                  {loading ? (
                    <CircularProgress
                      color="primary"
                      className={classes.itemProgress}
                    />
                  ) : (
                    <LineChart data={res} />
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
  cardheight: PropTypes.any,
  cardwidth: PropTypes.any,
  address: PropTypes.any,
};
