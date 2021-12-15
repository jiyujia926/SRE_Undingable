import React from "react";
// nodejs library that concatenates classes
//import classNames from "classnames";
// nodejs library to set properties for components
import PropTypes from "prop-types";
//import Header from "components/Navbars/Navbar";
import PieChart from "../../components/Charts/PieChart";
import BarChart from "../../components/Charts/BarChart";
import StackedBarChart from "../../components/Charts/StackedBarChart";

// material-ui components
//import { makeStyles } from "@material-ui/core/styles";
//import Button from "@material-ui/core/Button";

//import styles from "assets/jss/material-dashboard-react/components/buttonStyle.js";

//const useStyles = makeStyles(styles);
// type card={
//   datatype:String;
//   charttype:String;
// }

export default function ShowCard(props) {
  //const classes = useStyles();
  const datatype=props.dataType;
    const charttype=props.chartType;
    const cardwidth=props.cardwidth;
    const cardheight=props.cardheight;
    console.log(props);
    // var getInformation = {
    //   method: "POST",
    //   headers: {
    //     "Access-Control-Allow-Origin": "*",
    //     "Content-type": "application/json;charset=utf-8",
    //   },
    //   body: JSON.stringify({
    //     datatype:datatype,
    //     charttype:charttype
    //   }),
    // };
    // const res =  fetch("http://localhost:8080/update_data", getInformation);
    // const data: card =  res.json();
    // console.log(res);

    return (
        //标题，数据类型
        //横纵坐标
        //图表
        <Card width={cardwidth} height={cardheight}>
          <CardHeader color="success">{datatype}</CardHeader>
          
                {datatype}{charttype}
        </Card>


    );
    
}

ShowCard.propTypes = {
    dataType:PropTypes.oneOf([
        "pull",
        "request"

    ]),
  chartType: PropTypes.oneOf([
    "histogram",
    "line",
    "pie"
  ]),
  cardheight:PropTypes.any,
  cardwidth:PropTypes.any
};
