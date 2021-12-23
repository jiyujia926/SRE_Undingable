import React, { useEffect } from "react";
import * as eCharts from "echarts";
import { nanoid } from "nanoid";
import PropTypes from "prop-types";

const PieChart = (props) => {
  const { data } = props;
  let id = nanoid();
  let series_items = [];
  let cnt = 0;
  for (let item in data) {
    let tmp_item = {};
    tmp_item.name = item.repoName;
    tmp_item.type = "pie";
    tmp_item.label = { show: false, position: "center" };
    tmp_item.itemStyle = { borderRadius: 2 };
    tmp_item.data = item.data;
    if (cnt == 0) {
      tmp_item.radius = ["80%", "100%"];
      cnt++;
    } else {
      tmp_item.radius = ["50%", "70%"];
    }
    series_items.push(tmp_item);
  }

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
      series: series_items,
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

PieChart.propTypes = {
  data: PropTypes.object,
};

export default PieChart;
