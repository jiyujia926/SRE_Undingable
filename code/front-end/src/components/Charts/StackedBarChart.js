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
    item.name = data.valueData[i].repo + "-" + data.valueData[i].name;
    item.type = "bar";
    item.stack = data.valueData[i].repo;
    item.emphasis = { focus: "series" };
    item.data = data.valueData[i].detailData;
    item.large = true;
    series_data.push(item);
    console.log(item);
  }
  const initChart = () => {
    let element = document.getElementById(id);
    let myChart = eCharts.init(element);
    const option = {
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
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
        },
      },
      legend: {
        type: "scroll",
        x: "right",
        bottom: "20px",
        orient: "vertical",
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "15%",
        containLabel: true,
      },
      dataZoom: [
        {
          type: "inside",
        },
        {
          type: "slider",
        },
      ],
      xAxis: [
        {
          type: "category",
          data: data.categoryData,
          silent: false,
          splitLine: {
            show: false,
          },
          splitArea: {
            show: false,
          },
        },
      ],
      yAxis: [
        {
          type: "value",
          splitArea: {
            show: false,
          },
        },
      ],
      series: series_data,
    };
    option && myChart.setOption(option, true);
    window.addEventListener("resize", function () {
      myChart.resize();
    });
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
