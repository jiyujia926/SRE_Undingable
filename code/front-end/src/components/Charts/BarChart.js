import React, { useEffect } from "react";
import { nanoid } from "nanoid";
import * as eCharts from "echarts";
import PropTypes from "prop-types";

const BarChart = (props) => {
  console.log(props);
  const { data } = props;
  let id = nanoid();
  const initChart = () => {
    let element = document.getElementById(id);
    let myChart = eCharts.init(element);
    const option = {
      // delete title
      //   title: {
      //     text: eCharts.format.addCommas(2021) + " Data",
      //     left: 10,
      //   },
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
      grid: {
        bottom: 90,
      },
      dataZoom: [
        {
          type: "inside",
        },
        {
          type: "slider",
        },
      ],
      xAxis: {
        data: data.categoryData,
        silent: false,
        splitLine: {
          show: false,
        },
        splitArea: {
          show: false,
        },
      },
      yAxis: {
        splitArea: {
          show: false,
        },
      },
      series: [
        {
          type: "bar",
          data: data.valueData,
          // Set `large` for large data amount
          large: true,
        },
      ],
    };
    option && myChart.setOption(option);
  };

  useEffect(() => {
    initChart();
  }, []);

  return <div id={id} style={{ width: "100%", height: "100%" }}></div>;
};

BarChart.propTypes = {
  data: PropTypes.object,
};

export default BarChart;
