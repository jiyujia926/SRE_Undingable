import React, { useEffect } from "react";
import { nanoid } from "nanoid";
import * as eCharts from "echarts";
import PropTypes from "prop-types";

const LineChart = (props) => {
  const { data } = props;
  let id = nanoid();

  // filter data
  let series_data = [];
  let legend_data = [];
  for (let i = 0; i < data.valueData.length; i++) {
    let item = new Object();
    item.stack = data.valueData[i].repo;
    item.name = data.valueData[i].repo + "-" + data.valueData[i].name;
    item.data = data.valueData[i].detailData;
    item.type = "line";
    series_data.push(item);
    legend_data.push(item.name);
    console.log(item);
  }

  const initChart = () => {
    let element = document.getElementById(id);
    let myChart = eCharts.init(element);
    const option = {
      legend: {
        orient: "vertical",
        x: "left", // right center left
        y: "top", // top center down
        padding: [10, 0, 0, 0],
        data: data.name,
      },
      toolbox: {
        feature: {
          dataZoom: {
            yAxisIndex: false,
          },
          saveAsImage: {
            pixelRatio: 2,
          },
        },
        bottom: "-2%",
      },
      xAxis: {
        type: "category",
        data: data.categoryData,
      },
      yAxis: {
        type: "value",
      },
      series: series_data,
    };
    option && myChart.setOption(option);
    window.addEventListener("resize", function () {
      myChart.resize();
    });
  };

  useEffect(() => {
    initChart();
  }, []);

  return <div id={id} style={{ width: "100%", height: "100%" }}></div>;
};

LineChart.propTypes = {
  data: PropTypes.object,
};

export default LineChart;
