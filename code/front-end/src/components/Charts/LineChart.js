import React from "react";
import { nanoid } from "nanoid";
import * as eCharts from "echarts";
import PropTypes from "prop-types";

const LineChart = (props) => {
  const { data } = props;
  let id = nanoid();
  const initChart = () => {
    let element = document.getElementById(id);
    let myChart = eCharts.init(element);
    const option = {
    
    };
    option && myChart.setOption(option);
  }

  useEffect(() => {
    initChart();
  }, []);

  return <div id={id} style={{ width: "100%", height: "100%" }}></div>;
};

LineChart.propTypes = {
  data: PropTypes.object,
};

export default LineChart;