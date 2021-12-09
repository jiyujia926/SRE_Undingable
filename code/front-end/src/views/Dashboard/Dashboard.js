import React from "react";
// react plugin for creating charts
import ChartistGraph from "react-chartist";
// @material-ui/core
import { makeStyles } from "@material-ui/core/styles";
// @material-ui/icons
import ArrowUpward from "@material-ui/icons/ArrowUpward";
import AccessTime from "@material-ui/icons/AccessTime";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";

import { dailySalesChart } from "variables/charts.js";

import styles from "assets/jss/material-dashboard-react/views/dashboardStyle.js";
//import CustomInput from "../../components/CustomInput/CustomInput";
import Button from "../../components/CustomButtons/Button";
import Search from "@material-ui/icons/Search";
import { Input } from "@material-ui/core";

import axios from "axios";
axios.defaults.withCredentials = true;
axios.defaults.headers.post["Content-Type"] = "application/json";
const server = "http://122.51.228.166:8000";
//const server = "http://127.0.0.1:8000";

const useStyles = makeStyles(styles);

export default function Dashboard() {
  const classes = useStyles();
  const [input, setInput] = React.useState();
  const [address, setAddress] = React.useState();
  const handleInputChange = (event) => {
    setInput(event.target.value);
  };
  async function spider() {
    let data = {
      RepositoryURL: input,
    };
    let res = await axios.post(`${server}/spider/`, data);
    return res;
  }
  const handleSearch = () => {
    let reg = /^(?=^.{3,255}$)(http(s)?:\/\/)?(www\.)?(github.com\/)*([[a-zA-Z0-9]\/+=%&_\.~?-]*)*/; //正则表达式判断是否为github地址
    if (reg.test(input)) {
      let res = spider();
      // 此处调用后端函数, 参数就是{Address: input}
      // （根据之前的设想，先判断仓库能不能在数据库找到，可以就返回true；
      // 不能找到就现场爬取，但要先判断是不是仓库(?)，能就返回true，同时更新数据库，没法爬返回false）
      //alert("good");
      //res = { data: true };
      if (res.data) {
        setAddress(input);
        alert(address);
      } else {
        alert("请输入正确的github仓库地址");
      }
    } else {
      alert("请输入github地址");
    }
    setInput("");
  };
  return (
    <div>
      <div className={classes.searchWrapper}>
        <Input
          value={input}
          onChange={handleInputChange}
          placeholder="Address of the repository"
          className={classes.searchInput}
        />
        <Button
          color="white"
          aria-label="edit"
          justIcon
          round
          onClick={handleSearch}
        >
          <Search />
        </Button>
      </div>
      <GridContainer>
        <GridItem xs={12} sm={12} md={4}>
          <Card chart>
            <CardHeader color="success">
              <ChartistGraph
                className="ct-chart"
                data={dailySalesChart.data}
                type="Line"
                options={dailySalesChart.options}
                listener={dailySalesChart.animation}
              />
            </CardHeader>
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
    </div>
  );
}
