import React from "react";
// react plugin for creating charts
// import ChartistGraph from "react-chartist";
// @material-ui/core
import { makeStyles } from "@material-ui/core/styles";
// @material-ui/icons
// import ArrowUpward from "@material-ui/icons/ArrowUpward";
// import AccessTime from "@material-ui/icons/AccessTime";
// core components
// import GridItem from "components/Grid/GridItem.js";
// import GridContainer from "components/Grid/GridContainer.js";
// import Card from "components/Card/Card.js";
// import CardHeader from "components/Card/CardHeader.js";
// import CardBody from "components/Card/CardBody.js";
// import CardFooter from "components/Card/CardFooter.js";

// import { dailySalesChart } from "variables/charts.js";
import styles from "assets/jss/material-dashboard-react/views/dashboardStyle.js";
//import CustomInput from "../../components/CustomInput/CustomInput";
import Button from "../../components/CustomButtons/Button";
import Search from "@material-ui/icons/Search";
import { Input } from "@material-ui/core";
// import PieChart from "../../components/Charts/PieChart";
// import BarChart from "../../components/Charts/BarChart";
// import StackedBarChart from "../../components/Charts/StackedBarChart";
// import LineChart from "components/Charts/LineChart";
import axios from "axios";
import Cardshow from "components/Card/Cardshow";

axios.defaults.withCredentials = true;
axios.defaults.headers.post["Content-Type"] = "application/json";
// const server = "http://122.51.228.166:8000";
const server = "http://127.0.0.1:8000";

const useStyles = makeStyles(styles);
//let newChartsData = [];
export default function Dashboard() {
  const classes = useStyles();
  const [input, setInput] = React.useState();
  const [address, setAddress] = React.useState();
  const handleInputChange = (event) => {
    setInput(event.target.value);
  };
  async function checkurl() {
    // console.log(1);
    let data = {
      RepositoryURL: input,
    };
    // console.log(data);
    let res = await axios.post(`${server}/checkurl/`, data);
    // return res;
    // console.log(res);
    //这里的返回有三种情况，在数据库的仓库，不在数据库的仓库，不是仓库/未开源
    if (res.data === true) {
      setAddress(input);
      // alert(address);
      alert("数据库里有");
    } else if (res.data === "仓库不存在或未开源") {
      alert("请输入正确的github仓库地址");
    } else {
      alert("添加进数据库");
    }
  }
  const handleSearch = () => {
    let reg = /^(?=^.{3,255}$)(http(s)?:\/\/)?(www\.)?(github.com\/)*([[a-zA-Z0-9]\/+=%&_\.~?-]*)*/; //正则表达式判断是否为github地址
    if (reg.test(input)) {
      // let res = spider();
      // 此处调用后端函数, 参数就是{Address: input}
      // （根据之前的设想，先判断仓库能不能在数据库找到，可以就返回true；
      // 不能找到就现场爬取，但要先判断是不是仓库(?)，能就返回true，同时更新数据库，没法爬返回false）
      //alert("good");
      //res = { data: true };
      checkurl();
      console.log(address); //暂时无用应付编译器
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
      <Cardshow
        datatype="commit"
        charttype="barchart"
        address="https://github.com/jiyujia926/NFTauction"
      />
      {/* <GridContainer>
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
