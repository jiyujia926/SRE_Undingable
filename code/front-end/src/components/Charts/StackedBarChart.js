import React, { useEffect } from "react";
import { nanoid } from "nanoid";
import * as eCharts from "echarts";
import PropTypes from "prop-types";

const StackedBarChart = (props) => {
  const { data } = props;
  console.log(data);
  let id = nanoid();
  let series_data = [];
  for (let i = 0; i < data.valueData.length; i++) {
    let item = new Object();
    item.name = data.valueData[i].name;
    item.type = "bar";
    item.stack = "git";
    item.emphasis = { focus: "series" };
    item.data = data.valueData[i].detailData;
    series_data.push(item);
    console.log(item);
  }
  const initChart = () => {
    let element = document.getElementById(id);
    let myChart = eCharts.init(element);
    const option = {
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
        },
      },
      legend: {},
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true,
      },
      xAxis: [
        {
          type: "category",
          data: data.categoryData,
        },
      ],
      yAxis: [
        {
          type: "value",
        },
      ],
      series: series_data,
    };
    option && myChart.setOption(option);
  };

  useEffect(() => {
    initChart();
  }, []);

  return <div id={id} style={{ width: "100%", height: "100%" }}></div>;
};

StackedBarChart.propTypes = {
  data: PropTypes.object,
};

export default StackedBarChart;
