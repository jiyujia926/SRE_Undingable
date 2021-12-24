import React, { useEffect } from "react";
import * as eCharts from "echarts";
import { nanoid } from "nanoid";
import PropTypes from "prop-types";

const PieChart = (props) => {
  const { data } = props;
  let id = nanoid();
  // concat name
  let series_items = [];
  for (let i = 0; i < data.length; i++) {
    let tmp_item = {};
    tmp_item.name = data[i].repoName;
    tmp_item.type = "pie";
    tmp_item.label = { show: false, position: "center" };
    tmp_item.itemStyle = { borderRadius: 2 };
    tmp_item.data = [];
    for (let j = 0; j < data[i].data.length; j++) {
      let tmp = {};
      tmp.value = data[i].data[j].value;
      tmp.name = data[i].repoName + "-" + data[i].data[j].name;
      tmp_item.data.push(tmp);
    }
    console.log(tmp_item.data);
    if (i == 0) {
      tmp_item.radius = ["65%", "100%"];
    } else {
      tmp_item.radius = ["25%", "60%"];
    }
    series_items.push(tmp_item);
  }

  const initChart = () => {
    let element = document.getElementById(id);
    let myChart = eCharts.init(element);
    const option = {
      legend: {
        type: "scroll",
        x: "right",
        bottom: "20px",
        orient: "vertical",
      },
      itemStyle: {
        borderRadius: 2,
      },
      roseType: "radius",
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
