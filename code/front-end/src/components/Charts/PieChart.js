import React, { useEffect } from "react";
import * as eCharts from "echarts";
import { nanoid } from "nanoid";
import PropTypes from "prop-types";

const PieChart = (props) => {
  const { data } = props;
  let id = nanoid();
  const initChart = () => {
    let element = document.getElementById(id);
    let myChart = eCharts.init(element);
    const option = {
      legend: {
        top: "bottom",
      },
      toolbox: {
        show: true,
        feature: {
          mark: { show: true },
          dataView: { show: true, readOnly: false },
          restore: { show: true },
          saveAsImage: { show: true },
        },
        bottom: "-2%",
      },
      series: [
        {
          name: "Nightingale Chart",
          type: "pie",
          radius: [10, 60],
          center: ["50%", "50%"],
          roseType: "area",
          itemStyle: {
            borderRadius: 2,
          },
          data: data,
        },
      ],
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

PieChart.propTypes = {
  data: PropTypes.object,
};

export default PieChart;
